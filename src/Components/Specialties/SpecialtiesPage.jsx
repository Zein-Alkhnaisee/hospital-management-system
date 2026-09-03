import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { Link } from 'react-router-dom';
import './SpecialtiesPage.css';

const SpecialtiesPage = () => {
  const { axios } = useAuth();
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await axios.get('/specialties');
        
        if (response.data.success && Array.isArray(response.data.data)) {
          setSpecialties(response.data.data);
        } else {
          setError('Failed to load departments: Unexpected response structure');
        }
      } catch (err) {
        setError('Error loading departments: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, [axios]);

  if (loading) {
    return (
      <div className="specialties-loading">
        <div className="specialties-spinner"></div>
        <p>Loading departments...</p>
      </div>
    );
  }

  if (error) {
    return <div className="specialties-error">{error}</div>;
  }

  return (
    <div className="specialties-page-section">
      <div className="specialties-header-section">
        <h1>Hospital Departments</h1>
        <p>Discover medical specialties and find the best healthcare providers</p>
      </div>
      
      <div className="specialties-grid-section">
        {specialties.map((specialty) => (
          <div key={specialty.specialty_id} className="specialty-card-section">
            <div className="specialty-image-section">
              <img 
                src={specialty.specialty_image_url} 
                alt={specialty.name} 
                onError={(e) => e.target.src = '/placeholder.jpg'}
              />
            </div>
            <div className="specialty-info-section">
              <h2>{specialty.name}</h2>
              <p className="specialty-description-section">
                {specialty.description || 'No description available for this department'}
              </p>
              <Link 
                to={`/specialties/${specialty.specialty_id}`} 
                className="view-doctors-btn-section"
              >
                View department information
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialtiesPage;