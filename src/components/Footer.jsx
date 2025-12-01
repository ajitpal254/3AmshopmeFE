import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-5 mt-auto">
            <Container>
                <Row>
                    <Col md={4} className="mb-4 mb-md-0">
                        <h5 className="text-uppercase mb-3 fw-bold">3AmShop</h5>
                        <p className="text-muted">
                            Your premium destination for quality products, available 24/7. 
                            We bring you the best shopping experience with fast delivery and top-notch support.
                        </p>
                    </Col>
                    
                    <Col md={2} className="mb-4 mb-md-0">
                        <h6 className="text-uppercase mb-3 fw-bold">Shop</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="/" className="text-muted text-decoration-none hover-white">Home</Link></li>
                            <li className="mb-2"><Link to="/all-products" className="text-muted text-decoration-none hover-white">All Products</Link></li>
                            <li className="mb-2"><Link to="/cart" className="text-muted text-decoration-none hover-white">Cart</Link></li>
                        </ul>
                    </Col>

                    <Col md={3} className="mb-4 mb-md-0">
                        <h6 className="text-uppercase mb-3 fw-bold">Support & Legal</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="/about-us" className="text-muted text-decoration-none hover-white">About Us</Link></li>
                            <li className="mb-2"><Link to="/contact-us" className="text-muted text-decoration-none hover-white">Contact Us</Link></li>
                            <li className="mb-2"><Link to="/privacy-policy" className="text-muted text-decoration-none hover-white">Privacy Policy</Link></li>
                            <li className="mb-2"><Link to="/terms-of-service" className="text-muted text-decoration-none hover-white">Terms of Service</Link></li>
                            <li className="mb-2"><Link to="/refund-policy" className="text-muted text-decoration-none hover-white">Refund Policy</Link></li>
                        </ul>
                    </Col>

                    <Col md={3}>
                        <h6 className="text-uppercase mb-3 fw-bold">Connect</h6>
                        <div className="d-flex gap-3 mb-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light fs-5"><i className="fab fa-facebook"></i></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light fs-5"><i className="fab fa-twitter"></i></a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light fs-5"><i className="fab fa-instagram"></i></a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light fs-5"><i className="fab fa-linkedin"></i></a>
                        </div>
                        <p className="text-muted small">
                            Subscribe to our newsletter for updates.
                        </p>
                    </Col>
                </Row>
                <hr className="my-4 border-secondary" />
                <Row>
                    <Col className="text-center text-muted small">
                        &copy; {new Date().getFullYear()} 3AmShop. All rights reserved.
                    </Col>
                </Row>
            </Container>
            <style>
                {`
                    .hover-white:hover {
                        color: #fff !important;
                    }
                `}
            </style>
        </footer>
    );
};

export default Footer;
