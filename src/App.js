import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./pages/HomeScreen";
import ProductDetails from "./pages/ProductDetails";
import ShippingScreen from "./pages/ShippingScreen";
import PlaceOrderScreen from "./pages/PlaceOrderScreen";
import CartScreen from "./pages/CartScreen";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VendorLogin from "./pages/VendorLogin";
import VendorSignUp from "./pages/VendorSignUp";
import VendorDashboard from "./pages/VendorDashboard";
import VendorOrders from "./pages/VendorOrders";
import Admin from "./pages/Admin";
import AdminDeleteScreen from "./pages/AdminDeleteScreen";
import AdminDeleteConfirm from "./pages/AdminDeleteConfirm";
import DeleteConfirm from "./pages/DeleteConfirm";
import EmailVerification from "./pages/EmailVerification";
import OrderScreen from "./pages/OrderScreen";
import AllProducts from "./pages/AllProducts";

import OrdersScreen from "./pages/OrdersScreen";
import ProductListScreen from "./pages/ProductListScreen";
import OrderListScreen from "./pages/OrderListScreen";
import UserProfile from "./pages/UserProfile";
import ProductEditScreen from "./pages/ProductEditScreen";
import AdminVendorManagement from "./pages/AdminVendorManagement";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import MyReviewsPage from "./pages/MyReviewsPage";
import ReviewModeration from "./components/admin/ReviewModeration";
import "./App.css";

import { useDispatch } from "react-redux";
import { getCart } from "./actions/cartActions";
import { useEffect, useRef } from "react";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "./context/ThemeContext";
import WishlistScreen from "./pages/WishlistScreen";
import SplashScreen from "./components/SplashScreen";
import { useState } from "react";

function App() {
  const dispatch = useDispatch();
  const cartFetched = useRef(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !cartFetched.current) {
      console.log('Fetching cart on mount...');
      cartFetched.current = true;
      dispatch(getCart());
    }
  }, []); // Empty dependency array - only run once on mount

  // Show splash screen on first load
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <Router>
            <Header />
            <main>
              <Container>
                <ToastContainer position="bottom-left" autoClose={3000} />
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
                </Routes>
              </Container>
            </main>
            <Footer />
          </Router>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
