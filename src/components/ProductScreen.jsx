import React, { useState } from 'react';
import { Button, Card, Badge } from "react-bootstrap";
import Rating from './Rating'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../actions/cartActions";
import api from '../utils/api';
import notificationService from '../utils/notificationService';
import { useAuth } from '../context/AuthContext';
import QuickViewModal from './QuickViewModal';
import { formatPrice, getCurrencySymbol } from '../utils/currencyUtils';
import './ProductScreen.css';

export const ProductScreen = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);

    const currencyState = useSelector((state) => state.currencyState);
    const { currency } = currencyState;
    const currencySymbol = getCurrencySymbol(currency);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart(product._id, 1));
        notificationService.success('Added to cart!');
    };

    const handleAddToWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            notificationService.info('Please login to add to wishlist');
            navigate('/app/login');
            return;
        }
        try {
            await api.post(`/api/wishlist/${user._id}`, { productId: product._id });
            notificationService.success('Added to wishlist!');
        } catch (error) {
            notificationService.error(error.response?.data?.message || 'Failed to add to wishlist');
        }
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowQuickView(true);
    };

    // Calculate actual price and original price based on discount
    const hasDiscount = product.isOnDiscount && product.discountPercentage > 0;
    const rawDisplayPrice = hasDiscount
        ? (product.price * (1 - product.discountPercentage / 100))
        : product.price;

    const displayPrice = formatPrice(rawDisplayPrice || 0, currency);
    const originalPrice = formatPrice(product.price || 0, currency);

    return (
        <>
            <Card
                className="product-card h-100"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {hasDiscount && (
                    <Badge bg="danger" className="product-badge">
                        -{product.discountPercentage}% OFF
                    </Badge>
                )}

                <div className="product-image-container">
                    <Card.Img
                        variant="top"
                        src={product.image}
                        className="product-image"
                    />
                    <div className={`product-overlay ${isHovered ? 'show' : ''}`}>
                        <Button
                            variant="light"
                            className="quick-view-btn"
                            onClick={handleQuickView}
                        >
                            <i className="fas fa-eye me-2"></i>
                            Quick View
                        </Button>
                    </div>
                </div>

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
                        <span className="current-price">{currencySymbol}{displayPrice}</span>
                        {hasDiscount && (
                            <span className="original-price">{currencySymbol}{originalPrice}</span>
                        )}
                    </div>

                    {/* Action Buttons - Only show on hover */}
                    <div className={`action-buttons-container mt-auto ${isHovered ? 'show' : ''}`}>
                        <div className="dual-button-container">
                            <Button
                                variant="primary"
                                className="dual-btn cart-btn"
                                onClick={handleAddToCart}
                                title="Add to Cart"
                            >
                                <i className="fas fa-shopping-cart"></i>
                            </Button>
                            <Button
                                variant="danger"
                                className="dual-btn wishlist-btn"
                                onClick={handleAddToWishlist}
                                title="Add to Wishlist"
                            >
                                <i className="fas fa-heart"></i>
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Quick View Modal */}
            <QuickViewModal
                show={showQuickView}
                onHide={() => setShowQuickView(false)}
                product={product}
            />
        </>
    )
}

export default ProductScreen;
