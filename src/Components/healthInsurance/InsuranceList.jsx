import { deleteInsurance } from "./insuranceService";
import { useState } from "react";
import "./InsuranceList.css";

const InsuranceList = ({
  insurances,
  activeId,
  onSelect,
  onDeleteSuccess,
  user,
}) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      try {
        setDeletingId(id);
        await deleteInsurance(user, id);
        onDeleteSuccess();
      } catch (error) {
        alert(error.message || "فشل في حذف الطلب");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="hi-status-badge hi-status-approved">Approved</span>
        );
      case "pending":
        return (
          <span className="hi-status-badge hi-status-pending">Pending</span>
        );
      case "rejected":
        return (
          <span className="hi-status-badge hi-status-rejected">Rejected</span>
        );
      default:
        return <span className="hi-status-badge">غير معروف</span>;
    }
  };

  if (insurances.length === 0) {
    return (
      <div className="hi-empty-message">
        You do not have any health insurance request.
      </div>
    );
  }

  return (
    <div className="hi-list-card">
      <div className="hi-list-header">
        <h5>Previous Insurance Requests</h5>
      </div>
      <div className="hi-list-body">
        <ul className="hi-list-group">
          {insurances.map((insurance) => (
          <li
            key={insurance.insurance_id}
            className={`hi-list-item ${
              insurance.insurance_id === activeId ? "active" : ""
            }`}
            onClick={() => onSelect(insurance)}
          >
            <div className="hi-item-content">
              <div className="hi-item-main">
                <h6 className="hi-item-title">
                  {insurance.name}
                  {insurance.insurance_id === activeId && (
                    <span className="hi-active-badge">Active</span>
                  )}
                </h6>
                <div className="hi-item-meta">
                  {getStatusBadge(insurance.status)}
                  <span className="hi-date-text">
                    {new Date(insurance.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
          
              <div className="hi-actions">
                <button
                  className="hi-view-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(insurance);
                  }}
                >
                  View
                </button>

                <button
                  className="hi-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(insurance.insurance_id);
                  }}
                  disabled={deletingId === insurance.insurance_id}
                >
                  {deletingId === insurance.insurance_id ? (
                    <>
                      <span className="hi-delete-spinner"></span>
                      Deleting ...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InsuranceList;
