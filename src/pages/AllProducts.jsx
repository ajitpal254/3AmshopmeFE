import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Card, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import './AllProducts.css';

const AllProducts = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: [],
        sortBy: 'newest',
        deals: false,
        minPrice: '',
        maxPrice: '',
        search: ''
    });

    const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books', 'Beauty'];

    // Initialize filters from URL on mount and when URL changes
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const keyword = params.get('keyword') || '';
        const categoryParam = params.get('category');
        const category = categoryParam ? categoryParam.split(',') : [];
        const minPrice = params.get('minPrice') || '';
        const maxPrice = params.get('maxPrice') || '';
        const deals = params.get('deals') === 'true';
        const sortBy = params.get('sortBy') || 'newest';

        setFilters(prev => ({
            ...prev,
            search: keyword,
            category,
            minPrice,
            maxPrice,
            deals,
            sortBy
        }));
    }, [location.search]);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();

            if (filters.category.length > 0) queryParams.append('category', filters.category.join(','));
            if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
            if (filters.deals) queryParams.append('deals', 'true');
            if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
            if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
            if (filters.search) queryParams.append('keyword', filters.search);

            const { data } = await api.get(`/products?${queryParams.toString()}`);
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        // Debounce search to avoid too many requests
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchProducts]);

    const handleCategoryChange = (cat) => {
        const newCategories = filters.category.includes(cat)
            ? filters.category.filter(c => c !== cat)
            : [...filters.category, cat];
        setFilters({ ...filters, category: newCategories });
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
                <Row>
                    {/* Sidebar Filters */}
                    <Col lg={3} className="mb-4">
                        <div className="filters-card p-4 bg-white rounded shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Filters</h5>
                                <Button 
                                    variant="link" 
                                    className="text-decoration-none p-0"
                                    onClick={() => setFilters({ category: [], sortBy: 'newest', deals: false, minPrice: '', maxPrice: '', search: '' })}
                                >
                                    Reset
                                </Button>
                            </div>

                            {/* Search */}
                            <Form.Group className="mb-4">
                                <Form.Label>Search</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Search products..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                />
                            </Form.Group>

                            {/* Categories */}
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">Categories</Form.Label>
                                {categories.map(cat => (
                                    <Form.Check
                                        key={cat}
                                        type="checkbox"
                                        id={`cat-${cat}`}
                                        label={cat}
                                        checked={filters.category.includes(cat)}
                                        onChange={() => handleCategoryChange(cat)}
                                        className="mb-2"
                                    />
                                ))}
                            </Form.Group>

                            {/* Price Range */}
                            {/* Sort By */}
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">Sort By</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="rating">Top Rated</option>
                                    <option value="popular">Most Popular</option>
                                </Form.Control>
                            </Form.Group>

                            {/* Deals */}
                            <Form.Group>
                                <Form.Check
                                    type="switch"
                                    id="deals-filter"
                                    label="Deals Only"
                                    checked={filters.deals}
                                    onChange={(e) => setFilters({ ...filters, deals: e.target.checked })}
                                />
                            </Form.Group>
                        </div>
                    </Col>

                    {/* Products Grid */}
                    <Col lg={9}>
                        {loading ? (
                            <div className="loading-container text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">Loading products...</p>
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="products-count mb-4 d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        {products.length} Products Found
                                    </h5>
                                </div>
                                <Row className="g-4">
                                    {products.map(product => (
                                        <Col key={product._id} xs={12} sm={6} md={4}>
                                            <Card className="h-100 product-card border-0 shadow-sm">
                                                <Link to={`/products/${product._id}`}>
                                                    <div className="position-relative">
                                                        <Card.Img
                                                            variant="top"
                                                            src={product.image}
                                                            style={{ height: '200px', objectFit: 'cover' }}
                                                        />
                                                        {product.isOnDiscount && (
                                                            <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                                                                -{product.discountPercentage}%
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </Link>
                                                <Card.Body>
                                                    <Link to={`/products/${product._id}`} className="text-decoration-none">
                                                        <Card.Title className="text-dark text-truncate">{product.name}</Card.Title>
                                                    </Link>
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="text-warning">
                                                            {'★'.repeat(Math.floor(product.rating || 0))}
                                                            {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                                                            <small className="text-muted ms-1">({product.numReviews})</small>
                                                        </span>
                                                    </div>
                                                    <Card.Text className="h5 text-primary">
                                                        ${product.price}
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </>
                        ) : (
                            <div className="no-products text-center py-5">
                                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                <h3>No Products Found</h3>
                                <p className="text-muted">Try adjusting your filters or search terms</p>
                                <Button 
                                    variant="primary"
                                    onClick={() => setFilters({ category: [], sortBy: 'newest', deals: false, minPrice: '', maxPrice: '', search: '' })}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AllProducts;
