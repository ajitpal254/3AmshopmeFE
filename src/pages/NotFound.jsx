import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
    return (
        <Container className="text-center py-5" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Helmet>
                <title>404 Not Found | 3AmShop</title>
            </Helmet>
            <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#e2e8f0' }}>404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="mb-5 text-muted" style={{ maxWidth: '500px' }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/">
                <Button variant="primary" size="lg" style={{ borderRadius: '30px', padding: '10px 30px' }}>
                    Back to Home
                </Button>
            </Link>
        </Container>
    );
};

export default NotFound;
