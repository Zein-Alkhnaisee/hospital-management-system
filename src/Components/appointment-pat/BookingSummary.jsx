import React from "react";
import "./BookingSummary.css";

const BookingSummary = ({
  specialty,
  doctor,
  slot,
  onBook,
  onBack,
  isLoading,
  error,
}) => {
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="booking-summary">
      <div className="header-with-back">
        <button className="back-button" onClick={onBack}>
          &larr; Back
        </button>
        <h2>Confirm Appointment</h2>
      </div>

      <div className="summary-card">
        <h3>Appointment Details</h3>

        <div className="summary-section">
          <h4>Department</h4>
          <div className="specialty-info">
            <div className="specialty-image">
              <img src={specialty.specialty_image_url} alt={specialty.name} />
            </div>
            <div>
              <p className="specialty-name">{specialty.name}</p>
              <p className="specialty-description">
                {specialty.description || "No description"}
              </p>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h4>Doctor</h4>
          <div className="doctor-info-appoinment">
            <div className="doctor-image-appoinment">
              <img
                src={doctor.profile_image_url || "/doctor-placeholder.jpg"}
                alt={doctor.name}
              />
            </div>
            <div>
              <p className="doctor-name">Dr. {doctor.name}</p>
              <p className="doctor-experience">
                {doctor.experience} years experience
              </p>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h4>Date & Time</h4>
          <div className="datetime-info">
            <p className="date">{formatDate(slot.availability_date)}</p>
            <p className="time">{formatTime(slot.start)}</p>
            <p className="duration">{slot.duration} minutes</p>
          </div>
        </div>

        <div className="summary-section price-section">
          <h4>Price</h4>
          <p className="price">${slot.paid_amount}</p>
          <p className="note">
            This amount will be deducted from your account balance
          </p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="action-buttons">
        <button className="back-button" onClick={onBack} disabled={isLoading}>
          Back
        </button>
        <button className="book-button" onClick={onBook} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span> Booking...
            </>
          ) : (
            "Confirm Appointment"
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
