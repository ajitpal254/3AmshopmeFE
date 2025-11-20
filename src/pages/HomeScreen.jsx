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

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch popular products
            const popularRes = await api.get('/products?sortBy=popular');
            const popularData = popularRes.data.products || popularRes.data;
            setPopularProducts(popularData.slice(0, 4)); // Top 4 popular products

            // Fetch all products initially
            await fetchProducts();
        } catch (error) {
            console.error("Error loading data:", error);
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
        products.forEach(product => {
            if (!grouped[product.category]) {
                grouped[product.category] = [];
            }
            grouped[product.category].push(product);
        });
        return grouped;
    };

    const groupedProducts = getProductsByCategory();

    return (
        <div className="home-screen-container">
            <HeroBanner />

            <CategoryFilter onSelectCategory={handleCategorySelect} />

            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Most Popular Section */}
                    {popularProducts.length > 0 && (
                        <div className="mb-5">
                            <h2 className="section-title mb-4">
                                <i className="fas fa-fire text-danger me-2"></i>
                                Most Popular
                            </h2>
                            <Row className="product-grid">
                                {popularProducts.map((product, index) => (
                                    <Col
                                        key={product._id}
                                        sm={12}
                                        md={6}
                                        lg={4}
                                        xl={3}
                                        className="product-col"
                                    >
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
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h2 className="section-title mb-0">{category}</h2>
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => handleCategorySelect(category)}
                                    >
                                        View All {category}
                                    </button>
                                </div>
                                <Row className="product-grid">
                                    {groupedProducts[category].slice(0, 4).map((product) => (
                                        <Col
                                            key={product._id}
                                            sm={12}
                                            md={6}
                                            lg={4}
                                            xl={3}
                                            className="product-col"
                                        >
                                            <ProductScreen product={product} />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ))
                    ) : (
                        // Display Filtered List
                        <div>
                            <h2 className="section-title mb-4">{selectedCategory}</h2>
                            <Row className="product-grid">
                                {products.map((product, index) => (
                                    <Col
                                        key={product._id}
                                        sm={12}
                                        md={6}
                                        lg={4}
                                        xl={3}
                                        className="product-col"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <ProductScreen product={product} />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}

                    {products.length === 0 && !loading && (
                        <div className="alert alert-info text-center">
                            No products found.
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HomeScreen;
