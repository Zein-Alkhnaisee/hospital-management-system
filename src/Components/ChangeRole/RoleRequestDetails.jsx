import React, { useEffect, useState } from "react";
import axios from "../../Api/axiosInstance";
import EditRoleRequestForm from "./EditRoleRequestForm";
import { toast } from "react-toastify";

const RoleRequestDetails = ({ requestId, onClose, onDeleted, onUpdated }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/role-requests/${requestId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDetails(res.data);
    } catch (err) {
      setError("Failed to fetch request details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      fetchDetails();
    }
  }, [requestId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;
    try {
      await axios.delete(`/role-requests/${requestId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Request deleted successfully");
      onDeleted();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete request");
    }
  };

  const handleUpdateSuccess = () => {
    fetchDetails();
    setShowEditForm(false);
    if (onUpdated) onUpdated();
  };

  if (!requestId) return null;

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
    <div className="border p-3 mt-3 bg-light rounded">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={onClose}
        style={{ borderColor: "#6c757d", color: "#ffffff" }}
      >
        <i className="bi bi-x-circle me-1"></i> Close Details
      </button>

      {loading && <p>Loading details...</p>}
      {error && <p className="text-danger">{error}</p>}

      {details && !showEditForm && (
        <div>
          <h4>Request Details #{details.role_request?.request_id}</h4>

          <div className="mb-3">
            <strong>Request Information:</strong>
            <p>
              Requested Role: {getRoleText(details.role_request?.target_role)}
            </p>
            <p>
              Status:{" "}
              <span
                className={`badge bg-${getStatusColor(
                  details.role_request?.status
                )}`}
              >
                {getStatusText(details.role_request?.status)}
              </span>
            </p>
            <p>
              Created At:{" "}
              {new Date(details.role_request?.created_at).toLocaleString()}
            </p>
          </div>

          <div className="mb-3">
            <strong>Role Details:</strong>

            {details.role_request?.target_role === "receptionist" && (
              <>
                <p>
                  <strong>Hospital Name:</strong>{" "}
                  {details.details.hospital_name}
                </p>
                <p>
                  <strong>Job Number:</strong> {details.details.job_number}
                </p>
                <p>
                  <strong>Current Receptionist:</strong>{" "}
                  {details.details.current_receptionist || "None"}
                </p>
              </>
            )}

            {details.role_request?.target_role === "doctor" && (
              <>
                <p>
                  <strong>Specialty:</strong> {details.details.speciality}
                </p>
                <p>
                  <strong>License Number:</strong>{" "}
                  {details.details.license_number}
                </p>
                <p>
                  <strong>License Location:</strong>{" "}
                  {details.details.license_location}
                </p>
                <p>
                  <strong>License Date:</strong> {details.details.license_date}
                </p>
              </>
            )}

            {details.role_request?.target_role === "patient" && (
              <>
                <p>
                  <strong>Insurance Number:</strong>{" "}
                  {details.details.insurance_number}
                </p>
                <p>
                  <strong>Insurance Provider:</strong>{" "}
                  {details.details.insurance_provider}
                </p>
              </>
            )}
          </div>

          <div className="d-flex gap-2">
            {details.role_request?.status === "pending" && (
              <button
                className="btn btn-warning me-2"
                onClick={() => setShowEditForm(true)}
                style={{ backgroundColor: "#ffc107", borderColor: "#ffc107" }}
              >
                <i className="bi bi-pencil me-1"></i> Edit Request
              </button>
            )}

            <button
              className="btn btn-danger"
              onClick={handleDelete}
              style={{ backgroundColor: "#dc3545", borderColor: "#dc3545" }}
            >
              <i className="bi bi-trash me-1"></i> Delete Request
            </button>
          </div>
        </div>
      )}

      {showEditForm && details && (
        <EditRoleRequestForm
          requestId={requestId}
          roleType={details.role_request?.target_role}
          initialData={details.details}
          onUpdateSuccess={handleUpdateSuccess}
          onCancel={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
};

export default RoleRequestDetails;
