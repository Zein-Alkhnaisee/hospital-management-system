import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import SpecialtySelection from "./SpecialtySelection";
import DoctorSelection from "./DoctorSelection";
import SlotSelection from "./SlotSelection";
import appointmentApi from "./appointmentApi";
import "./ModifyAppointment.css";

const ModifyAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios } = useAuth();

  const [step, setStep] = useState(1);
  const [appointment, setAppointment] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modifying, setModifying] = useState(false);
  const [error, setError] = useState("");

  // جلب بيانات الموعد الحالي
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await appointmentApi.getAppointment(id);
        if (response.data && response.data.data) {
          setAppointment(response.data.data);
        } else {
          setError("Failed to load appointment details.");
        }
      } catch (err) {
        setError("Error loading appointment details. Please try again later.");
        console.error("Error fetching appointment:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, axios]);

  const handleSpecialtySelect = (specialty) => {
    setSelectedSpecialty(specialty);
    setStep(2);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(3);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(4);
  };

  // دالة تعديل الموعد
  const handleModifyAppointment = async () => {
    if (!selectedSlot) {
      setError("Please select a time slot.");
      return;
    }

    setModifying(true);
    setError("");

    try {
      // 1.  إلغاء الموعد القديم
      await appointmentApi.cancelAppointment(id);

      // 2.  حجز الموعد الجديد
      const response = await appointmentApi.bookAppointment({
        availability_id: selectedSlot.availability_id,
        start: selectedSlot.start,
      });

      // 3. إعادة التوجيه إلى صفحة المواعيد مع رسالة نجاح
      navigate("/appointments", {
        state: {
          successMessage: "Appointment modified successfully!",
          newAppointment: response.data.appointment,
        },
      });
    } catch (err) {
      console.error("Modification error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to modify appointment. Please try again."
      );
    } finally {
      setModifying(false);
    }
  };

  if (loading) {
    return (
      <div className="modify-appointment-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="modify-appointment-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => navigate("/appointments")}>
            Back to Appointments
          </button>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modify-appointment-container">
      <div className="modify-header">
        <button
          className="back-button"
          onClick={() => navigate("/appointments")}
        >
          &larr; Back to Appointments
        </button>
        <h1>Modify Appointment</h1>
        <p>Change your appointment details</p>
      </div>

      {appointment && (
        <div className="current-appointment">
          <h3>Current Appointment Details</h3>
          <div className="appointment-info">
            <p>
              <strong>Date:</strong>{" "}
              {new Date(appointment.appointment_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(appointment.appointment_date).toLocaleTimeString()}
            </p>
            <p>
              <strong>Doctor:</strong> Dr. {appointment.doctor_name}
            </p>
            <p>
              <strong>Specialty:</strong> {appointment.specialty_name}
            </p>
          </div>
        </div>
      )}

      <div className="modify-stepper">
        <div className={`step ${step >= 1 ? "active" : ""}`}>
          <span>1</span>
          <p>Specialty</p>
        </div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>
          <span>2</span>
          <p>Doctor</p>
        </div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>
          <span>3</span>
          <p>Time</p>
        </div>
        <div className={`step ${step >= 4 ? "active" : ""}`}>
          <span>4</span>
          <p>Confirm</p>
        </div>
      </div>

      <div className="modify-content">
        {step === 1 && <SpecialtySelection onSelect={handleSpecialtySelect} />}

        {step === 2 && selectedSpecialty && (
          <DoctorSelection
            specialtyId={selectedSpecialty.specialty_id}
            onSelect={handleDoctorSelect}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && selectedDoctor && (
          <SlotSelection
            doctorId={selectedDoctor.doctor_id}
            onSelect={handleSlotSelect}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && selectedSlot && (
          <div className="modify-summary">
            <h3>New Appointment Details</h3>
            <div className="summary-details">
              <p>
                <strong>Specialty:</strong> {selectedSpecialty.name}
              </p>
              <p>
                <strong>Doctor:</strong> Dr. {selectedDoctor.name}
              </p>
              <p>
                <strong>Date:</strong> {selectedSlot.availability_date}
              </p>
              <p>
                <strong>Time:</strong> {selectedSlot.start}
              </p>
              <p>
                <strong>Duration:</strong> {selectedSlot.duration} minutes
              </p>
              <p>
                <strong>Price:</strong> ${selectedSlot.paid_amount}
              </p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modify-actions">
              <button
                className="back-button"
                onClick={() => setStep(3)}
                disabled={modifying}
              >
                Back
              </button>
              <button
                className="modify-button"
                onClick={handleModifyAppointment}
                disabled={modifying}
              >
                {modifying ? (
                  <>
                    <span className="spinner"></span> Modifying...
                  </>
                ) : (
                  "Confirm Changes"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModifyAppointment;
