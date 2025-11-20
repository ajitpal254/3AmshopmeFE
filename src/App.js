import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./pages/HomeScreen";
import ProductDetails from "./pages/ProductDetails";
import CartScreen from "./pages/CartScreen";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VendorLogin from "./pages/VendorLogin";
import VendorSignUp from "./pages/VendorSignUp";
import Admin from "./pages/Admin";
import AdminDeleteScreen from "./pages/AdminDeleteScreen";
import AdminDeleteConfirm from "./pages/AdminDeleteConfirm";
import DeleteConfirm from "./pages/DeleteConfirm";
import SearchResultScreen from "./pages/SearchResultScreen";
import EmailVerification from "./pages/EmailVerification";
import OrdersScreen from "./pages/OrdersScreen";
import ProductListScreen from "./pages/ProductListScreen";
import OrderListScreen from "./pages/OrderListScreen";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <main className="py-3">
            <Container>
              <Switch>
                <Route path="/" component={HomeScreen} exact />
                <Route path="/products/:id" component={ProductDetails} />
                <Route path="/cart/:id?" component={CartScreen} />
                <Route path="/app/login" component={Login} />
                <Route path="/app/signup" component={SignUp} />
                <Route path="/vendor/login" component={VendorLogin} />
                <Route path="/vendor/signup" component={VendorSignUp} />
                <Route path="/admin" component={Admin} exact />
                <Route path="/admin/upload" component={Admin} exact />
                <Route path="/admin/delete" component={AdminDeleteScreen} exact />
                <Route
                  path="/admin/delete/:id"
                  component={AdminDeleteConfirm}
                  exact
                />
                <Route path="/delete-confirm" component={DeleteConfirm} />
                <Route path="/search" component={SearchResultScreen} />
                <Route path="/orders" component={OrdersScreen} />
                <Route path="/admin/productlist" component={ProductListScreen} />
                <Route path="/admin/orderlist" component={OrderListScreen} />
                <Route path="/app/verify/:token" component={EmailVerification} />
                <Route path="/vendor/verify/:token" component={EmailVerification} />
              </Switch>
            </Container>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
