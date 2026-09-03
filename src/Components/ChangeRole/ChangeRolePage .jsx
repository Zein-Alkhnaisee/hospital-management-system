import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleChangeForm from "./RoleChangeForm";
import RoleRequestsList from "./RoleRequestsList";
import RoleRequestDetails from "./RoleRequestDetails";
import { useAuth } from "../AuthContext/AuthContext";
import "./RoleChangePage.css";

const RoleChangePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const handleRequestSubmit = () => {
    setSelectedRequestId(null);
    setRefreshFlag((prev) => prev + 1);
  };

  const handleRequestUpdate = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning p-4">
          <h3 className="mb-3">Login Required</h3>
          <p className="mb-4">
            You cannot access the role change page without logging in
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container role-mar-top">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Change Role for {user.name}</h2>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <RoleChangeForm
            userId={user.id}
            onRequestSubmit={handleRequestSubmit}
          />
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <RoleRequestsList
            refreshTrigger={refreshFlag}
            onSelectRequest={(id) => setSelectedRequestId(id)}
          />
        </div>
      </div>

      {selectedRequestId && (
        <RoleRequestDetails
          requestId={selectedRequestId}
          onClose={() => setSelectedRequestId(null)}
          onDeleted={() => setRefreshFlag((prev) => prev + 1)}
          onUpdated={handleRequestUpdate}
        />
      )}
    </div>
  );
};

export default RoleChangePage;
