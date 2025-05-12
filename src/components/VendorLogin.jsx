import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import "../components/css/VendorLogin.css"; // Ensure this file exists

const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const env = process.env.NODE_ENV;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${
          env === "production"
            ? process.env.REACT_APP_API_URL_PROD
            : process.env.REACT_APP_API_URL
        }/vendor/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      if (data.token) {
        const decodedToken = jwt_decode(data.token);
        if (decodedToken.role === "vendor") {
          sessionStorage.setItem("jwtTokenVendor", data.token);
          // Redirect logic here if needed
          console.log("Vendor logged in successfully.");
        } else {
          throw new Error("Not authorized as vendor");
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="vendor-login-container">
      <form className="vendor-login-form" onSubmit={handleSubmit}>
        <h2>Vendor Login</h2>
        {error && <div className="vendor-error">{error}</div>}
        <div className="vendor-form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="vendor-form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="vendor-login-button">
          Login
        </button>
        <p className="vendor-switch-link">
          Not a vendor? <Link to="/app/login">Try user login</Link>
        </p>
      </form>
    </div>
  );
};

export default VendorLogin;
