import React, { useState, useEffect } from "react";
import { useAuth } from "./../AuthContext/AuthContext";
import "./SpecialtySelection.css";

const SpecialtySelection = ({ onSelect }) => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { axios } = useAuth();

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await axios.get("/specialties");
        if (response.data.success && Array.isArray(response.data.data)) {
          setSpecialties(response.data.data);
        } else {
          setError("Failed to load specialties. Please try again.");
        }
      } catch (err) {
        setError("Error loading specialties. Please try again later.");
        console.error("Error fetching specialties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, [axios]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading specialties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="specialty-selection">
      <h2>Select a Medical Specialty</h2>
      <p>Choose the department you want to book an appointment in</p>

      <div className="specialty-grid">
        {specialties.map((specialty) => (
          <div
            key={specialty.specialty_id}
            className="specialty-card"
            onClick={() => onSelect(specialty)}
          >
            <div className="specialty-image">
              <img
                src={specialty.specialty_image_url}
                alt={specialty.name}
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />
            </div>
            <div className="specialty-info">
              <h3>{specialty.name}</h3>
              <p className="description">
                {specialty.description || "No description available"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialtySelection;
