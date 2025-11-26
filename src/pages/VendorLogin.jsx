import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";
import "../components/css/VendorLogin.css";

const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { loginVendor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const data = await loginVendor(email, password);
      setLoading(false);

      // Redirect to vendor dashboard
      navigate('/vendor/dashboard');

    } catch (err) {
      setLoading(false);
      setError(err.toString());
    }
  };

  return (
    <div className="vendor-login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100 py-5">
          <Col lg={10} xl={9}>
            <Card className="vendor-login-card border-0 shadow-lg overflow-hidden">
              <Row className="g-0">
                {/* Left Side - Hero Image/Info */}
                <Col md={6} className="vendor-login-hero d-none d-md-flex flex-column justify-content-center p-5 text-white">
                  <div className="hero-content text-center">
                    <div className="mb-4 icon-circle">
                      <i className="fas fa-chart-line fa-3x"></i>
                    </div>
                    <h2 className="fw-bold mb-3">Welcome Back!</h2>
                    <p className="lead mb-4">Manage your store, track orders, and grow your business.</p>
                    <div className="mt-4">
                      <p className="small text-white-50">"Success is not the key to happiness. Happiness is the key to success."</p>
                    </div>
                  </div>
                </Col>

                {/* Right Side - Form */}
                <Col md={6} className="bg-white p-4 p-md-5">
                  <div className="text-center mb-4">
                    <h3 className="fw-bold text-primary">Vendor Login</h3>
                    <p className="text-muted">Access your seller dashboard</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      <div>{error}</div>
                    </div>
                  )}

                  {successMessage && (
                    <div className="alert alert-success d-flex align-items-center" role="alert">
                      <i className="fas fa-check-circle me-2"></i>
                      <div>{successMessage}</div>
                    </div>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label>Email Address</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-envelope text-muted"></i></InputGroup.Text>
                        <Form.Control
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="border-start-0 bg-light"
                          required
                        />
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-lock text-muted"></i></InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="border-start-0 border-end-0 bg-light"
                          required
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

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 py-2 mb-3 fw-bold shadow-sm"
                      disabled={loading}
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Logging In...
                        </>
                      ) : (
                        'Login to Dashboard'
                      )}
                    </Button>

                    <div className="text-center mt-4">
                      <p className="text-muted mb-0">
                        Don't have a vendor account? <Link to="/vendor/signup" className="text-primary fw-bold text-decoration-none">Register here</Link>
                      </p>
                      <p className="text-muted mt-2 small">
                        Not a vendor? <Link to="/app/login" className="text-secondary text-decoration-none">Customer Login</Link>
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
};

export default VendorLogin;
