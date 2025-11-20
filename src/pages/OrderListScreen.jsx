import React, { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderListScreen = ({ history }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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

    if (loading) {
        return <LoadingSpinner message="Loading orders..." />;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">{vendor ? 'My Orders' : user && user.isAdmin ? 'All Orders' : 'My Orders'}</h1>

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
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id.substring(0, 10)}...</td>
                                <td>{order.User?.name || order.User || 'N/A'}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>${order.totalPrice.toFixed(2)}</td>
                                <td>
                                    {order.isPaid ? (
                                        <Badge bg="success">
                                            <i className="fas fa-check"></i> Paid
                                        </Badge>
                                    ) : (
                                        <Badge bg="warning">
                                            <i className="fas fa-times"></i> Pending
                                        </Badge>
                                    )}
                                </td>
                                <td>
                                    {order.isDelieved ? (
                                        <Badge bg="success">
                                            <i className="fas fa-check"></i> Delivered
                                        </Badge>
                                    ) : (
                                        <Badge bg="secondary">
                                            <i className="fas fa-times"></i> Processing
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
                            ? 'Showing all orders in the system'
                            : 'Showing your personal orders'
                    }
                </small>
            </div>
        </div>
    );
};

export default OrderListScreen;
