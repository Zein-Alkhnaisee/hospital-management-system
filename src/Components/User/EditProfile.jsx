import React, { useEffect, useState } from "react";
import axios from "../../Api/axiosInstance";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ProfileStyles.css";

const EditProfile = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    dateofbirth: "",
    gender: "",
    address: "",
    phone: "",
    bio: "",
    blood_type: "",
    marital_status: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.profile;
        setFormData({
          dateofbirth: data.dateofbirth || "",
          gender: data.gender || "",
          address: data.address || "",
          phone: data.phone || "",
          bio: data.bio || "",
          blood_type: data.blood_type || "",
          marital_status: data.marital_status || "",
        });

        if (data.profile_image_url) {
          setPreviewImage(data.profile_image_url);
        }
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const data = new FormData();

      for (const key in formData) {
        data.append(key, formData[key]);
      }

      if (profileImage) {
        data.append("profile_image_url", profileImage);
      }

      data.append("_method", "PUT");

      const res = await axios.post("/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setError("An error occurred while updating the profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container fade-in">
      <div className="profile-header">
        <h2>Edit Profile</h2>
        <p>Update your personal information</p>
      </div>

      <div className="profile-card">
        {error && (
          <div className="profile-alert profile-alert-danger">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-image-container">
            <label className="profile-image-upload">
              <img
                src={previewImage || "/default-avatar.png"}
                alt="Profile preview"
                className="profile-image"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Date of birth</label>
              <input
                type="date"
                className="form-control"
                name="dateofbirth"
                onChange={handleChange}
                value={formData.dateofbirth}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                name="gender"
                onChange={handleChange}
                value={formData.gender}
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              onChange={handleChange}
              value={formData.address}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              onChange={handleChange}
              value={formData.phone}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">About you</label>
            <textarea
              className="form-control"
              name="bio"
              rows="3"
              onChange={handleChange}
              value={formData.bio}
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Blood type</label>
              <input
                type="text"
                className="form-control"
                name="blood_type"
                onChange={handleChange}
                value={formData.blood_type}
                placeholder="e.g. O+"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Marital status</label>
              <input
                type="text"
                className="form-control"
                name="marital_status"
                onChange={handleChange}
                value={formData.marital_status}
                placeholder="e.g. Married, Single"
              />
            </div>
          </div>

          <button
            type="submit"
            className="profile-btn profile-btn-success w-100"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
