import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import notificationService from '../utils/notificationService';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would send this to your backend

        notificationService.success('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <Container className="py-5">
            <Helmet>
                <title>Contact Us | 3AmShop</title>
                <meta name="description" content="Get in touch with 3AmShop support team." />
            </Helmet>
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="text-center mb-5">
                        <h1 className="fw-bold">Contact Us</h1>
                        <p className="text-muted">
                            Have a question or feedback? We'd love to hear from you.
                        </p>
                    </div>
                    
                    <Card className="border-0 shadow-sm p-4">
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Your Name" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="name@example.com" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formSubject">
                                    <Form.Label>Subject</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="How can we help?" 
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formMessage">
                                    <Form.Label>Message</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={5} 
                                        placeholder="Your message..." 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button variant="primary" type="submit" size="lg">
                                        Send Message
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    <div className="mt-5 text-center">
                        <h5 className="fw-bold mb-3">Other ways to reach us</h5>
                        <p className="mb-1"><i className="fas fa-envelope me-2 text-primary"></i> support@3amshop.com</p>
                        <p><i className="fas fa-phone me-2 text-primary"></i> +1 (555) 123-4567</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactUs;
