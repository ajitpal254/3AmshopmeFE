import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation, useHistory } from "react-router-dom";
import { Row, Col, ListGroup, Image, Form, Button, Card } from "react-bootstrap";
import { useCart } from "../context/CartContext";

const CartScreen = () => {
    const { id } = useParams();
    const location = useLocation();
    const history = useHistory();
    const qty = location.search ? Number(location.search.split("=")[1]) : 1;

    const { cartItems, addToCart, removeFromCart, createOrder } = useCart();
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");

    useEffect(() => {
        if (id) {
            addToCart(id, qty);
        }
    }, [id, qty, addToCart]);

    const removeFromCartHandler = (backendId) => {
        removeFromCart(backendId);
    };

    const checkoutHandler = async () => {
        setCheckoutLoading(true);
        setCheckoutError("");
        try {
            await createOrder();
            history.push("/orders");
        } catch (error) {
            setCheckoutError(error.response?.data?.message || "Failed to create order");
            setCheckoutLoading(false);
        }
    };

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <div className="alert alert-info">
                        Your cart is empty <Link to="/">Go Back</Link>
                    </div>
                ) : (
                    <ListGroup variant="flush">
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item.backendId}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/products/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>${item.price}</Col>
                                    <Col md={2}>Qty: {item.qty}</Col>
                                    <Col md={2}>
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() => removeFromCartHandler(item.backendId)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>
                                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                                items
                            </h2>
                            $
                            {cartItems
                                .reduce((acc, item) => acc + item.qty * item.price, 0)
                                .toFixed(2)}
                        </ListGroup.Item>
                        {checkoutError && (
                            <ListGroup.Item>
                                <div className="alert alert-danger mb-0">{checkoutError}</div>
                            </ListGroup.Item>
                        )}
                        <ListGroup.Item>
                            <Button
                                type="button"
                                className="btn-block"
                                disabled={cartItems.length === 0 || checkoutLoading}
                                onClick={checkoutHandler}
                            >
                                {checkoutLoading ? "Creating Order..." : "Proceed To Checkout"}
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    );
};

export default CartScreen;
