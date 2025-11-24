import React, { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseconfig";
import { NavLink, useHistory, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { Container, Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";
import "../components/css/CustomerAuth.css";
import notificationService from "../utils/notificationService";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const { loginUser, user: loggedInUser } = useAuth();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const { email, password, isAdmin } = user;

  // Redirect if already logged in
  useEffect(() => {
    if (loggedInUser) {
      history.push(redirect);
    }
  }, [loggedInUser, history, redirect]);

  const onChange = (e) => {
    setLoginError("");
    setUser({
      ...user,
      [e.target.name]:
        e.target.name === "isAdmin" ? e.target.checked : e.target.value,
    });
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      await loginUser(email, password, isAdmin);
      setLoading(false);
      notificationService.success("Login successful!");
      history.push(redirect);
    } catch (err) {
      setLoading(false);
      const errorMessage = err.toString();
      setLoginError(errorMessage);
      notificationService.error(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      const { data } = await api.post('/app/google-login', {
        token: idToken,
        attemptingAdminLogin: isAdmin,
      });

      const responseData = data;

      if (isAdmin && (!responseData.user || responseData.user.isAdmin === false)) {
        const msg = "You don't have admin privileges with this Google account.";
        setLoginError(msg);
        notificationService.error(msg);
        return;
      }

      localStorage.setItem("token", responseData.token);
      localStorage.setItem("userInfo", JSON.stringify(responseData.user));
      notificationService.success("Google Login successful!");
      window.location.href = redirect;

    } catch (error) {
      console.error("Google Sign In Error:", error);
      const msg = error.response?.data?.message || "Google Sign-In failed.";
      setLoginError(msg);
      notificationService.error(msg);
    }
  };

  return (
    <div className="customer-auth-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100 py-5">
          <Col lg={10} xl={9}>
            <Card className="customer-auth-card border-0 shadow-lg overflow-hidden">
              <Row className="g-0">
                {/* Left Side - Hero */}
                <Col md={6} className="customer-auth-hero d-none d-md-flex flex-column justify-content-center p-5 text-white">
                  <div className="hero-content text-center">
                    <div className="mb-4 icon-circle">
                      <i className="fas fa-user-circle fa-3x"></i>
                    </div>
                    <h2 className="fw-bold mb-3">Welcome Back!</h2>
                    <p className="lead mb-4">Login to access your account and continue shopping.</p>
                    <div className="mt-4">
                      <p className="small text-white-50">"Style is a way to say who you are without having to speak."</p>
                    </div>
                  </div>
                </Col>

                {/* Right Side - Form */}
                <Col md={6} className="bg-white p-4 p-md-5">
                  <div className="text-center mb-4">
                    <h3 className="fw-bold text-primary">Login</h3>
                    <p className="text-muted">Access your customer account</p>
                  </div>

                  {loginError && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      <div>{loginError}</div>
                    </div>
                  )}

                  <Form onSubmit={submitForm}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-envelope text-muted"></i></InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={onChange}
                          className="border-start-0 bg-light"
                          required
                        />
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-lock text-muted"></i></InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="••••••"
                          value={password}
                          onChange={onChange}
                          className="border-start-0 border-end-0 bg-light"
                          required
                        />
                        <InputGroup.Text
                          className="bg-light border-start-0 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-muted`}></i>
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="isAdmin"
                        id="isAdminCheck"
                        label="Login as Admin"
                        checked={isAdmin}
                        onChange={onChange}
                        className="text-muted"
                      />
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
                        'Sign In'
                      )}
                    </Button>
                  </Form>

                  <div className="divider-text text-muted small mb-3">OR</div>

                  <Button
                    onClick={handleGoogleLogin}
                    className="google-btn w-100 py-2 mb-4 d-flex align-items-center justify-content-center"
                  >
                    <i className="fab fa-google me-2"></i>
                    Sign in with Google
                  </Button>

                  <div className="text-center">
                    <p className="text-muted mb-2">
                      Don't have an account? <NavLink to="/app/signup" className="text-primary fw-bold text-decoration-none">Sign Up</NavLink>
                    </p>
                    <div className="border-top pt-3 mt-3">
                      <p className="text-muted small mb-0">
                        Are you a vendor?
                      </p>
                      <Link to="/vendor/login" className="btn btn-outline-secondary btn-sm mt-2 rounded-pill px-4">
                        Vendor Login
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;