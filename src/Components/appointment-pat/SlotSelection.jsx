import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./SlotSelection.css";

const SlotSelection = ({ doctorId, onSelect, onBack }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { axios } = useAuth();

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setError("");
        setLoading(true);
        console.log("Fetching slots for doctor ID:", doctorId);

        const response = await axios.get(`/doctor-available-slots/${doctorId}`);
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
          if (response.data.length > 0) {
            setSlots(response.data);
          } else {
            setError("No available time slots for this doctor at the moment.");
          }
        } else {
          setError("Unexpected response format from server.");
          console.error("Unexpected response format:", response.data);
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        let errorMessage = "Error loading available slots. ";

        if (err.response) {
          console.error("Error response:", err.response);
          if (err.response.status === 404) {
            errorMessage += "Doctor not found or no slots available.";
          } else if (err.response.status === 500) {
            errorMessage += "Server error. Please try again later.";
          } else {
            errorMessage += `Server returned status ${err.response.status}.`;
          }
        } else if (err.request) {
          errorMessage +=
            "No response from server. Please check your connection.";
        } else {
          errorMessage += err.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchSlots();
    } else {
      setError("Doctor ID is missing.");
      setLoading(false);
    }
  }, [axios, doctorId]);

  const formatTime = (time) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group slots by date
  const groupedSlots = slots.reduce((groups, slot) => {
    const date = slot.availability_date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(slot);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading available time slots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <div className="button-group">
          <button className="btn" onClick={onBack}>
            Choose Another Doctor
          </button>
          <button className="btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="slot-selection">
      <div className="header-with-back">
        <button className="back-button" onClick={onBack}>
          &larr; Back
        </button>
        <h2>Select a Time Slot</h2>
      </div>

      {Object.keys(groupedSlots).length > 0 ? (
        <div className="all-slots-container">
          {Object.entries(groupedSlots).map(([date, dateSlots]) => (
            <div key={date} className="date-group">
              <h3 className="date-header">{formatDate(date)}</h3>
              <div className="time-slots-grid">
                {dateSlots.map((slot) => (
                  <div
                    key={slot.availability_id}
                    className="time-slot-card"
                    onClick={() => onSelect(slot)}
                  >
                    <div className="slot-time">{formatTime(slot.start)}</div>
                    <div className="slot-details">
                      <span>{slot.duration} minutes</span>
                      <span className="price">${slot.paid_amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-slots">
          <p>No available time slots for this doctor at the moment.</p>
          <button className="btn" onClick={onBack}>
            Choose Another Doctor
          </button>
        </div>
      )}
    </div>
  );
};

export default SlotSelection;
