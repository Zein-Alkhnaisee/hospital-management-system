import { Link } from "react-router-dom";
import "./HeroStyle.css";

const Hero = () => {
  const scrollToSection = (id, offset = -100) => {
    const element = document.getElementById(id);
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="hero-app">
      <div className="over-hero">
        <div className="items-hero">
          <h2>
            Your Health is Our
            <div className="animated">
              <span className="word1 animated-items">Priority</span>
              <span className="word2 animated-items">Mission</span>
              <span className="word3 animated-items">Passion</span>
            </div>
          </h2>

          <p>
            Enjoy world-class healthcare with the latest technology and
            dedicated, compassionate doctors for your health.
          </p>

          <div className="btn-hero">
            <Link
              to="/change-role"
              className="hero-cta-button"
              onClick={() => scrollToSection("topContact")}
            >
              New Job Application
            </Link>

            <Link
              to="/specialties"
              className="more-deliats-hero"
              onClick={() => scrollToSection("topAbout")}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
