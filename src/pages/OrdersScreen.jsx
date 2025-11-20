import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../utils/api";
import LoadingSpinner from "../components/shared/LoadingSpinner";

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    if (loading) {
        return <LoadingSpinner message="Loading your orders..." />;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">MY ORDERS</h1>
            {orders.length === 0 ? (
                <div className="alert alert-info">
                    You haven't placed any orders yet. <Link to="/">Start Shopping</Link>
                </div>
            ) : (
                <Row>
                    {orders.map((order) => (
                        <Col md={12} key={order._id} className="mb-4">
                            <Card>
                                <Card.Header>
                                    <Row>
                                        <Col md={6}>
                                            <strong>Order ID:</strong> {order._id.substring(0, 10)}...
                                        </Col>
                                        <Col md={3}>
                                            <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
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
                                                            <Col md={5}>{item.name}</Col>
                                                            <Col md={3}>
                                                                {item.qty} x ${item.price.toFixed(2)}
                                                            </Col>
                                                            <Col md={2} className="text-end">
                                                                <strong>${(item.qty * item.price).toFixed(2)}</strong>
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
                                                                    <strong>${order.totalPrice.toFixed(2)}</strong>
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item>
                                                            <Row>
                                                                <Col>Status:</Col>
                                                                <Col className="text-end">
                                                                    {order.isDelieved ? (
                                                                        <span className="text-success">Delivered</span>
                                                                    ) : (
                                                                        <span className="text-warning">Processing</span>
                                                                    )}
                                                                </Col>
                                                            </Row>
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
