import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const AuthButtons = () => (
    <div className="d-flex align-items-center gap-2 ms-2">
        <LinkContainer to="/app/login">
            <Nav.Link className="nav-link-modern">
                <i className="fas fa-user me-2"></i> Sign In
            </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/app/signup">
            <Button
                variant="primary"
                className="rounded-pill px-4 fw-bold"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    fontSize: '0.95rem',
                    padding: '0.5rem 1.5rem'
                }}
            >
                Sign Up
            </Button>
        </LinkContainer>
    </div>
);

export default AuthButtons;
