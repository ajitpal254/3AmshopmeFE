import React, { useState } from "react";
import { NavLink, useHistory, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseconfig";
import api from "../utils/api";
import { Container, Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";
import "../components/css/CustomerAuth.css";

const SignUp = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const history = useHistory();
    const { signupUser } = useAuth();

    const { name, email, phone, address, city, country, postalCode, password } = user;

    const onChange = (e) => {
        setError("");
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const submitForm = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signupUser({
                name,
                email,
                phone,
                address,
                city,
                country,
                postalCode,
                password
            });
            setLoading(false);
            history.push('/');
        } catch (err) {
            setLoading(false);
            setError(err.toString());
        }
    };

    const handleGoogleSignup = async () => {
        setError("");
        try {
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;
            const idToken = await firebaseUser.getIdToken();

            const { data } = await api.post('/app/google-login', {
                token: idToken,
                attemptingAdminLogin: false, // Regular signup
            });

            const responseData = data;

            localStorage.setItem("token", responseData.token);
            localStorage.setItem("userInfo", JSON.stringify(responseData.user));
            window.location.href = '/';

        } catch (error) {
            console.error("Google Sign Up Error:", error);
            setError(error.response?.data?.message || "Google Sign-Up failed.");
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
                                <Col md={5} className="customer-auth-hero d-none d-md-flex flex-column justify-content-center p-5 text-white">
                                    <div className="hero-content text-center">
                                        <div className="mb-4 icon-circle">
                                            <i className="fas fa-shopping-bag fa-3x"></i>
                                        </div>
                                        <h2 className="fw-bold mb-3">Join 3AmShoppee</h2>
                                        <p className="lead mb-4">Discover amazing products and shop with confidence.</p>
                                        <div className="mt-4">
                                            <p className="small text-white-50">"Shopping is cheaper than therapy."</p>
                                        </div>
                                    </div>
                                </Col>

                                {/* Right Side - Form */}
                                <Col md={7} className="bg-white p-4 p-md-5">
                                    <div className="text-center mb-4">
                                        <h3 className="fw-bold text-primary">Create Account</h3>
                                        <p className="text-muted">Start your shopping journey</p>
                                    </div>

                                    {error && (
                                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                                            <i className="fas fa-exclamation-circle me-2"></i>
                                            <div>{error}</div>
                                        </div>
                                    )}

                                    <Form onSubmit={submitForm}>
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
                                                            value={name}
                                                            onChange={onChange}
                                                            className="border-start-0 bg-light"
                                                            required
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
                                                            value={email}
                                                            onChange={onChange}
                                                            className="border-start-0 bg-light"
                                                            required
                                                        />
                                                    </InputGroup>
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
                                                            value={phone}
                                                            onChange={onChange}
                                                            className="border-start-0 bg-light"
                                                        />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Postal Code</Form.Label>
                                                    <InputGroup>
                                                        <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-map-marker-alt text-muted"></i></InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            name="postalCode"
                                                            placeholder="12345"
                                                            value={postalCode}
                                                            onChange={onChange}
                                                            className="border-start-0 bg-light"
                                                        />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Address</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-home text-muted"></i></InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    name="address"
                                                    placeholder="123 Main St"
                                                    value={address}
                                                    onChange={onChange}
                                                    className="border-start-0 bg-light"
                                                />
                                            </InputGroup>
                                        </Form.Group>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>City</Form.Label>
                                                    <InputGroup>
                                                        <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-city text-muted"></i></InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            name="city"
                                                            placeholder="New York"
                                                            value={city}
                                                            onChange={onChange}
                                                            className="border-start-0 bg-light"
                                                        />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Country</Form.Label>
                                                    <InputGroup>
                                                        <InputGroup.Text className="bg-light border-end-0"><i className="fas fa-globe text-muted"></i></InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            name="country"
                                                            placeholder="USA"
                                                            value={country}
                                                            onChange={onChange}
                                                            className="border-start-0 bg-light"
                                                        />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-4">
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
                                                    Creating Account...
                                                </>
                                            ) : (
                                                'Sign Up'
                                            )}
                                        </Button>
                                    </Form>

                                    <div className="divider-text text-muted small mb-3">OR</div>

                                    <Button
                                        onClick={handleGoogleSignup}
                                        className="google-btn w-100 py-2 mb-4 d-flex align-items-center justify-content-center"
                                    >
                                        <i className="fab fa-google me-2"></i>
                                        Sign up with Google
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-muted mb-2">
                                            Already have an account? <NavLink to="/app/login" className="text-primary fw-bold text-decoration-none">Login</NavLink>
                                        </p>
                                        <div className="border-top pt-3 mt-3">
                                            <p className="text-muted small mb-0">
                                                Want to sell on 3AmShoppee?
                                            </p>
                                            <Link to="/vendor/signup" className="btn btn-outline-secondary btn-sm mt-2 rounded-pill px-4">
                                                Become a Vendor
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

export default SignUp;
