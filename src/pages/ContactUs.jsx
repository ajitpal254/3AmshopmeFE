import React, { useActionState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import notificationService from '../utils/notificationService';

// Mock async action
const submitContactForm = async (prevState, formData) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const name = formData.get('name');
    // In a real app, you would send this to your backend
    console.log('Form submitted for:', name);
    
    notificationService.success('Message sent successfully! We will get back to you soon.');
    return { success: true, message: 'Message sent successfully!' };
};

const ContactUs = () => {
    const [state, formAction, isPending] = useActionState(submitContactForm, null);

    return (
        <Container className="py-5">
            <title>Contact Us | 3AmShop</title>
            <meta name="description" content="Get in touch with 3AmShop support team." />
            
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
                            <Form action={formAction}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Your Name" 
                                        name="name"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="name@example.com" 
                                        name="email"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formSubject">
                                    <Form.Label>Subject</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="How can we help?" 
                                        name="subject"
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
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        size="lg" 
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="me-2"
                                                />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Message'
                                        )}
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
