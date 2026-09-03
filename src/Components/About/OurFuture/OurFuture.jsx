import React, { useEffect, useRef, useState } from "react";
import "./OurFuture.css";
import videoz from "./../../assets/video/ourfuture.mp4";

const OurFuture = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entries]) => {
        if (entries.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.6 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div>
      <section ref={sectionRef} className="vision-future">
        <video autoPlay muted loop className="vision-video">
          <source src={videoz} type="video/mp4" />
          متصفحك لا يدعم الفيديو.
        </video>
        <div className="vision-overlay">
          <h2 className={`vision-line ${visible ? "show" : ""}`}>
            نحلم بعالمٍ لا ينتظر فيه المريضُ دورَه...
          </h2>
          <h2 className={`vision-line delay-1 ${visible ? "show" : ""}`}>
            ...بل يجد العناية تسبق الألم
          </h2>
          <h2 className={`vision-line delay-2 ${visible ? "show" : ""}`}>
            رؤيتنا: ريادةٌ إنسانيةٌ تُشفي وتُلهم
          </h2>
        </div>
      </section>
    </div>
  );
};

export default OurFuture;
