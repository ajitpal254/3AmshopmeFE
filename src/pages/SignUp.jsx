import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseconfig";
import api from "../utils/api";

const SignUp = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const history = useHistory();
    const { signupUser } = useAuth();

    const { name, email, password } = user;

    const onChange = (e) => {
        setError("");
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const submitForm = async (event) => {
        event.preventDefault();
        setError("");

        try {
            await signupUser({ name, email, password });
            history.push('/');
        } catch (err) {
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
        <div
            className="container d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
        >
            <div
                className="card p-4 shadow"
                style={{ width: "100%", maxWidth: "400px" }}
            >
                <h3 className="text-center mb-4">Sign Up</h3>
                <form onSubmit={submitForm}>
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            onChange={onChange}
                            value={name}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            onChange={onChange}
                            value={email}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            onChange={onChange}
                            value={password}
                            className="form-control"
                            required
                        />
                    </div>

                    {error && (
                        <div className="alert alert-danger mt-2 mb-3" role="alert">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100 mb-3">
                        Sign Up
                    </button>
                </form>
                <div className="text-center">
                    <p className="mb-2">Or sign up with:</p>
                    <button
                        onClick={handleGoogleSignup}
                        className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-google me-2" viewBox="0 0 16 16" style={{ verticalAlign: 'middle' }}>
                            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                        </svg>
                        SIGN UP WITH GOOGLE
                    </button>
                </div>
                <div className="text-center mt-3">
                    <p>Already have an account? <NavLink to="/app/login">Login</NavLink></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

