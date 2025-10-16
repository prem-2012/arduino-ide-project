import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

export default function StudentIDE() {
  const [code, setCode] = useState(`void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println("Hello Arduino!");
  delay(1000);
}`);
  const [output, setOutput] = useState("Ready.");
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [roll, setRoll] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://192.168.29.253:3001";

  const compileCode = async () => {
    setOutput("⏳ Compiling...");
    try {
      const res = await axios.post(`${API_BASE}/api/compile`, { code });
      setOutput(res.data.output || "✅ Compilation Successful!");
    } catch (err) {
      setOutput("❌ Compile Error: " + (err.response?.data?.error || err.message));
    }
  };

  const submitCode = async () => {
    if (!name || !className || !section || !roll) {
      alert("⚠️ Fill all fields before submitting!");
      return;
    }
    setOutput("📤 Submitting...");
    try {
      const res = await axios.post(`${API_BASE}/api/submit`, {
        name,
        className,
        section,
        roll,
        code,
      });
      setOutput(res.data.message);
    } catch (err) {
      setOutput("❌ Submit Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={container}>
      {/* Toolbar */}
      <div style={toolbar}>
        <div style={inputs}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputBox} />
          <input placeholder="Class" value={className} onChange={(e) => setClassName(e.target.value)} style={inputBox} />
          <input placeholder="Section" value={section} onChange={(e) => setSection(e.target.value)} style={inputBox} />
          <input placeholder="Roll No." value={roll} onChange={(e) => setRoll(e.target.value)} style={inputBox} />
        </div>

        <div style={buttons}>
          <button onClick={compileCode} style={buttonBlue}>⚙️ Compile</button>
          <button onClick={submitCode} style={buttonGreen}>📤 Submit</button>
        </div>
      </div>

      {/* Code Editor */}
      <div style={{ flexGrow: 1 }}>
        <Editor
          height="100%"
          theme="vs-dark"
          defaultLanguage="cpp"
          value={code}
          onChange={(v) => setCode(v)}
          options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
        />
      </div>

      {/* Console */}
      <pre style={consoleBox}>{output}</pre>
    </div>
  );
}

const container = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#1e1e1e",
  color: "#fff",
};

const toolbar = {
  padding: "10px 20px",
  background: "#2d2d2d",
  borderBottom: "2px solid #444",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const inputs = { display: "flex", gap: "10px" };

const inputBox = {
  background: "#111",
  color: "#fff",
  border: "1px solid #555",
  borderRadius: "4px",
  padding: "6px 8px",
  width: "120px",
};

const buttons = { display: "flex", gap: "10px" };

const buttonBlue = {
  background: "#0a84ff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "8px 14px",
  fontWeight: "bold",
  cursor: "pointer",
};

const buttonGreen = {
  background: "#00b050",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "8px 14px",
  fontWeight: "bold",
  cursor: "pointer",
};

const consoleBox = {
  background: "#000",
  color: "#0f0",
  padding: "10px",
  fontSize: "14px",
  fontFamily: "monospace",
  height: "120px",
  borderTop: "2px solid #333",
  overflowY: "auto",
};
