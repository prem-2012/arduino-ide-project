import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// =============================
// 📁 Ensure Data Directory Exists
// =============================
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const submissionsFile = path.join(dataDir, "submissions.json");

// =============================
// 🩺 Health Check
// =============================
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "✅ Backend is running fine!" });
});

// =============================
// ⚙️ Compile Arduino Code (FINAL FIXED)
// =============================
app.post("/api/compile", async (req, res) => {
  const { code } = req.body;
  if (!code)
    return res
      .status(400)
      .json({ success: false, error: "Code is missing" });

  try {
    // 🧩 Create a unique temporary sketch folder
    const sketchFolder = path.join(dataDir, "temp_sketch");
    const sketchFile = path.join(sketchFolder, "temp_sketch.ino");

    // Ensure folder exists
    if (!fs.existsSync(sketchFolder))
      fs.mkdirSync(sketchFolder, { recursive: true });

    // Write Arduino code file
    fs.writeFileSync(sketchFile, code);

    // Run the Arduino CLI compile command
    const command = `arduino-cli compile --fqbn arduino:avr:uno "${sketchFolder}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Compilation failed:", stderr || stdout);
        return res.json({ success: false, output: stderr || stdout });
      }

      console.log("✅ Compilation successful!");
      res.json({ success: true, output: stdout });
    });
  } catch (err) {
    console.error("⚠️ Compile Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// =============================
// 💾 Submit Student Code
// =============================
app.post("/api/submit", async (req, res) => {
  try {
    const { name, className, section, roll, code } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ success: false, error: "Code is required" });
    }

    const submission = {
      name: name?.trim() || "Unknown",
      className: className?.trim() || "-",
      section: section?.trim() || "-",
      roll: roll?.trim() || "-",
      code,
      submittedAt: new Date().toISOString(),
    };

    // Read existing submissions
    let submissions = [];
    if (fs.existsSync(submissionsFile)) {
      const fileData = fs.readFileSync(submissionsFile, "utf8");
      if (fileData) submissions = JSON.parse(fileData);
    }

    // Add new submission
    submissions.unshift(submission);

    // Save file
    fs.writeFileSync(
      submissionsFile,
      JSON.stringify(submissions, null, 2)
    );

    res.json({ success: true, message: "✅ Code submitted successfully!" });
  } catch (error) {
    console.error("❌ Submission error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================
// 📜 Get All Submissions
// =============================
app.get("/api/submissions", (req, res) => {
  try {
    if (!fs.existsSync(submissionsFile)) return res.json([]);
    const data = fs.readFileSync(submissionsFile, "utf8");
    res.json(JSON.parse(data || "[]"));
  } catch (error) {
    console.error("❌ Submissions read error:", error);
    res.status(500).json({ error: error.message });
  }
});

// =============================
// 🧹 Optional Cleanup Function (to keep /data clean)
// =============================
app.post("/api/clean", (req, res) => {
  try {
    const sketchFolder = path.join(dataDir, "temp_sketch");
    if (fs.existsSync(sketchFolder)) {
      fs.rmSync(sketchFolder, { recursive: true, force: true });
      console.log("🧹 Temporary sketch folder cleaned.");
    }
    res.json({ success: true, message: "Cleaned temporary files." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =============================
// 🚀 Start Server
// =============================
app.listen(PORT, "0.0.0.0", () =>
  console.log(
    `✅ Backend running and accessible on LAN at http://0.0.0.0:${PORT}`
  )
);
