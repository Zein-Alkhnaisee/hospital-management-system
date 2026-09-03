import React from "react";
import { Link } from "react-router-dom";

const SeminarCard = ({ seminar }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const formattedDate = formatDate(seminar.date);

  return (
    <div className="seminar-card">
      <div className="card-header">
        {seminar.image_url && (
          <img
            src={seminar.image_url}
            alt={seminar.title}
            className="seminar-image"
          />
        )}
        <div className={`price-tag ${seminar.is_paid ? "paid" : "free"}`}>
          {seminar.is_paid ? `${seminar.price} SAR` : "Free"}
        </div>
      </div>

      <div className="card-content">
        <div className="seminar-date">
          <i className="fas fa-calendar-alt"></i>
          {formattedDate}
        </div>

        <h3 className="seminar-title">{seminar.title}</h3>

        <div className="seminar-location">
          <i className="fas fa-map-marker-alt"></i>
          {seminar.type === "online" ? "Online Seminar" : seminar.location}
        </div>

        <div className="seminar-stats">
          <div className="stat">
            <i className="fas fa-users"></i>
            {seminar.seminar_registrations_count} Registered
          </div>
          <div className="stat">
            <i className="fas fa-chair"></i>
            {seminar.capacity} Seats
          </div>
        </div>
      </div>

      <div className="card-footer">
        <Link
          to={`/seminars/${seminar.seminar_id}`}
          className="btn details-btn"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default SeminarCard;
