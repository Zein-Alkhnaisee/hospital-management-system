import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./SpecialtyPage.css";

  const SpecialtyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { axios, isAuthenticated, user } = useAuth();
    const [specialty, setSpecialty] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // جلب معلومات القسم
          const specialtyResponse = await axios.get(`/specialties/${id}`);
          console.log('Specialty response:', specialtyResponse.data);
          
          if (specialtyResponse.data.success && specialtyResponse.data.data) {
            setSpecialty(specialtyResponse.data.data);
            
            // بدلاً من استخدام endpoint الأطباء حسب التخصص الذي يعطي 500
            // سنستخدم endpoint جميع الأطباء ثم نصنفهم
            try {
              const allDoctorsResponse = await axios.get('/doctors');
              console.log('All doctors response:', allDoctorsResponse.data);
              
              let allDoctors = [];
              if (allDoctorsResponse.data && Array.isArray(allDoctorsResponse.data.doctors)) {
                allDoctors = allDoctorsResponse.data.doctors;
              } else if (Array.isArray(allDoctorsResponse.data)) {
                allDoctors = allDoctorsResponse.data;
              } else if (allDoctorsResponse.data && allDoctorsResponse.data.data && Array.isArray(allDoctorsResponse.data.data)) {
                allDoctors = allDoctorsResponse.data.data;
              }
              
              // تصفية الأطباء حسب specialty_id
              const filteredDoctors = allDoctors.filter(doctor => 
                doctor.specialty_id == id || 
                (doctor.specialty && doctor.specialty.toLowerCase() === specialtyResponse.data.data.name.toLowerCase())
              );
              console.log('Filtered doctors:', filteredDoctors);
              setDoctors(filteredDoctors);
            } catch (doctorsError) {
              console.error('Error fetching doctors:', doctorsError);
              setDoctors([]);
            }
          } else {
            setError('Failed to load department: Unexpected response structure');
          }
        } catch (err) {
          console.error('Error loading specialty data:', err);
          if (err.response) {
            setError(`Error: ${err.response.status} - ${err.response.data?.message || 'No message'}`);
          } else {
            setError('Error loading data: ' + err.message);
          }
        } finally {
          setLoading(false);
        }
      };
  
      if (isAuthenticated) {
        fetchData();
      } else {
        setError('You need to be logged in to view this content');
        setLoading(false);
      }
    }, [id, axios, isAuthenticated]);
  

  if (loading) {
    return (
      <div className="specialty-loading">
        <div className="spinner"></div>
        <p>Loading department data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="specialty-error">
        <h3>Error Loading Content</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={() => navigate('/specialties')} className="back-btn">
            Back to Departments
          </button>
          <button onClick={() => navigate('/diagnostics')} className="diagnostics-btn">
            Run Diagnostics
          </button>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="specialty-page">
      <div className="specialty-header">
        <button onClick={() => navigate("/specialties")} className="back-btn">
          &larr; Back to Departments
        </button>
        <h1>{specialty.name} Department</h1>
      </div>

      <div className="specialty-content">
        <div className="specialty-details">
          <div className="specialty-image">
            <img
              src={specialty.specialty_image_url}
              alt={specialty.name}
              onError={(e) => (e.target.src = "/placeholder.jpg")}
            />
          </div>
          <div className="specialty-info">
            <h2>Department Information</h2>
            <p className="description">
              {specialty.description ||
                "No description available for this department"}
            </p>
            <div className="meta-info">
              <div className="meta-item">
                <span className="label">Status:</span>
                <span
                  className={`status ${
                    specialty.is_active ? "sp-active" : "sp-inactive"
                  }`}
                >
                  {specialty.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="meta-item">
                <span className="label">Created At:</span>
                <span className="value">
                  {new Date(specialty.created_at).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="specialty-doctors">
          <h2>{specialty.name} Department Doctors</h2>

          {doctors.length === 0 ? (
            <div className="no-doctors">
              <p>No doctors found in this department</p>
              <p className="info-text">
                This might be because no doctors are currently assigned to this
                department, or there might be a data loading issue.
              </p>
              <button
                onClick={() => navigate("/doctors")}
                className="view-all-doctors"
              >
                Browse All Doctors
              </button>
              <button
                onClick={() => window.location.reload()}
                className="retry-btn"
              >
                Retry Loading
              </button>
            </div>
          ) : (
            <div className="doctors-grid">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-image">
                    <img
                      src={
                        doctor.image ||
                        doctor.profile_image_url ||
                        "/doctor-placeholder.jpg"
                      }
                      alt={doctor.name}
                      onError={(e) =>
                        (e.target.src = "/doctor-placeholder.jpg")
                      }
                    />
                  </div>
                  <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <p className="experience">
                      <span>Experience:</span> {doctor.experience} years
                    </p>
                    <Link
                      to={`/doctors/${doctor.id}`}
                      className="view-doctor-btn"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialtyPage;
