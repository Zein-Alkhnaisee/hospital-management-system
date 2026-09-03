import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./DoctorPage.css";
import DoctorRatings from "../RatingService/DoctorRatings";

const DoctorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [specialty, setSpecialty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // جلب بيانات الطبيب
        const doctorResponse = await axios.get(`/doctors/${id}`);
        
        if (doctorResponse.data && doctorResponse.data.id) {
          setDoctor(doctorResponse.data);
        } else {
          throw new Error("Unexpected doctor response structure");
        }
        
        // جلب التخصص
        const specialtyResponse = await axios.get(`/doctors/${id}/specialties`);
        
        if (specialtyResponse.data && specialtyResponse.data.specialty) {
          setSpecialty(specialtyResponse.data.specialty);
        } else {
          setSpecialty({
            specialty_id: doctorResponse.data.specialty_id,
            name: doctorResponse.data.specialty,
            specialty_image_url: "/placeholder.jpg",
          });
        }
      } catch (err) {
        let errorMessage = "Error loading doctor data";
        
        if (err.response) {
          if (err.response.status === 404) {
            errorMessage = "Doctor not found";
          } else if (err.response.status === 500) {
            errorMessage = "Internal server error";
          } else {
            errorMessage += `: ${err.response.status}`;
          }
        } else if (err.request) {
          errorMessage = "No server response";
        } else {
          errorMessage = `Request error: ${err.message}`;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [id, axios]);

  if (loading) {
    return (
      <div className="doctor-loading">
        <div className="spinner"></div>
        <p>Loading doctor information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-error">
        <h3>Error</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-page">
      <div className="doctor-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          &larr; Back
        </button>
        <h1>Dr. {doctor.name}</h1>
      </div>

      <div className="doctor-content">
        <div className="doctor-profile-section">
          <div className="doctor-image">
            <img
              src={doctor.profile_image_url}
              alt={doctor.name}
              onError={(e) => (e.target.src = "/doctor-placeholder.jpg")}
            />
          </div>
          
          <div className="doctor-basic-info">
            <h2>Professional Information</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Degree:</span>
                <span className="value">{doctor.education_degree}</span>
              </div>
              
              <div className="detail-item">
                <span className="label">University:</span>
                <span className="value">{doctor.university_name}</span>
              </div>
              
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{doctor.email}</span>
              </div>
              
              <div className="detail-item">
                <span className="label">License No:</span>
                <span className="value">{doctor.license_number}</span>
              </div>
              
              <div className="detail-item">
                <span className="label">Experience:</span>
                <span className="value">
                  {doctor.experience || "Not specified"} years
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="doctor-specialty">
          <h2>Specialization</h2>
          {specialty ? (
            <div className="specialty-card">
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
                <Link
                  to={`/specialties/${specialty.specialty_id}`}
                  className="view-specialty-btn"
                >
                  Visit Department
                </Link>
              </div>
            </div>
          ) : (
            <p>No specialization information</p>
          )}
        </div>
        
        <div className="doctor-bio">
          <h2>Professional Bio</h2>
          <p>{doctor.bio || "No additional information available."}</p>
        </div>
        
        <div className="ratings-section">
          <h2>Patient Ratings & Reviews</h2>
          <DoctorRatings doctorId={id} />
        </div>
      </div>
    </div>
  );
};

export default DoctorPage;