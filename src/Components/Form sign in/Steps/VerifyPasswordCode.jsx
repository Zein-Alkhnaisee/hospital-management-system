import React, { useState } from "react";
import axios from "../../../Api/axiosInstance";
import { useAuth } from "../../AuthContext/AuthContext";
import { STEPS } from "../PrimaryForm/PrimaryForm";
import { toast } from "react-toastify";

export default function VerifyPasswordCode({ otp_code, setCode, setStep }) {
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const resetToken = localStorage.getItem("reset_temp_token");
      if (!resetToken) {
        toast.error("Reset token is missing");
        setLoading(false);
        return;
      }
  
      const res = await axios.post("/verify-otp", {
        otp_code,
        temp_token: resetToken,
        purpose: "password_reset"
      });
      
      console.log("Verify OTP response:", res.data);
      
      // التعديل هنا: حفظ التوكن الجديد من الاستجابة
      if (res.data.message === 'Verified successfully' && res.data.temp_token) {
        // استخدم التوكن الجديد الذي أعاده الخادم
        localStorage.setItem("reset_verified_token", res.data.temp_token);
        
        // تنظيف التوكن القديم
        localStorage.removeItem("reset_temp_token");
        
        toast.success("Verification successful!");
        setTimeout(() => {
          setStep(STEPS.NEW_PASSWORD);
        }, 1000);
      } else {
        toast.error(res.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verify OTP error:", error.response?.data);
      toast.error(error.response?.data?.message || "Verification error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleResend = async () => {
    const resetToken = localStorage.getItem("reset_temp_token");
    
    if (!resetToken) {
      alert("No reset token found");
      return;
    }
    
    try {
      setLoading(true);
      const res = await axios.post("/resend-verification", {
        temp_token: resetToken,
        purpose: "password_reset" // تحديد الغرض
      });
      toast.success(res.data.message || "Code resent successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resending code");
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
      <h2>Verify Password Reset</h2>
      <div className="row">
        <div className="col-12 up-input">
        <div className="input-with-icon">
          <i className="bi bi-shield-check"></i>
          <input
            type="text"
            id="num"
            placeholder="Enter the verification code"
            value={otp_code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Verifying..." : "Verify Code"}
          </button>

          <p className="mt-3 text-center">
            Didn't receive the code?
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="forget-password "
            >
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}