import React, { useState, useEffect } from 'react';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import notificationService from "../utils/notificationService";
import StripePaymentForm from '../components/StripePaymentForm';
import TrackOrder from '../components/TrackOrder';
import { formatPrice, getCurrencySymbol } from '../utils/currencyUtils';

const OrderScreen = ({ match, history }) => {
    const orderId = match.params.id;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stripePromise, setStripePromise] = useState(null);

    const { user: userInfo } = useAuth();
    const currencyState = useSelector((state) => state.currencyState);
    const { currency } = currencyState;
    const currencySymbol = getCurrencySymbol(currency);

    useEffect(() => {
        if (!userInfo) {
            history.push('/app/login');
        }

        const fetchStripeConfig = async () => {
            try {
                const { data: key } = await api.get('/api/payment/config/stripe');
                if (key) {
                    setStripePromise(loadStripe(key));
                }
            } catch (err) {
                console.error("Failed to load Stripe config", err);
            }
        };

        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${orderId}`);
                setOrder(data);

                if (!data.isPaid) {
                    fetchStripeConfig();
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load order');
            } finally {
                setLoading(false);
            }
        };

        if (!order || order._id !== orderId) {
            fetchOrder();
        }
    }, [orderId, order, userInfo, history]);

    const successPaymentHandler = async (paymentResult) => {
        try {
            const { data } = await api.put(`/orders/${orderId}/pay`, paymentResult);
            setOrder(data);
            notificationService.success('Payment Successful!');
        } catch (err) {
            notificationService.error(err.response?.data?.message || 'Payment update failed');
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading order details..." />;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Order {order._id}</h2>
            <TrackOrder
                isPaid={order.isPaid}
                isDelivered={order.isDelivered}
                paidAt={order.paidAt}
                deliveredAt={order.deliveredAt}
            />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3>Shipping</h3>
                            <p><strong>Name: </strong> {order.User?.name || order.User}</p>
                            <p><strong>Email: </strong> <a href={`mailto:${order.User?.email}`}>{order.User?.email}</a></p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress?.address}, {order.shippingAddress?.city}{' '}
                                {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                            </p>
                            {order.isDelivered ? (
                                <div className="alert alert-success">Delivered on {order.deliveredAt}</div>
                            ) : (
                                <div className="alert alert-danger">Not Delivered</div>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h3>Payment Method</h3>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <div className="alert alert-success">Paid on {order.paidAt}</div>
                            ) : (
                                <div className="alert alert-danger">Not Paid</div>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h3>Order Items</h3>
                            {order.orderItems?.length === 0 ? (
                                <div className="alert alert-info">Order is empty</div>
                            ) : (
                                <ListGroup variant="flush">
                                    {order.orderItems?.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/products/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x {currencySymbol}{formatPrice(item.price, currency)} = {currencySymbol}{formatPrice(item.qty * item.price, currency)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>{currencySymbol}{formatPrice(order.itemsPrice, currency)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>{currencySymbol}{formatPrice(order.shippingPrice, currency)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>{currencySymbol}{formatPrice(order.taxPrice, currency)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>{currencySymbol}{formatPrice(order.totalPrice, currency)}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {stripePromise ? (
                                        <Elements stripe={stripePromise}>
                                            <StripePaymentForm
                                                orderId={orderId}
                                                amount={order.totalPrice}
                                                onSuccess={successPaymentHandler}
                                            />
                                        </Elements>
                                    ) : (
                                        <LoadingSpinner message="Loading payment system..." />
                                    )}
                                </ListGroup.Item>
                            )}
                            {order.isPaid && (
                                <ListGroup.Item>
                                    <button
                                        className="btn btn-dark w-100"
                                        onClick={() => window.print()}
                                    >
                                        <i className="fas fa-print me-2"></i>
                                        Download Receipt
                                    </button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default OrderScreen;
