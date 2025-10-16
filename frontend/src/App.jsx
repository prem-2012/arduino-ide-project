import React, { useState } from "react";
import StudentIDE from "./components/StudentIDE";
import TeacherDashboard from "./components/TeacherDashboard";

export default function App() {
  const [mode, setMode] = useState("student"); // or "teacher"

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#1e1e1e",
          color: "#fff",
          padding: "10px 20px",
        }}
      >
        <h2>Teacher–Student Arduino IDE</h2>
        <div>
          <button
            onClick={() => setMode("student")}
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              background: mode === "student" ? "#0078d7" : "#333",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Student
          </button>
          <button
            onClick={() => setMode("teacher")}
            style={{
              padding: "5px 10px",
              background: mode === "teacher" ? "#0078d7" : "#333",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Teacher
          </button>
        </div>
      </div>

      {mode === "student" ? <StudentIDE /> : <TeacherDashboard />}
    </div>
  );
}
