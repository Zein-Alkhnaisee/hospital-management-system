import React from "react";
import { Link } from "react-router-dom";

const RegistrationCard = ({ registration }) => {
  const seminar = registration.seminar;

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

  const registrationDate = new Date(registration.created_at).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="registration-card">
      <div className="card-header">
        {seminar.image_url && (
          <img
            src={seminar.image_url}
            alt={seminar.title}
            className="seminar-image"
          />
        )}
        <div className="registration-id">
          Registration ID: #{registration.registration_id}
        </div>
      </div>

      <div className="card-content">
        <div className="seminar-date">
          <i className="fas fa-calendar-alt"></i>
          {formattedDate}
        </div>

        <h3 className="seminar-title">{seminar.title}</h3>

        <div className="registration-details">
          <div className="detail">
            <i className="fas fa-ticket-alt"></i>
            Registration Date: {registrationDate}
          </div>
          <div className="detail">
            <i className="fas fa-money-bill-wave"></i>
            Paid Amount: {registration.paid_amount} SAR
          </div>
        </div>
      </div>

      <div className="card-footer">
        <Link
          to={`/my-seminars/${registration.registration_id}`}
          className="btn details-btn"
        >
          View Registration
        </Link>
      </div>
    </div>
  );
};

export default RegistrationCard;
