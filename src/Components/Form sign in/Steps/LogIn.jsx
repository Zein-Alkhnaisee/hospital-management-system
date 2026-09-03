import React, { useState } from "react";
import { useAuth } from "../../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./../../Form sign in/FormSignStylee.css";

export default function LogIn({ setStep }) {
  const { login: authLogin, axios } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/login", formData);
      const { token, User } = res.data;
      const verified = User.is_verified === 1;
      
      // إضافة الحقول الجديدة المطلوبة
      const userData = {
        id: User.id,
        name: User.name,
        email: User.email,
        role: User.role,
        phone: User.phone,
        email_verified: verified,
        is_patient_registered: User.is_patient_registered || false,
        wallet_balance: User.wallet_balance || 0
      };
      
      authLogin(token, userData, verified);

      if (verified) {
        // التوجيه حسب دور المستخدم
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (userData.role === 'doctor') {
          navigate('/doctor/appointments');
        } else if (userData.role === 'patient') {
          navigate('/patient/dashboard');
        } else {
          navigate('/');
        }
      } else {
        localStorage.setItem("temp_token", res.data.temp_token);
        localStorage.setItem("email", formData.email);
        setStep("verify-code");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2>Log In</h2>
      
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="row">
        <div className="col-12 up-input">
          <label htmlFor="email">Email :</label>
          <div className="input-with-icon">
            <i className="bi bi-envelope"></i>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12 up-input">
          <label htmlFor="password">Password :</label>
          <div className="input-with-icon password-field">
            <i className="bi bi-lock"></i>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Your Password"
              value={formData.password}
              onChange={handleChange}
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

        <div className="col-12">
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
        </div>

        <div className="col-12 ">
          <button 
            type="submit" 
            disabled={loading}
            className="auth-button"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing in...
              </>
            ) : "Login"}
          </button>
        </div>

        <div className="col-12 ">
          <button 
            type="button" 
            className="create-account"
            onClick={() => setStep("signUp")}
          >
            Create New Account
          </button>
        </div>

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