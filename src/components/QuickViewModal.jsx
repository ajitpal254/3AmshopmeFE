import React, { useState } from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import Rating from './Rating';
import notificationService from '../utils/notificationService';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './QuickViewModal.css';

const QuickViewModal = ({ show, onHide, product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [qty, setQty] = useState(1);

    // Don't render if no product
    if (!product) {
        return (
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Loading...</Modal.Title>
                </Modal.Header>
                <Modal.Body>Please wait...</Modal.Body>
            </Modal>
        );
    }

    const hasDiscount = product.isOnDiscount && product.discountPercentage > 0;
    const displayPrice = hasDiscount
        ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
        : product.price;
    const originalPrice = hasDiscount ? product.price : null;

    const handleAddToCart = () => {
        dispatch(addToCart(product._id, qty));
        notificationService.success('Added to cart!');
        onHide();
    };

    const handleAddToWishlist = async () => {
        if (!user) {
            notificationService.info('Please login to add to wishlist');
            navigate('/app/login');
            return;
        }
        try {
            await api.post(`/api/wishlist/${user._id}`, { productId: product._id });
            notificationService.success('Added to wishlist!');
            onHide();
        } catch (error) {
            notificationService.error(error.response?.data?.message || 'Failed to add to wishlist');
        }
    };

    const handleViewFullDetails = () => {
        onHide();
        navigate(`/products/${product._id}`);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered scrollable className="quick-view-modal">
            <Modal.Header closeButton>
                <Modal.Title>Quick View</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <div className="quick-view-image-container">
                            {hasDiscount && (
                                <Badge bg="danger" className="quick-view-badge">
                                    -{product.discountPercentage}% OFF
                                </Badge>
                            )}
                            <img
                                src={product.image}
                                alt={product.name}
                                className="quick-view-image"
                            />
                        </div>
                    </Col>
                    <Col md={6}>
                        <h3 className="quick-view-title">{product.name}</h3>

                        <div className="mb-3">
                            <Rating value={product.rating} text={`${product.numReviews || 0} reviews`} />
                        </div>

                        <div className="price-section mb-3">
                            <span className="quick-view-price">${displayPrice}</span>
                            {originalPrice && (
                                <span className="quick-view-original-price ms-2">${originalPrice}</span>
                            )}
                        </div>

                        <div className="mb-3">
                            <strong>Status: </strong>
                            {product.countInStock > 0 ? (
                                <Badge bg="success">In Stock ({product.countInStock})</Badge>
                            ) : (
                                <Badge bg="danger">Out of Stock</Badge>
                            )}
                        </div>

                        <p className="product-description">
                            {product.description?.substring(0, 200)}
                            {product.description?.length > 200 && '...'}
                        </p>

                        {product.countInStock > 0 && (
                            <div className="mb-3">
                                <label className="form-label"><strong>Quantity:</strong></label>
                                <select
                                    className="form-select"
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    style={{ width: '100px' }}
                                >
                                    {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="d-flex gap-2 mb-3">
                            <Button
                                variant="primary"
                                className="flex-fill"
                                onClick={handleAddToCart}
                                disabled={product.countInStock === 0}
                            >
                                <i className="fas fa-shopping-cart me-2"></i>
                                Add to Cart
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleAddToWishlist}
                            >
                                <i className="fas fa-heart"></i>
                            </Button>
                        </div>

                        <Button
                            variant="outline-primary"
                            className="w-100"
                            onClick={handleViewFullDetails}
                        >
                            View Full Details
                        </Button>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default QuickViewModal;
