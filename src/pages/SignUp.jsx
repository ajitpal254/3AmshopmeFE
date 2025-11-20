import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
                <div className="text-center mt-3">
                    <p>Already have an account? <NavLink to="/app/login">Login</NavLink></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
