import axios from "./../../../Api//axiosInstance";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";
import "./../../Form sign in/FormSignStylee.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUpForm({ formData, updateField, setStep }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/register", formData);
      if (res.status === 200) {
        const tempToken = res.data.temp_token;
        localStorage.setItem("temp_token", tempToken);
        localStorage.setItem("email", res.data.email);
        setStep("verify-code");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`login-form ${
        isAuthenticated ? "width-navbar" : "widthout-navbar"
      }`}
    >
      <h2>Create Account</h2>
      <div className="row">
        <div className="col-lg-6 col-sm-12 up-input">
          <label htmlFor="name">Name :</label>
          <div className="input-with-icon">
            <i className="bi bi-person"></i>
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="col-lg-6 col-sm-12 up-input">
          <label htmlFor="email">Email :</label>
          <div className="input-with-icon">
            <i className="bi bi-envelope"></i>
            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="col-lg-6 col-sm-12 up-input">
          <label htmlFor="password">Password :</label>
          <div className="input-with-icon password-field">
            <i className="bi bi-lock"></i>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Your Password"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              required
            />
            <button
              type="button"
              className="input-group-text"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="col-lg-6 col-sm-12 up-input">
          <label htmlFor="password_confirmation">Confirm Password :</label>
          <div className="input-with-icon password-field">
            <i className="bi bi-lock-fill"></i>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="password_confirmation"
              name="password_confirmation"
              placeholder="Confirm Password"
              value={formData.password_confirmation}
              onChange={(e) => updateField("password_confirmation", e.target.value)}
              required
            />
            <button
              type="button"
              className="input-group-text"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="remember-me">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember" className="label-remember">
            Remember Me
          </label>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Registration is underway" : "Create Account"}
        </button>
        
        <button 
          type="button" 
          className="create-account"
          onClick={() => setStep("login")}
        >
          Already have an account? Log In
        </button>

        <button
          type="button"
          className="forget-password"
          onClick={() => setStep("forget-password")}
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
}