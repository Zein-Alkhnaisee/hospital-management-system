import NavBar from "../NavBar/NavBar";
import ServicesSection from "./Services Section/ServicesSection";
import StatsSection from "./StatsSection/StatsSection";
import "./../ButtonSign/ButtonSign.css";
import "./Service.css";
import { Link } from "react-router-dom";

const Service = () => {
  return (
    <div>
      <NavBar />
      <div id="topService"></div>
      <ServicesSection />
      <StatsSection />
      <section className="cta-section">
        <h2 className="cta-heading">Need help with our services?</h2>
        <p className="cta-subtext">
          Let us know and we’ll reach out to assist you!
        </p>
        <Link
          to={"/change-role"}
          className="cta-button"
          onClick={() => {
            const el = document.getElementById("topContact");
            el?.scrollIntoView({ behavio: "smooth", block: "start" });
            window.scrollBy(0, -2000);
          }}
        >
          Communicating as a Patient
        </Link>
      </section>
    </div>
  );
};

export default Service;
