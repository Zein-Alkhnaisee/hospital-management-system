import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Api/axiosInstance";
import { useAuth } from "../AuthContext/AuthContext";
import "./ProfileStyles.css";

const UserProfileHandler = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    axios
      .get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.info_ready) {
          navigate("/profile");
        } else {
          navigate("/create-profile");
        }
      })
      .catch((err) => {
        console.error("Check error:", err);
        navigate("/create-profile");
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  return (
    <div className="profile-container">
      <div className="profile-loading">
        <div className="profile-spinner"></div>
        <p>Checking profile status...</p>
      </div>
    </div>
  );
};

export default UserProfileHandler;
