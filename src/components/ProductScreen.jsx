import React from 'react';
import { Button, Card, Badge } from "react-bootstrap";
import Rating from './Rating'
import { Link, useHistory } from "react-router-dom";
import { useCart } from "../context/CartContext";
import './ProductScreen.css';

const ProductScreen = ({ product }) => {
    const { addToCart } = useCart();
    const history = useHistory();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product._id, 1);
        history.push(`/`);
    };

    // Calculate discount if product has originalPrice
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <Card className="product-card h-100">
            {discount > 0 && (
                <Badge bg="danger" className="product-badge">
                    -{discount}% OFF
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
                    <span className="current-price">${product.price}</span>
                    {product.originalPrice && (
                        <span className="original-price">${product.originalPrice}</span>
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

export default ProductScreen;
