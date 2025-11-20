import React from 'react';
import { Button, Card, Badge } from "react-bootstrap";
import Rating from './Rating'
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../actions/cartActions";
import './ProductScreen.css';

export const ProductScreen = ({ product }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const handleAddToCart = (e) => {
        e.preventDefault();
        dispatch(addToCart(product._id, 1));
    };

    // Calculate actual price and original price based on discount
    const hasDiscount = product.isOnDiscount && product.discountPercentage > 0;
    const displayPrice = hasDiscount
        ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
        : product.price;
    const originalPrice = hasDiscount ? product.price : (product.originalPrice || null);

    return (
        <Card className="product-card h-100">
            {hasDiscount && (
                <Badge bg="danger" className="product-badge">
                    -{product.discountPercentage}% OFF
                </Badge>
            )}

            <Link to={`/products/${product._id}`} className="text-decoration-none">
                <div className="product-image-container">
                    <Card.Img
                        variant="top"
                        src={product.image}
                        className="product-image"
                    />
                    <div className="product-overlay">
                        <Button variant="light" className="quick-view-btn">
                            Quick View
                        </Button>
                    </div>
                </div>
            </Link>

            <Card.Body className="d-flex flex-column">
                <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
                    <Card.Title as="div" className="product-title-text">
                        {product.name}
                    </Card.Title>
                </Link>

                <Card.Text as="div" className="mb-2">
                    <Rating value={product.rating} text={` ${product.numReviews || 0} reviews`} />
                </Card.Text>

                <div className="price-container mb-3">
                    <span className="current-price">${displayPrice}</span>
                    {originalPrice && (
                        <span className="original-price">${originalPrice}</span>
                    )}
                </div>

                <Button
                    variant="primary"
                    className="add-to-cart-btn mt-auto"
                    onClick={handleAddToCart}
                >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Add to Cart
                </Button>
            </Card.Body>
        </Card>
    )
}

