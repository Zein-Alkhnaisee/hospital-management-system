import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./PrescriptionDetailsPage.css";

const PrescriptionDetailsPage = () => {
  const { prescriptionId } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { axios, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchPrescription = async () => {
      try {
        const response = await axios.get(`/prescriptions/${prescriptionId}`);

        if (response.data && response.data.data) {
          setPrescription(response.data.data);
        } else {
          setError("Failed to load prescription details. Please try again.");
        }
      } catch (err) {
        setError("Error loading prescription details. Please try again later.");
        console.error("Error fetching prescription:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [axios, prescriptionId, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="prescription-details-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading prescription details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prescription-details-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => navigate("/prescriptions")}>
            Back to Prescriptions
          </button>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="prescription-details-container">
        <div className="no-prescription">
          <p>Prescription not found</p>
          <button onClick={() => navigate("/prescriptions")}>
            Back to Prescriptions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="prescription-details-container">
      <div className="prescription-header">
        <button
          className="back-button"
          onClick={() => navigate("/prescriptions")}
        >
          &larr; Back to Prescriptions
        </button>
        <h1>Prescription Details</h1>
      </div>

      <div className="prescription-card">
        <div className="prescription-meta">
          <div className="meta-item">
            <span>Prescription ID:</span>
            <span>{prescription.prescription_id}</span>
          </div>
          <div className="meta-item">
            <span>Status:</span>
            <span className="status-active">Active</span>
          </div>
          <div className="meta-item">
            <span>Issued Date:</span>
            <span>
              {prescription.medical_record?.record_date
                ? new Date(
                    prescription.medical_record.record_date
                  ).toLocaleDateString("en-US")
                : "N/A"}
            </span>
          </div>
        </div>

        <div className="section">
          <h2>Medication Information</h2>
          <div className="medication-info">
            <div className="info-item">
              <span>Medication Name:</span>
              <span className="medication-name">
                {prescription.medication_name}
              </span>
            </div>
            <div className="info-item">
              <span>Dosage:</span>
              <span>{prescription.dosage}</span>
            </div>
            <div className="info-item">
              <span>Instructions:</span>
              <p>{prescription.instructions}</p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Doctor Information</h2>
          <div className="doctor-info">
            <div className="doctor-avatar">
              <div className="avatar-initials">
                {prescription.medical_record?.doctor?.name
                  ? prescription.medical_record.doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "DR"}
              </div>
            </div>
            <div className="doctor-details">
              <h3>
                Dr.{" "}
                {prescription.medical_record?.doctor?.name || "Unknown Doctor"}
              </h3>
              <p className="specialty">
                {prescription.medical_record?.doctor?.speciality ||
                  "General Medicine"}
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Related Medical Record</h2>
          <div className="record-summary">
            <div className="record-info">
              <div className="info-item">
                <span>Record ID:</span>
                <span>{prescription.medical_record?.record_id || "N/A"}</span>
              </div>
              <div className="info-item">
                <span>Diagnosis:</span>
                <span>
                  {prescription.medical_record?.diagnosis ||
                    "No diagnosis provided"}
                </span>
              </div>
              <div className="info-item">
                <span>Record Date:</span>
                <span>
                  {prescription.medical_record?.record_date
                    ? new Date(
                        prescription.medical_record.record_date
                      ).toLocaleDateString("en-US")
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="view-record-btn">
              <Link
                to={`/prescriptions/${prescription.prescription_id}/record`}
              >
                View Full Medical Record
              </Link>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Appointment Information</h2>
          {prescription.medical_record?.appointments?.length > 0 ? (
            <div className="appointment-info">
              <div className="info-item">
                <span>Appointment Date:</span>
                <span>
                  {prescription.medical_record.appointments[0]?.appointment_date
                    ? new Date(
                        prescription.medical_record.appointments[0].appointment_date
                      ).toLocaleString("en-US")
                    : "N/A"}
                </span>
              </div>
              <div className="info-item">
                <span>Status:</span>
                <span
                  className={`status-${
                    prescription.medical_record.appointments[0]?.status ||
                    "unknown"
                  }`}
                >
                  {prescription.medical_record.appointments[0]?.status ||
                    "Unknown"}
                </span>
              </div>
              {prescription.medical_record.appointments[0]?.invoice && (
                <div className="info-item">
                  <span>Invoice Status:</span>
                  <span
                    className={`invoice-status ${prescription.medical_record.appointments[0].invoice.status}`}
                  >
                    {prescription.medical_record.appointments[0].invoice.status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p>No appointment information available for this prescription.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailsPage;
