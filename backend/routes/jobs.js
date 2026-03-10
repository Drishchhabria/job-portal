const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { load, save } = require("../database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  const { type, department, search } = req.query;
  try {
    let jobs = load().jobs.filter((j) => j.is_active === 1);
    if (type) jobs = jobs.filter((j) => j.type === type);
    if (department) jobs = jobs.filter((j) => j.department === department);
    if (search) {
      const q = search.toLowerCase();
      jobs = jobs.filter((j) =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      );
    }
    jobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json({ success: true, data: jobs });
  } catch (err) {
    console.error("GET /jobs error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
});

router.get("/all", requireAdmin, (req, res) => {
  try {
    const jobs = load().jobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json({ success: true, data: jobs });
  } catch (err) {
    console.error("GET /jobs/all error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
});

router.get("/:id", (req, res) => {
  try {
    const job = load().jobs.find((j) => j.id === req.params.id && j.is_active === 1);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, data: job });
  } catch (err) {
    console.error("GET /jobs/:id error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch job" });
  }
});

router.post("/", requireAdmin, (req, res) => {
  console.log("POST /jobs body:", req.body);
  const { title, department, location, type, experience, salary, description, requirements } = req.body;
  if (!title || !department || !location || !type || !experience || !description || !requirements) {
    return res.status(400).json({ success: false, message: "All required fields must be filled" });
  }
  const validTypes = ["Full-Time", "Part-Time", "Contract", "Internship"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: "Invalid job type" });
  }
  const newJob = {
    id: uuidv4(), title, department, location, type, experience,
    salary: salary || null, description, requirements,
    is_active: 1, created_at: new Date().toISOString(),
  };
  try {
    const db = load();
    db.jobs.push(newJob);
    save(db);
    res.status(201).json({ success: true, data: newJob, message: "Job posted successfully" });
  } catch (err) {
    console.error("POST /jobs error:", err);
    res.status(500).json({ success: false, message: "Failed to create job" });
  }
});

router.patch("/:id", requireAdmin, (req, res) => {
  try {
    const db = load();
    const idx = db.jobs.findIndex((j) => j.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: "Job not found" });
    const allowed = ["title","department","location","type","experience","salary","description","requirements","is_active"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) db.jobs[idx][key] = req.body[key];
    }
    save(db);
    res.json({ success: true, data: db.jobs[idx], message: "Job updated successfully" });
  } catch (err) {
    console.error("PATCH /jobs/:id error:", err);
    res.status(500).json({ success: false, message: "Failed to update job" });
  }
});

router.delete("/:id", requireAdmin, (req, res) => {
  try {
    const db = load();
    const idx = db.jobs.findIndex((j) => j.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: "Job not found" });
    db.jobs.splice(idx, 1);
    db.applications = db.applications.filter((a) => a.job_id !== req.params.id);
    save(db);
    res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    console.error("DELETE /jobs/:id error:", err);
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
});

module.exports = router;