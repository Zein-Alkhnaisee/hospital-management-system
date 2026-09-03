import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./DoctorSelection.css";

const DoctorSelection = ({ specialtyId, onSelect, onBack }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { axios } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`/specialties/${specialtyId}/doctors`);
        if (response.data && Array.isArray(response.data.doctors)) {
          // إضافة مسار افتراضي للصورة إذا لم يكن موجوداً
          const doctorsWithImages = response.data.doctors.map((doctor) => ({
            ...doctor,
            profile_image:
              doctor.profile_image ||
              "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
          }));
          setDoctors(doctorsWithImages);
        } else {
          setError("Failed to load doctors. Please try again.");
        }
      } catch (err) {
        setError("Error loading doctors. Please try again later.");
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [axios, specialtyId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading doctors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <div className="button-group">
          <button className="btn" onClick={onBack}>
            Go Back
          </button>
          <button className="btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-selection">
      <div className="header-with-back">
        <button className="back-button" onClick={onBack}>
          &larr; Back
        </button>
        <h2>Select a Doctor</h2>
      </div>

      <p>Choose a doctor from this specialty</p>

      <div className="doctor-grid">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div
              key={doctor.doctor_id}
              className="doctor-card"
              onClick={() => onSelect(doctor)}
            >
              <div className="doctor-image">
                <img
                  src={doctor.profile_image_url}
                  alt={doctor.name}
                  onError={(e) => {
                    e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
                  }}
                />
              </div>
              <div className="doctor-info">
                <h3>Dr. {doctor.name}</h3>
                <p className="experience">
                  Experience: {doctor.experience} years
                </p>
                <div className="rating">
                  <span className="stars">★★★★★</span>
                  <span>(4.8)</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-doctors">
            <p>No doctors available in this specialty at the moment.</p>
            <button className="btn" onClick={onBack}>
              Choose Another Specialty
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSelection;
