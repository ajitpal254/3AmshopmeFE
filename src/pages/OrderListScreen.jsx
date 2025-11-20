import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderListScreen = ({ history }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user, vendor } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let endpoint;
            if (vendor) {
                endpoint = '/vendor/orders';
            } else if (user && user.isAdmin) {
                endpoint = '/admin/orders';
            } else {
                endpoint = '/orders';
            }

            const { data } = await api.get(endpoint);
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentStatusChange = async (orderId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await api.put(`/admin/orders/${orderId}/payment`, { isPaid: newStatus });
            setSuccess('Payment status updated successfully');
            fetchOrders();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update payment status');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeliveryStatusChange = async (orderId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await api.put(`/admin/orders/${orderId}/delivery`, { isDelivered: newStatus });
            setSuccess('Delivery status updated successfully');
            fetchOrders();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update delivery status');
            setTimeout(() => setError(''), 3000);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading orders..." />;
    }

    const canUpdateStatus = (user && user.isAdmin) || vendor;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">{vendor ? 'My Orders' : user && user.isAdmin ? 'All Orders' : 'My Orders'}</h1>

            {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}
            {success && <div className="alert alert-success alert-dismissible fade show">{success}</div>}

            {orders.length === 0 ? (
                <div className="alert alert-info">
                    No orders found.
                </div>
            ) : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ORDER ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>ITEMS</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>
                                    <small>{order._id.substring(0, 10)}...</small>
                                </td>
                                <td>{order.User?.name || order.User || 'N/A'}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>{order.orderItems?.length || 0} items</td>
                                <td>${order.totalPrice?.toFixed(2) || '0.00'}</td>
                                <td>
                                    {canUpdateStatus ? (
                                        <Form.Check
                                            type="switch"
                                            id={`paid-${order._id}`}
                                            checked={order.isPaid || false}
                                            onChange={() => handlePaymentStatusChange(order._id, order.isPaid)}
                                            label={
                                                <Badge bg={order.isPaid ? "success" : "warning"}>
                                                    {order.isPaid ? (
                                                        <><i className="fas fa-check"></i> Paid</>
                                                    ) : (
                                                        <><i className="fas fa-times"></i> Pending</>
                                                    )}
                                                </Badge>
                                            }
                                        />
                                    ) : (
                                        <Badge bg={order.isPaid ? "success" : "warning"}>
                                            {order.isPaid ? (
                                                <><i className="fas fa-check"></i> Paid</>
                                            ) : (
                                                <><i className="fas fa-times"></i> Pending</>
                                            )}
                                        </Badge>
                                    )}
                                </td>
                                <td>
                                    {canUpdateStatus ? (
                                        <Form.Check
                                            type="switch"
                                            id={`delivered-${order._id}`}
                                            checked={order.isDelivered || order.isDelieved || false}
                                            onChange={() => handleDeliveryStatusChange(order._id, order.isDelivered || order.isDelieved)}
                                            label={
                                                <Badge bg={(order.isDelivered || order.isDelieved) ? "success" : "secondary"}>
                                                    {(order.isDelivered || order.isDelieved) ? (
                                                        <><i className="fas fa-check"></i> Delivered</>
                                                    ) : (
                                                        <><i className="fas fa-clock"></i> Processing</>
                                                    )}
                                                </Badge>
                                            }
                                        />
                                    ) : (
                                        <Badge bg={(order.isDelivered || order.isDelieved) ? "success" : "secondary"}>
                                            {(order.isDelivered || order.isDelieved) ? (
                                                <><i className="fas fa-check"></i> Delivered</>
                                            ) : (
                                                <><i className="fas fa-clock"></i> Processing</>
                                            )}
                                        </Badge>
                                    )}
                                </td>
                                <td>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        onClick={() => history.push(`/orders/${order._id}`)}
                                    >
                                        <i className="fas fa-eye"></i> Details
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <div className="mt-3 text-muted">
                <small>
                    <i className="fas fa-info-circle me-2"></i>
                    {vendor
                        ? 'Showing orders that contain your products only'
                        : user && user.isAdmin
                            ? 'Showing all orders in the system. Toggle switches to update order status.'
                            : 'Showing your personal orders'
                    }
                </small>
            </div>
        </div>
    );
};

export default OrderListScreen;
