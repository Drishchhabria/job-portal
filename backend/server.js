require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const jobsRouter = require("./routes/jobs");
const applicationsRouter = require("./routes/applications");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ─────────────────────────────────────────────────
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ───────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Unizoy API is running 🚀", timestamp: new Date().toISOString() });
});

// ─── Admin Auth ─────────────────────────────────────────────────
app.post("/api/auth/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: "Password required" });
  }

  if (password !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ success: false, message: "Invalid admin password" });
  }

  const token = jwt.sign(
    { role: "admin", iat: Date.now() },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ success: true, token, message: "Welcome, Admin!" });
});

// ─── Routes ─────────────────────────────────────────────────────
app.use("/api/jobs", jobsRouter);
app.use("/api/applications", applicationsRouter);

// ─── 404 Handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ─── Start Server ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Unizoy API running at http://localhost:${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/api/health\n`);
});
