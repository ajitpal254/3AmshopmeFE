import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/shared/LoadingSpinner";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { getCart } from "./actions/cartActions";

// Lazy Loaded Pages
const HomeScreen = lazy(() => import("./pages/HomeScreen"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const ShippingScreen = lazy(() => import("./pages/ShippingScreen"));
const PlaceOrderScreen = lazy(() => import("./pages/PlaceOrderScreen"));
const CartScreen = lazy(() => import("./pages/CartScreen"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const VendorLogin = lazy(() => import("./pages/VendorLogin"));
const VendorSignUp = lazy(() => import("./pages/VendorSignUp"));
const VendorDashboard = lazy(() => import("./pages/VendorDashboard"));
const VendorOrders = lazy(() => import("./pages/VendorOrders"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminDeleteScreen = lazy(() => import("./pages/AdminDeleteScreen"));
const AdminDeleteConfirm = lazy(() => import("./pages/AdminDeleteConfirm"));
const DeleteConfirm = lazy(() => import("./pages/DeleteConfirm"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const OrderScreen = lazy(() => import("./pages/OrderScreen"));
const AllProducts = lazy(() => import("./pages/AllProducts"));
const OrdersScreen = lazy(() => import("./pages/OrdersScreen"));
const ProductListScreen = lazy(() => import("./pages/ProductListScreen"));
const OrderListScreen = lazy(() => import("./pages/OrderListScreen"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const ProductEditScreen = lazy(() => import("./pages/ProductEditScreen"));
const AdminVendorManagement = lazy(() => import("./pages/AdminVendorManagement"));
const MyReviewsPage = lazy(() => import("./pages/MyReviewsPage"));
const WishlistScreen = lazy(() => import("./pages/WishlistScreen"));
const ReviewModeration = lazy(() => import("./components/admin/ReviewModeration"));

// New Pages Lazy Load
const NotFound = lazy(() => import('./pages/NotFound'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const ForgotPasswordScreen = lazy(() => import('./pages/ForgotPasswordScreen'));
const ResetPasswordScreen = lazy(() => import('./pages/ResetPasswordScreen'));

function App() {
  const dispatch = useDispatch();
  const cartFetched = useRef(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !cartFetched.current) {

      cartFetched.current = true;
      dispatch(getCart());
    }
  }, [dispatch]); // Empty dependency array - only run once on mount

  // Show splash screen on first load
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider>
            <Router>
              <Header />
              <main>
                <Container>
                  <ToastContainer position="bottom-left" autoClose={3000} />
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
                      <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                        <Route path="/cart" element={<CartScreen />} />
                        <Route path="/cart/:id" element={<CartScreen />} />
                        <Route path="/shipping" element={<ShippingScreen />} />
                        <Route path="/app/shipping" element={<ShippingScreen />} />
                        <Route path="/placeorder" element={<PlaceOrderScreen />} />
                        <Route path="/app/login" element={<Login />} />
                        <Route path="/app/signup" element={<SignUp />} />
                        <Route path="/app/forgot-password" element={<ForgotPasswordScreen />} />
                        <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
                        <Route path="/vendor/login" element={<VendorLogin />} />
                        <Route path="/vendor/signup" element={<VendorSignUp />} />
                        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                        <Route path="/vendor/orders" element={<VendorOrders />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/admin/upload" element={<Admin />} />
                        <Route path="/vendor/upload" element={<Admin />} />
                        <Route path="/admin/delete" element={<AdminDeleteScreen />} />
                        <Route
                          path="/admin/delete/:id"
                          element={<AdminDeleteConfirm />}
                        />
                        <Route path="/delete-confirm" element={<DeleteConfirm />} />
                        <Route path="/search" element={<AllProducts />} />
                        <Route path="/all-products" element={<AllProducts />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/my-reviews" element={<MyReviewsPage />} />
                        <Route path="/orders/:id" element={<OrderScreen />} />
                        <Route path="/orders" element={<OrdersScreen />} />
                        <Route path="/wishlist" element={<WishlistScreen />} />
                        <Route path="/admin/productlist" element={<ProductListScreen />} />
                        <Route path="/vendor/products" element={<ProductListScreen />} />
                        <Route path="/product/edit/:id" element={<ProductEditScreen />} />
                        <Route path="/admin/orderlist" element={<OrderListScreen />} />
                        <Route path="/admin/vendors" element={<AdminVendorManagement />} />
                        <Route path="/admin/reviews" element={<ReviewModeration />} />
                        <Route path="/app/verify/:token" element={<EmailVerification />} />
                        <Route path="/vendor/verify/:token" element={<EmailVerification />} />
                        <Route path="/verify/:token" element={<EmailVerification />} />
                        
                        {/* New Info Pages */}
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route path="/refund-policy" element={<RefundPolicy />} />
                        
                        {/* 404 Not Found - Must be last */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </Container>
              </main>
              <Footer />
            </Router>
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
