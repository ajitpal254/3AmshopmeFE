import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ProductScreen } from "../components/ProductScreen";
import HeroBanner from "../components/HeroBanner";
import CategoryFilter from "../components/CategoryFilter";
import FeaturesSection from "../components/home/FeaturesSection";
import PromoBanner from "../components/home/PromoBanner";
import ProductRow from "../components/home/ProductRow";
import Newsletter from "../components/home/Newsletter";
import Testimonials from "../components/home/Testimonials";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import Message from "../components/shared/Message";
import useScrollReveal from "../hooks/useScrollReveal";
import api from "../utils/api";
import './HomeScreen.css';

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Custom hook for scroll animations
    // Pass dependencies to re-run observer when data changes
    useScrollReveal([products.length, popularProducts.length, selectedCategory]);

    useEffect(() => {
        loadData();
        setupScrollProgress();

        return () => {
            window.removeEventListener('scroll', handleScrollProgress);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Scroll Progress Bar
    const handleScrollProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        setScrollProgress(scrollPercent);
    };

    const setupScrollProgress = () => {
        window.addEventListener('scroll', handleScrollProgress);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch popular products
            const popularRes = await api.get('/products?sortBy=popular');
            const popularData = popularRes?.data?.products || popularRes?.data || [];
            setPopularProducts(Array.isArray(popularData) ? popularData.slice(0, 4) : []);

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
            {/* Scroll Progress Bar */}
            <div className="scroll-progress">
                <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
            </div>

            <HeroBanner />
            <FeaturesSection />
            <CategoryFilter onSelectCategory={handleCategorySelect} />

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="container my-5">
                    <Message variant="danger">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Error: {error}
                        <br />
                        <small>Please check your connection or try again later.</small>
                    </Message>
                </div>
            ) : (
                <>
                    {/* Most Popular Section */}
                    {popularProducts.length > 0 && (
                        <ProductRow
                            title="Most Popular"
                            products={popularProducts}
                            icon="fas fa-fire text-danger"
                        />
                    )}

                    {/* Main Product Display */}
                    {selectedCategory === 'All' ? (
                        // Display by Category
                        Object.keys(groupedProducts || {}).map((category) => (
                            <ProductRow
                                key={category}
                                title={category}
                                products={groupedProducts[category].slice(0, 4)} // Show top 4 for grid
                                onViewAll={() => handleCategorySelect(category)}
                            />
                        ))
                    ) : null}

                    {/* Promotional Banner */}
                    {selectedCategory === 'All' && <PromoBanner />}

                    {selectedCategory !== 'All' ? (
                        // Display Filtered List
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
                    ) : null}

                    {products.length === 0 && !loading && !error && (
                        <div className="container my-5">
                            <Message variant="info">
                                <i className="fas fa-info-circle me-2"></i>
                                No products found.
                            </Message>
                        </div>
                    )}

                    <Testimonials />
                    <Newsletter />
                </>
            )}
        </div>
    );
};

export default HomeScreen;
