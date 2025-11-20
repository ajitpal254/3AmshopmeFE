import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductScreen from "../components/ProductScreen";
import HeroBanner from "../components/HeroBanner";
import CategoryFilter from "../components/CategoryFilter";
import api from "../utils/api";
import './HomeScreen.css';

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (category = null) => {
        setLoading(true);
        try {
            const url = category && category !== 'All'
                ? `/products/category/${category}`
                : '/products';
            const { data } = await api.get(url);
            setProducts(data);
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

    return (
        <div className="home-screen-container">
            <HeroBanner />

            <CategoryFilter onSelectCategory={handleCategorySelect} />

            <h2 className="section-title">
                {selectedCategory === 'All' ? 'Latest Products' : selectedCategory}
            </h2>

            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
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
            )}

            {products.length === 0 && !loading && (
                <div className="alert alert-info text-center">
                    No products found in this category.
                </div>
            )}
        </div>
    );
};

export default HomeScreen;
