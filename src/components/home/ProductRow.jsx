import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { ProductScreen } from "../ProductScreen"; // Adjust path if needed, assuming it's in src/components

const ProductRow = ({ title, products, onViewAll, icon }) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="mb-5 scroll-reveal">
            <div className="section-header scroll-reveal-left">
                <h2 className="section-title">
                    {icon && <i className={`${icon} me-2`}></i>}
                    {title}
                </h2>
                {onViewAll && (
                    <button
                        className="view-all-btn"
                        onClick={onViewAll}
                    >
                        View All <i className="fas fa-arrow-right"></i>
                    </button>
                )}
            </div>

            {/* Mobile: Horizontal Scroll */}
            <div className="d-md-none horizontal-scroll-container scroll-reveal-right">
                {products.map((product) => (
                    <div key={product._id} className="horizontal-item">
                        <ProductScreen product={product} />
                    </div>
                ))}
            </div>

            {/* Desktop: Grid */}
            <Row className="d-none d-md-flex product-grid scroll-reveal">
                {products.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="product-col">
                        <ProductScreen product={product} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ProductRow;
