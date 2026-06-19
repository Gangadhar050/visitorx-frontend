import { useLocation, useNavigate } from "react-router-dom";
import VisitorForm from "../components/VisitorForm";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const editMode = location.state?.editMode || false;
  const visitorData = location.state?.visitorData || null;

  const handleFormSubmission = (savedServerRecord) => {
    if (editMode) {
      navigate("/admin");
      return;
    }

    const savedLogs = localStorage.getItem("globalVisitorsList");
    const activeLogs = savedLogs ? JSON.parse(savedLogs) : [];

    activeLogs.unshift(savedServerRecord);
    localStorage.setItem("globalVisitorsList", JSON.stringify(activeLogs));

    localStorage.setItem("visitorData", JSON.stringify(savedServerRecord));

    navigate("/capture", { state: { visitorDetails: savedServerRecord } });
  };

  return (
    <div className="v-container">
      <div className="v-card">
        <div className="v-header">
          <button className="back-btn" onClick={() => navigate(editMode ? "/admin" : "/")}>
            ←
          </button>

          <div className="v-logo" onClick={() => navigate("/admin")}>
            Visitor<span>X</span>
          </div>

          <div className="lang-badge">🌐 EN ▾</div>
        </div>

        <div className="v-meta-head">
          <h2>{editMode ? "Update Visitor" : "Visitor Registration"}</h2>
          <p>{editMode ? "Edit visitor details" : "Please enter your details"}</p>
        </div>

        <div className="v-body-content">
          <VisitorForm
            onSubmit={handleFormSubmission}
            editMode={editMode}
            visitorData={visitorData}
          />
        </div>

        <div className="secure-notice">
          🔒 Your information is secure with us.
        </div>
      </div>
    </div>
  );
}