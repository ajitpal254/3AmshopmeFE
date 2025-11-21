import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import '../components/css/VendorOrders.css';

const VendorOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/vendor/orders');
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleMarkDelivered = async (orderId) => {
        if (!window.confirm('Are you sure you want to mark this order as delivered?')) return;
        try {
            await api.put(`/vendor/orders/${orderId}/deliver`);
            fetchOrders(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handleMarkPaid = async (orderId) => {
        if (!window.confirm('Are you sure you want to mark this order as paid?')) return;
        try {
            await api.put(`/vendor/orders/${orderId}/pay`);
            fetchOrders(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    return (
        <div className="vendor-orders-container">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0 fw-bold text-dark">My Orders</h2>
                    <Link to="/vendor/dashboard" className="btn btn-outline-primary">
                        <i className="fas fa-arrow-left me-2"></i>Dashboard
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : orders.length === 0 ? (
                    <Card className="vendor-orders-card">
                        <div className="empty-state">
                            <i className="fas fa-shopping-bag"></i>
                            <h4>No orders yet</h4>
                            <p>When customers buy your products, orders will appear here.</p>
                        </div>
                    </Card>
                ) : (
                    <Card className="vendor-orders-card">
                        <div className="table-responsive">
                            <Table hover borderless className="mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Paid</th>
                                        <th>Delivered</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td><span className="font-monospace text-primary">#{order._id.substring(0, 8)}</span></td>
                                            <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                                            <td>{order.User?.name || 'Guest'}</td>
                                            <td className="fw-bold">${order.totalPrice?.toFixed(2)}</td>
                                            <td>
                                                {order.isPaid ? (
                                                    <Badge bg="success" className="status-badge status-paid">Paid</Badge>
                                                ) : (
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        className="status-badge status-unpaid border-0"
                                                        onClick={() => handleMarkPaid(order._id)}
                                                    >
                                                        Mark Paid
                                                    </Button>
                                                )}
                                            </td>
                                            <td>
                                                {order.isDelieved ? (
                                                    <Badge bg="primary" className="status-badge status-delivered">Delivered</Badge>
                                                ) : (
                                                    <Button
                                                        variant="outline-warning"
                                                        size="sm"
                                                        className="status-badge status-processing border-0"
                                                        onClick={() => handleMarkDelivered(order._id)}
                                                    >
                                                        Mark Delivered
                                                    </Button>
                                                )}
                                            </td>
                                            <td>
                                                <Link to={`/order/${order._id}`} className="btn btn-sm btn-light text-primary">
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                )}
            </Container>
        </div>
    );
};

export default VendorOrders;
