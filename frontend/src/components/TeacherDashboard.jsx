import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TeacherDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://192.168.29.253:3001";

  const fetchSubmissions = async () => {
    const res = await axios.get(`${API_BASE}/api/submissions`);
    setSubmissions(res.data);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div style={{ background: "#1e1e1e", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>📋 Teacher Dashboard</h2>
      <button onClick={fetchSubmissions} style={refreshBtn}>🔄 Refresh</button>

      <table style={table}>
        <thead>
          <tr style={{ background: "#0078d7" }}>
            <th>Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Roll</th>
            <th>Submitted</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s, i) => (
            <tr key={i}>
              <td>{s.name}</td>
              <td>{s.className}</td>
              <td>{s.section}</td>
              <td>{s.roll}</td>
              <td>{new Date(s.submittedAt).toLocaleTimeString()}</td>
              <td>
                <button onClick={() => setSelectedCode(s.code)} style={viewBtn}>👁️ View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Modal */}
      {selectedCode && (
        <div style={modalOverlay} onClick={() => setSelectedCode(null)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>📄 Student Code</h3>
            <pre style={codeBox}>{selectedCode}</pre>
            <button onClick={() => setSelectedCode(null)} style={closeBtn}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const table = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
  marginTop: "20px",
};

const refreshBtn = {
  background: "#0078d7",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};

const viewBtn = {
  background: "#00b050",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContent = {
  background: "#2d2d2d",
  padding: "20px",
  borderRadius: "8px",
  width: "80%",
  maxWidth: "800px",
  color: "#fff",
};

const codeBox = {
  background: "#000",
  color: "#0f0",
  padding: "10px",
  borderRadius: "6px",
  fontFamily: "monospace",
  maxHeight: "400px",
  overflowY: "auto",
};

const closeBtn = {
  marginTop: "10px",
  background: "#ff4444",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "5px",
  cursor: "pointer",
};
