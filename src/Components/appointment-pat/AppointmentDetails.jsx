import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./AppointmentDetails.css";

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModifying, setIsModifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { axios } = useAuth();

  // Check for success message from location state
  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clear the state after showing the message
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`/appointments/${id}`);
        if (response.data && response.data.data) {
          setAppointment(response.data.data);
        } else {
          setError("Failed to load appointment details. Please try again.");
        }
      } catch (err) {
        setError("Error loading appointment details. Please try again later.");
        console.error("Error fetching appointment:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [axios, id]);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const handleModifyAppointment = () => {
    setIsModifying(true);
    navigate("/book-appointment");
  };

  const handleCancelAppointment = async () => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await axios.delete(`/appointments/${id}`);
        setSuccessMessage("Appointment cancelled successfully!");
        // Refresh appointment data
        const response = await axios.get(`/appointments/${id}`);
        setAppointment(response.data.data);
      } catch (err) {
        setError("Failed to cancel appointment. Please try again.");
        console.error("Cancellation error:", err);
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "confirmed":
        return "status-confirmed";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="appointment-details-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointment-details-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
          <button onClick={() => navigate("/appointments")}>
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="appointment-details-container">
        <div className="no-appointment">
          <p>Appointment not found</p>
          <button onClick={() => navigate("/appointments")}>
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  const { date, time } = formatDateTime(appointment.appointment_date);

  return (
    <div className="appointment-details-container">
      <div className="appointment-header">
        <button
          className="back-button"
          onClick={() => navigate("/appointments")}
        >
          &larr; Back to Appointments
        </button>
        <h1>Appointment Details</h1>
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className={`appointment-card ${getStatusClass(appointment.status)}`}>
        <div className="appointment-header-info">
          <div className="date-time">
            <div className="date">{date}</div>
            <div className="time">{time}</div>
          </div>
          <div className={`status ${getStatusClass(appointment.status)}`}>
            {appointment.status}
          </div>
        </div>

        <div className="appointment-body">
          <div className="doctor-info">
            <div className="doctor-image-appoin">
              <img
                src={appointment.doctor_image || "/doctor-placeholder.jpg"}
                alt={appointment.doctor_name}
              />
            </div>
            <div className="doctor-details">
              <h2>Dr. {appointment.doctor_name}</h2>
              <p className="specialty">{appointment.specialty_name}</p>
              <div className="rating">
                <span className="stars">★★★★★</span>
                <span>(4.8)</span>
              </div>
            </div>
          </div>

          <div className="appointment-meta">
            <div className="meta-item">
              <span>Appointment ID:</span>
              <span>{appointment.appointment_id}</span>
            </div>
            <div className="meta-item">
              <span>Duration:</span>
              <span>30 minutes</span>
            </div>
            <div className="meta-item">
              <span>Price:</span>
              <span>${appointment.paid_amount}</span>
            </div>
            <div className="meta-item">
              <span>Location:</span>
              <span>Main Hospital Building, Room 304</span>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        {appointment.status === "pending" && (
          <>
            <button className="modify-button" onClick={handleModifyAppointment}>
              Modify Appointment
            </button>
            <button className="cancel-button" onClick={handleCancelAppointment}>
              Cancel Appointment
            </button>
          </>
        )}

        {appointment.status === "confirmed" && (
          <button className="cancel-button" onClick={handleCancelAppointment}>
            Cancel Appointment
          </button>
        )}

        {appointment.status === "completed" && (
          <button
            className="rate-button"
            onClick={() =>
              alert("Rating functionality will be implemented soon")
            }
          >
            Rate Your Experience
          </button>
        )}
      </div>

      <div className="additional-info">
        <h3>Appointment Instructions</h3>
        <ul>
          <li>
            Please arrive 15 minutes before your scheduled appointment time.
          </li>
          <li>Bring your insurance card and a valid photo ID.</li>
          <li>Bring any relevant medical records or test results.</li>
          <li>
            If you need to cancel or reschedule, please do so at least 24 hours
            in advance.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AppointmentDetails;
