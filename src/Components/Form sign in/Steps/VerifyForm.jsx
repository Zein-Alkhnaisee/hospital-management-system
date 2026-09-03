import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";
import axios from "./../../../Api/axiosInstance";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function VerifyForm({ code, setCode, setStep }) {
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, verify } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const handleResendCode = async () => {
    const tempToken = localStorage.getItem("temp_token");
    if (!tempToken) return alert("Missing token");
  
    try {
      await axios.post("/resend-verification", null, {
        headers: { "temp-token": tempToken },
      });
      toast.success("Code re-sent successfully");
    } catch (error) {
      toast.error("Failed to resend code");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tempToken = localStorage.getItem("temp_token");
      if (!tempToken) {
        alert("❌ Temp token is missing");
        setStep("signup");
        return;
      }
  
      const res = await axios.post(
        "/verify-code",
        { code, temp_token: tempToken },
        { headers: { "temp-token": tempToken } }
      );
  
      if (res.status === 200) {
        const token = res.data.token || res.data.user?.token;
        const userData = res.data.user; // استخراج بيانات المستخدم
        
        if (token && userData) {
          localStorage.setItem("token", token);
          localStorage.setItem("email_verified", "true");
          localStorage.removeItem("temp_token");
          
          // التصحيح: تمرير بيانات المستخدم
          login(token, userData, true);
          
          // الانتقال إلى الصفحة الرئيسية
          navigate("/");
        } else {
          alert("❌ No token or user data returned from server");
        }
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      // تحسين رسالة الخطأ
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      "Verification error";
      alert(`❌ ${errorMsg}`);
      console.error("Verification error details:", error.response?.data);
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
      <h2>Verify Your Account</h2>
      <div className="row">
        <div className="col-12 up-input">
          <label htmlFor="num">Verification Code :</label>
          <div className="input-with-icon">
            <i className="bi bi-shield-check"></i>
            <input
              id="num"
              placeholder="Enter the verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Verifying..." : "Verify Account"}
          </button>
          <button 
            type="button" 
            className="create-account mt-3" 
            onClick={handleResendCode} 
            disabled={loading}
          >
            Resend Code
          </button>
        </div>
      </div>
    </form>
  );
}