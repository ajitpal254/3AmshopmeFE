import React, { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseconfig";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });
  const [loginError, setLoginError] = useState("");
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

    try {
      await loginUser(email, password, isAdmin);
      history.push(redirect);
    } catch (err) {
      setLoginError(err.toString());
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
        setLoginError("You don't have admin privileges with this Google account.");
        return;
      }

      localStorage.setItem("token", responseData.token);
      localStorage.setItem("userInfo", JSON.stringify(responseData.user));
      window.location.href = redirect;

    } catch (error) {
      console.error("Google Sign In Error:", error);
      setLoginError(error.response?.data?.message || "Google Sign-In failed.");
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
        <h3 className="text-center mb-4">LOGIN</h3>
        <form onSubmit={submitForm}>
          <div className="form-group mb-3">
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={onChange}
              value={email}
              className="form-control"
              autoComplete="email"
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
              autoComplete="current-password"
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

          {loginError && (
            <div className="alert alert-danger mt-2 mb-3" role="alert">
              {loginError}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 mb-3">
            SIGN IN
          </button>
        </form>
        <div className="text-center">
          <p className="mb-2">Or sign in with:</p>
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-google me-2" viewBox="0 0 16 16" style={{ verticalAlign: 'middle' }}>
              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
            </svg>
            SIGN IN WITH GOOGLE
          </button>
        </div>
        <div className="text-center mt-3">
          <p>Don't have an account? <NavLink to="/app/signup">Sign Up</NavLink></p>
        </div>
      </div>
    </div>
  );
};

export default Login;