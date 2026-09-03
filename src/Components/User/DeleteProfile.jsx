import React from "react";
import axios from "../../Api/axiosInstance";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ProfileStyles.css";

const DeleteProfile = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your profile? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile deleted successfully");
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert("An error occurred while deleting. Please try again.");
    }
  };

  return (
    <div className="profile-container fade-in">
      <div className="profile-header">
        <h2>Delete Profile</h2>
        <p>Permanently remove your account and all associated data</p>
      </div>

      <div className="delete-confirmation">
        <div className="delete-warning-icon">⚠️</div>
        <h3 className="text-danger mb-3">
          Warning: This action is irreversible
        </h3>
        <p className="mb-4">
          All your profile data, including personal information and preferences,
          will be permanently deleted from our systems.
        </p>

        <button
          className="profile-btn profile-btn-danger mb-3"
          onClick={handleDelete}
        >
          Confirm Permanent Deletion
        </button>

        <br />

        <button
          className="profile-btn profile-btn-outline"
          onClick={() => navigate("/profile")}
        >
          Cancel and Return
        </button>
      </div>
    </div>
  );
};

export default DeleteProfile;
