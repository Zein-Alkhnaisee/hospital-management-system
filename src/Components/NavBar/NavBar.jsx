import { useState } from "react";
import "./NavBar.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import Sidebar from "../Sidebar/Sidebar";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h2 className="navbar-icone">
            {isAuthenticated && (
              <button
                className="sidebar-toggle"
                onClick={toggleSidebar}
                aria-label="Open sidebar"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            )}
          </h2>

          <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            &#9776;
          </button>

          <ul className={`nav-links ${isOpen ? "open" : ""}`}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => {
                  const el = document.getElementById("topHome");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.scrollBy(0, -2000);
                }}
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to={"/service"}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => {
                  const el = document.getElementById("topService");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.scrollBy(0, -2000);
                }}
              >
                Service
              </NavLink>
            </li>

            <li>
              <NavLink
                to={"/about"}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => {
                  const el = document.getElementById("topAbout");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.scrollBy(0, -2000);
                }}
              >
                About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <Link
                to="/specialties"
                className={`nav-link ${
                  location.pathname.startsWith("/specialties") ? "active" : ""
                }`}
              >
                Medical departments
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default NavBar;
