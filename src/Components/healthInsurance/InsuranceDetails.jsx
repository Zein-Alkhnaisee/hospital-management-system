import { deleteInsurance } from "./insuranceService";
import { useState } from "react";
import "./InsuranceDetails.css";

const InsuranceDetails = ({
  insurance,
  onClose,
  onEdit,
  onDeleteSuccess,
  user,
}) => {
  const [deleting, setDeleting] = useState(false);

  const getStatusText = () => {
    switch (insurance.status) {
      case "approved":
        return "Approved and Active";
      case "pending":
        return "Under Review";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        setDeleting(true);
        await deleteInsurance(user, insurance.insurance_id);
        onDeleteSuccess();
        onClose();
      } catch (error) {
        alert(error.message || "Failed to delete request");
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="hi-details-card">
      <div className="hi-details-header">
        <h5>Insurance Request Details</h5>
        <button className="hi-close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="hi-details-body">
        <div className="hi-details-row row">
          <div className="col-md-6">
            <div className="hi-detail-item">
              <strong>Request ID:</strong> {insurance.insurance_id}
            </div>
            <div className="hi-detail-item">
              <strong>Company Name:</strong> {insurance.name}
            </div>
            <div className="hi-detail-item">
              <strong>Status:</strong> {getStatusText()}
            </div>
            <div className="hi-detail-item">
              <strong>Submitted At:</strong>{" "}
              {new Date(insurance.created_at).toLocaleString()}
            </div>
          </div>
          <div className="col-md-6">
            {insurance.image_url && (
              <div className="hi-image-container">
                <img
                  src={insurance.image_url}
                  alt="Insurance document"
                  className="hi-document-image"
                />
                <a
                  href={insurance.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hi-view-image-btn"
                >
                  View Full Image
                </a>
              </div>
            )}
          </div>
        </div>

        {insurance.status === "approved" && (
          <div className="hi-status-alert">
            <div className="hi-detail-item">
              <strong>Coverage Percentage:</strong>{" "}
              {insurance.coverage_percentage}%
            </div>
            <div className="hi-detail-item">
              <strong>Valid Until:</strong> {insurance.valid_to}
            </div>
          </div>
        )}

        <div className="hi-action-buttons">
          {insurance.status === "pending" && (
            <button className="hi-edit-btn" onClick={onEdit}>
              Edit Request
            </button>
          )}

          <button
            className="hi-delete-btn"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <span className="hi-delete-spinner"></span>
                Deleting...
              </>
            ) : (
              "Delete Request"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceDetails;
