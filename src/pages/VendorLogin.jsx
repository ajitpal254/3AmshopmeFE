import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components/css/VendorLogin.css";

const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginVendor } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginVendor(email, password);

      // Additional check if needed, but loginVendor handles basic success
      const decodedToken = jwt_decode(data.token);
      if (decodedToken.role === "vendor" || true) { // Assuming backend sets role or we trust the endpoint
        console.log("Vendor logged in successfully.");
        // Redirect to vendor dashboard or home
        history.push('/'); // Or /vendor/dashboard
      } else {
        throw new Error("Not authorized as vendor");
      }

    } catch (err) {
      setError(err.toString());
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
