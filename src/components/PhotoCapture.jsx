import Webcam from "react-webcam";
import { useRef } from "react";

export default function PhotoCapture({ setImage }) {
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      alert("Unable to capture image. Please allow camera access.");
      return;
    }

    setImage(imageSrc);
  };

  const videoConstraints = {
    width: 280,
    height: 220,
    facingMode: "user",
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "16px",
          border: "1px solid #ddd",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          style={{
            width: "100%",
            height: "260px",
            objectFit:"cover",
            display: "block",
          }}
          onUserMedia={() => {
            console.log("Camera started");
          }}
          onUserMediaError={(err) => {
            console.error("Camera Error:", err);
            alert(
              "Camera access denied. Please allow camera permission and refresh the page."
            );
          }}
        />
      </div>

      <button
        type="button"
        className="secondary-btn"
        onClick={capture}
        style={{
          width: "100%",
          padding: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        📸 Capture Photo
      </button>
    </>
  );
}