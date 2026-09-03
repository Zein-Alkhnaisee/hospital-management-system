import React, { useState, useEffect } from "react";
import axios from "../../Api/axiosInstance";
import RegistrationCard from "./RegistrationCard";
import "./Seminars.css";

const MySeminarsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get("/seminar-registrations");
        setRegistrations(response.data.data);
      } catch (err) {
        setError("Failed to fetch your registrations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) {
    return (
      <div className="seminarpage-loading seminarpage-fade-in">
        <div className="seminarpage-spinner"></div>
        <p className="seminarpage-loading-text">
          Loading your registrations...
        </p>
      </div>
    );
  }
  if (error) return <div className="error">{error}</div>;

  return (
    <section className="my-seminars-page">
      <div className="container">
        <h1 className="page-title">My Seminar Registrations</h1>
        <p className="page-subtitle">List of seminars you've registered for</p>

        {registrations.length === 0 ? (
          <div className="no-seminars">
            <i className="fas fa-calendar-times"></i>
            <h3>No seminar registrations yet</h3>
            <p>
              Browse available seminars and register for those that interest you
            </p>
            <a href="/seminars" className="btn">
              Browse Seminars
            </a>
          </div>
        ) : (
          <div className="registrations-grid">
            {registrations.map((registration) => (
              <RegistrationCard
                key={registration.registration_id}
                registration={registration}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MySeminarsPage;
