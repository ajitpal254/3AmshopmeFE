import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Card, Form, Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/api";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { formatPrice, getCurrencySymbol } from "../utils/currencyUtils";

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [activeTab, setActiveTab] = useState('current'); // 'current' or 'past'

    const currencyState = useSelector((state) => state.currencyState);
    const { currency } = currencyState;
    const currencySymbol = getCurrencySymbol(currency);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get("/orders");
                setOrders(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const isDelivered = order.isDelivered || order.isDelieved;
        const isCurrentOrder = !isDelivered;
        const isPastOrder = isDelivered;

        // Filter by Tab
        if (activeTab === 'current' && !isCurrentOrder) return false;
        if (activeTab === 'past' && !isPastOrder) return false;

        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderItems.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = statusFilter === 'All' ||
            (statusFilter === 'Paid' && order.isPaid) ||
            (statusFilter === 'Unpaid' && !order.isPaid) ||
            (statusFilter === 'Delivered' && isDelivered) ||
            (statusFilter === 'Processing' && !isDelivered);

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <LoadingSpinner message="Loading your orders..." />;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">MY ORDERS</h1>

            {/* Tabs for Current vs Past Orders */}
            <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav.Item>
                    <Nav.Link eventKey="current" className="fw-bold text-dark">
                        Current Orders <span className="badge bg-primary ms-1">{orders.filter(o => !(o.isDelivered || o.isDelieved)).length}</span>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="past" className="fw-bold text-dark">
                        Past Orders <span className="badge bg-secondary ms-1">{orders.filter(o => (o.isDelivered || o.isDelieved)).length}</span>
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            <Row className="mb-4">
                <Col md={6} className="mb-2">
                    <Form.Control
                        type="text"
                        placeholder="Search by Order ID or Product Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={6} className="mb-2">
                    <Form.Control
                        as="select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Processing">Processing</option>
                    </Form.Control>
                </Col>
            </Row>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-5">
                    <div className="mb-4">
                        <i className={`fas ${activeTab === 'current' ? 'fa-box-open' : 'fa-history'} fa-4x text-muted opacity-25`}></i>
                    </div>
                    {orders.length === 0 ? (
                        <>
                            <h3 className="fw-bold mb-3">No Orders Yet</h3>
                            <p className="text-muted mb-4">You haven't placed any orders yet. Start shopping to fill this page!</p>
                            <Link to="/" className="btn btn-primary px-5 py-2 fw-bold rounded-pill shadow-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
                                Start Shopping
                            </Link>
                        </>
                    ) : (
                        <>
                            <h3 className="fw-bold mb-3">
                                {activeTab === 'current' ? 'No Current Orders' : 'No Past Orders'}
                            </h3>
                            <p className="text-muted mb-4">
                                {searchTerm || statusFilter !== 'All' 
                                    ? "We couldn't find any orders matching your search or filter criteria." 
                                    : activeTab === 'current' 
                                        ? "You have no orders currently in progress." 
                                        : "You have no past orders."}
                            </p>
                            {(searchTerm || statusFilter !== 'All') && (
                                <Button variant="outline-primary" onClick={() => {setSearchTerm(''); setStatusFilter('All');}}>
                                    Clear Filters
                                </Button>
                            )}
                            {(!searchTerm && statusFilter === 'All' && activeTab === 'current') && (
                                <Link to="/" className="btn btn-primary px-5 py-2 fw-bold rounded-pill shadow-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
                                    Start Shopping
                                </Link>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <Row>
                    {filteredOrders.map((order) => (
                        <Col md={12} key={order._id} className="mb-4">
                            <Card className="shadow-sm border-0">
                                <Card.Header className="bg-white border-bottom">
                                    <Row className="align-items-center">
                                        <Col md={6}>
                                            <small className="text-muted d-block">Order ID</small>
                                            <strong><Link to={`/orders/${order._id}`} className="text-decoration-none text-dark">{order._id}</Link></strong>
                                        </Col>
                                        <Col md={3}>
                                            <small className="text-muted d-block">Total Amount</small>
                                            <strong>{currencySymbol}{formatPrice(order.totalPrice, currency)}</strong>
                                        </Col>
                                        <Col md={3} className="text-end">
                                            <div className="d-flex flex-column align-items-end gap-1">
                                                {order.isPaid ? (
                                                    <span className="badge bg-success rounded-pill">Paid</span>
                                                ) : (
                                                    <span className="badge bg-warning text-dark rounded-pill">Unpaid</span>
                                                )}
                                                {order.isDelivered || order.isDelieved ? (
                                                    <span className="badge bg-info text-dark rounded-pill">Delivered</span>
                                                ) : (
                                                    <span className="badge bg-primary rounded-pill">Processing</span>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={8}>
                                            <ListGroup variant="flush">
                                                {order.orderItems.map((item, index) => (
                                                    <ListGroup.Item key={index} className="border-0 px-0 py-2">
                                                        <Row className="align-items-center">
                                                            <Col md={2} xs={3}>
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="img-fluid rounded"
                                                                    style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                                                />
                                                            </Col>
                                                            <Col md={6} xs={9}>
                                                                <Link to={`/products/${item.product}`} className="text-decoration-none text-dark fw-semibold">
                                                                    {item.name}
                                                                </Link>
                                                                <div className="text-muted small mt-1">
                                                                    Qty: {item.qty}
                                                                </div>
                                                            </Col>
                                                            <Col md={4} className="text-end d-none d-md-block">
                                                                <span className="fw-bold">{currencySymbol}{formatPrice(item.price, currency)}</span>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </Col>
                                        <Col md={4} className="d-flex align-items-center justify-content-center justify-content-md-end mt-3 mt-md-0">
                                            <Link to={`/orders/${order._id}`} className="btn btn-outline-primary w-100 w-md-auto">
                                                View Order Details
                                            </Link>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default OrdersScreen;
