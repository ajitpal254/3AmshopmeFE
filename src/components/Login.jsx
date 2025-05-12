import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseconfig"; // Adjust path as needed
import { NavLink, useHistory } from "react-router-dom";
import axios from "axios";

const Login = (props) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    isAdmin: false, // State of the "Admin Login" checkbox
    tracking: {
      adminLoggedIn: false,
      lastAdminLogin: null,
    },
  });
  const [loginError, setLoginError] = useState("");
  const history = useHistory();

  const { email, password, isAdmin } = user;

  const onChange = (e) => {
    setLoginError(""); // Clear error when user interacts with form
    setUser({
      ...user,
      [e.target.name]:
        e.target.name === "isAdmin" ? e.target.checked : e.target.value,
    });
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setLoginError("");

    const env = process.env.NODE_ENV;
    const apiUrl =
      env === "production"
        ? process.env.REACT_APP_API_URL_PROD
        : process.env.REACT_APP_API_URL;

    try {
      const response = await axios.post(`${apiUrl}/app/login`, {
        email,
        password,
        attemptingAdminLogin: isAdmin,
      });

      const responseData = response.data;

      // If "Admin Login" was checked, but backend says user isn't an actual admin
      if (isAdmin && (!responseData.user || responseData.user.isAdmin === false)) {
        setLoginError(
          "You don't have admin privileges. Please uncheck 'Admin Login' to sign in as a regular user or contact support."
        );
      } else {
        // Proceed with successful login
        localStorage.setItem("token", responseData.token);
        if (responseData.user && responseData.user.name) {
          localStorage.setItem("username", responseData.user.name);
        }
        if (responseData.user && typeof responseData.user.isAdmin === 'boolean') {
          localStorage.setItem("isActualAdmin", responseData.user.isAdmin.toString());
        }
        localStorage.setItem("loggedIn", "true");

        if (props.onLoginSuccess) {
          props.onLoginSuccess(responseData.token, responseData.user);
        } else {
          props.setLoggedIn(true);
        }
        // history.push('/'); // Optional: Redirect after successful login
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setLoginError(err.response.data.message);
      } else if (err.response && err.response.status === 403 && isAdmin) {
        setLoginError("You don't have admin privileges.");
      } else if (err.response && err.response.status === 401) {
        setLoginError("Invalid email or password.");
      } else {
        setLoginError("Login failed. An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", err);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      const env = process.env.NODE_ENV;
      const apiUrl =
        env === "production"
          ? process.env.REACT_APP_API_URL_PROD
          : process.env.REACT_APP_API_URL;

      const backendResponse = await axios.post(`${apiUrl}/app/google-login`, {
        token: idToken,
        attemptingAdminLogin: isAdmin, // Backend for Google login must also handle this
      });
      
      const responseData = backendResponse.data;

      // If "Admin Login" was checked for Google Sign-In, but backend says user isn't an actual admin
      if (isAdmin && (!responseData.user || responseData.user.isAdmin === false)) {
        setLoginError(
          "You don't have admin privileges with this Google account. Please uncheck 'Admin Login' or contact support."
        );
        // await auth.signOut(); // Optional: Sign out Firebase user if backend admin check fails
      } else {
        localStorage.setItem("token", responseData.token);
        if (responseData.user && responseData.user.name) {
          localStorage.setItem("username", responseData.user.name);
        }
        if (responseData.user && typeof responseData.user.isAdmin === 'boolean') {
            localStorage.setItem("isActualAdmin", responseData.user.isAdmin.toString());
        }
        localStorage.setItem("loggedIn", "true");

        if (props.onLoginSuccess) {
          props.onLoginSuccess(responseData.token, responseData.user);
        } else {
          props.setLoggedIn(true);
        }
        // history.push('/'); // Optional: Redirect after successful login
      }

    } catch (error) {
      console.error("Google Sign In Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setLoginError(error.response.data.message);
      } else if (error.code === 'auth/popup-closed-by-user') {
        setLoginError("Google Sign-In cancelled.");
      } else if (error.response && error.response.status === 403 && isAdmin) {
        setLoginError("You don't have admin privileges with this Google account.");
      }
      else {
        setLoginError("Google Sign-In failed. Please try again.");
      }
    }
  };

  if (props.loggedIn) {
    return <NavLink to="/" />; 
  }

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
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
            Sign In
          </button>
        </form>
        <div className="text-center">
          <p className="mb-2">Or sign in with:</p>
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-google me-2" viewBox="0 0 16 16" style={{ verticalAlign: 'middle' }}>
              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
            </svg>
            Sign in with Google
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