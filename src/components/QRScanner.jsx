import React, { useState } from 'react';
import './global.css';

export default function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const toggleScanner = () => {
    setIsScanning(!isScanning);
    if (!isScanning) {
      // Mocking a successful scan event for visual confirmation
      setTimeout(() => {
        setScanResult({
          name: 'Ravi Kumar',
          phone: '9876543210',
          purpose: 'Interview',
          time: '03 Jun 2026, 03:45 PM'
        });
        setIsScanning(false);
      }, 3000);
    }
  };

  const clearResult = () => {
    setScanResult(null);
  };

  return (
    <div className="scanner-page-container">
      {/* Title Header Card */}
      <div className="table-card" style={{ marginBottom: '24px' }}>
        <div className="scanner-header-block">
          <h2>📱 QR Code Verification Terminal</h2>
          <p>Scan visitor confirmation passes using your device's camera portal.</p>
        </div>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="scanner-workspace-layout">
        
        {/* Left Side: Camera Feed Box */}
        <div className="table-card scanner-box-card">
          <h3>Camera Viewport</h3>
          <div className={`camera-view-window ${isScanning ? 'active-scanning' : ''}`}>
            {isScanning ? (
              <div className="scanner-laser-line-wrapper">
                <div className="scanning-laser-line" />
                <span className="camera-icon-placeholder">🎥</span>
                <p>Initializing lens... Align QR pass inside the frame</p>
              </div>
            ) : (
              <div className="scanner-idle-state">
                <span className="camera-icon-placeholder">📷</span>
                <p>Camera feed is currently offline</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={toggleScanner} 
            className={`add-btn scanner-toggle-trigger ${isScanning ? 'scanning-stop-btn' : ''}`}
          >
            {isScanning ? '🛑 Disconnect Camera' : '✨ Activate Device Camera'}
          </button>
        </div>

        {/* Right Side: Validation Results Panel */}
        <div className="table-card scanner-box-card">
          <h3>Verification Log Output</h3>
          
          {scanResult ? (
            <div className="scan-result-success-box">
              <div className="success-badge-title">✅ Pass Verified Successfully</div>
              
              <div className="result-data-list">
                <div className="result-data-row">
                  <span className="row-label">Visitor Name:</span>
                  <span className="row-value-highlight">{scanResult.name}</span>
                </div>
                <div className="result-data-row">
                  <span className="row-label">Mobile Number:</span>
                  <span className="row-value">{scanResult.phone}</span>
                </div>
                <div className="result-data-row">
                  <span className="row-label">Purpose:</span>
                  <span className="badge-purpose interview" style={{ marginTop: '4px' }}>
                    {scanResult.purpose}
                  </span>
                </div>
                <div className="result-data-row">
                  <span className="row-label">Timestamp:</span>
                  <span className="row-value" style={{ color: '#64748b' }}>{scanResult.time}</span>
                </div>
              </div>

              <button onClick={clearResult} className="export-btn clear-scan-btn">
                🔄 Clear and Scan Next Pass
              </button>
            </div>
          ) : (
            <div className="scanner-results-empty">
              <span className="empty-state-icon">📄</span>
              <p>Awaiting valid entry matrix transmission data pass...</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}