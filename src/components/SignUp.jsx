import React, { Component } from "react";
import { Link } from "react-router-dom";
import { auth, provider } from "../firebaseconfig";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";

class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "", // To store validation errors
        };
        this.changeName = this.changeName.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleGoogleSignUp = this.handleGoogleSignUp.bind(this);
    }

    changeName(e) {
        this.setState({ name: e.target.value });
    }

    changeEmail(e) {
        this.setState({ email: e.target.value });
    }

    changePassword(e) {
        this.setState({ password: e.target.value });
    }

    // Email Validation Function
    validateEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }

    // Password Validation Function (Optional)
    validatePassword(password) {
        // At least 8 characters long
        return password.length >= 8;
    }

    // Submit Form
    onSubmit(e) {
        e.preventDefault();

        const { name, email, password } = this.state;

        // Validate email and password before proceeding
        if (!this.validateEmail(email)) {
            this.setState({ error: "Please enter a valid email address." });
            return;
        }

        if (!this.validatePassword(password)) {
            this.setState({ error: "Password must be at least 8 characters long." });
            return;
        }

        const env = process.env.NODE_ENV;
        const baseURL = env === "production" ? process.env.REACT_APP_API_URL_PROD : process.env.REACT_APP_API_URL;

        // Send data to the backend
        axios
            .post(`${baseURL}/app/signup`, { name, email, password })
            .then((res) => {
                console.log("Signup Success:", res.data);
                window.location = "/";
            })
            .catch((err) => {
                console.error("Signup Error:", err);
                this.setState({ error: "Error signing up. Please try again later." });
            });
    }

    async handleGoogleSignUp() {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userData = {
                name: user.displayName,
                email: user.email,
                password: user.uid, // You can use Firebase UID or handle Google-specific logic
            };

            const env = process.env.NODE_ENV;
            const baseURL = env === "production" ? process.env.REACT_APP_API_URL_PROD : process.env.REACT_APP_API_URL;

            axios
                .post(`${baseURL}/app/signup`, userData)
                .then((res) => {
                    console.log("Google Signup Success:", res.data);
                    window.location = "/";
                })
                .catch((err) => {
                    console.error("Google Signup Error:", err);
                    this.setState({ error: "Error signing up with Google." });
                });
        } catch (error) {
            console.error("Google Sign-In Failed:", error);
            this.setState({ error: "Google Sign-In failed. Please try again." });
        }
    }

    render() {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
                    <h3 className="text-center mb-4">Create Account</h3>
                    {this.state.error && (
                        <div className="alert alert-danger" role="alert">
                            {this.state.error}
                        </div>
                    )}
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group mb-3">
                            <input
                                type="text"
                                placeholder="Full Name"
                                onChange={this.changeName}
                                value={this.state.name}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="email"
                                placeholder="Email"
                                onChange={this.changeEmail}
                                value={this.state.email}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group mb-4">
                            <input
                                type="password"
                                placeholder="Password"
                                onChange={this.changePassword}
                                value={this.state.password}
                                className="form-control"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mb-3">
                            Sign Up
                        </button>
                    </form>

                    <div className="text-center">
                        <p>Or sign up with:</p>
                        <button className="btn btn-danger w-100 mb-2" onClick={this.handleGoogleSignUp}>
                            <i className="fab fa-google me-2"></i> Sign Up with Google
                        </button>
                        <Link to="/app/login" className="text-decoration-none">
                            Already have an account? <strong>Log In</strong>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUp;
