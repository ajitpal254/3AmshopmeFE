import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Table, Modal, Form } from 'react-bootstrap';
import api from '../../utils/api';
import notificationService from '../../utils/notificationService';

const ReviewModeration = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // pending, approved, all
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, [filter]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/api/reviews?status=${filter}`);
            setReviews(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            notificationService.error('Failed to load reviews');
            setLoading(false);
        }
    };

    const handleApprove = async (productId, reviewId) => {
        try {
            await api.put(`/api/reviews/${productId}/${reviewId}/approve`);
            notificationService.success('Review approved successfully');
            fetchReviews();
        } catch (error) {
            notificationService.error(error.response?.data?.message || 'Failed to approve review');
        }
    };

    const handleDelete = async () => {
        if (!selectedReview) return;

        try {
            await api.delete(`/api/reviews/${selectedReview.productId}/${selectedReview._id}`);
            notificationService.success('Review deleted successfully');
            setShowDeleteModal(false);
            setSelectedReview(null);
            fetchReviews();
        } catch (error) {
            notificationService.error(error.response?.data?.message || 'Failed to delete review');
        }
    };

    const confirmDelete = (review) => {
        setSelectedReview(review);
        setShowDeleteModal(true);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h3 className="mb-0">
                        <i className="fas fa-comments me-2"></i>
                        Review Moderation
                    </h3>
                </Card.Header>
                <Card.Body>
                    {/* Filter Buttons */}
                    <div className="mb-3">
                        <Button
                            variant={filter === 'pending' ? 'primary' : 'outline-primary'}
                            onClick={() => setFilter('pending')}
                            className="me-2"
                        >
                            Pending ({reviews.filter(r => !r.isApproved).length})
                        </Button>
                        <Button
                            variant={filter === 'approved' ? 'success' : 'outline-success'}
                            onClick={() => setFilter('approved')}
                            className="me-2"
                        >
                            Approved ({reviews.filter(r => r.isApproved).length})
                        </Button>
                        <Button
                            variant={filter === 'all' ? 'info' : 'outline-info'}
                            onClick={() => setFilter('all')}
                        >
                            All ({reviews.length})
                        </Button>
                    </div>

                    {/* Reviews Table */}
                    {reviews.length === 0 ? (
                        <div className="text-center text-muted py-4">
                            <i className="fas fa-inbox fa-3x mb-3"></i>
                            <p>No reviews found</p>
                        </div>
                    ) : (
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Reviewer</th>
                                    <th>Rating</th>
                                    <th>Comment</th>
                                    <th>Status</th>
                                    <th>Helpful Votes</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review._id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={review.productImage}
                                                    alt={review.productName}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    className="me-2 rounded"
                                                />
                                                <span>{review.productName}</span>
                                            </div>
                                        </td>
                                        <td>{review.name}</td>
                                        <td>
                                            <div className="text-warning">
                                                {'★'.repeat(review.rating)}
                                                {'☆'.repeat(5 - review.rating)}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ maxWidth: '200px' }} className="text-truncate">
                                                {review.comment}
                                            </div>
                                        </td>
                                        <td>
                                            {review.isApproved ? (
                                                <Badge bg="success">Approved</Badge>
                                            ) : (
                                                <Badge bg="warning">Pending</Badge>
                                            )}
                                            {review.isVerifiedPurchase && (
                                                <Badge bg="info" className="ms-1">
                                                    <i className="fas fa-check-circle me-1"></i>
                                                    Verified
                                                </Badge>
                                            )}
                                        </td>
                                        <td>
                                            <i className="fas fa-thumbs-up me-1"></i>
                                            {review.helpfulVotes || 0}
                                        </td>
                                        <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {!review.isApproved && (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleApprove(review.productId, review._id)}
                                                    className="me-1"
                                                >
                                                    <i className="fas fa-check"></i>
                                                </Button>
                                            )}
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => confirmDelete(review)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this review? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ReviewModeration;
