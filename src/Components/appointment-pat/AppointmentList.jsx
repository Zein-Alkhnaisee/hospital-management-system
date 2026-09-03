import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import AppointmentCard from "./AppointmentCard";
import "./AppointmentList.css";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const { axios } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/appointments");
        if (Array.isArray(response.data)) {
          // تصفية المواعيد التي تم دفعها فقط
          const paidAppointments = response.data.filter(
            (appointment) => appointment.status !== "cancelled"
          );
          setAppointments(paidAppointments);
        } else {
          setError("Failed to load appointments. Please try again.");
        }
      } catch (err) {
        setError("Error loading appointments. Please try again later.");
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [axios]);

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    return appointment.status === filter;
  });

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
      <div className="appointment-list-container">
        <div className="appointment-header">
          <h1>My Appointments</h1>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointment-list-container">
        <div className="appointment-header">
          <h1>My Appointments</h1>
        </div>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-list-container">
      <div className="appointment-header">
        <h1>My Appointments</h1>
        <Link to="/book-appointment" className="new-appointment-button">
          Book New Appointment
        </Link>
      </div>

      <div className="appointments-info">
        <p>
          Here you can view and manage all your booked appointments. You can
          modify or cancel appointments that are still pending.
        </p>
      </div>

      <div className="filters">
        <button
          className={`filter-button ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={`filter-button ${filter === "confirmed" ? "active" : ""}`}
          onClick={() => setFilter("confirmed")}
        >
          Confirmed
        </button>
        <button
          className={`filter-button ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {filteredAppointments.length > 0 ? (
        <div className="appointments-grid">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.appointment_id}
              appointment={appointment}
              showModifyButton={appointment.status === "pending"}
            />
          ))}
        </div>
      ) : (
        <div className="no-appointments">
          <div className="no-appointments-content">
            <h3>No appointments found</h3>
            <p>You haven't booked any appointments yet.</p>
            <Link to="/book-appointment" className="book-button">
              Book Your First Appointment
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
