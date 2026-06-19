import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PhotoCapture from "../components/PhotoCapture";
import { updateVisitorPhoto } from "../services/visitorService";

export default function CapturePhotoPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const visitorDetails =
    location.state?.visitorDetails ||
    JSON.parse(localStorage.getItem("visitorData") || "{}");

  const handleConfirmPhoto = async () => {
    if (!image) {
      alert("Please capture a photo first!");
      return;
    }

    const visitorId = visitorDetails?._id;

    console.log("visitorDetails:", visitorDetails);
    console.log("visitorId:", visitorId);

    if (!visitorId) {
      alert("Error: Server visitor ID not found. Please register again.");
      return;
    }

    setLoading(true);

    try {
      await updateVisitorPhoto(visitorId, image);

      const updatedVisitorData = {
        ...visitorDetails,
        photoUrl: image,
        photo: image,
      };

      localStorage.setItem("visitorData", JSON.stringify(updatedVisitorData));

      navigate("/success", {
        state: { visitorDetails: updatedVisitorData },
      });
    } catch (error) {
      console.error("Photo update error:", error);
      alert("Failed to link photo to server profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="v-container">
      <div className="v-card">
        <div className="v-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/register")}
          >
            ←
          </button>

          <div className="v-logo">
            Visitor<span>X</span>
          </div>

          <div className="lang-badge">🌐 EN ▾</div>
        </div>

        <div className="v-meta-head">
          <h2>Photo Capture</h2>
          <p>Please take a clear photo. Make sure your face is visible.</p>
        </div>

        <div
          className="v-body-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {!image ? (
              <PhotoCapture setImage={setImage} />
            ) : (
              <>
                <img
                  src={image}
                  alt="Captured visitor"
                  style={{
                    width: "100%",
                    maxHeight: "220px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid #ccc",
                  }}
                />

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setImage(null)}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginTop: "12px",
                  }}
                >
                  📸 Retake Photo
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            className="primary-btn"
            onClick={handleConfirmPhoto}
            disabled={loading}
            style={{
              display: "block",
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: "8px",
              marginBottom: "24px",
            }}
          >
            {loading ? "⏳ Saving Profile..." : "✓ Use Photo"}
          </button>
        </div>

        <div className="secure-notice" style={{ marginTop: "16px" }}>
          🔒 Your information is secure with us.
        </div>
      </div>
    </div>
  );
}