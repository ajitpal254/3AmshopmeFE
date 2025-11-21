import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Newsletter = () => {
    return (
        <div className="newsletter-section py-5 mt-3 text-white" style={{ background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)' }}>
            <Container>
                <Row className="align-items-center">
                    <Col md={6} className="mb-3 mb-md-0">
                        <h3 className="fw-bold mb-2">Subscribe to our Newsletter</h3>
                        <p className="mb-0 opacity-75">Get the latest updates, new arrivals, and special offers.</p>
                    </Col>
                    <Col md={6}>
                        <Form className="d-flex gap-2">
                            <Form.Control
                                type="email"
                                placeholder="Enter your email address"
                                className="border-0 shadow-sm"
                                style={{ height: '50px' }}
                            />
                            <Button variant="dark" style={{ height: '50px', minWidth: '120px' }}>
                                Subscribe
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Newsletter;
