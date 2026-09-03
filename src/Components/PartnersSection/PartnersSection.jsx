import "./PartnersSectionStylee.css";
import { useEffect, useRef, useState } from "react";
import img1 from "./../assets/images/red-cross.jpg";
import img2 from "./../assets/images/doctors-without-borders.jpg";
import img3 from "./../assets/images/alliance.jpg";

const partnerTestimonials = [
  {
    name: "Red Cross",
    quote:
      "We are proud to support such a professional and compassionate medical institution.",
    // نحن فخورون بدعم مثل هذه المؤسسة الطبية المهنية والعاطفية
    logo: img1,
  },
  {
    name: "Doctors Without Borders",
    quote:
      "Working together with this hospital has allowed us to expand our impact.",
    // لقد سمح لنا العمل مع هذا المشفى بتوسيع تاثيرنا
    logo: img2,
  },
  {
    name: "Health Alliance",
    quote: "This collaboration is making a real difference on the ground.",
    // التعاون يحدث فرقا حقيقيا على الارض ... التحالف الصحي
    logo: img3,
  },
];

export function PartnersSection() {
  const [index, setIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);
  // const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const startRotat = () => {
    intervalRef.current = setInterval(() => {
      setFlipping(true); // بلّش دوران
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % partnerTestimonials.length);
        setFlipping(false); // رجع للثبات
      }, 800); // خليه يلف شوي قبل التبديل
    }, 6000);
  };
  const stopRotat = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // if(isHovered)  return ;
    // if(window.innerWidth>768) {
    //   startRotat()
    // }
    startRotat();
    return () => stopRotat();
  }, []);

  const { name, quote, logo } = partnerTestimonials[index];
  const handleMouseEnter = () => {
    stopRotat();
  };
  const handleMouseLeave = () => {
    startRotat();
  };

  return (
    <div className="partner-slider">
      <h2 className="partner-title">Our Partners</h2>
      <div
        className={`partner-card-wrapper ${flipping ? "flip" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="partner-card front">
          <img src={logo} alt={name} className="partner-logo" />
          <blockquote className="partner-quote">“{quote}”</blockquote>
          <p className="partner-name">— {name}</p>
        </div>
      </div>
    </div>
  );
}
