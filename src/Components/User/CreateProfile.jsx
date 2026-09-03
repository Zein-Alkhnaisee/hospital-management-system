import React, { useState } from "react";
import axios from "../../Api/axiosInstance";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ProfileStyles.css";
import { toast } from "react-toastify";

const CreateProfile = () => {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setLoading(true);

    try {
      const data = new FormData();

      // إضافة الحقول النصية
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      // إضافة ملف الصورة إن وُجد
      if (profileImage) {
        data.append("profile_image_url", profileImage);
      }

      const res = await axios.post("/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile created successfully");
      navigate("/profile-view");
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message || "حدث خطأ أثناء إنشاء الملف الشخصي"
        );
      } else {
        setError("حدث خطأ في الاتصال بالخادم");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container fade-in">
      <div className="profile-header">
        <h2>Create profile</h2>
        <p>Complete your personal information to create your profile</p>
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
            className="profile-btn profile-btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Save is underway...
              </>
            ) : (
              "Save Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
