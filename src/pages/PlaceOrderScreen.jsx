import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { clearCart } from '../actions/cartActions';
import api from '../utils/api';

const PlaceOrderScreen = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { cartItems, shippingAddress, coupon } = cart;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);

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
                paymentMethod: 'PayPal', // Default payment method
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

            // Redirect to orders list
            history.push(`/orders`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {shippingAddress.address}, {shippingAddress.city}{' '}
                                {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            PayPal or Credit Card
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cartItems.length === 0 ? (
                                <div>Your cart is empty</div>
                            ) : (
                                <ListGroup variant="flush">
                                    {cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/products/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
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
                                    <Col>Items:</Col>
                                    <Col>${itemsPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${shippingPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax (15%):</Col>
                                    <Col>${taxPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>

                            {couponDiscount > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Coupon ({coupon.code}):
                                        </Col>
                                        <Col className="text-success">
                                            -${couponDiscount.toFixed(2)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Total:</strong></Col>
                                    <Col><strong>${totalPrice.toFixed(2)}</strong></Col>
                                </Row>
                            </ListGroup.Item>

                            {error && (
                                <ListGroup.Item>
                                    <div className="alert alert-danger">{error}</div>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="btn-block w-100"
                                    disabled={cartItems.length === 0 || loading}
                                    onClick={placeOrderHandler}
                                >
                                    {loading ? 'Placing Order...' : 'Place Order'}
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
