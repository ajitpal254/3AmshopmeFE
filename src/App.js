import './App.css';
import Footer from './components/Footer';
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomeScreen from './components/HomeScreen';
import ProductDetails from "./components/ProductDetails";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import CartScreen from "./components/CartScreen";
import Admin from "./components/Admin";
import DeleteConfirm from "./components/DeleteConfirm";
import AdminDeleteScreen from "./components/AdminDeleteScreen";
import AdminDeleteConfirm from "./components/AdminDeleteConfirm";
import SearchResultsScreen from './components/SearchResultScreen';
import axios from 'axios';
import VendorLogin from './components/VendorLogin';
import VendorSignUp from './components/VendorSignUp';
import EmailVerification from './components/util/EmailVerification';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const env = process.env.NODE_ENV;
  console.log("Running in", env, "mode");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem("loggedIn");
    const storedToken = localStorage.getItem("token");

    if (storedLoggedInStatus === "true" && storedToken) {
      setLoggedIn(true);
      console.log("Restored logged-in state from localStorage.");
    } else {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("token");
      setLoggedIn(false);
      console.log("No valid session found. Ensured logged out state.");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("token");
    setLoggedIn(false);
    console.log("User logged out. localStorage cleared.");
  };

  return (
    <Router>
      <Header loggedIn={loggedIn} handleLogout={handleLogout} />
      <main className="my-3">
        <Container>
          <Switch>
            <Route path="/app/login">
              <Login setLoggedIn={setLoggedIn} />
            </Route>
            <Route path="/app/SignUp" component={SignUp} exact />
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/products/:id" component={ProductDetails} />
            <Route path="/admin/upload" component={Admin} />
            <Route path="/search" component={SearchResultsScreen} />
            <Route path="/cart/delete/:id" element={<DeleteConfirm />} exact />
            <Route path="/admin/delete/:id" element={<AdminDeleteConfirm />} />
            <Route path="/admin/delete" component={AdminDeleteScreen} exact />
            <Route path="/vendor/login" component={VendorLogin} />
            <Route path="/vendor/verify/:token" component={EmailVerification} />
            <Route path="/vendor/signup" component={VendorSignUp} exact />
            <Route path="/" component={HomeScreen} exact />
          </Switch>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
