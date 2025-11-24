import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './AllProducts.css';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        sortBy: 'newest',
        deals: false
    });

    const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books', 'Beauty'];

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();

            if (filters.category) queryParams.append('category', filters.category);
            if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
            if (filters.deals) queryParams.append('deals', 'true');

            const { data } = await api.get(`/api/products?${queryParams.toString()}`);
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="all-products-page">
            <div className="products-hero">
                <Container>
                    <h1 className="hero-title">
                        <i className="fas fa-shopping-bag me-3"></i>
                        All Products
                    </h1>
                    <p className="hero-subtitle">
                        Discover amazing products at great prices
                    </p>
                </Container>
            </div>

            <Container className="py-5">
                {/* Filters */}
                <Row className="mb-4">
                    <Col lg={12}>
                        <div className="filters-card">
                            <Row className="g-3 align-items-center">
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="filter-label">
                                            <i className="fas fa-filter me-2"></i>
                                            Category
                                        </Form.Label>
                                        <Form.Select
                                            value={filters.category}
                                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                            className="filter-select"
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="filter-label">
                                            <i className="fas fa-sort me-2"></i>
                                            Sort By
                                        </Form.Label>
                                        <Form.Select
                                            value={filters.sortBy}
                                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                            className="filter-select"
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="rating">Top Rated</option>
                                            <option value="popular">Most Popular</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={3}>
                                    <Form.Group className="mt-4">
                                        <Form.Check
                                            type="checkbox"
                                            id="deals-filter"
                                            label="Deals Only"
                                            checked={filters.deals}
                                            onChange={(e) => setFilters({ ...filters, deals: e.target.checked })}
                                            className="deals-checkbox"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={3} className="text-end">
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => setFilters({ category: '', sortBy: 'newest', deals: false })}
                                        className="reset-btn"
                                    >
                                        <i className="fas fa-redo me-2"></i>
                                        Reset Filters
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                {/* Products Grid */}
                {loading ? (
                    <div className="loading-container">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading products...</p>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="products-count mb-4">
                            <h5>
                                <i className="fas fa-box me-2"></i>
                                {products.length} Products Found
                            </h5>
                        </div>
                        <Row className="g-4">
                            {products.map(product => (
                                <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                                    <Card className="h-100">
                                        <Link to={`/products/${product._id}`}>
                                            <Card.Img
                                                variant="top"
                                                src={product.image}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                        </Link>
                                        <Card.Body>
                                            <Link to={`/products/${product._id}`} className="text-decoration-none">
                                                <Card.Title className="text-dark">{product.name}</Card.Title>
                                            </Link>
                                            <Card.Text className="mb-2">
                                                <span className="text-warning">
                                                    {'★'.repeat(Math.floor(product.rating || 0))}
                                                    {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                                                </span>
                                                <small className="text-muted ms-2">
                                                    ({product.numReviews || 0} reviews)
                                                </small>
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>${product.price}</strong>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </>
                ) : (
                    <div className="no-products">
                        <i className="fas fa-box-open"></i>
                        <h3>No Products Found</h3>
                        <p>Try adjusting your filters or check back later</p>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default AllProducts;
