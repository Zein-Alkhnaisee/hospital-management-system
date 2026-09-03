import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";

const RoleRequestsList = ({ refreshTrigger, onSelectRequest }) => {
  const { user, axios } = useAuth();
  const [requests, setRequests] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    axios
      .get(`/role-requests?userId=${user.id}`)
      .then((res) => {
        setRequests(res.data.requests || []);
        setSelectedId(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load requests");
      })
      .finally(() => setLoading(false));
  }, [refreshTrigger, user, axios]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;
    setDeleteLoading(true);
    setError(null);
    try {
      await axios.delete(`/role-requests/${id}`);
      setRequests((prev) => prev.filter((r) => r.request_id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete request");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "doctor":
        return "Doctor";
      case "receptionist":
        return "Receptionist";
      case "patient":
        return "Patient";
      default:
        return role;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="role-requests-list">
      <h3 className="mb-3">Role Change Requests</h3>

      {error && (
        <div className="alert alert-danger mb-3">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : requests.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          There are no role change requests at the moment
        </div>
      ) : (
        <div className="list-group">
          {requests.map((req) => (
            <div
              key={req.request_id}
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                selectedId === req.request_id ? "active" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedId(req.request_id);
                onSelectRequest(req.request_id);
              }}
            >
              <div>
                <span className="fw-bold">Request #{req.request_id}</span>
                <span className="mx-2">-</span>
                <span className="badge bg-info">
                  {getRoleText(req.target_role)}
                </span>
                <span className="mx-2">-</span>
                <span className={`badge bg-${getStatusColor(req.status)}`}>
                  {getStatusText(req.status)}
                </span>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(req.request_id);
                    onSelectRequest(req.request_id);
                  }}
                  style={{ backgroundColor: "#0d6efd", borderColor: "#0d6efd" }}
                >
                  <i className="bi bi-eye me-1"></i> View
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(req.request_id);
                  }}
                  disabled={deleteLoading}
                  style={{ backgroundColor: "#dc3545", borderColor: "#dc3545" }}
                >
                  {deleteLoading ? (
                    <span className="spinner-border spinner-border-sm me-1"></span>
                  ) : (
                    <i className="bi bi-trash me-1"></i>
                  )}
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleRequestsList;
