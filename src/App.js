import './App.css';
import Footer from './components/Footer';
import React, {useState} from 'react'
import Header from './components/Header';
import { Container } from 'react-bootstrap';

import HomeScreen from './components/HomeScreen';
import ProductDetails from "./components/ProductDetails";
import {BrowserRouter as Router, Route} from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";


import CartScreen from "./components/CartScreen";
import Admin from "./components/Admin";
import DeleteConfirm from "./components/DeleteConfirm";

import AdminDeleteScreen from "./components/AdminDeleteScreen";
import AdminDeleteConfirm from "./components/AdminDeleteConfirm";





function App() {
  const env = process.env.NODE_ENV;
  console.log("Running in", env, "mode");
    const [loggedIn, setLoggedIn] = useState(false)

  return (
      <Router>

        <Header setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>
        <main className="my-3">
          <Container>
              <Route path="/app/login">
                  <Login setLoggedIn={setLoggedIn} />
              </Route>
              <Route path="/app/SignUp" component={SignUp} exact />
                <Route path="/cart" component={CartScreen} exact  />
            <Route path="/" component={HomeScreen} exact />
            <Route path="/products/:id" component={ProductDetails}  />
            <Route path="/admin/upload" component={Admin} />
            <Route path="/cart/:id" component={DeleteConfirm} />
            <Route path="/admin/delete" component={AdminDeleteScreen} />
            <Route path="/admin/delete/:id" component={AdminDeleteConfirm} exact/>

          </Container>
        </main>

        <Footer/>

      </Router>
  );
}

export default App;
