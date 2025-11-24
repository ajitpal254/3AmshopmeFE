import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import notificationService from '../utils/notificationService';
import Rating from '../components/Rating';

const MyReviews = ({ userId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserReviews();
    }, [userId]);

    const fetchUserReviews = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/api/reviews/user/${userId}`);
            setReviews(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user reviews:', error);
            notificationService.error('Failed to load your reviews');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <Card className="text-center py-5">
                <Card.Body>
                    <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No Reviews Yet</h5>
                    <p className="text-muted">You haven't written any reviews yet.</p>
                    <Link to="/" className="btn btn-primary">
                        Start Shopping
                    </Link>
                </Card.Body>
            </Card>
        );
    }

    return (
        <div>
            <h4 className="mb-4">
                <i className="fas fa-star me-2"></i>
                My Reviews ({reviews.length})
            </h4>

            <Row>
                {reviews.map((review) => (
                    <Col md={12} key={review._id} className="mb-3">
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Row>
                                    <Col md={2}>
                                        <Link to={`/product/${review.productId}`}>
                                            <img
                                                src={review.productImage}
                                                alt={review.productName}
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '100px', objectFit: 'cover' }}
                                            />
                                        </Link>
                                    </Col>
                                    <Col md={10}>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h5>
                                                    <Link
                                                        to={`/product/${review.productId}`}
                                                        className="text-decoration-none"
                                                    >
                                                        {review.productName}
                                                    </Link>
                                                </h5>
                                                <Rating value={review.rating} />
                                            </div>
                                            <div className="text-end">
                                                <small className="text-muted">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>

                                        <p className="mb-2">{review.comment}</p>

                                        <div className="d-flex gap-2">
                                            {review.isVerifiedPurchase && (
                                                <Badge bg="success">
                                                    <i className="fas fa-check-circle me-1"></i>
                                                    Verified Purchase
                                                </Badge>
                                            )}
                                            {review.isApproved ? (
                                                <Badge bg="info">
                                                    <i className="fas fa-check me-1"></i>
                                                    Approved
                                                </Badge>
                                            ) : (
                                                <Badge bg="warning" text="dark">
                                                    <i className="fas fa-clock me-1"></i>
                                                    Pending Moderation
                                                </Badge>
                                            )}
                                            {review.helpfulVotes > 0 && (
                                                <Badge bg="secondary">
                                                    <i className="fas fa-thumbs-up me-1"></i>
                                                    {review.helpfulVotes} found helpful
                                                </Badge>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default MyReviews;
