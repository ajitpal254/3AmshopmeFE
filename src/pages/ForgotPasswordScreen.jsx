import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import notificationService from '../utils/notificationService';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { data } = await api.post('/app/forgot-password', { email });
            setMessage({ type: 'success', text: data.message });
            notificationService.success(data.message);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
            setMessage({ type: 'danger', text: errorMsg });
            notificationService.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Helmet>
                <title>Forgot Password | 3AmShop</title>
            </Helmet>
            <Card className="p-4 shadow-lg border-0" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
                <Card.Body>
                    <h2 className="text-center mb-4 fw-bold">Forgot Password</h2>
                    <p className="text-center text-muted mb-4">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    {message && <Alert variant={message.type}>{message.text}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4" controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ borderRadius: '10px', padding: '12px' }}
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                                style={{ borderRadius: '10px', padding: '12px', fontWeight: '600' }}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ForgotPasswordScreen;
