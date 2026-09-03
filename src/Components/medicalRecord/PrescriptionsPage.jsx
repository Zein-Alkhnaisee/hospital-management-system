import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./PrescriptionsPage.css";

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { axios, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get("/prescriptions");
        console.log("Prescriptions API full response:", response);

        if (response.data && Array.isArray(response.data.data)) {
          console.log("Prescriptions data:", response.data.data);

          // جلب معلومات مفصلة لكل وصفة
          const prescriptionsWithDetails = await Promise.all(
            response.data.data.map(async (prescription) => {
              try {
                // جلب السجل الطبي الكامل لكل وصفة
                const recordResponse = await axios.get(
                  `/prescriptions/${prescription.prescription_id}/record`
                );
                const recordData = recordResponse.data.data;

                return {
                  ...prescription,
                  medical_record: recordData,
                  doctorName: recordData.doctor?.name || "Unknown Doctor",
                };
              } catch (error) {
                console.error("Error fetching record details:", error);
                return {
                  ...prescription,
                  medical_record: null,
                  doctorName: "Unknown Doctor",
                };
              }
            })
          );

          setPrescriptions(prescriptionsWithDetails);
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

    if (isAuthenticated) {
      fetchPrescriptions();
    } else {
      navigate("/login");
    }
  }, [axios, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="prescriptions-page-container">
        <h1>Medical Prescriptions</h1>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prescriptions-page-container">
        <h1>Medical Prescriptions</h1>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="prescriptions-page-container">
      <h1>Medical Prescriptions</h1>
      <p className="subtitle">All your active and past prescriptions</p>

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
                <div
                  className={`status ${
                    prescription.medical_record?.appointments?.some(
                      (app) => app.invoice && app.invoice.status === "paid"
                    )
                      ? "status-active"
                      : "status-pending"
                  }`}
                >
                  {prescription.medical_record?.appointments?.some(
                    (app) => app.invoice && app.invoice.status === "paid"
                  )
                    ? "Active"
                    : "Pending Payment"}
                </div>
              </div>

              <div className="prescription-body">
                <div className="medication-info">
                  <h3>{prescription.medication_name}</h3>
                  <div className="dosage">
                    <span>Dosage:</span>
                    <span>{prescription.dosage}</span>
                  </div>
                  {prescription.instructions && (
                    <div className="instructions">
                      <span>Instructions:</span>
                      <span>{prescription.instructions}</span>
                    </div>
                  )}
                </div>

                <div className="record-info">
                  <div className="record-date">
                    <span className="label">Record Date:</span>
                    <span className="value">
                      {prescription.medical_record?.record_date
                        ? new Date(
                            prescription.medical_record.record_date
                          ).toLocaleDateString("en-US")
                        : "N/A"}
                    </span>
                  </div>
                  <div className="doctor-name">
                    <span className="label">Doctor:</span>
                    <span className="value">Dr. {prescription.doctorName}</span>
                  </div>
                </div>
              </div>

              <div className="prescription-footer">
                <div className="action-buttons">
                  <Link
                    to={`/prescriptions/${prescription.prescription_id}`}
                    className="view-btn"
                  >
                    View Prescription
                  </Link>
                  <Link
                    to={`/prescriptions/${prescription.prescription_id}/record`}
                    className="record-btn"
                  >
                    View Medical Record
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-prescriptions">
          <p>No prescriptions found</p>
          <p>Your prescriptions will appear here after medical appointments.</p>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsPage;
