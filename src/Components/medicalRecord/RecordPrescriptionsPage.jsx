import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./RecordPrescriptionsPage.css";

const RecordPrescriptionsPage = () => {
  const { recordId } = useParams();
  const [prescriptions, setPrescriptions] = useState([]);
  const [recordInfo, setRecordInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { axios, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      try {
        // Fetch record info
        const recordResponse = await axios.get(`/medical-records/${recordId}`);
        setRecordInfo(recordResponse.data.data);

        // Fetch prescriptions for the record
        const prescriptionsResponse = await axios.get(
          `/medical-records/${recordId}/prescriptions`
        );
        if (
          prescriptionsResponse.data &&
          Array.isArray(prescriptionsResponse.data.data)
        ) {
          setPrescriptions(prescriptionsResponse.data.data);
        } else {
          setError("Failed to load prescriptions. Please try again.");
        }
      } catch (err) {
        setError("Error loading prescriptions. Please try again later.");
        console.error("Error fetching prescriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [axios, recordId]);

  if (loading) {
    return (
      <div className="prescriptions-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prescriptions-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="prescriptions-container">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <h1>Prescriptions for Medical Record #{recordId}</h1>
        <p className="subtitle">
          {recordInfo &&
            `Diagnosis: ${recordInfo.diagnosis || "No diagnosis provided"}`}
        </p>
      </div>

      {prescriptions.length > 0 ? (
        <div className="prescriptions-grid">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.prescription_id}
              className="prescription-card"
            >
              <div className="prescription-header">
                <div className="prescription-id">
                  Prescription #{prescription.prescription_id}
                </div>
                <div className="status">Active</div>
              </div>

              <div className="prescription-body">
                <div className="medication-info">
                  <h3>{prescription.medication_name}</h3>
                  <div className="dosage">
                    <span>Dosage:</span>
                    <span>{prescription.dosage}</span>
                  </div>
                </div>

                <div className="instructions">
                  <h4>Instructions:</h4>
                  <p>{prescription.instructions}</p>
                </div>
              </div>

              <div className="prescription-footer">
                <Link
                  to={`/prescriptions/${prescription.prescription_id}`}
                  className="view-btn"
                >
                  View Prescription Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-prescriptions">
          <p>No prescriptions found for this medical record.</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      )}
    </div>
  );
};

export default RecordPrescriptionsPage;
