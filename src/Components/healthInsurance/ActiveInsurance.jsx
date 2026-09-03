import { deleteInsurance } from "./insuranceService";
import "./ActiveInsurance.css";

const ActiveInsurance = ({ insurance, onDelete, user }) => {
  if (!insurance || !user || user.role !== "patient") return null;

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete the active insurance? You will lose the discount benefits."
      )
    ) {
      try {
        await deleteInsurance(user, insurance.insurance_id);
        onDelete();
      } catch (error) {
        alert(error.message || "Failed to delete insurance");
      }
    }
  };

  return (
    <div className="hi-active-insurance-card">
      <div className="hi-active-insurance-header">
        <h5>Active Health Insurance</h5>
      </div>
      <div className="hi-active-insurance-body">
        <div className="row">
          <div className="col-md-8">
            <div className="hi-insurance-detail">
              <strong>Company Name:</strong> {insurance.name}
            </div>
            <div className="hi-insurance-detail">
              <strong>Coverage Percentage:</strong>{" "}
              {insurance.coverage_percentage}%
            </div>
            <div className="hi-insurance-detail">
              <strong>Valid Until:</strong> {insurance.valid_to}
            </div>
            <div className="hi-insurance-detail">
              <strong>Status:</strong>{" "}
              <span className="hi-status-badge">Active</span>
            </div>
          </div>
          <div className="col-md-4 text-end">
            <button className="hi-delete-btn" onClick={handleDelete}>
              Delete Insurance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveInsurance;
