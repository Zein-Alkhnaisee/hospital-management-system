import { useState } from "react";
import "./QuestionStylee.css";
import { Link } from "react-router-dom";

export default function Question() {
  const [activeIndex, setActiveIndex] = useState(null);

  const questions = [
    {
      question: "How can I book an appointment?",
      answer: `"You can book an appointment by clicking the Book Now button and filling out the form, or by calling the reception number."`,
      btn: (
        <Link
          to={"/book-appointment"}
          onClick={() => {
            const el = document.getElementById("topContact");
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
            window.scrollBy(0, -2000);
          }}
        >
          Appointments
        </Link>
      ),
    },
    {
      question: "Does the hospital receive emergency cases?",
      answer: "Yes, we offer 24/7 emergency service.",
      btn: (
        <Link
          to={"/service"}
          onClick={() => {
            const el = document.getElementById("topService");
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
            window.scrollBy(0, -2000);
          }}
        >
          View services
        </Link>
      ),
    },
    {
      question: "What are the working hours?",
      answer:
        "Sunday to Thursday, 8 AM to 8 PM. Emergency services are always available.",
      btn: (
        <Link
          to={"/service"}
          onClick={() => {
            const el = document.getElementById("statsSection");
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
            window.scrollBy(0, -2700);
          }}
        >
          Show more
        </Link>
      ),
    },
    {
      question: "Is there health insurance service?",
      answer:
        "Yes, the hospital has contracts with several local and international health insurance companies, and you can submit your health insurance to get a discount by clicking on the health insurance button.",
      btn: (
        <Link
          to={"/health-insurance"}
          onClick={() => {
            const el = document.getElementById("topAbout");
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
            window.scrollBy(0, -4000);
          }}
        >
          Health insurance
        </Link>
      ),
    },
    {
      question: "Are there specialist doctors?",
      answer:
        "Yes, we have a group of elite specialist doctors. You can see each department and the doctors within it by clicking on the “View Medical Departments” button.",
      btn: (
        <Link
          to={"/specialties"}
          onClick={() => {
            const el = document.getElementById("topAbout");
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
            window.scrollBy(0, -4000);
          }}
        >
          View Medical Departments
        </Link>
      ),
    },
  ];

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-cards">
        {questions.map((item, index) => (
          <div
            key={index}
            className={`faq-card ${activeIndex === index ? "active" : ""}`}
            onClick={() => setActiveIndex(index === activeIndex ? null : index)}
          >
            <h3>{item.question}</h3>
            {activeIndex === index && (
              <p className="answer-text">{item.answer}</p>
            )}
            {activeIndex === index && item.btn}
          </div>
        ))}
      </div>
    </section>
  );
}
