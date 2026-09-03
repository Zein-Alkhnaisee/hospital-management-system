import React, { useEffect } from "react";
import { useWalletTopup } from "./WalletTopupContext";
import { Link } from "react-router-dom";
import { useAuth } from "../Components/AuthContext/AuthContext";
import "./TopupList.css";
import "./WalletAnimations.css";

const TopupList = () => {
  const { topups, loading, error, refresh } = useWalletTopup();
  const { user } = useAuth();

  useEffect(() => {
    // Refresh list when component loads
    refresh();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: "Pending Review", className: "bg-warning text-dark" },
      approved: { text: "Approved", className: "bg-success" },
      rejected: { text: "Rejected", className: "bg-danger" },
    };

    const statusInfo = statusMap[status] || {
      text: status,
      className: "bg-secondary",
    };

    return (
      <span
        className={`wallet-topup-list-status-badge ${statusInfo.className}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="wallet-topup-list-loading wallet-fade-in">
        <div className="wallet-topup-list-spinner"></div>
        <p className="wallet-topup-list-loading-text">
          Loading top-up requests...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wallet-topup-list-error">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
        <div className="mt-3 d-flex">
          <button className="wallet-topup-list-refresh-btn" onClick={refresh}>
            <i className="bi bi-arrow-repeat me-2"></i>
            Try Again
          </button>
          <Link to="/" className="wallet-topup-form-cancel-btn">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (topups.length === 0) {
    return (
      <div className="wallet-topup-list-empty">
        <i className="bi bi-wallet2 wallet-topup-list-empty-icon"></i>
        <h4 className="wallet-topup-list-empty-title">
          No top-up requests yet
        </h4>
        <p className="wallet-topup-list-empty-text">
          You can create a new top-up request to start the process
        </p>
        <Link
          to="/wallet-topups/create"
          className="wallet-topup-list-empty-btn"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Create New Top-up Request
        </Link>
      </div>
    );
  }

  return (
    <div className="wallet-topup-list-container">
      <div className="wallet-topup-list-card wallet-card-hover wallet-fade-in">
        <div className="wallet-topup-list-card-header">
          <h5 className="wallet-topup-list-title">Previous Top-up Requests</h5>
          <div className="wallet-topup-list-header-buttons">
            <Link
              to="/wallet-topups/create"
              className="wallet-topup-list-new-btn"
            >
              <i className="bi bi-plus-circle me-1"></i> New Request
            </Link>
            <button
              className="wallet-topup-list-refresh-btn"
              onClick={refresh}
              disabled={loading}
            >
              <i className="bi bi-arrow-repeat me-1"></i> Refresh List
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table wallet-topup-list-table">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Request Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topups.map((topup) => (
                <tr key={topup.wallet_topup_id}>
                  <td className="fw-bold">{topup.wallet_topup_id}</td>
                  <td className="fw-bold text-success">
                    ${parseFloat(topup.amount).toFixed(2)}
                  </td>
                  <td>{getStatusBadge(topup.status)}</td>
                  <td>{formatDate(topup.created_at)}</td>
                  <td>
                    <Link
                      to={`/wallet-topups/${topup.wallet_topup_id}`}
                      className="wallet-topup-list-details-btn"
                    >
                      <i className="bi bi-eye me-1"></i>
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="wallet-topup-list-card-footer">
          {topups.length} request(s) - Last update:{" "}
          {new Date().toLocaleTimeString("en-US")}
        </div>
      </div>
    </div>
  );
};

export default TopupList;
