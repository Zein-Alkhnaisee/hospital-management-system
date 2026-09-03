import "./ServicesSectionStylee.css";
import { useState } from "react";
import { useAuth } from "../../AuthContext/AuthContext";

import {
  FaStethoscope,
  FaFlask,
  FaAmbulance,
  FaHeartbeat,
  FaUserNurse,
  FaNotesMedical,
} from "react-icons/fa";
import img1 from "./../../assets/images/1746108227843.jpg";
import img2 from "./../../assets/images/car.jpg";
import img3 from "./../../assets/images/1746111149891.jpg";
import img4 from "./../../assets/images/doctor/CardiacCare.jpg";
import img5 from "./../../assets/images/doctor/HomeNursing.jpg";
import img6 from "./../../assets/images/doctor/MedicalRecords.jpg";

const allServices = [
  {
    title: "Outpatient Clinics",
    desc: "Comprehensive medical consultations and follow-ups across various specialties.",
    icon: FaStethoscope,
    image: img1,
    class: "one",
    catagory: "Clinical",
  },
  {
    title: "Laboratory Tests",
    desc: "Accurate diagnostic services with rapid turnaround times.",
    icon: FaFlask,
    image: img2,
    class: "two",
    catagory: "Clinical",
  },
  {
    title: "Emergency Department",
    desc: "24/24 emergency care for critical and urgent conditions.",
    icon: FaAmbulance,
    image: img3,
    class: "three",
    catagory: "Emergency",
  },
  {
    title: "Cardiac Care",
    desc: "Advanced treatment and monitoring for heart-related conditions.",
    icon: FaHeartbeat,
    image: img4,
    class: "four",
    catagory: "Clinical",
  },
  {
    title: "Home Nursing",
    desc: "Professional nursing services delivered to patients’ homes.",
    icon: FaUserNurse,
    image: img5,
    class: "five",
    catagory: "Support",
  },
  {
    title: "Medical Records",
    desc: "Efficient management of patient data with confidentiality.",
    icon: FaNotesMedical,
    image: img6,
    class: "sex",
    catagory: "Clinical",
  },
];

export default function ServicesSection() {
  const [filter, setFilter] = useState("All");
  const filterServices =
    filter === "All"
      ? allServices
      : allServices.filter((service) => service.catagory === filter);
  const filters = ["All", "Clinical", "Emergency", "Support"];
  const isAuthenticated = useAuth();

  return (
    <div
      className={`services-section ${
        isAuthenticated ? "width-navbar" : "widthout-navbar"
      }`}
    >
      <h2 className="services-title">Our Servicse</h2>
      <div className="services-filters">
        {filters.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`filter-btn ${filter === cat ? "active" : ""}`}
          >
            {" "}
            {cat}
          </button>
        ))}
      </div>
      <div className="services-grid">
        {filterServices.map((service, index) => (
          <div key={index} className="service-card">
            <div className={`service-overlay ${service.class}`}>
              <service.icon className="service-icon" />
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
