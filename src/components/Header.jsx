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
      <Navbar expand="lg" collapseOnSelect className="custom-navbar glass-effect">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="brand-text">
              <i className="fas fa-shopping-bag me-2"></i>
              <span className="brand-name">3AMSHOPPEE</span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Form onSubmit={submitHandler} className="d-flex ms-auto me-3 search-form">
              <FormControl
                type="text"
                placeholder="Search Products..."
                className="search-input border-0"
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Button type="submit" variant="outline-primary" className="search-btn rounded-pill ms-1">
                <i className="fas fa-search"></i>
              </Button>
            </Form>
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link className="nav-link-custom nav-link-enhanced">
                  <i className="fas fa-shopping-cart me-1"></i>
                  <span className="nav-text">CART</span>
                  {cartItems.length > 0 && (
                    <span className="badge bg-danger ms-1 cart-badge">
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>

              {user && (
                <LinkContainer to="/orders">
                  <Nav.Link className="nav-link-custom nav-link-enhanced">
                    <i className="fas fa-receipt me-1"></i>
                    <span className="nav-text">ORDERS</span>
                  </Nav.Link>
                </LinkContainer>
              )}

              {user ? (
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center">
                      <img
                        src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&size=35&background=007bff&color=fff&bold=true`}
                        alt={user.name}
                        className="rounded-circle me-2"
                        style={{ width: '35px', height: '35px', objectFit: 'cover', border: '2px solid #fff' }}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&size=35&background=007bff&color=fff&bold=true`;
                        }}
                      />
                      <span className="nav-text">{user.name || "User"}</span>
                    </span>
                  }
                  id="username"
                  className="nav-link-custom user-dropdown"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item className="dropdown-item-custom">
                      <i className="fas fa-user-circle me-2"></i>
                      My Profile
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={handleLogout} className="dropdown-item-custom">
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : vendor ? (
                <NavDropdown
                  title={
                    <span>
                      <i className="fas fa-store me-2"></i>
                      {vendor.name || "Vendor"}
                    </span>
                  }
                  id="vendorname"
                  className="nav-link-custom"
                >
                  <LinkContainer to="/vendor/dashboard">
                    <NavDropdown.Item className="dropdown-item-custom">
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Dashboard
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/vendor/products">
                    <NavDropdown.Item className="dropdown-item-custom">
                      <i className="fas fa-box me-2"></i>
                      My Products
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={handleVendorLogout} className="dropdown-item-custom">
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/app/login">
                  <Nav.Link className="nav-link-custom nav-link-enhanced">
                    <i className="fas fa-user me-1"></i>
                    <span className="nav-text">SIGN IN</span>
                  </Nav.Link>
                </LinkContainer>
              )}

              {user && user.isAdmin && (
                <NavDropdown title={<><i className="fas fa-user-shield me-1"></i>ADMIN</>} id="adminmenu" className="nav-link-custom admin-dropdown">
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item className="dropdown-item-custom">
                      <i className="fas fa-box me-2"></i>Products
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item className="dropdown-item-custom">
                      <i className="fas fa-receipt me-2"></i>Orders
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/vendor/dashboard">
                    <NavDropdown.Item className="dropdown-item-custom">
                      <i className="fas fa-ticket-alt me-2"></i>Coupons
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/upload">
                    <NavDropdown.Item className="dropdown-item-custom">
                      <i className="fas fa-upload me-2"></i>Upload Product
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/delete">
                    <NavDropdown.Item className="dropdown-item-custom">
                      <i className="fas fa-trash me-2"></i>Delete Product
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default withRouter(Header);
