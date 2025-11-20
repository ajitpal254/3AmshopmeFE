import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ProductScreen } from "../components/ProductScreen";
import HeroBanner from "../components/HeroBanner";
import CategoryFilter from "../components/CategoryFilter";
import api from "../utils/api";
import './HomeScreen.css';

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch popular products
            const popularRes = await api.get('/products?sortBy=popular');
            const popularData = popularRes?.data?.products || popularRes?.data || [];
            setPopularProducts(Array.isArray(popularData) ? popularData.slice(0, 4) : []); // Top 4 popular products

            // Fetch all products initially
            await fetchProducts();
        } catch (error) {
            console.error("Error loading data:", error);
            setError(error.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (category = null) => {
        setLoading(true);
        try {
            const url = category && category !== 'All'
                ? `/products/category/${category}`
                : '/products';
            const { data } = await api.get(url);

            if (data.products) {
                setProducts(data.products);
            } else {
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(error.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        fetchProducts(category);
    };

    // Helper to group products by category
    const getProductsByCategory = () => {
        if (selectedCategory !== 'All') return null;

        const grouped = {};
        if (Array.isArray(products)) {
            products.forEach(product => {
                const category = product.category || 'Uncategorized';
                if (!grouped[category]) {
                    grouped[category] = [];
                }
                grouped[category].push(product);
            });
        }
        return grouped;
    };

    const groupedProducts = getProductsByCategory();

    return (
        <div className="home-screen-container">
            <HeroBanner />

            <CategoryFilter onSelectCategory={handleCategorySelect} />

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Most Popular Section */}
                    {popularProducts.length > 0 && (
                        <div className="mb-5">
                            <div className="section-header">
                                <h2 className="section-title">
                                    <i className="fas fa-fire text-danger me-2"></i>
                                    Most Popular
                                </h2>
                            </div>

                            {/* Horizontal Scroll for Mobile & Desktop (or Grid for Desktop if preferred, but user asked for sideways) */}
                            {/* Let's use Grid for Desktop and Horizontal for Mobile as per request "on mobile... scroll sideways" */}
                            <div className="d-md-none horizontal-scroll-container">
                                {popularProducts.map((product) => (
                                    <div key={product._id} className="horizontal-item">
                                        <ProductScreen product={product} />
                                    </div>
                                ))}
                            </div>
                            <Row className="d-none d-md-flex product-grid">
                                {popularProducts.map((product, index) => (
                                    <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="product-col">
                                        <ProductScreen product={product} />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}

                    {/* Main Product Display */}
                    {selectedCategory === 'All' ? (
                        // Display by Category
                        Object.keys(groupedProducts || {}).map((category) => (
                            <div key={category} className="mb-5">
                                <div className="section-header">
                                    <h2 className="section-title">{category}</h2>
                                    <button
                                        className="view-all-btn"
                                        onClick={() => handleCategorySelect(category)}
                                    >
                                        View All <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>

                                {/* Mobile: Horizontal Scroll */}
                                <div className="d-md-none horizontal-scroll-container">
                                    {groupedProducts[category].slice(0, 6).map((product) => (
                                        <div key={product._id} className="horizontal-item">
                                            <ProductScreen product={product} />
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop: Grid */}
                                <Row className="d-none d-md-flex product-grid">
                                    {groupedProducts[category].slice(0, 4).map((product) => (
                                        <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="product-col">
                                            <ProductScreen product={product} />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ))
                    ) : (
                        // Display Filtered List (Grid for all since it's a specific view)
                        <div>
                            <div className="section-header">
                                <h2 className="section-title">{selectedCategory}</h2>
                                {selectedCategory !== 'All' && (
                                    <button className="view-all-btn" onClick={() => handleCategorySelect('All')}>
                                        <i className="fas fa-arrow-left me-1"></i> Back to All
                                    </button>
                                )}
                            </div>
                            <Row className="product-grid">
                                {products.filter(p => p).map((product, index) => (
                                    <Col
                                        key={product._id}
                                        sm={12}
                                        md={6}
                                        lg={4}
                                        xl={3}
                                        className="product-col"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <ProductScreen product={product} />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}

                    {products.length === 0 && !loading && !error && (
                        <div className="alert alert-info text-center my-5">
                            <i className="fas fa-info-circle me-2"></i>
                            No products found.
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger text-center my-5">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            Error: {error}
                            <br />
                            <small>Please check your connection or try again later.</small>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HomeScreen;
