import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Api/axiosInstance";
import "./Seminars.css";
import { toast } from "react-toastify";

const SeminarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seminar, setSeminar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchSeminar = async () => {
      try {
        const response = await axios.get(`/seminars/${id}`);
        setSeminar(response.data.data);
      } catch (err) {
        setError("Failed to fetch seminar details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeminar();
  }, [id]);

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await axios.post(`/seminars/${id}/register`);
      setIsRegistered(true);
      toast.success("Registered successfully!");
    } catch (err) {
      alert(
        "Registration failed: " +
          (err.response?.data?.message || "Something went wrong")
      );
      console.error(err);
    } finally {
      setRegistering(false);
    }
  };

  const handleViewDoctor = () => {
    alert("Doctor profile will be available soon");
  };

  if (loading) {
    return (
      <div className="seminarpage-loading seminarpage-fade-in">
        <div className="seminarpage-spinner"></div>
        <p className="seminarpage-loading-text">
          Loading seminar details...
        </p>
      </div>
    );
  }
  if (error) return <div className="error">{error}</div>;
  if (!seminar) return <div className="error">Seminar not found</div>;

  return (
    <div className="seminar-detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate("/seminars")}>
          <i className="fas fa-arrow-left"></i> Back to Seminars
        </button>

        <div className="seminar-header">
          <h1 className="seminar-title">{seminar.title}</h1>
          <div className="seminar-meta">
            <span className={`seminar-type ${seminar.type}`}>
              {seminar.type === "online" ? "Online" : "In-person"}
            </span>
            <span className={`price-tag ${seminar.is_paid ? "paid" : "free"}`}>
              {seminar.is_paid ? `${seminar.price} SAR` : "Free"}
            </span>
          </div>
        </div>

        <div className="seminar-content">
          <div className="seminar-image-container">
            {seminar.image_url && (
              <img
                src={seminar.image_url}
                alt={seminar.title}
                className="seminar-image"
              />
            )}
          </div>

          <div className="seminar-details">
            <div className="detail-item">
              <i className="fas fa-calendar-alt"></i>
              <div>
                <h3>Date & Time</h3>
                <p>
                  {new Date(seminar.date).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="detail-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Location</h3>
                <p>
                  {seminar.type === "online"
                    ? "Online Seminar"
                    : seminar.location}
                </p>
              </div>
            </div>

            <div className="detail-item">
              <i className="fas fa-user-md"></i>
              <div>
                <h3>Presenter</h3>
                <p>Dr. Ahmed Mohamed</p>
                <button className="doctor-btn" onClick={handleViewDoctor}>
                  View Profile
                </button>
              </div>
            </div>

            <div className="detail-item">
              <i className="fas fa-users"></i>
              <div>
                <h3>Seats</h3>
                <p>
                  {seminar.seminar_registrations_count} registered out of{" "}
                  {seminar.capacity}
                </p>
                <div className="capacity-bar">
                  <div
                    className="capacity-progress"
                    style={{
                      width: `${
                        (seminar.seminar_registrations_count /
                          seminar.capacity) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="seminar-description">
            <h2>Seminar Details</h2>
            <p>{seminar.description}</p>
          </div>
        </div>

        <div className="action-buttons">
          {isRegistered ? (
            <div className="registered-badge">
              <i className="fas fa-check-circle"></i> Registered
            </div>
          ) : (
            <button
              className="register-btn"
              onClick={handleRegister}
              disabled={
                registering ||
                seminar.seminar_registrations_count >= seminar.capacity
              }
            >
              {registering ? "Registering..." : "Register Now"}
            </button>
          )}

          <button
            className="view-my-seminars-btn"
            onClick={() => navigate("/my-seminars")}
          >
            <i className="fas fa-list"></i> View My Seminars
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeminarDetailPage;
