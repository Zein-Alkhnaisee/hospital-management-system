import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWalletTopup } from "./WalletTopupContext";
import TopupForm from "./TopupForm";
import "./TopupDetails.css";
import "./WalletAnimations.css";
import { toast } from "react-toastify";

const TopupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTopupDetails, deleteTopup } = useWalletTopup();
  const [topup, setTopup] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopupDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTopupDetails(id);
        setTopup(data);
      } catch (err) {
        setError(err.message || "Error loading request details");
      } finally {
        setLoading(false);
      }
    };

    fetchTopupDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      setIsDeleting(true);
      try {
        await deleteTopup(id);
        navigate("/wallet-topups");
      } catch (err) {
        setError(
          "Failed to delete request: " + (err.message || "Unknown error")
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    const fetchTopupDetails = async () => {
      setLoading(true);
      try {
        const data = await getTopupDetails(id);
        setTopup(data);
        toast.success("Wallet updated successfully");
      } catch (err) {
        console.error("Error fetching topup details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopupDetails();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
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
      <div className="wallet-topup-details-loading wallet-fade-in">
        <div className="wallet-topup-details-spinner"></div>
        <p className="wallet-topup-details-loading-text">
          Loading request details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wallet-topup-details-error">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
        <div className="mt-3">
          <button
            className="wallet-topup-details-back-btn"
            onClick={() => navigate("/wallet-topups")}
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  if (!topup) {
    return (
      <div className="wallet-topup-details-warning">
        <i className="bi bi-exclamation-circle me-2"></i>
        Request details not found
        <div className="mt-3">
          <button
            className="wallet-topup-details-back-btn"
            onClick={() => navigate("/wallet-topups")}
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  return (
    <div className="wallet-topup-details-container">
      <div className="wallet-topup-details-header wallet-fade-in">
        <h2 className="wallet-topup-details-title">
          Top-up Request Details #{topup.wallet_topup_id}
        </h2>
        <button
          className="wallet-topup-details-back-btn"
          onClick={() => navigate("/wallet-topups")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to List
        </button>
      </div>

      {isEditing ? (
        <TopupForm existingTopup={topup} onSuccess={handleEditSuccess} />
      ) : (
        <div className="wallet-topup-details-card wallet-card-hover wallet-fade-in">
          <div className="wallet-topup-details-card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-4">
                  <h5 className="text-primary">Amount</h5>
                  <p className="wallet-topup-details-amount">
                    ${parseFloat(topup.amount).toFixed(2)}
                  </p>
                </div>

                <div className="mb-4">
                  <h5 className="text-primary">Status</h5>
                  <p className="fs-4">
                    <span
                      className={`wallet-topup-details-status-badge ${
                        topup.status === "pending"
                          ? "bg-warning text-dark"
                          : topup.status === "approved"
                          ? "bg-success"
                          : topup.status === "rejected"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {getStatusText(topup.status)}
                    </span>
                  </p>
                </div>

                <div className="mb-4">
                  <h5 className="text-primary">Request Date</h5>
                  <p className="wallet-topup-details-date">
                    {formatDate(topup.created_at)}
                  </p>
                </div>

                {topup.updated_at && (
                  <div className="mb-4">
                    <h5 className="text-primary">Last Updated</h5>
                    <p className="wallet-topup-details-date">
                      {formatDate(topup.updated_at)}
                    </p>
                  </div>
                )}

                {topup.review_notes && (
                  <div className="mb-4">
                    <h5 className="text-primary">Review Notes</h5>
                    <p className="fs-5 bg-light p-3 rounded">
                      {topup.review_notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <div className="mb-4">
                  <h5 className="text-primary">Receipt Image</h5>
                  <div className="wallet-topup-details-image-container">
                    <img
                      src={topup.receipt_image_url}
                      alt="Receipt"
                      className="wallet-topup-details-image"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <a
                      href={topup.receipt_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wallet-topup-details-view-btn"
                    >
                      <i className="bi bi-zoom-in me-2"></i>
                      View Full Size
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {topup.status === "pending" && (
              <div className="wallet-topup-details-actions">
                <button
                  className="wallet-topup-details-edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit Request
                </button>

                <button
                  className="wallet-topup-details-delete-btn"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="spinner-border spinner-border-sm me-1"></span>
                  ) : null}
                  <i className="bi bi-trash me-2"></i>
                  Delete Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopupDetails;
