import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseconfig"; // Adjust path as needed
import { NavLink } from "react-router-dom";
import axios from "axios";

const Login = (props) => {
    const [user, setUser] = useState({
        email: "",
        password: "",
        isAdmin: false,
        tracking: {
            adminLoggedIn: false,
            lastAdminLogin: null,
        },
    });

    const { email, password, isAdmin } = user;

    const onChange = (e) =>
        setUser({
            ...user,
            [e.target.name]:
                e.target.name === "isAdmin" ? e.target.checked : e.target.value,
        });

    const submitForm = (event) => {
        event.preventDefault();
        const env = process.env.NODE_ENV;
        const url =
            env === "production"
                ? process.env.REACT_APP_API_URL_PROD
                : process.env.REACT_APP_API_URL;

        axios
            .post(`${url}/app/login`, { email, password })
            .then((response) => {
                if (response.data?.status === 200) {
                    localStorage.setItem("loggedIn", "true");
                    props.setLoggedIn(true);
                }
            })
            .catch((err) => console.error(err));
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            const env = process.env.NODE_ENV;
            const url =
                env === "production"
                    ? process.env.REACT_APP_API_URL_PROD
                    : process.env.REACT_APP_API_URL;

            axios
                .post(`${url}/app/google-login`, { token: idToken })
                .then((res) => {
                    if (res.data?.status === 200) {
                        localStorage.setItem("loggedIn", "true");
                        props.setLoggedIn(true);
                    }
                })
                .catch((err) => console.error(err));
        } catch (error) {
            console.error("Google Sign In Error:", error);
        }
    };

    if (props.loggedIn) {
        return <NavLink to="/" />;
    }

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
            <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
                <h3 className="text-center mb-4">Login</h3>
                <form onSubmit={submitForm}>
                    <div className="form-group mb-3">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
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
                            placeholder="Enter password"
                            onChange={onChange}
                            value={password}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-check mb-3">
                        <input
                            type="checkbox"
                            name="isAdmin"
                            onChange={onChange}
                            checked={isAdmin}
                            className="form-check-input"
                            id="isAdminCheck"
                        />
                        <label className="form-check-label" htmlFor="isAdminCheck">
                            Admin Login
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3">
                        Sign In
                    </button>
                </form>
                <div className="text-center">
                    <p>Or sign in with:</p>
                    <button onClick={handleGoogleLogin} className="btn btn-outline-danger w-100">
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
