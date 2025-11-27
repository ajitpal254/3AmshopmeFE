import React, { useState } from "react";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import SearchBar from "./header/SearchBar";
import MobileDrawer from "./header/MobileDrawer";
import UserMenu from "./header/UserMenu";
import VendorMenu from "./header/VendorMenu";
import AuthButtons from "./header/AuthButtons";
import CurrencySwitcher from "./CurrencySwitcher";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logoutUser, vendor, logoutVendor } = useAuth();
  const cart = useSelector((state) => state.cart);
  const cartItems = cart?.cartItems || [];

  const handleLogout = () => {
    logoutUser();
    navigate("/app/login");
  };

  const handleVendorLogout = () => {
    logoutVendor();
    navigate("/vendor/login");
  };

  return (
    <header>
      <Navbar expand="lg" className="custom-navbar" sticky="top">
        <Container fluid className="px-4 d-flex align-items-center">
          {/* Brand - Far Left */}
          <LinkContainer to="/">
            <Navbar.Brand className="brand-text me-0">
              <i className="fas fa-shopping-bag brand-icon"></i>
              <span className="brand-name">3AMSHOPPEE</span>
            </Navbar.Brand>
          </LinkContainer>

          {/* Search Bar - Center (Desktop) */}
          <div className="d-none d-lg-flex flex-grow-1 justify-content-center mx-3" style={{ maxWidth: '700px' }}>
            <SearchBar />
          </div>

          {/* Mobile Cart & Menu Toggle */}
          <div className="d-lg-none d-flex align-items-center gap-3">
            <LinkContainer to="/cart">
              <Nav.Link className="position-relative">
                <i className="fas fa-shopping-cart"></i>
                {cartItems.length > 0 && (
                  <Badge pill bg="danger" className="cart-badge">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>
            <button
              className="mobile-menu-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle menu"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>

          {/* Desktop Navigation - Far Right */}
          <Navbar.Collapse id="basic-navbar-nav" className="flex-grow-0">
            <Nav className="d-flex align-items-center gap-3">
              {/* Cart Link */}
              <LinkContainer to="/cart">
                <Nav.Link className="nav-link-modern position-relative">
                  <i className="fas fa-shopping-cart me-1"></i>
                  Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg="danger" className="ms-2">
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="nav-link-modern border-0 bg-transparent"
                aria-label="Toggle theme"
                style={{ cursor: 'pointer' }}
              >
                <i className={`fas fa-${theme === "light" ? "moon" : "sun"}`}></i>
              </button>

              {/* Currency Switcher */}
              <CurrencySwitcher />

              {/* User/Vendor Menu or Auth Buttons */}
              {user ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : vendor ? (
                <VendorMenu vendor={vendor} onLogout={handleVendorLogout} />
              ) : (
                <AuthButtons />
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Drawer */}
      <MobileDrawer
        show={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        user={user}
        vendor={vendor}
        cartItems={cartItems}
        logoutUser={handleLogout}
        logoutVendor={handleVendorLogout}
      />
    </header>
  );
};

export default Header;
