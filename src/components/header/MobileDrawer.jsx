import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import SearchBar from "./SearchBar";

const MobileDrawer = ({
    show,
    onClose,
    user,
    vendor,
    cartItems,
    logoutUser,
    logoutVendor
}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showAdminMenu, setShowAdminMenu] = useState(false);
    const [showVendorMenu, setShowVendorMenu] = useState(false);

    return (
        <>
            {/* Mobile Drawer Backdrop */}
            <div
                className={`mobile-drawer-backdrop ${show ? "show" : ""}`}
                onClick={onClose}
            ></div>

            {/* Mobile Drawer */}
            <div className={`mobile-drawer ${show ? "show" : ""}`}>
                <div className="drawer-header">
                    <div className="brand-text">
                        <i className="fas fa-shopping-bag brand-icon"></i>
                        <span className="brand-name">Menu</span>
                    </div>
                    <button className="drawer-close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="drawer-search">
                    <SearchBar onSearch={onClose} />
                </div>

                <div className="drawer-nav">

                    {/* User Menu Dropdown */}
                    {user && (
                        <div className="drawer-nav-group">
                            <div
                                className="drawer-nav-item"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <div className="d-flex align-items-center">
                                    <div className="drawer-nav-icon">
                                        <i className="fas fa-user-circle"></i>
                                    </div>
                                    <span>User Menu</span>
                                </div>
                                <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'} text-muted`}></i>
                            </div>

                            {showUserMenu && (
                                <div className="drawer-nav-subitems">
                                    <LinkContainer to="/profile" onClick={onClose}>
                                        <div className="drawer-nav-subitem">
                                            <i className="fas fa-id-card"></i>
                                            <span>Profile</span>
                                        </div>
                                    </LinkContainer>
                                    <LinkContainer to="/orders" onClick={onClose}>
                                        <div className="drawer-nav-subitem">
                                            <i className="fas fa-box-open"></i>
                                            <span>My Orders</span>
                                        </div>
                                    </LinkContainer>
                                    <LinkContainer to="/my-reviews" onClick={onClose}>
                                        <div className="drawer-nav-subitem">
                                            <i className="fas fa-star"></i>
                                            <span>My Reviews</span>
                                        </div>
                                    </LinkContainer>
                                    <LinkContainer to="/wishlist" onClick={onClose}>
                                        <div className="drawer-nav-subitem">
                                            <i className="fas fa-heart"></i>
                                            <span>Wishlist</span>
                                        </div>
                                    </LinkContainer>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Admin Menu Dropdown */}
                    {user && user.isAdmin && (
                        <div className="drawer-nav-group">
                            <div
                                className="drawer-nav-item"
                                onClick={() => setShowAdminMenu(!showAdminMenu)}
                            >
                                <div className="d-flex align-items-center">
                                    <div className="drawer-nav-icon">
                                        <i className="fas fa-shield-alt"></i>
                                    </div>
                                    <span>Admin Panel</span>
                                </div>
                                <i className={`fas fa-chevron-${showAdminMenu ? 'up' : 'down'} text-muted`}></i>
                            </div>

                            {showAdminMenu && (
                                <div className="drawer-nav-subitems">
                                    <LinkContainer to="/admin/productlist" onClick={onClose}>
                                        <div className="drawer-nav-subitem">
                                            <i className="fas fa-boxes"></i>
                                            <span>Products</span>
                                        </div>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/orderlist" onClick={onClose}>
                                        <div className="drawer-nav-subitem">
                                            <i className="fas fa-clipboard-list"></i>
                                            <span>Orders</span>
                                        </div>
                                    </LinkContainer>
                                    <LinkContainer to="/vendor/dashboard" onClick={onClose}>
                                        <div className="drawer-nav-subitem">
                                            <i className="fas fa-tags"></i>
                                            <span>Coupons</span>
                                        </div>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/vendors" onClick={onClose}>
                                        <div className="drawer-nav-subitem">
                                            <i className="fas fa-users-cog"></i>
                                            <span>Vendors</span>
                                        </div>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/reviews" onClick={onClose}>
                                        <div className="drawer-nav-subitem">
                                            <i className="fas fa-comments"></i>
                                            <span>Reviews</span>
                                        </div>
                                    </LinkContainer>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Vendor Menu Dropdown */}
                    {vendor && (
                        <div className="drawer-nav-group">
                            <div
                                className="drawer-nav-item"
                                onClick={() => setShowVendorMenu(!showVendorMenu)}
                            >
                                <div className="d-flex align-items-center">
                                    <div className="drawer-nav-icon">
                                        <i className="fas fa-store"></i>
                                    </div>
                                    <span>Vendor Menu</span>
                                </div>
                                <i className={`fas fa-chevron-${showVendorMenu ? 'up' : 'down'} text-muted`}></i>
                            </div>

                            {showVendorMenu && (
                                <div className="drawer-nav-subitems">
                                    <LinkContainer to="/vendor/dashboard" onClick={onClose}>
                                        <div className="drawer-nav-subitem">
                                            <i className="fas fa-tachometer-alt"></i>
                                            <span>Dashboard</span>
                                        </div>
                                    </LinkContainer>
                                    <LinkContainer to="/vendor/products" onClick={onClose}>
                                        <div className="drawer-nav-subitem">
                                            <i className="fas fa-box"></i>
                                            <span>My Products</span>
                                        </div>
                                    </LinkContainer>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                <div className="drawer-user-section">
                    {user ? (
                        <>
                            <LinkContainer to="/profile" onClick={onClose}>
                                <div className="drawer-user-card">
                                    <img
                                        src={
                                            user.profilePicture ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                user.name || "U"
                                            )}&background=random`
                                        }
                                        alt={user.name}
                                        className="user-profile-img"
                                        style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                                    />
                                    <div className="ms-3">
                                        <div className="fw-bold text-dark">{user.name}</div>
                                        <div className="small text-muted" style={{ fontSize: "0.75rem" }}>
                                            {user.email}
                                        </div>
                                    </div>
                                    <i className="fas fa-chevron-right ms-auto text-muted"></i>
                                </div>
                            </LinkContainer>
                            <button
                                className="drawer-logout-btn"
                                onClick={() => {
                                    logoutUser();
                                    onClose();
                                }}
                            >
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </>
                    ) : vendor ? (
                        <>
                            <LinkContainer to="/vendor/dashboard" onClick={onClose}>
                                <div className="drawer-user-card">
                                    <div
                                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: "40px", height: "40px" }}
                                    >
                                        <i className="fas fa-store"></i>
                                    </div>
                                    <div className="ms-3">
                                        <div className="fw-bold text-dark">{vendor.name}</div>
                                        <div className="small text-muted">Vendor Account</div>
                                    </div>
                                </div>
                            </LinkContainer>
                            <button
                                className="drawer-logout-btn"
                                onClick={() => {
                                    logoutVendor();
                                    onClose();
                                }}
                            >
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </>
                    ) : (
                        <div className="d-grid gap-2">
                            <LinkContainer to="/app/login" onClick={onClose}>
                                <Button variant="outline-primary" className="rounded-pill py-2 fw-bold">
                                    Sign In
                                </Button>
                            </LinkContainer>
                            <LinkContainer to="/app/signup" onClick={onClose}>
                                <Button
                                    variant="primary"
                                    className="rounded-pill py-2 fw-bold"
                                    style={{
                                        background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
                                        border: "none",
                                    }}
                                >
                                    Create Account
                                </Button>
                            </LinkContainer>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MobileDrawer;
