import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const UserMenu = ({ user, onLogout }) => (
    <NavDropdown
        title={
            <div className="d-flex align-items-center gap-2">
                <img
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=40&background=007bff&color=fff&bold=true`}
                    alt={user.name}
                    className="rounded-circle"
                    style={{
                        width: '38px',
                        height: '38px',
                        objectFit: 'cover',
                        border: '2px solid #667eea'
                    }}
                />
                <span className="user-name-text" style={{
                    fontWeight: '600',
                    color: '#4a5568',
                    fontSize: '0.95rem'
                }}>
                    {user.name?.split(' ')[0]}
                </span>
            </div>
        }
        id="username"
        align="end"
        className="user-dropdown-nav"
    >
        <div className="px-3 py-2 border-bottom mb-2">
            <p className="mb-0 fw-bold text-dark">{user.name}</p>
            <small className="text-muted">{user.email}</small>
        </div>

        <LinkContainer to="/profile">
            <NavDropdown.Item>
                <i className="fas fa-user-circle"></i> Profile
            </NavDropdown.Item>
        </LinkContainer>

        <LinkContainer to="/my-reviews">
            <NavDropdown.Item>
                <i className="fas fa-star"></i> My Reviews
            </NavDropdown.Item>
        </LinkContainer>

        <LinkContainer to="/orders">
            <NavDropdown.Item>
                <i className="fas fa-shopping-bag"></i> My Orders
            </NavDropdown.Item>
        </LinkContainer>

        <LinkContainer to="/wishlist">
            <NavDropdown.Item>
                <i className="fas fa-heart"></i> Wishlist
            </NavDropdown.Item>
        </LinkContainer>

        {user.isAdmin && <AdminMenuItems />}

        <div className="dropdown-divider"></div>
        <NavDropdown.Item onClick={onLogout} className="text-danger">
            <i className="fas fa-sign-out-alt"></i> Logout
        </NavDropdown.Item>
    </NavDropdown>
);

const AdminMenuItems = () => (
    <>
        <div className="dropdown-divider"></div>
        <div className="px-3 py-1 text-muted small fw-bold text-uppercase">Admin</div>
        <LinkContainer to="/admin/productlist">
            <NavDropdown.Item>
                <i className="fas fa-boxes"></i> Products
            </NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/admin/orderlist">
            <NavDropdown.Item>
                <i className="fas fa-clipboard-list"></i> Orders
            </NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/vendor/dashboard">
            <NavDropdown.Item>
                <i className="fas fa-tags"></i> Coupons
            </NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/admin/vendors">
            <NavDropdown.Item>
                <i className="fas fa-users-cog"></i> Vendor Management
            </NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/admin/reviews">
            <NavDropdown.Item>
                <i className="fas fa-comments"></i> Review Moderation
            </NavDropdown.Item>
        </LinkContainer>
    </>
);

export default UserMenu;
