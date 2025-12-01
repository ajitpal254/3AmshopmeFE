import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import notificationService from '../utils/notificationService';

const ResetPasswordScreen = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setMessage({ type: 'danger', text: 'Passwords do not match' });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: 'danger', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const { data } = await api.post('/app/reset-password', { token, password });
            setMessage({ type: 'success', text: data.message });
            notificationService.success(data.message);
            setTimeout(() => {
                navigate('/app/login');
            }, 3000);
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
                <title>Reset Password | 3AmShop</title>
            </Helmet>
            <Card className="p-4 shadow-lg border-0" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
                <Card.Body>
                    <h2 className="text-center mb-4 fw-bold">Reset Password</h2>
                    
                    {message && <Alert variant={message.type}>{message.text}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ borderRadius: '10px', padding: '12px' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ResetPasswordScreen;
