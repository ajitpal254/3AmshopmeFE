import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  NavDropdown,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { withRouter } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import "./Header.css";

const Header = ({ history }) => {
  const [keyword, setKeyword] = useState("");
  const { user, logoutUser, vendor, logoutVendor } = useAuth();
  const cart = useSelector((state) => state.cart);
  const cartItems = cart?.cartItems || [];

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search?keyword=${keyword}`);
    } else {
      history.push("/");
    }
  };

  const handleLogout = () => {
    logoutUser();
    history.push("/app/login");
  };

  const handleVendorLogout = () => {
    logoutVendor();
    history.push("/vendor/login");
  };

  return (
    <header>
      <Navbar expand="lg" collapseOnSelect className="custom-navbar" sticky="top">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="brand-text">
              <i className="fas fa-shopping-bag brand-icon"></i>
              <span className="brand-name">3AMSHOPPEE</span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Form onSubmit={submitHandler} className="search-form d-flex mx-auto">
              <FormControl
                type="text"
                placeholder="Search for products..."
                className="search-input"
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Button type="submit" className="search-btn">
                <i className="fas fa-search"></i>
              </Button>
            </Form>

            <Nav className="align-items-lg-center ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link className="nav-link-modern position-relative">
                  <i className="fas fa-shopping-cart nav-icon"></i>
                  <span className="ms-2">Cart</span>
                  {cartItems.length > 0 && (
                    <span className="cart-badge">
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>

              {user && (
                <LinkContainer to="/orders">
                  <Nav.Link className="nav-link-modern">
                    <i className="fas fa-box-open nav-icon"></i>
                    <span className="ms-2">Orders</span>
                  </Nav.Link>
                </LinkContainer>
              )}

              {user ? (
                <NavDropdown
                  title={
                    <div className="user-profile-wrapper">
                      <img
                        src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=random`}
                        alt={user.name}
                        className="user-profile-img"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=random`;
                        }}
                      />
                      <span className="user-name-text ms-2">{user.name?.split(' ')[0]}</span>
                    </div>
                  }
                  id="username"
                  className="nav-link-modern p-0"
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

                  {user.isAdmin && (
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
                    </>
                  )}

                  <div className="dropdown-divider"></div>
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : vendor ? (
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
                  className="nav-link-modern p-0"
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
                  <NavDropdown.Item onClick={handleVendorLogout} className="text-danger">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <div className="d-flex align-items-center ms-2">
                  <LinkContainer to="/app/login">
                    <Nav.Link className="nav-link-modern">
                      <i className="fas fa-user me-2"></i> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/app/signup">
                    <Button variant="primary" className="ms-2 rounded-pill px-4 fw-bold" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', border: 'none' }}>
                      Sign Up
                    </Button>
                  </LinkContainer>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default withRouter(Header);
