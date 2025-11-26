import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Card, Form } from "react-bootstrap";
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
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderItems.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = statusFilter === 'All' ||
            (statusFilter === 'Paid' && order.isPaid) ||
            (statusFilter === 'Unpaid' && !order.isPaid) ||
            (statusFilter === 'Delivered' && (order.isDelivered || order.isDelieved)) ||
            (statusFilter === 'Processing' && !(order.isDelivered || order.isDelieved));

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
                <div className="alert alert-info">
                    {orders.length === 0 ? (
                        <>You haven't placed any orders yet. <Link to="/">Start Shopping</Link></>
                    ) : (
                        <>No orders found matching your criteria.</>
                    )}
                </div>
            ) : (
                <Row>
                    {filteredOrders.map((order) => (
                        <Col md={12} key={order._id} className="mb-4">
                            <Card>
                                <Card.Header>
                                    <Row>
                                        <Col md={6}>
                                            <strong>Order ID:</strong> <Link to={`/orders/${order._id}`}>{order._id}</Link>
                                        </Col>
                                        <Col md={3}>
                                            <strong>Total:</strong> {currencySymbol}{formatPrice(order.totalPrice, currency)}
                                        </Col>
                                        <Col md={3} className="text-end">
                                            {order.isPaid ? (
                                                <span className="badge bg-success">Paid</span>
                                            ) : (
                                                <span className="badge bg-warning">Pending</span>
                                            )}
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={8}>
                                            <h5>Order Items</h5>
                                            <ListGroup variant="flush">
                                                {order.orderItems.map((item, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <Row className="align-items-center">
                                                            <Col md={2}>
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    style={{ width: "100%", borderRadius: "5px" }}
                                                                />
                                                            </Col>
                                                            <Col md={5}>
                                                                <Link to={`/products/${item.product}`}>{item.name}</Link>
                                                            </Col>
                                                            <Col md={3}>
                                                                {item.qty} x {currencySymbol}{formatPrice(item.price, currency)}
                                                            </Col>
                                                            <Col md={2} className="text-end">
                                                                <strong>{currencySymbol}{formatPrice(item.qty * item.price, currency)}</strong>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </Col>
                                        <Col md={4}>
                                            <Card>
                                                <Card.Body>
                                                    <h5>Order Summary</h5>
                                                    <ListGroup variant="flush">
                                                        <ListGroup.Item>
                                                            <Row>
                                                                <Col>Items:</Col>
                                                                <Col className="text-end">{order.orderItems.length}</Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item>
                                                            <Row>
                                                                <Col>Total:</Col>
                                                                <Col className="text-end">
                                                                    <strong>{currencySymbol}{formatPrice(order.totalPrice, currency)}</strong>
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item>
                                                            <Row>
                                                                <Col>Status:</Col>
                                                                <Col className="text-end">
                                                                    {order.isDelivered || order.isDelieved ? (
                                                                        <span className="text-success">Delivered</span>
                                                                    ) : (
                                                                        <span className="text-warning">Processing</span>
                                                                    )}
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item>
                                                            <Link to={`/orders/${order._id}`} className="btn btn-primary w-100">
                                                                View Details
                                                            </Link>
                                                        </ListGroup.Item>
                                                    </ListGroup>
                                                </Card.Body>
                                            </Card>
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
