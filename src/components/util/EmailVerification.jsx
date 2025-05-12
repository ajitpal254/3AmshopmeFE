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
    try {
      const response = await axios.get(`${baseURL}/vendor/verify/${token}`);

      if (response?.msg) {
        setStatus("success");
      } else {
        setStatus("error");
      }

      setMessage(response?.msg);
    } catch (error) {
      setStatus("error");
      setMessage(
        error?.response?.data.msg ||
          "An error occurred during verification. Please try again later."
      );
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
    }
  }, [token]);

  const getColor = () => {
    switch (status) {
      case "success":
        return "green";
      case "error":
        return "red";
      default:
        return "#333";
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Email Verification</h2>
      <p style={{ color: getColor(), fontSize: "18px", fontWeight: "bold" }}>
        {status === "loading" ? "Verifying your email..." : message}
      </p>
      {status === "error" && (
        <button
          onClick={verifyEmail}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Retry Verification
        </button>
      )}
    </div>
  );
};

export default EmailVerification;
