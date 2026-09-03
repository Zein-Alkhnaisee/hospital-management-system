import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./MedicalRecordsPage.css";

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { axios, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const fetchMedicalRecords = async () => {
      try {
        const response = await axios.get("/medical-records");
        if (response.data && Array.isArray(response.data.data)) {
          // Filter records where all invoices are paid
          const filteredRecords = response.data.data.filter((record) => {
            return record.appointments.every(
              (app) => app.invoice && app.invoice.status === "paid"
            );
          });
          setRecords(filteredRecords);
        } else {
          setError("Failed to load medical records. Please try again.");
        }
      } catch (err) {
        setError("Error loading medical records. Please try again later.");
        console.error("Error fetching medical records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [axios]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="medical-records-container">
        <h1>Medical Records</h1>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading medical records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="medical-records-container">
        <h1>Medical Records</h1>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-records-container">
      <h1>Medical Records</h1>
      <p className="subtitle">Your complete medical history and records</p>

      {records.length > 0 ? (
        <div className="records-grid">
          {records.map((record) => (
            <div key={record.record_id} className="record-card">
              <div className="record-header">
                <div className="record-date">
                  {formatDate(record.record_date)}
                </div>
                <div className="record-status">
                  {record.appointments.every(
                    (app) => app.invoice && app.invoice.status === "paid"
                  ) ? (
                    <span className="status-paid">All Invoices Paid</span>
                  ) : (
                    <span className="status-pending">Pending Payments</span>
                  )}
                </div>
              </div>

              <div className="record-body">
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

                <div className="diagnosis-summary">
                  <h4>Diagnosis</h4>
                  <p>{record.diagnosis || "No diagnosis provided"}</p>
                </div>

                <div className="record-meta">
                  <div className="meta-item">
                    <span>Appointments:</span>
                    <span>{record.appointments.length}</span>
                  </div>
                  <div className="meta-item">
                    <span>Prescriptions:</span>
                    <span>{record.prescriptions.length}</span>
                  </div>
                </div>
              </div>

              <div className="record-footer">
                <Link
                  to={`/medical-records/${record.record_id}`}
                  className="view-record-btn"
                >
                  View Record Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-records">
          <p>No medical records found</p>
          <p>
            All your medical records will appear here once appointments are
            completed and invoices are paid.
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsPage;
