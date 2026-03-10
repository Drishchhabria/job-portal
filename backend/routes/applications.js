const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { load, save } = require("../database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const isValidURL = (u) => { try { new URL(u); return true; } catch { return false; } };

router.post("/", (req, res) => {
  const { job_id, name, email, resume_link, cover_note } = req.body;
  if (!job_id || !name || !email || !resume_link)
    return res.status(400).json({ success: false, message: "name, email, resume_link and job_id are required" });
  if (!isValidEmail(email))
    return res.status(400).json({ success: false, message: "Invalid email address" });
  if (!isValidURL(resume_link))
    return res.status(400).json({ success: false, message: "Invalid resume link — please provide a full URL (https://...)" });

  const db = load();
  const job = db.jobs.find((j) => j.id === job_id && j.is_active === 1);
  if (!job) return res.status(404).json({ success: false, message: "Job not found or no longer accepting applications" });

  const existing = db.applications.find((a) => a.job_id === job_id && a.email === email.toLowerCase().trim());
  if (existing) return res.status(409).json({ success: false, message: "You have already applied for this position" });

  const newApp = {
    id: uuidv4(), job_id,
    name: name.trim(), email: email.toLowerCase().trim(),
    resume_link: resume_link.trim(), cover_note: cover_note?.trim() || null,
    status: "pending", applied_at: new Date().toISOString(),
  };
  db.applications.push(newApp);
  save(db);
  res.status(201).json({ success: true, message: "Application submitted successfully! We'll be in touch soon.", data: { id: newApp.id } });
});

router.get("/", requireAdmin, (req, res) => {
  const { status, job_id } = req.query;
  const db = load();
  let apps = [...db.applications];
  if (status) apps = apps.filter((a) => a.status === status);
  if (job_id) apps = apps.filter((a) => a.job_id === job_id);
  apps = apps.map((a) => {
    const job = db.jobs.find((j) => j.id === a.job_id);
    return { ...a, job_title: job?.title || "Unknown", department: job?.department || "" };
  });
  apps.sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at));
  res.json({ success: true, data: apps });
});

router.get("/stats", requireAdmin, (req, res) => {
  const db = load();
  const stats = db.jobs.map((j) => {
    const jobApps = db.applications.filter((a) => a.job_id === j.id);
    return {
      id: j.id, title: j.title, department: j.department,
      total: jobApps.length,
      pending: jobApps.filter((a) => a.status === "pending").length,
      shortlisted: jobApps.filter((a) => a.status === "shortlisted").length,
    };
  });
  res.json({ success: true, data: stats });
});

router.patch("/:id/status", requireAdmin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "reviewed", "shortlisted", "rejected"];
  if (!validStatuses.includes(status))
    return res.status(400).json({ success: false, message: "Invalid status value" });
  const db = load();
  const idx = db.applications.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Application not found" });
  db.applications[idx].status = status;
  save(db);
  res.json({ success: true, message: `Status updated to '${status}'` });
});

module.exports = router;