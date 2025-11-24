import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { clearCart } from '../actions/cartActions';
import api from '../utils/api';
import notificationService from "../utils/notificationService";

const PlaceOrderScreen = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { cartItems, shippingAddress, coupon } = cart;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState('Stripe');

    useEffect(() => {
        if (!shippingAddress.address && !orderPlaced) {
            history.push('/shipping');
        }
    }, [shippingAddress, history, orderPlaced]);

    // Calculate prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    // Calculate discount from coupon
    let couponDiscount = 0;
    if (coupon) {
        if (coupon.discountType === 'percentage') {
            couponDiscount = (itemsPrice * coupon.discountValue) / 100;
        } else {
            couponDiscount = coupon.discountValue;
        }
    }

    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * (itemsPrice - couponDiscount)).toFixed(2));
    const totalPrice = Number((itemsPrice - couponDiscount + shippingPrice + taxPrice).toFixed(2));

    const placeOrderHandler = async () => {
        setLoading(true);
        setError('');

        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    Product: item.product
                })),
                shippingAddress: shippingAddress,
                paymentMethod: 'Stripe',
                itemsPrice: itemsPrice,
                shippingPrice: shippingPrice,
                taxPrice: taxPrice,
                totalPrice: totalPrice,
                couponCode: coupon?.code || null,
                discount: couponDiscount
            };

            const { data } = await api.post('/orders', orderData);

            // Mark order as placed to prevent redirect
            setOrderPlaced(true);

            // Clear cart using Redux action (clears both state and localStorage)
            dispatch(clearCart());

            notificationService.success("Order placed successfully!");

            // Redirect to order details
            history.push(`/orders/${data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
            notificationService.error(err.response?.data?.message || 'Failed to place order');
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <Row>
                <Col md={8}>
                    <Card className="mb-4 border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom-0 pt-4 px-4">
                            <h4 className="mb-0">Shipping & Payment</h4>
                        </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="px-4 py-3">
                                <h5 className="mb-2 text-muted">Shipping Address</h5>
                                <p className="mb-0">
                                    {shippingAddress.address}, {shippingAddress.city}{' '}
                                    {shippingAddress.postalCode}, {shippingAddress.country}
                                </p>
                            </ListGroup.Item>

                            <ListGroup.Item className="px-4 py-3">
                                <h5 className="mb-3 text-muted">Payment Method</h5>
                                <div className="p-3 bg-light rounded">
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="paymentMethod"
                                            id="stripe"
                                            value="Stripe"
                                            checked={true}
                                            readOnly
                                        />
                                        <label className="form-check-label fw-bold" htmlFor="stripe">
                                            Credit / Debit Card (Stripe)
                                        </label>
                                    </div>
                                    <div className="mt-2 text-muted small">
                                        <i className="fas fa-lock me-1"></i> Secure payment processing by Stripe.
                                    </div>
                                </div>
                            </ListGroup.Item>

                            <ListGroup.Item className="px-4 py-3">
                                <h5 className="mb-3 text-muted">Order Items</h5>
                                {cartItems.length === 0 ? (
                                    <div className="alert alert-info">Your cart is empty</div>
                                ) : (
                                    <ListGroup variant="flush">
                                        {cartItems.map((item, index) => (
                                            <ListGroup.Item key={index} className="border-0 px-0 py-2">
                                                <Row className="align-items-center">
                                                    <Col md={2}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/products/${item.product}`} className="text-decoration-none text-dark fw-bold">
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4} className="text-end">
                                                        {item.qty} x ${item.price} = <strong>${(item.qty * item.price).toFixed(2)}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom-0 pt-4 px-4">
                            <h4 className="mb-0">Order Summary</h4>
                        </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="px-4">
                                <Row>
                                    <Col>Items:</Col>
                                    <Col className="text-end">${itemsPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item className="px-4">
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col className="text-end">${shippingPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item className="px-4">
                                <Row>
                                    <Col>Tax (15%):</Col>
                                    <Col className="text-end">${taxPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>

                            {couponDiscount > 0 && (
                                <ListGroup.Item className="px-4">
                                    <Row>
                                        <Col>
                                            Coupon ({coupon.code}):
                                        </Col>
                                        <Col className="text-success text-end">
                                            -${couponDiscount.toFixed(2)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item className="px-4">
                                <Row>
                                    <Col><strong>Total:</strong></Col>
                                    <Col className="text-end"><strong>${totalPrice.toFixed(2)}</strong></Col>
                                </Row>
                            </ListGroup.Item>

                            {error && (
                                <ListGroup.Item className="px-4">
                                    <div className="alert alert-danger mb-0">{error}</div>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item className="p-4">
                                <Button
                                    type="button"
                                    className="w-100 py-2 fw-bold"
                                    disabled={cartItems.length === 0 || loading}
                                    onClick={placeOrderHandler}
                                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PlaceOrderScreen;
