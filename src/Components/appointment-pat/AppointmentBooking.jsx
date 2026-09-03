import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpecialtySelection from "./SpecialtySelection";
import DoctorSelection from "./DoctorSelection";
import SlotSelection from "./SlotSelection";
import BookingSummary from "./BookingSummary";
import { useAuth } from "./../AuthContext/AuthContext";
import "./AppointmentBooking.css";

const AppointmentBooking = () => {
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { axios } = useAuth();
  const navigate = useNavigate();

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

  const handleBookAppointment = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/appointments/book-with-balance", {
        availability_id: selectedSlot.availability_id,
        start: selectedSlot.start,
      });

      navigate(`/appointments/${response.data.appointment.appointment_id}`, {
        state: {
          successMessage: "Appointment booked successfully!",
          appointment: response.data.appointment,
        },
      });
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="appointment-booking-container">
      <div className="booking-header">
        <h1>Book a Medical Appointment</h1>
        <div className="booking-stepper">
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
      </div>

      <div className="booking-content">
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
          <BookingSummary
            specialty={selectedSpecialty}
            doctor={selectedDoctor}
            slot={selectedSlot}
            onBook={handleBookAppointment}
            onBack={() => setStep(3)}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;
