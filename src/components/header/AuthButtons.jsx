import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const AuthButtons = () => (
    <div className="d-flex align-items-center gap-3">
        <LinkContainer to="/app/login">
            <Nav.Link className="nav-link-modern">
                <i className="fas fa-user me-2"></i> Sign In
            </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/app/signup">
            <Button
                variant="primary"
                className="rounded-pill fw-bold d-flex align-items-center justify-content-center"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    fontSize: '0.95rem',
                    height: '38px',
                    padding: '0 1.5rem',
                    boxShadow: '0 4px 6px rgba(102, 126, 234, 0.25)'
                }}
            >
                Sign Up
            </Button>
        </LinkContainer>
    </div>
);

export default AuthButtons;
