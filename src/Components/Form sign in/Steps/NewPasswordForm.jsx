import React, { useEffect, useState } from "react";
import axios from "../../../Api/axiosInstance";
import { useAuth } from "../../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function NewPasswordForm({ setStep }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  useEffect(() => {
    console.log("Reset tokens in localStorage:", {
      reset_temp_token: localStorage.getItem("reset_temp_token"),
      reset_verified_token: localStorage.getItem("reset_verified_token")
    });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setLoading(true);
    
    try {
    const resetToken = localStorage.getItem("reset_verified_token");
    
    if (!resetToken) {
      alert("Reset token is missing");
      setLoading(false);
      return;
    }

    const res = await axios.post("/reset-password", {
      temp_token: resetToken,
      password: newPassword,
      password_confirmation: confirmPassword,
      purpose: "password_reset"
    });
    
    console.log("Reset response:", res.data);
    
    if (res.data.token) {
      // تنظيف التوكنات المؤقتة
      localStorage.removeItem("reset_temp_token");
      localStorage.removeItem("reset_verified_token");
      
      // حفظ التوكن الجديد
      const newToken = res.data.token;
      localStorage.setItem("token", newToken);
      
      // جلب بيانات المستخدم
      try {
        const userRes = await axios.get("/user", {
          headers: {
            Authorization: `Bearer ${newToken}`
          }
        });
        
        if (userRes.data) {
          // تسجيل الدخول ببيانات المستخدم
          login(newToken, userRes.data, true);
          navigate("/", { replace: true });
        } else {
          throw new Error("No user data returned");
        }
      } catch (userError) {
        console.error("Failed to fetch user data", userError);
        alert("Password reset successful! Please log in manually");
        navigate("/login");
      }
    } else {
      alert("Password reset failed: missing token in response");
    }
  } catch (error) {
    // ... معالجة الأخطاء ...
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Create New Password</h2>
      <div className="row">
        <div className="col-lg-6 col-sm-12 up-input">
          <label htmlFor="password">New Password :</label>
          <div className="input-with-icon password-field">
            <i className="bi bi-lock"></i>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

        <div className="col-12 up-input">
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}