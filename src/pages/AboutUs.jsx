import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const AboutUs = () => {
    return (
        <Container className="py-5">
            <Helmet>
                <title>About Us | 3AmShop</title>
                <meta name="description" content="Learn more about 3AmShop, your go-to destination for premium products." />
            </Helmet>
            <Row className="justify-content-center mb-5">
                <Col md={8} className="text-center">
                    <h1 className="mb-4 fw-bold">About 3AmShop</h1>
                    <p className="lead text-muted">
                        Redefining your shopping experience with quality, speed, and style.
                    </p>
                </Col>
            </Row>

            <Row className="mb-5 align-items-center">
                <Col md={6}>
                    <img 
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                        alt="Our Store" 
                        className="img-fluid rounded-3 shadow-lg mb-4 mb-md-0"
                    />
                </Col>
                <Col md={6}>
                    <h2 className="fw-bold mb-3">Our Story</h2>
                    <p>
                        Founded in 2024, 3AmShop began with a simple mission: to provide high-quality products available at any time of the day. We understand that inspiration (and shopping urges) doesn't strictly follow business hours.
                    </p>
                    <p>
                        What started as a small passion project has grown into a diverse marketplace offering everything from cutting-edge electronics to fashion-forward apparel. We pride ourselves on curating items that bring value and joy to your life.
                    </p>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col md={4} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm text-center p-4">
                        <Card.Body>
                            <div className="display-4 text-primary mb-3">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <Card.Title className="fw-bold">Quality First</Card.Title>
                            <Card.Text>
                                We meticulously vet every vendor and product to ensure you receive nothing but the best.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm text-center p-4">
                        <Card.Body>
                            <div className="display-4 text-primary mb-3">
                                <i className="fas fa-shipping-fast"></i>
                            </div>
                            <Card.Title className="fw-bold">Fast Shipping</Card.Title>
                            <Card.Text>
                                We know you want your gear fast. Our logistics partners ensure timely delivery to your doorstep.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm text-center p-4">
                        <Card.Body>
                            <div className="display-4 text-primary mb-3">
                                <i className="fas fa-headset"></i>
                            </div>
                            <Card.Title className="fw-bold">24/7 Support</Card.Title>
                            <Card.Text>
                                Questions? Concerns? Our support team is available around the clock to assist you.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AboutUs;
