import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Fashion Blogger",
            text: "I absolutely love the quality of the clothes! The delivery was super fast and the packaging was beautiful.",
            rating: 5
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Verified Buyer",
            text: "Great customer service and amazing products. Will definitely be shopping here again.",
            rating: 5
        },
        {
            id: 3,
            name: "Emily Davis",
            role: "Designer",
            text: "The variety of styles is impressive. Found exactly what I was looking for.",
            rating: 4
        }
    ];

    return (
        <div className="testimonials-section py-4 bg-light">
            <Container>
                <div className="text-center mb-4">
                    <h2 className="fw-bold">What Our Customers Say</h2>
                    <p className="text-muted">Real reviews from real customers</p>
                </div>
                <Row>
                    {testimonials.map(item => (
                        <Col md={4} key={item.id} className="mb-4">
                            <Card className="h-100 border-0 shadow-sm testimonial-card" style={{ transition: 'transform 0.3s' }}>
                                <Card.Body className="p-4 text-center">
                                    <div className="mb-3 text-warning">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <i key={i} className="fas fa-star"></i>
                                        ))}
                                    </div>
                                    <Card.Text className="fst-italic mb-4">"{item.text}"</Card.Text>
                                    <h5 className="fw-bold mb-1">{item.name}</h5>
                                    <small className="text-muted">{item.role}</small>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default Testimonials;
