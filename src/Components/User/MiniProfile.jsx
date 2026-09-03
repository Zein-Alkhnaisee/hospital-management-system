import React, { useEffect, useState } from "react";
import axios from "../../Api/axiosInstance";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { commonFields, roleSpecificFields } from "./../roleFields/roleFields";
import "./ProfileStyles.css";

const MiniProfile = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(res.data.profile);
        setName(res.data.name);
        setEmail(res.data.email);
        setError("");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile information.");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading)
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>Loading profile data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="profile-container">
        <div className="profile-alert profile-alert-danger text-center">
          {error}
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="profile-container">
        <div className="profile-alert profile-alert-warning text-center">
          No profile data found.
        </div>
      </div>
    );

  const userRole = profile.role;

  return (
    <div className="profile-container fade-in">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <p>View and manage your personal information</p>
      </div>

      <div className="profile-card gradient-border">
        <div className="profile-image-container">
          <img
            src={profile.profile_image_url || "/default-avatar.png"}
            alt="Profile"
            className="profile-image"
          />
        </div>

        <div className="text-center mb-4">
          <h3 className="mb-1">{name || "Username"}</h3>
          <p className="text-muted">{email}</p>
          {userRole && <span className="badge bg-primary">{userRole}</span>}
        </div>

        <ul className="profile-data-list">
          {commonFields.map((field) => (
            <li key={field.key} className="profile-data-item slide-in-left">
              <span className="profile-data-label">{field.label}</span>
              <span className="profile-data-value">
                {profile[field.key] || "Not specified"}
              </span>
            </li>
          ))}

          {userRole &&
            roleSpecificFields[userRole] &&
            roleSpecificFields[userRole].map((field) => (
              <li key={field.key} className="profile-data-item slide-in-right">
                <span className="profile-data-label">{field.label}</span>
                <span className="profile-data-value">
                  {profile[field.key] || "Not specified"}
                </span>
              </li>
            ))}
        </ul>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            className="profile-btn profile-btn-outline"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
          <button
            className="profile-btn profile-btn-danger"
            onClick={() => navigate("/delete-profile")}
          >
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniProfile;
