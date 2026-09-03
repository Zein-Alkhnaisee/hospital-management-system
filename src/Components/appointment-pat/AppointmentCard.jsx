import React from "react";
import { Link } from "react-router-dom";
import "./AppointmentCard.css";

const AppointmentCard = ({ appointment, showModifyButton = false }) => {
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDateTime(appointment.appointment_date);

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

  return (
    <div className={`appointment-card ${getStatusClass(appointment.status)}`}>
      <div className="appointment-header">
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
          <div className="doctor-image">
            <img
              src={appointment.doctor_image || "/doctor-placeholder.jpg"}
              alt={appointment.doctor_name}
            />
          </div>
          <div className="doctor-details">
            <h3>Dr. {appointment.doctor_name}</h3>
            <p className="specialty">{appointment.specialty_name}</p>
          </div>
        </div>

        <div className="appointment-meta">
          <div className="meta-item">
            <span>Duration:</span>
            <span>30 mins</span>
          </div>
          <div className="meta-item">
            <span>Price:</span>
            <span>${appointment.paid_amount}</span>
          </div>
        </div>
      </div>

      <div className="appointment-footer">
        <Link
          to={`/appointments/${appointment.appointment_id}`}
          className="view-details-button"
        >
          View Details
        </Link>
        {showModifyButton && (
          <Link
            to={`/modify-appointment/${appointment.appointment_id}`}
            className="modify-button"
          >
            Modify
          </Link>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
