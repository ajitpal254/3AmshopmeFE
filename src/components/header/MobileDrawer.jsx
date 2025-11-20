import React from "react";
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
                    <LinkContainer to="/cart" onClick={onClose}>
                        <div className="drawer-nav-item">
                            <div className="drawer-nav-icon">
                                <i className="fas fa-shopping-cart"></i>
                            </div>
                            <span>Cart</span>
                            {cartItems.length > 0 && (
                                <span className="ms-auto badge bg-danger rounded-pill">
                                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </div>
                    </LinkContainer>

                    {user && (
                        <LinkContainer to="/orders" onClick={onClose}>
                            <div className="drawer-nav-item">
                                <div className="drawer-nav-icon">
                                    <i className="fas fa-box-open"></i>
                                </div>
                                <span>My Orders</span>
                            </div>
                        </LinkContainer>
                    )}

                    {user && user.isAdmin && (
                        <>
                            <div className="text-muted small fw-bold text-uppercase mt-3 mb-2 ps-2">
                                Admin
                            </div>
                            <LinkContainer to="/admin/productlist" onClick={onClose}>
                                <div className="drawer-nav-item">
                                    <div className="drawer-nav-icon">
                                        <i className="fas fa-boxes"></i>
                                    </div>
                                    <span>Products</span>
                                </div>
                            </LinkContainer>
                            <LinkContainer to="/admin/orderlist" onClick={onClose}>
                                <div className="drawer-nav-item">
                                    <div className="drawer-nav-icon">
                                        <i className="fas fa-clipboard-list"></i>
                                    </div>
                                    <span>Orders</span>
                                </div>
                            </LinkContainer>
                            <LinkContainer to="/vendor/dashboard" onClick={onClose}>
                                <div className="drawer-nav-item">
                                    <div className="drawer-nav-icon">
                                        <i className="fas fa-tags"></i>
                                    </div>
                                    <span>Coupons</span>
                                </div>
                            </LinkContainer>
                        </>
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
                                        style={{ width: "40px", height: "40px" }}
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
