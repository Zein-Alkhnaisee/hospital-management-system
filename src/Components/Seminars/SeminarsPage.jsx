import React, { useState, useEffect } from "react";
import axios from "../../Api/axiosInstance";
import SeminarCard from "./SeminarCard";
import "./Seminars.css";

const SeminarsPage = () => {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        const response = await axios.get("/seminars");
        setSeminars(response.data.data);
      } catch (err) {
        setError("Failed to fetch seminars");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeminars();
  }, []);

  if (loading) {
    return (
      <div className="seminarpage-loading seminarpage-fade-in">
        <div className="seminarpage-spinner"></div>
        <p className="seminarpage-loading-text">Loading seminars...</p>
      </div>
    );
  }
  if (error) return <div className="error">{error}</div>;

  return (
    <section className="seminars-page">
      <div className="container">
        <h1 className="page-title">Medical Seminars</h1>
        <p className="page-subtitle">
          Join our seminars and enhance your knowledge
        </p>

        <div className="seminars-grid">
          {seminars.map((seminar) => (
            <SeminarCard key={seminar.seminar_id} seminar={seminar} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeminarsPage;
