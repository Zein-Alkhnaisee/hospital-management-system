import axios from "./../../Api/axiosInstance";

const appointmentApi = {
  // Get all specialties
  getSpecialties: () => {
    return axios.get("/specialties");
  },

  // Get doctors in a specialty
  getDoctorsBySpecialty: (specialtyId) => {
    return axios.get(`/specialties/${specialtyId}/doctors`);
  },

  // Get available slots for a doctor
  getDoctorSlots: (doctorId) => {
    return axios.get(`/doctor-available-slots/${doctorId}`);
  },

  // Book an appointment
  bookAppointment: (data) => {
    return axios.post("/appointments/book-with-balance", data);
  },

  // Get all appointments for current user
  getAppointments: () => {
    return axios.get("/appointments");
  },

  // Get a specific appointment
  getAppointment: (appointmentId) => {
    return axios.get(`/appointments/${appointmentId}`);
  },

  // Modify an appointment
  modifyAppointment: (appointmentId, data) => {
    return axios.put(`/appointments/${appointmentId}`, data);
  },

  // Cancel an appointment
  cancelAppointment: (appointmentId) => {
    return axios.delete(`/appointments/${appointmentId}`);
  },
};

export default appointmentApi;
