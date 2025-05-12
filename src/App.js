import './App.css';
import Footer from './components/Footer';
import React, {useState, useEffect} from 'react'; // Make sure useEffect is imported
import Header from './components/Header';
import { Container } from 'react-bootstrap';
import {BrowserRouter as Router, Route, Switch } from "react-router-dom"; // Added Switch for better route handling

import HomeScreen from './components/HomeScreen';
import ProductDetails from "./components/ProductDetails";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import CartScreen from "./components/CartScreen";
import Admin from "./components/Admin";
import DeleteConfirm from "./components/DeleteConfirm";
import AdminDeleteScreen from "./components/AdminDeleteScreen";
import AdminDeleteConfirm from "./components/AdminDeleteConfirm";

import axios from 'axios';
import SearchResultsScreen from './components/SearchResultScreen';

// It's often good practice to define your Axios instance outside the component
// if it doesn't rely on props or state, or use useMemo within the component.
// Also, ensure baseURL is correct. If your API is on a different domain/port,
// use the full URL (e.g., process.env.REACT_APP_API_URL).
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/', // Use environment variable or fallback
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
  // Optional: you might want to store the token in state if other components need it reactively
  // const [token, setToken] = useState(localStorage.getItem('token'));


  // useEffect to check localStorage on initial app load
  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem("loggedIn");
    const storedToken = localStorage.getItem("token");

    // Check if both "loggedIn" is true and a token exists
    if (storedLoggedInStatus === "true" && storedToken) {
      setLoggedIn(true);
      // If you also manage token in state:
      // setToken(storedToken);
      console.log("Restored logged-in state from localStorage.");
    } else {
      // If no valid session, ensure we are logged out and localStorage is clean.
      // This handles cases where 'loggedIn' might be true but token is missing, or vice-versa.
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("token");
      setLoggedIn(false); // Explicitly set to false, though it's the default
      // setToken(null); // If managing token in state
      console.log("No valid session found in localStorage or session data inconsistent. Ensured logged out state.");
    }
  }, []); // Empty dependency array [] means this effect runs only once when the component mounts

  // Centralized logout function
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("token");
    setLoggedIn(false);
    // setToken(null); // If managing token in state
    console.log("User logged out. localStorage cleared.");
    // Optionally, redirect to login page or home page
    // You might need to use useHistory hook from react-router-dom for programmatic navigation
    // Example: history.push('/app/login');
  };

  // The Login component will call setLoggedIn(true) and set items in localStorage upon successful login.
  // It's good that your Login component already receives `setLoggedIn`.
  // Ensure your Login component, on successful authentication, does:
  // 1. localStorage.setItem("loggedIn", "true");
  // 2. localStorage.setItem("token", receivedToken);
  // 3. props.setLoggedIn(true); (where props.setLoggedIn is the setLoggedIn function from App.js)

  return (
    <Router>
      {/* Pass loggedIn status and handleLogout function to Header */}
      <Header loggedIn={loggedIn} handleLogout={handleLogout}/>
      <main className="my-3">
        <Container>
          {/* Using <Switch> ensures only the first matching Route renders */}
          <Switch>
            <Route path="/app/login">
              <Login setLoggedIn={setLoggedIn} />
            </Route>
            <Route path="/app/SignUp" component={SignUp} exact />
            <Route path="/cart/:id?" component={CartScreen} /> {/* Made :id optional for viewing cart */}
            <Route path="/products/:id" component={ProductDetails} />
            <Route path="/admin/upload" component={Admin} />
            <Route path="/search" component={SearchResultsScreen} /> {/* Add this route */}

            {/* Note: The route "/cart/:id" for DeleteConfirm might conflict with "/cart/:id?" for CartScreen if not ordered carefully or distinguished.
                Assuming DeleteConfirm is for specific item deletion actions within the cart context rather than a standalone page for /cart/:id.
                If it's a modal or part of another component, routing might be handled differently.
                For now, keeping it as is from your original.
            */}
            <Route path="/cart/delete/:id" component={DeleteConfirm} /> {/* Clarified path for delete confirm if it's distinct */}
            <Route path="/admin/delete/:id" component={AdminDeleteConfirm} exact/>
            <Route path="/admin/delete" component={AdminDeleteScreen} exact />
            <Route path="/" component={HomeScreen} exact />
            {/* Add other routes as needed. Consider a 404 Not Found route at the end of Switch */}
          </Switch>
        </Container>
      </main>
      <Footer/>
    </Router>
  );
}

export default App;