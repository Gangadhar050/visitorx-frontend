import React, { useState } from 'react';
import './global.css';

export default function ExportExcel({ visitors = [] }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fallback mock data matching your main dashboard registry if no props are passed
  const fallbackRegistry = [
    { id: 1, name: 'Ravi Kumar', phone: '9876543210', purpose: 'Interview', time: '25 May 2026, 10:15 AM' },
    { id: 2, name: 'Priya Sharma', phone: '9988776655', purpose: 'Business Purpose', time: '25 May 2026, 10:42 AM' },
    { id: 3, name: 'Amit Verma', phone: '8765432109', purpose: 'Full-Time Employment', time: '25 May 2026, 11:00 AM' },
    { id: 4, name: 'Neha Singh', phone: '9811223344', purpose: 'Internship', time: '25 May 2026, 11:30 AM' }
  ];

  const dataToRender = visitors.length > 0 ? visitors : fallbackRegistry;

  const handleExport = (e) => {
    e.preventDefault();
    alert(`Exporting logs from ${startDate || 'Earliest'} to ${endDate || 'Latest'} as Excel Spreadsheet...`);
  };

  return (
    <div className="export-page-container">
      {/* Configuration Control Panel Card */}
      <div className="table-card">
        <div className="export-header-block">
          <h2>💾 Export Registry Database</h2>
          <p>Filter by date range parameters to compile custom spreadsheets.</p>
        </div>

        <form className="export-filter-form" onSubmit={handleExport}>
          <div className="input-field-group">
            <label htmlFor="startDate">Start Date</label>
            <input 
              id="startDate"
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="input-field-group">
            <label htmlFor="endDate">End Date</label>
            <input 
              id="endDate"
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button type="submit" className="add-btn download-action-btn">
            📥 Download Spreadsheet (.xlsx)
          </button>
        </form>
      </div>

      {/* Preview Sheet Card Container */}
      <div className="table-card" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', color: '#334155' }}>
          📋 Previewing ({dataToRender.length}) Unexported Log Rows
        </h3>

        {/* Responsive viewport boundary scroller container */}
        <div className="table-responsive">
          <table className="visitor-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Mobile Number</th>
                <th>Registry Purpose</th>
                <th>Check-In Context</th>
              </tr>
            </thead>
            <tbody>
              {dataToRender.map((row, idx) => (
                <tr key={row.id || idx}>
                  <td style={{ fontWeight: 600, color: '#94a3b8' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{row.name}</td>
                  <td style={{ color: '#475569', fontWeight: 500 }}>{row.phone}</td>
                  <td>
                    <span className="badge-purpose preview-label">
                      {row.purpose}
                    </span>
                  </td>
                  <td style={{ color: '#64748b' }}>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}