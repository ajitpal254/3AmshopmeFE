import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EmailVerification = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const env = process.env.NODE_ENV;
  const baseURL =
    env === "production"
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL;

  const verifyEmail = async () => {
    setStatus("loading");
    setMessage("Verifying your email. Please wait...");

    try {
      const response = await axios.get(`${baseURL}/vendor/verify/${token}`);

      if (response?.data?.msg) {
        setStatus("success");
        setMessage("🎉 Your email has been successfully verified! You may now log in.");
      } else {
        setStatus("error");
        setMessage("❌ Verification failed. Invalid or expired token.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        `❌ ${error?.response?.data?.msg || "Something went wrong. Please try again."}`
      );
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("❌ Invalid or missing verification token.");
    }
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

      {status === "error" && (
        <button
          onClick={verifyEmail}
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
