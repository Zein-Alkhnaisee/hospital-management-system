import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import ActiveInsurance from "./ActiveInsurance";
import InsuranceForm from "./InsuranceForm";
import InsuranceList from "./InsuranceList";
import InsuranceDetails from "./InsuranceDetails";
import { getActiveInsurance, getAllInsurances } from "./insuranceService";
import "./HealthInsurancePage.css";

const HealthInsurancePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [activeInsurance, setActiveInsurance] = useState(null);
  const [insurances, setInsurances] = useState([]);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const all = await getAllInsurances(user);
      setInsurances(all);

      const active = all.find(
        (insurance) =>
          insurance.status === "approved" &&
          new Date(insurance.valid_to) > new Date()
      );

      setActiveInsurance(active || null);

      const hasPending = all.some((i) => i.status === "pending");
      setShowForm(!active && !hasPending);
    } catch (err) {
      setError(err.message || "Failed to load insurance data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      isAuthenticated &&
      user?.role === "patient" &&
      user.is_patient_registered
    ) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleInsuranceAction = () => {
    fetchData();
    setSelectedInsurance(null);
  };

  const handleEditInsurance = (insurance) => {
    setSelectedInsurance(insurance);
    setShowForm(true);
  };

  if (authLoading) {
    return (
      <div className="hi-loading-container">
        <div className="hi-spinner"></div>
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="hi-alert-box hi-alert-danger">
        You must be logged in to access this page
      </div>
    );
  }

  if (user?.role !== "patient") {
    return (
      <div className="hi-alert-box hi-alert-warning">
        This page is only available for patients
      </div>
    );
  }

  if (!user.is_patient_registered) {
    return (
      <div className="hi-alert-box hi-alert-warning">
        <h4>Not Registered as a Patient</h4>
        <p>
          You need to register your information as a patient to use health
          insurance services
        </p>
        <button
          className="hi-btn-primary mt-2"
          onClick={() => navigate("/role-change")}
        >
          Go to Registration
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="hi-loading-container">
        <div className="hi-spinner"></div>
        <p>Loading insurance data...</p>
      </div>
    );
  }

  return (
    <div className="hi-container">
      <h2 className="hi-title">Health Insurance Management</h2>

      {error && <div className="hi-alert-box hi-alert-danger">{error}</div>}

      {activeInsurance && (
        <ActiveInsurance
          insurance={activeInsurance}
          onDelete={handleInsuranceAction}
          user={user}
        />
      )}

      {!showForm && !activeInsurance && (
        <div className="hi-action-buttons">
          <button className="hi-btn-primary" onClick={() => setShowForm(true)}>
            + Add New Health Insurance
          </button>
        </div>
      )}

      {showForm && (
        <InsuranceForm
          insurance={selectedInsurance}
          onSuccess={handleInsuranceAction}
          onCancel={() => {
            setShowForm(false);
            setSelectedInsurance(null);
          }}
          user={user}
        />
      )}

      <InsuranceList
        insurances={insurances}
        activeId={activeInsurance?.insurance_id}
        onSelect={setSelectedInsurance}
        onDeleteSuccess={handleInsuranceAction}
        user={user}
      />

      {selectedInsurance && (
        <InsuranceDetails
          insurance={selectedInsurance}
          onClose={() => setSelectedInsurance(null)}
          onEdit={() => handleEditInsurance(selectedInsurance)}
          onDeleteSuccess={handleInsuranceAction}
          user={user}
        />
      )}
    </div>
  );
};

export default HealthInsurancePage;
