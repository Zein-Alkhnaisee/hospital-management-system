import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Api/axiosInstance";
import "./Seminars.css";
import { toast } from "react-toastify";

const RegistrationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seminars, setSeminars] = useState([]);
  const [selectedSeminar, setSelectedSeminar] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch registration details
        const regResponse = await axios.get(`/seminar-registrations/${id}`);
        setRegistration(regResponse.data.data);

        // Fetch all seminars for update form
        const semResponse = await axios.get("/seminars");
        setSeminars(semResponse.data.data);
        setSelectedSeminar(regResponse.data.data.seminar_id);
      } catch (err) {
        setError("Failed to fetch registration details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await axios.put(`/seminar-registrations/${id}`, {
        seminar_id: selectedSeminar,
      });
      toast.success("Registration updated successfully!");
      setShowUpdateForm(false);
      // Refresh data
      const response = await axios.get(`/seminar-registrations/${id}`);
      setRegistration(response.data.data);
    } catch (err) {
      alert(
        "Update failed: " +
          (err.response?.data?.message || "Something went wrong")
      );
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to cancel this registration?"))
      return;

    try {
      setDeleting(true);
      await axios.delete(`/seminar-registrations/${id}`);
      toast.success("Registration canceled successfully");
      navigate("/my-seminars");
    } catch (err) {
      alert(
        "Cancellation failed: " +
          (err.response?.data?.message || "Something went wrong")
      );
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleViewDoctor = () => {
    alert("Doctor profile will be available soon");
  };

  if (loading) {
    return (
      <div className="seminarpage-loading seminarpage-fade-in">
        <div className="seminarpage-spinner"></div>
        <p className="seminarpage-loading-text">
          Loading registration details...
        </p>
      </div>
    );
  }
  if (error) return <div className="error">{error}</div>;
  if (!registration) return <div className="error">Registration not found</div>;

  const seminar = registration.seminar;
  const registrationDate = new Date(registration.created_at).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="registration-detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate("/my-seminars")}>
          <i className="fas fa-arrow-left"></i> Back to My Seminars
        </button>

        <div className="registration-header">
          <h1>Registration Details</h1>
          <div className="registration-id">
            Registration ID: #{registration.registration_id}
          </div>
        </div>

        <div className="registration-content">
          <div className="seminar-info">
            <div className="seminar-image-container">
              {seminar.image_url && (
                <img
                  src={seminar.image_url}
                  alt={seminar.title}
                  className="seminar-image"
                />
              )}
            </div>

            <div className="seminar-details">
              <h2 className="seminar-title">{seminar.title}</h2>

              <div className="detail-item">
                <i className="fas fa-calendar-alt"></i>
                <div>
                  <h3>Seminar Date</h3>
                  <p>
                    {new Date(seminar.date).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="detail-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Location</h3>
                  <p>
                    {seminar.type === "online"
                      ? "Online Seminar"
                      : seminar.location}
                  </p>
                </div>
              </div>

              <div className="detail-item">
                <i className="fas fa-user-md"></i>
                <div>
                  <h3>Presenter</h3>
                  <p>Dr. Ahmed Mohamed</p>
                  <button className="doctor-btn" onClick={handleViewDoctor}>
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="registration-details">
            <h2>Registration Information</h2>

            <div className="detail-item">
              <i className="fas fa-calendar-check"></i>
              <div>
                <h3>Registration Date</h3>
                <p>{registrationDate}</p>
              </div>
            </div>

            <div className="detail-item">
              <i className="fas fa-money-bill-wave"></i>
              <div>
                <h3>Paid Amount</h3>
                <p className="paid-amount">{registration.paid_amount} SAR</p>
              </div>
            </div>

            <div className="detail-item">
              <i className="fas fa-ticket-alt"></i>
              <div>
                <h3>Registration Status</h3>
                <p className="status active">Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          {!showUpdateForm ? (
            <>
              <button
                className="update-btn"
                onClick={() => setShowUpdateForm(true)}
              >
                <i className="fas fa-edit"></i> Update Registration
              </button>
              <button
                className="delete-btn"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  "Canceling..."
                ) : (
                  <>
                    <i className="fas fa-trash-alt"></i> Cancel Registration
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="update-form">
              <h3>Update Registration</h3>
              <p>Choose a new seminar to register for:</p>

              <div className="form-group">
                <label>Seminar:</label>
                <select
                  value={selectedSeminar}
                  onChange={(e) => setSelectedSeminar(e.target.value)}
                  disabled={updating}
                >
                  {seminars.map((sem) => (
                    <option key={sem.seminar_id} value={sem.seminar_id}>
                      {sem.title} - {new Date(sem.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button
                  className="btn save-btn"
                  onClick={handleUpdate}
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="btn cancel-btn"
                  onClick={() => setShowUpdateForm(false)}
                  disabled={updating}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetailPage;
