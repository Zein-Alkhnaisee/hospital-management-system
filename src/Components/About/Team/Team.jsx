import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faCalendarAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext/AuthContext';
import './Team.css';

const Team = () => {
  const { isAuthenticated, axios } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/doctors');
        let doctorsData = [];
        
        // التعامل مع هياكل البيانات المختلفة
        if (response.data && Array.isArray(response.data.doctors)) {
          doctorsData = response.data.doctors;
        } else if (Array.isArray(response.data)) {
          doctorsData = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          doctorsData = response.data.data;
        } else {
          setError('Failed to fetch doctors data: Unexpected response structure');
          return;
        }
        
        const formattedDoctors = doctorsData.map(doctor => ({
          id: doctor.doctor_id || doctor.id,
          name: doctor.name,
          image: doctor.profile_image_url || doctor.profile_image || doctor.image || '/doctor-placeholder.jpg',
          specialty: doctor.specialty || 'Not specified',
          experience: doctor.experience || 0
        }));
        
        setDoctors(formattedDoctors);
      } catch (err) {
        let errorMessage = 'An error occurred while fetching doctors data';
        
        if (err.response) {
          errorMessage += `: ${err.response.status} - ${err.response.data?.message || 'No details'}`;
        } else {
          errorMessage += `: ${err.message}`;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [axios]);

  // تحديد عدد الأطباء المعروضين ب 7 اطباء بالواحهة وعند ضغط زر العرض نعرض جميع الاطباء
  const displayedDoctors = showAll ? doctors : doctors.slice(0, 7);

  if (loading) {
    return (
      <section className={`doctors-section ${isAuthenticated ? "with-nav" : "without-nav"}`} >
        <div className="team-loading">
          <div className="spinner"></div>
          <p>Loading doctors' data...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`doctors-section ${isAuthenticated ? "with-nav" : "without-nav"}`}>
        <div className="team-error">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={`doctors-section-team ${isAuthenticated ? "with-nav" : "without-nav"}`}>
      <div className="team-header">
        <h2>Doctor team</h2>
        <p>Meet our team of highly experienced specialist doctors.</p>
      </div>
      
      <div className="doctor-grid-team">
        {displayedDoctors.map((doctor) => (
          <div className="doctor-card-team" key={doctor.id}>
            <div className="doctor-image-team">
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                onError={(e) => e.target.src = '/doctor-placeholder.jpg'}
              />
            </div>
            <div className="doctor-info-team">
              <h3>{doctor.name}</h3>
              <div className="doctor-details-team">
                <p className="specialty-team">
                  <FontAwesomeIcon icon={faUserMd} />
                  <span>{doctor.specialty}</span>
                </p>
                <p className="experience-team">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Years of experience: {doctor.experience}</span>
                </p>
              </div>
              <Link 
                to={`/doctors/${doctor.id}`} 
                className="view-doctor-btn-team"
              >
                View doctor
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* زر عرض جميع الأطباء */}
      {doctors.length > 7 && !showAll && (
        <div className="view-all-container">
          <button 
            className="view-all-doctors-btn"
            onClick={() => setShowAll(true)}
          >
            View all doctors ({doctors.length})
            <FontAwesomeIcon icon={faArrowRight} className="btn-icon" />
          </button>
        </div>
      )}

      {/* زر الذهاب لصفحة جميع الأطباء */}
      <div className="all-doctors-link-container">
        <Link to="/doctors" className="all-doctors-link">
          Browse all doctors
          <FontAwesomeIcon icon={faArrowRight} className="link-icon" />
        </Link>
      </div>
    </section>
  );
};

export default Team;