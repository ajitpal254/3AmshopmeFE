import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";

const EmailVerification = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email. Please wait...");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("❌ Invalid or missing verification token.");
        return;
      }

      try {
        const response = await api.get(`/vendor/verify/${token}`);
        if (response.data.msg) {
          setStatus("success");
          setMessage("🎉 Your email has been successfully verified! You may now log in.");
        } else {
          // Fallback if msg is not present but request succeeded (unlikely based on previous code, but good for safety)
          setStatus("success");
          setMessage("🎉 Your email has been successfully verified! You may now log in.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          `❌ ${error.response?.data?.msg || "Verification failed. Invalid or expired token."}`
        );
      }
    };
    verifyEmail();
  }, [token]);

  const getColor = () => {
    switch (status) {
      case "success":
        return "green";
      case "error":
        return "crimson";
      case "loading":
        return "#555";
      default:
        return "#333";
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px", padding: "20px" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Email Verification</h2>
      <p style={{ color: getColor(), fontSize: "20px", fontWeight: "500" }}>
        {message}
      </p>

      {status === "success" && (
        <Link to="/vendor/login" className="btn btn-primary mt-3">
          Go to Vendor Login
        </Link>
      )}

      {status === "error" && (
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "25px",
            padding: "12px 24px",
            borderRadius: "6px",
            backgroundColor: "#007BFF",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          🔁 Retry Verification
        </button>
      )}
    </div>
  );
};

export default EmailVerification;
