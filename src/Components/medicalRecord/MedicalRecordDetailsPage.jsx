import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./../AuthContext/AuthContext";
import "./MedicalRecordDetailsPage.css";

const MedicalRecordDetailsPage = () => {
  const { recordId } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { axios, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const fetchMedicalRecord = async () => {
      try {
        const response = await axios.get(`/medical-records/${recordId}`);
        if (response.data && response.data.data) {
          setRecord(response.data.data);
        } else {
          setError("Failed to load medical record. Please try again.");
        }
      } catch (err) {
        setError("Error loading medical record. Please try again later.");
        console.error("Error fetching medical record:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecord();
  }, [axios, recordId]);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="record-details-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading medical record details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="record-details-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => navigate("/medical-records")}>
            Back to Records
          </button>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="record-details-container">
        <div className="no-record">
          <p>Medical record not found</p>
          <button onClick={() => navigate("/medical-records")}>
            Back to Records
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="record-details-container">
      <div className="record-header">
        <button
          className="back-button"
          onClick={() => navigate("/medical-records")}
        >
          &larr; Back to Records
        </button>
        <h1>Medical Record Details</h1>
      </div>

      <div className="record-card">
        <div className="record-meta">
          <div className="meta-item">
            <span>Record ID:</span>
            <span>{record.record_id}</span>
          </div>
          <div className="meta-item">
            <span>Date:</span>
            <span>
              {new Date(record.record_date).toLocaleDateString("en-US")}
            </span>
          </div>
          <div className="meta-item">
            <span>Status:</span>
            <span className="status-paid">Completed</span>
          </div>
        </div>

        <div className="section">
          <h2>Diagnosis</h2>
          <div className="diagnosis-content">
            {record.diagnosis || "No diagnosis provided"}
          </div>
        </div>

        <div className="section">
          <h2>Treatment Plan</h2>
          <div className="treatment-content">
            {record.treatment_plan || "No treatment plan provided"}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Doctor Information</h2>
          </div>
          <div className="doctor-info">
            <div className="doctor-avatar">
              <div className="avatar-initials">
                {record.doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>
            <div className="doctor-details">
              <h3>Dr. {record.doctor.name}</h3>
              <p className="specialty">
                {record.doctor.speciality || "General Medicine"}
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Related Appointments</h2>
            <span className="count-badge">{record.appointments.length}</span>
          </div>
          <div className="appointments-list">
            {record.appointments.length > 0 ? (
              record.appointments.map((appointment) => (
                <div
                  key={appointment.appointment_id}
                  className="appointment-item"
                >
                  <div className="appointment-date">
                    {formatDateTime(appointment.appointment_date)}
                  </div>
                  <div className="appointment-status">
                    <span className={`status-${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="invoice-info">
                    {appointment.invoice && (
                      <div
                        className={`invoice-status ${appointment.invoice.status}`}
                      >
                        Invoice: {appointment.invoice.status.toUpperCase()} - $
                        {appointment.invoice.paid_amount} paid of $
                        {appointment.invoice.total_amount}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No appointments related to this medical record.</p>
            )}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Prescriptions</h2>
            <span className="count-badge">{record.prescriptions.length}</span>
          </div>
          <div className="prescriptions-list">
            {record.prescriptions.length > 0 ? (
              <>
                {record.prescriptions.slice(0, 3).map((prescription) => (
                  <div
                    key={prescription.prescription_id}
                    className="prescription-item"
                  >
                    <div className="medication-name">
                      {prescription.medication_name}
                    </div>
                    <div className="dosage">{prescription.dosage}</div>
                  </div>
                ))}
                {record.prescriptions.length > 3 && (
                  <div className="view-all-prescriptions">
                    <Link
                      to={`/medical-records/${record.record_id}/prescriptions`}
                    >
                      View all {record.prescriptions.length} prescriptions
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p>No prescriptions related to this medical record.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordDetailsPage;
