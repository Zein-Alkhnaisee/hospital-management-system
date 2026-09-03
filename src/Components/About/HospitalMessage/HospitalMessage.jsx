import "./HospitalMessageStylee.css";
import video from "./../../assets/video/messagehospital.mp4";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
const HospitalMessage = () => {
  const fullText =
    "Our message: Providing humanitarian health care with international standards";
  const [displayText, setDisplayText] = useState("");

  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && indexRef.current < fullText.length) {
      intervalRef.current = setInterval(() => {
        indexRef.current++;

        setDisplayText(fullText.slice(0, indexRef.current));

        if (indexRef.current >= fullText.length) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 100);
    }

    if (!inView && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [inView]);

  return (
    <div>
      <section className="mission-section" ref={ref}>
        <video autoPlay muted loop className="background-video">
          <source src={video} type="video/mp4" />
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
        <div className="overlay">
          <h2 className="typing-text">
            {displayText}
            {indexRef.current < fullText.length && (
              <span className="cursor"> </span>
            )}
          </h2>
          <div className="icon-row">
            <div className="icon-card">care</div>
            <div className="icon-card">trust</div>
            <div className="icon-card">Humanity</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HospitalMessage;
