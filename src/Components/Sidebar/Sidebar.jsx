import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const {
    logout,
    user,
    loading,
    axios: axiosInstance,
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  // جلب أدوار المستخدم
  useEffect(() => {
    const fetchUserRoles = async () => {
      if (isAuthenticated && isOpen) {
        setRolesLoading(true);
        try {
          console.log("جلب أدوار المستخدم...");
          const response = await axiosInstance.get("/me/roles");
          console.log("استجابة الأدوار:", response.data);
          setUserRoles(response.data.roles || []);
        } catch (error) {
          console.error("فشل في جلب أدوار المستخدم:", error);
          setUserRoles([]);
        } finally {
          setRolesLoading(false);
        }
      }
    };

    fetchUserRoles();
  }, [isAuthenticated, isOpen, axiosInstance]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest(".sidebar")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (loading) {
    return (
      <div className={`sidebar-overlay ${isOpen ? "open" : ""}`}>
        <div className="sidebar">
          <div className="spinner-container-sidebar">
            <span className="spinner-border spinner-border-sm me-2"></span>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // تحديد العناصر المعروضة بناء على الأدوار
  const hasAdminRole = userRoles.includes("admin");
  const hasDoctorRole = userRoles.includes("doctor");
  const hasReceptionistRole = userRoles.includes("receptionist");
  const hasPatientRole = userRoles.includes("patient");
  const hasNoRoles = userRoles.length === 0;

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={onClose}>
            &times;
          </button>
          <div className="user-info-sidebar">
            <div className="avatar-sidebar">
              {user?.photo ? (
                <img
                  src={user.photo}
                  className="rounded-circle"
                  width="50"
                  height="50"
                  alt={user.name}
                />
              ) : (
                <i className="bi bi-person fs-3"></i>
              )}
            </div>
            <div className="user-details-sidebar">
              <div className="fw-bold">{user?.name}</div>
              <small className="text-muted">
                {user?.email || "example@domain.com"}
              </small>
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          {rolesLoading ? (
            <div className="text-center p-3">
              <span className="spinner-border spinner-border-sm me-2"></span>
              Bring data...
            </div>
          ) : (
            <ul className="sidebar-menu">
              {/* العناصر الأساسية للجميع */}
              <li>
                <Link
                  to="/user-profile"
                  className="sidebar-item"
                  onClick={onClose}
                >
                  <i className="bi bi-person-circle text-primary me-2"></i>
                  Profile
                </Link>
              </li>

              {/* العناصر للمستخدمين بدون أدوار أو المرضى */}
              {(hasNoRoles || hasPatientRole) && (
                <>
                  <li>
                    <Link
                      to="/change-role"
                      className="sidebar-item"
                      onClick={onClose}
                    >
                      <i className="bi bi-arrow-left-right text-info me-2"></i>
                      Role Request
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/wallet-topups"
                      className="sidebar-item"
                      onClick={onClose}
                    >
                      <i className="bi bi-cash-stack text-success me-2"></i>
                      Wallet Top-up
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/my-seminars"
                      className="sidebar-item"
                      onClick={onClose}
                    >
                      <i className="bi bi-collection-play text-success me-2"></i>
                      My Seminars
                    </Link>
                  </li>
                </>
              )}

              {/* العناصر الخاصة بالمريض */}
              {hasPatientRole && (
                <>
                  <li>
                    <Link
                      to="/health-insurance"
                      className="sidebar-item"
                      onClick={onClose}
                    >
                      <i className="bi bi-shield-plus text-danger me-2"></i>
                      Health Insurance
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/appointments"
                      className="sidebar-item"
                      onClick={onClose}
                    >
                      <i className="bi bi-calendar-check text-primary me-2"></i>
                      My appointments
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/prescriptions"
                      className="sidebar-item"
                      onClick={onClose}
                    >
                      <i className="bi bi-file-medical text-warning me-2"></i>
                      Medical Records
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/invoices"
                      className="sidebar-item"
                      onClick={onClose}
                    >
                      <i className="bi bi-receipt text-info me-2"></i>
                      Invoices
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/payments"
                      className="sidebar-item"
                      onClick={onClose}
                    >
                      <i className="bi bi-credit-card text-success me-2"></i>
                      Payments
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}

          <div className="sidebar-actions">
            {/* <div className="d-flex justify-content-around mb-3">
              <button
                className="btn btn-sm btn-outline-secondary rounded-pill"
                title="Toggle theme"
              >
                <i className="bi bi-moon-stars"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-secondary rounded-pill"
                title="Change language"
              >
                <i className="bi bi-translate"></i>
              </button>
            </div> */}

            {/* لوحة التحكم للمسؤولين والأطباء وموظفي الاستقبال */}
            {(hasAdminRole || hasDoctorRole || hasReceptionistRole) && (
              <li>
                <a
                  href="http://127.0.0.1:8000/admin/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-item text-warning admin-panel-btn"
                  onClick={onClose}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Admin Panel
                </a>
              </li>
            )}

            <button
              onClick={handleLogout}
              className="sidebar-item text-danger logout-btn"
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
