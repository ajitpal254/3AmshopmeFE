import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Form, Button, Card, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
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
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { signupVendor } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setShowNiche(category !== "");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Full Name is required.";
    if (!formData.email.trim() || !formData.email.includes("@")) return "Valid email is required.";
    if (!formData.password) return "Password is required.";
    if (formData.password.length < 6) return "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
    if (!selectedCategory.trim()) return "Business category is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

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
      // Success handling
      setLoading(false);
      history.push("/vendor/login", {
        message: "Registration successful! Please check your email for verification. Your account is pending admin approval."
      });
    } catch (err) {
      setLoading(false);
      setError(err.toString());
    }
  };

  return (
    <div className="vendor-signup-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100 py-5">
          <Col lg={10} xl={9}>
            <Card className="vendor-signup-card border-0 shadow-lg overflow-hidden">
              <Row className="g-0">
                {/* Left Side - Hero Image/Info */}
                <Col md={5} className="vendor-signup-hero d-none d-md-flex flex-column justify-content-center p-5 text-white">
                  <div className="hero-content text-center">
                    <div className="mb-4 icon-circle">
                      <i className="fas fa-store fa-3x"></i>
                    </div>
                    <h2 className="fw-bold mb-3">Join Our Marketplace</h2>
                    <p className="lead mb-4">Grow your business with 3AmShoppee. Reach millions of customers today.</p>
                    <ul className="list-unstyled text-start mx-auto" style={{ maxWidth: '250px' }}>
                      <li className="mb-2"><i className="fas fa-check-circle me-2"></i> Easy Product Management</li>
                      <li className="mb-2"><i className="fas fa-check-circle me-2"></i> Secure Payments</li>
                      <li className="mb-2"><i className="fas fa-check-circle me-2"></i> 24/7 Support</li>
                    </ul>
                  </div>
                </Col>

                {/* Right Side - Form */}
                <Col md={7} className="bg-white p-4 p-md-5">
                  <div className="text-center mb-4">
                    <h3 className="fw-bold text-primary">Vendor Registration</h3>
                    <p className="text-muted">Create your seller account</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      <div>{error}</div>
                    </div>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <InputGroup>
                            <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-user text-muted"></i></InputGroup.Text>
                            <Form.Control
                              type="text"
                              name="name"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={handleChange}
                              className="border-start-0 bg-light"
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <InputGroup>
                            <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-envelope text-muted"></i></InputGroup.Text>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="name@example.com"
                              value={formData.email}
                              onChange={handleChange}
                              className="border-start-0 bg-light"
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <InputGroup>
                            <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-lock text-muted"></i></InputGroup.Text>
                            <Form.Control
                              type={showPassword ? "text" : "password"}
                              name="password"
                              placeholder="••••••"
                              value={formData.password}
                              onChange={handleChange}
                              className="border-start-0 border-end-0 bg-light"
                            />
                            <InputGroup.Text
                              className="bg-light border-start-0 cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                              style={{ cursor: 'pointer' }}
                            >
                              <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-muted`}></i>
                            </InputGroup.Text>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password</Form.Label>
                          <InputGroup>
                            <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-lock text-muted"></i></InputGroup.Text>
                            <Form.Control
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              placeholder="••••••"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="border-start-0 border-end-0 bg-light"
                            />
                            <InputGroup.Text
                              className="bg-light border-start-0 cursor-pointer"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              style={{ cursor: 'pointer' }}
                            >
                              <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-muted`}></i>
                            </InputGroup.Text>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Business Category</Form.Label>
                          <InputGroup>
                            <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-briefcase text-muted"></i></InputGroup.Text>
                            <Form.Control
                              as="select"
                              name="businessCategory"
                              value={selectedCategory}
                              onChange={handleCategoryChange}
                              className="border-start-0 bg-light"
                            >
                              <option value="">Select Category</option>
                              <option value="Jewelry">Jewelry</option>
                              <option value="Clothing">Clothing</option>
                              <option value="Electronics">Electronics</option>
                              <option value="Home & Living">Home & Living</option>
                              <option value="Beauty">Beauty</option>
                              <option value="Restaurant">Restaurant</option>
                              <option value="Other">Other</option>
                            </Form.Control>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Niche
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Specific area within your category (e.g., 'Handmade Silver' for Jewelry)</Tooltip>}
                            >
                              <i className="fas fa-info-circle ms-2 text-muted" style={{ cursor: 'help' }}></i>
                            </OverlayTrigger>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            placeholder="e.g. Handmade"
                            disabled={!showNiche}
                            className="bg-light"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <InputGroup>
                            <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-phone text-muted"></i></InputGroup.Text>
                            <Form.Control
                              type="text"
                              name="phone"
                              placeholder="+1 (555) 000-0000"
                              value={formData.phone}
                              onChange={handleChange}
                              className="border-start-0 bg-light"
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Website (Optional)</Form.Label>
                          <InputGroup>
                            <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-globe text-muted"></i></InputGroup.Text>
                            <Form.Control
                              type="text"
                              name="website"
                              placeholder="https://yourstore.com"
                              value={formData.website}
                              onChange={handleChange}
                              className="border-start-0 bg-light"
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 py-2 mt-3 fw-bold shadow-sm"
                      disabled={loading}
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        'Register Business'
                      )}
                    </Button>

                    <div className="text-center mt-4">
                      <p className="text-muted mb-0">
                        Already have a vendor account? <Link to="/vendor/login" className="text-primary fw-bold text-decoration-none">Login here</Link>
                      </p>
                      <p className="text-muted mt-2 small">
                        Looking to shop? <Link to="/app/signup" className="text-secondary text-decoration-none">Create a customer account</Link>
                      </p>
                    </div>
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default VendorSignUp;
