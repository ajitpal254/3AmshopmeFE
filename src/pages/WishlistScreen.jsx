import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const WishlistScreen = () => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (user) {
                try {
                    const { data } = await api.get(`/api/wishlist/${user._id}`);
                    setWishlist(data);
                } catch (error) {
                    console.error("Error fetching wishlist", error);
                    toast.error("Failed to load wishlist");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [user]);

    const removeFromWishlistHandler = async (productId) => {
        try {
            const { data } = await api.delete(`/api/wishlist/${user._id}/${productId}`);
            setWishlist(data);
            toast.success("Removed from wishlist");
        } catch (error) {
            console.error("Error removing from wishlist", error);
            toast.error("Failed to remove item");
        }
    };

    if (!user) {
        return (
            <div className="container mt-5">
                <Alert variant="info">
                    Please <Link to="/app/login">login</Link> to view your wishlist.
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">My Wishlist</h1>
            {loading ? (
                <div>Loading...</div>
            ) : wishlist.length === 0 ? (
                <div className="text-center py-5">
                    <div className="mb-4">
                        <i className="fas fa-heart fa-4x text-muted opacity-25"></i>
                    </div>
                    <h3 className="fw-bold mb-3">Your Wishlist is Empty</h3>
                    <p className="text-muted mb-4">Save items you love here to buy them later.</p>
                    <Link to="/" className="btn btn-primary px-5 py-2 fw-bold rounded-pill shadow-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <Row>
                    {wishlist.map((item) => (
                        <Col key={item._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                            <Card className="h-100 shadow-sm border-0">
                                <Link to={`/products/${item._id}`}>
                                    <Card.Img variant="top" src={item.image} style={{ height: '200px', objectFit: 'contain', padding: '1rem' }} />
                                </Link>
                                <Card.Body className="d-flex flex-column">
                                    <Link to={`/products/${item._id}`} className="text-decoration-none text-dark">
                                        <Card.Title as="div" className="mb-3">
                                            <strong>{item.name}</strong>
                                        </Card.Title>
                                    </Link>
                                    <Card.Text as="h3" className="mb-3">
                                        ${item.price}
                                    </Card.Text>
                                    <div className="mt-auto d-flex gap-2">
                                        <Button
                                            variant="danger"
                                            className="w-100"
                                            onClick={() => removeFromWishlistHandler(item._id)}
                                        >
                                            <i className="fas fa-trash"></i> Remove
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default WishlistScreen;
