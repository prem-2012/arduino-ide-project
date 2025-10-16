import React, { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ArduinoEditor() {
  const [code, setCode] = useState(`void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println("Hello Arduino!");
  delay(1000);
}`);
  const [output, setOutput] = useState("Ready.");

  const compileCode = async () => {
    setOutput("⏳ Compiling...");
    try {
      const res = await axios.post(`${API_BASE}/api/compile`, { code });
      setOutput(res.data.output);
    } catch (err) {
      setOutput("❌ Compile Error: " + err.message);
    }
  };

  const submitCode = async () => {
    setOutput("📤 Submitting...");
    try {
      const res = await axios.post(`${API_BASE}/api/submit`, {
        code,
        studentName: "Student",
      });
      setOutput("✅ " + res.data.message);
    } catch (err) {
      setOutput("❌ Submit Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Arduino IDE (Web)</h2>
      <Editor
        height="400px"
        language="cpp"
        value={code}
        onChange={(val) => setCode(val)}
      />
      <div style={{ marginTop: "1rem" }}>
        <button onClick={compileCode}>⚙️ Compile</button>
        <button onClick={submitCode} style={{ marginLeft: "10px" }}>
          📤 Submit
        </button>
      </div>
      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: "1rem",
          marginTop: "1rem",
          borderRadius: "8px",
          minHeight: "150px",
        }}
      >
        {output}
      </pre>
    </div>
  );
}
