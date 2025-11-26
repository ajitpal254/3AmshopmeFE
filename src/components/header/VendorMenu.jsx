import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const VendorMenu = ({ vendor, onLogout }) => (
    <NavDropdown
        title={
            <div className="d-flex align-items-center gap-2">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                    <i className="fas fa-store"></i>
                </div>
                <span className="fw-bold text-dark">{vendor.name}</span>
            </div>
        }
        id="vendorname"
        align="end"
        className="user-dropdown-nav nav-link-modern p-0"
    >
        <LinkContainer to="/vendor/dashboard">
            <NavDropdown.Item>
                <i className="fas fa-tachometer-alt"></i> Dashboard
            </NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/vendor/products">
            <NavDropdown.Item>
                <i className="fas fa-box"></i> My Products
            </NavDropdown.Item>
        </LinkContainer>
        <div className="dropdown-divider"></div>
        <NavDropdown.Item onClick={onLogout} className="text-danger">
            <i className="fas fa-sign-out-alt"></i> Logout
        </NavDropdown.Item>
    </NavDropdown>
);

export default VendorMenu;
