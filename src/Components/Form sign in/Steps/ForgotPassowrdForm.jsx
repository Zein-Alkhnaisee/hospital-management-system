import React, { useState, useEffect } from "react";
import axios from "./../../../Api/axiosInstance";
import { useAuth } from "../../AuthContext/AuthContext";

export default function ForgotPasswordForm({ email: propEmail, setEmail: propSetEmail, setStep }) {
  const [email, setEmailState] = useState(propEmail || "");
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useAuth();

  const onChangeEmail = (e) => {
    const val = e.target.value;
    setEmailState(val);
    if (typeof propSetEmail === "function") {
      propSetEmail(val);
    }
  };

  useEffect(() => {
    if (propEmail !== undefined) {
      setEmailState(propEmail);
    }
  }, [propEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      localStorage.removeItem("reset_temp_token");
      localStorage.removeItem("reset_verified_token");
      
      const res = await axios.post("/forgot-password", { 
        email,
        purpose: "password_reset"
      });
      
      if (res.data.temp_token) {
        localStorage.setItem("reset_temp_token", res.data.temp_token);
        setStep("verify-otp");
      }
    } catch (error) {
      console.error("Forgot password error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`login-form  ${
        isAuthenticated ? "width-navbar" : "widthout-navbar"
      }`}
    >
      <h2>Reset Your Password</h2>

      <div className="row">
        <div className="col-12 up-input">
          <label htmlFor="email">Your Email :</label>
          <div className="input-with-icon">
            <i className="bi bi-envelope"></i>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              value={email}
              onChange={onChangeEmail}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading
              ? "Sending verification code..."
              : "Send Verification Code"}
          </button>
        </div>
      </div>
    </form>
  );
}