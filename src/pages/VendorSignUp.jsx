import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components/css/VendorSignUp.css";

function VendorSignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessCategory: "",
    phone: "",
    website: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showNiche, setShowNiche] = useState(false);
  const [showNicheTooltip, setShowNicheTooltip] = useState(false);

  const [niche, setNiche] = useState("");
  const history = useHistory();
  const { signupVendor } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setShowNiche(category !== "");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Name is required.";
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      return "A valid email is required.";
    }
    if (!formData.password) {
      return "Password is required.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }
    if (!selectedCategory.trim()) {
      return "Business category is required.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const submissionData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      businessCategory: selectedCategory,
      niche: niche,
      phone: formData.phone,
      website: formData.website
    };

    try {
      await signupVendor(submissionData);
      alert(
        "Sign up successful! A verification email has been sent. Please verify your email before logging in."
      );
      history.push("/vendor/login");
    } catch (err) {
      setError(err.toString());
    }
  };

  return (
    <div className="vendor-signup-container">
      <form onSubmit={handleSubmit} className="vendor-signup-form">
        <h2>Vendor Sign Up</h2>
        {error && <div className="vendor-error">{error}</div>}

        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span className="eye-icon" onClick={toggleShowPassword}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="password-field">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <span className="eye-icon" onClick={toggleShowConfirmPassword}>
            {showConfirmPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <label htmlFor="businessCategory">Business Category</label>
        <select
          id="businessCategory"
          name="businessCategory"
          value={selectedCategory}
          onChange={handleCategoryChange}
          required
        >
          <option value="">-- Select a category --</option>
          <option value="Jewelry">Jewelry</option>
          <option value="Restaurant">Restaurant</option>
          <option value="IT">IT</option>
          <option value="Shoes">Shoes</option>
          {/* Add more categories as needed */}
        </select>

        {showNiche && (
          <>
            <label htmlFor="niche">
              Niche
              <span
                className="info-icon"
                onMouseEnter={() => setShowNicheTooltip(true)}
                onMouseLeave={() => setShowNicheTooltip(false)}
              >
                ℹ️
              </span>
            </label>
            <input
              type="text"
              id="niche"
              name="niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder={`Describe your niche in ${selectedCategory}`}
            />
            {showNicheTooltip && (
              <div className="tooltip">
                Enter additional details about your business niche (e.g., type
                of jewelry, restaurant cuisine, etc.).
              </div>
            )}
          </>
        )}

        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
        />

        <button type="submit" className="vendor-signup-button">
          Sign Up
        </button>

        <p className="vendor-switch-link">
          Not a vendor? <Link to="/app/signup">Try user signup</Link>
        </p>
      </form>
    </div>
  );
}

export default VendorSignUp;
