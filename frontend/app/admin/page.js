"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship"];
const STATUS_COLORS = {
  pending: { bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.25)", text: "#facc15" },
  reviewed: { bg: "rgba(0,212,255,0.1)", border: "rgba(0,212,255,0.25)", text: "#00D4FF" },
  shortlisted: { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)", text: "#4ade80" },
  rejected: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", text: "#f87171" },
};

const EMPTY_FORM = {
  title: "", department: "", location: "", type: "Full-Time",
  experience: "", salary: "", description: "", requirements: "",
};

// ── Auth helpers ──────────────────────────────────────────────
function getToken() {
  if (typeof window !== "undefined") return localStorage.getItem("unizoy_admin_token");
  return null;
}
function setToken(t) { localStorage.setItem("unizoy_admin_token", t); }
function clearToken() { localStorage.removeItem("unizoy_admin_token"); }
function authHeaders(token) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export default function AdminPage() {
  const [token, setTokenState] = useState(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState("jobs"); // "jobs" | "applications"
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const [showJobForm, setShowJobForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Init from localStorage
  useEffect(() => {
    const t = getToken();
    if (t) setTokenState(t);
  }, []);

  // Load data when logged in
  useEffect(() => {
    if (token) {
      fetchJobs();
      if (tab === "applications") fetchApplications();
    }
  }, [token, tab]);

  // ── Auth ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.message || "Wrong password"); return; }
      setToken(data.token);
      setTokenState(data.token);
    } catch {
      setLoginError("Network error — is the backend running?");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    setTokenState(null);
    setJobs([]);
    setApplications([]);
  };

  // ── Data fetching ──
  const fetchJobs = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await fetch(`${API}/api/jobs/all`, { headers: authHeaders(token) });
      if (res.status === 401) { handleLogout(); return; }
      const data = await res.json();
      if (data.success) setJobs(data.data);
    } finally {
      setDataLoading(false);
    }
  }, [token]);

  const fetchApplications = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await fetch(`${API}/api/applications`, { headers: authHeaders(token) });
      const data = await res.json();
      if (data.success) setApplications(data.data);
    } finally {
      setDataLoading(false);
    }
  }, [token]);

  // ── Job form ──
  const openNewJobForm = () => {
    setEditJob(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setFormSuccess("");
    setShowJobForm(true);
  };

  const openEditForm = (job) => {
    setEditJob(job);
    setForm({
      title: job.title, department: job.department, location: job.location,
      type: job.type, experience: job.experience, salary: job.salary || "",
      description: job.description, requirements: job.requirements,
    });
    setFormError("");
    setFormSuccess("");
    setShowJobForm(true);
  };

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      const url = editJob ? `${API}/api/jobs/${editJob.id}` : `${API}/api/jobs`;
      const method = editJob ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: authHeaders(token),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.message || "Failed to save job"); return; }
      setFormSuccess(editJob ? "Job updated!" : "Job posted successfully!");
      fetchJobs();
      setTimeout(() => { setShowJobForm(false); setFormSuccess(""); }, 1200);
    } catch {
      setFormError("Network error.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await fetch(`${API}/api/jobs/${id}`, { method: "DELETE", headers: authHeaders(token) });
      fetchJobs();
      setDeleteConfirm(null);
    } catch {}
  };

  const handleToggleActive = async (job) => {
    await fetch(`${API}/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ is_active: job.is_active ? 0 : 1 }),
    });
    fetchJobs();
  };

  const handleStatusChange = async (appId, status) => {
    await fetch(`${API}/api/applications/${appId}/status`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    });
    fetchApplications();
  };

  // ── Login screen ──
  if (!token) {
    return (
      <div className="mesh-bg min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4 pt-16">
          <div
            className="w-full max-w-sm animate-fade-up"
            style={{
              background: "rgba(13,21,48,0.95)",
              border: "1px solid rgba(139,159,200,0.15)",
              borderRadius: "20px",
              padding: "40px 32px",
            }}
          >
            <div className="text-center mb-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, #FF6B35, #E5521C)", boxShadow: "0 4px 16px rgba(255,107,53,0.4)" }}
              >
                U
              </div>
              <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#fff" }}>
                Admin Login
              </h1>
              <p className="mt-1 text-sm" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                Sign in to manage Unizoy jobs
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                  Admin Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setLoginError(""); }}
                  className="input-field"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              {loginError && (
                <p className="text-sm" style={{ color: "#f87171", fontFamily: "DM Sans, sans-serif" }}>
                  {loginError}
                </p>
              )}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl font-semibold text-white mt-1"
                style={{
                  background: "linear-gradient(135deg, #FF6B35, #E5521C)",
                  fontFamily: "DM Sans, sans-serif",
                  opacity: loginLoading ? 0.6 : 1,
                  cursor: loginLoading ? "not-allowed" : "pointer",
                }}
              >
                {loginLoading ? "Signing in..." : "Sign In →"}
              </button>
              <p className="text-center text-xs" style={{ color: "rgba(139,159,200,0.4)", fontFamily: "DM Sans, sans-serif" }}>
                Default: set ADMIN_SECRET in backend .env
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  const activeJobs = jobs.filter((j) => j.is_active);
  const totalApps = applications.length;

  return (
    <div className="mesh-bg min-h-screen">
      <Navbar />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 animate-fade-up">
            <div>
              <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "2rem", color: "#fff", letterSpacing: "-0.02em" }}>
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                Manage job postings and review applications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openNewJobForm}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm"
                style={{
                  background: "linear-gradient(135deg, #FF6B35, #E5521C)",
                  fontFamily: "DM Sans, sans-serif",
                  boxShadow: "0 6px 18px rgba(255,107,53,0.3)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Post Job
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl text-sm transition-colors"
                style={{
                  background: "rgba(13,21,48,0.6)",
                  border: "1px solid rgba(139,159,200,0.15)",
                  color: "#8B9FC8",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Log out
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up stagger-1">
            {[
              { label: "Total Jobs", value: jobs.length, icon: "📋" },
              { label: "Active Jobs", value: activeJobs.length, icon: "✅" },
              { label: "Applications", value: totalApps, icon: "📥" },
              { label: "Shortlisted", value: applications.filter((a) => a.status === "shortlisted").length, icon: "⭐" },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(13,21,48,0.7)",
                  border: "1px solid rgba(139,159,200,0.1)",
                }}
              >
                <div className="text-2xl mb-2">{icon}</div>
                <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.8rem", color: "#fff", lineHeight: 1 }}>
                  {value}
                </div>
                <div className="mt-1 text-xs" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: "rgba(13,21,48,0.8)", border: "1px solid rgba(139,159,200,0.1)" }}>
            {["jobs", "applications"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                style={{
                  background: tab === t ? "rgba(255,107,53,0.15)" : "transparent",
                  color: tab === t ? "#FF6B35" : "#8B9FC8",
                  border: tab === t ? "1px solid rgba(255,107,53,0.3)" : "1px solid transparent",
                  fontFamily: "DM Sans, sans-serif",
                  cursor: "pointer",
                }}
              >
                {t === "jobs" ? `Jobs (${jobs.length})` : `Applications (${totalApps})`}
              </button>
            ))}
          </div>

          {/* Jobs Tab */}
          {tab === "jobs" && (
            <div className="space-y-3">
              {dataLoading && (
                <div className="text-center py-10 text-slate-400">Loading...</div>
              )}
              {!dataLoading && jobs.length === 0 && (
                <div className="text-center py-16" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                  <p className="text-5xl mb-3">📋</p>
                  <p className="text-lg font-medium text-white mb-1">No jobs posted yet</p>
                  <p className="text-sm mb-5">Click "Post Job" to create your first listing.</p>
                  <button onClick={openNewJobForm} className="px-5 py-2 rounded-xl text-sm text-white" style={{ background: "linear-gradient(135deg, #FF6B35, #E5521C)" }}>
                    Post Job
                  </button>
                </div>
              )}
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4"
                  style={{
                    background: "rgba(13,21,48,0.7)",
                    border: `1px solid ${job.is_active ? "rgba(139,159,200,0.1)" : "rgba(239,68,68,0.1)"}`,
                    opacity: job.is_active ? 1 : 0.6,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0"
                      style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)" }}
                    >
                      💼
                    </div>
                    <div>
                      <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, color: "#fff", fontSize: "0.95rem" }}>
                        {job.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                        {job.department} · {job.location} · {job.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="badge"
                      style={{
                        background: job.is_active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        border: `1px solid ${job.is_active ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                        color: job.is_active ? "#4ade80" : "#f87171",
                      }}
                    >
                      {job.is_active ? "Active" : "Paused"}
                    </span>
                    <button
                      onClick={() => handleToggleActive(job)}
                      className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                      style={{ background: "rgba(26,42,82,0.8)", color: "#8B9FC8", border: "1px solid rgba(139,159,200,0.15)", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
                    >
                      {job.is_active ? "Pause" : "Activate"}
                    </button>
                    <button
                      onClick={() => openEditForm(job)}
                      className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                      style={{ background: "rgba(0,212,255,0.08)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.2)", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(job)}
                      className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                      style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Applications Tab */}
          {tab === "applications" && (
            <div className="space-y-3">
              {dataLoading && <div className="text-center py-10 text-slate-400">Loading...</div>}
              {!dataLoading && applications.length === 0 && (
                <div className="text-center py-16" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                  <p className="text-5xl mb-3">📥</p>
                  <p className="text-lg font-medium text-white mb-1">No applications yet</p>
                  <p className="text-sm">Applications will appear here once candidates apply.</p>
                </div>
              )}
              {applications.map((app) => {
                const sc = STATUS_COLORS[app.status] || STATUS_COLORS.pending;
                return (
                  <div
                    key={app.id}
                    className="rounded-2xl p-5"
                    style={{ background: "rgba(13,21,48,0.7)", border: "1px solid rgba(139,159,200,0.1)" }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, color: "#fff", fontSize: "0.95rem" }}>
                          {app.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                          {app.email}
                        </p>
                        <p className="text-xs mt-1" style={{ color: "#FF6B35", fontFamily: "DM Sans, sans-serif" }}>
                          Applied for: {app.job_title} · {app.department}
                        </p>
                        {app.cover_note && (
                          <p className="mt-2 text-xs leading-relaxed max-w-md" style={{ color: "rgba(139,159,200,0.7)", fontFamily: "DM Sans, sans-serif" }}>
                            "{app.cover_note}"
                          </p>
                        )}
                        <a
                          href={app.resume_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 text-xs underline"
                          style={{ color: "#00D4FF", fontFamily: "DM Sans, sans-serif" }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15,3 21,3 21,9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          View Resume
                        </a>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="badge" style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
                          {app.status}
                        </span>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="text-xs rounded-lg px-2 py-1.5"
                          style={{
                            background: "rgba(26,42,82,0.8)",
                            border: "1px solid rgba(139,159,200,0.2)",
                            color: "#A8B8D8",
                            fontFamily: "DM Sans, sans-serif",
                            cursor: "pointer",
                          }}
                        >
                          {["pending", "reviewed", "shortlisted", "rejected"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <span className="text-xs" style={{ color: "rgba(139,159,200,0.4)", fontFamily: "DM Sans, sans-serif" }}>
                          {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── Job Form Modal ── */}
      {showJobForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: "rgba(5,10,24,0.85)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="w-full max-w-2xl my-8 animate-fade-up"
            style={{
              background: "rgba(13,21,48,0.98)",
              border: "1px solid rgba(139,159,200,0.15)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <div className="px-8 py-6 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(139,159,200,0.1)" }}>
              <div>
                <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: "#FF6B35", letterSpacing: "0.1em", fontFamily: "DM Sans, sans-serif" }}>
                  {editJob ? "Edit Job" : "New Job"}
                </p>
                <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff" }}>
                  {editJob ? editJob.title : "Post a New Role"}
                </h2>
              </div>
              <button onClick={() => setShowJobForm(false)} className="text-slate-400 hover:text-white p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "title", label: "Job Title", placeholder: "e.g. Senior Frontend Engineer", required: true, span: 2 },
                { name: "department", label: "Department", placeholder: "e.g. Engineering", required: true },
                { name: "location", label: "Location", placeholder: "e.g. Remote / New York", required: true },
                { name: "experience", label: "Experience", placeholder: "e.g. 2–4 years", required: true },
                { name: "salary", label: "Salary Range", placeholder: "e.g. $80k – $110k" },
              ].map(({ name, label, placeholder, required, span }) => (
                <div key={name} className={span === 2 ? "md:col-span-2" : ""}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                    {label} {required && <span style={{ color: "#FF6B35" }}>*</span>}
                  </label>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleFormChange}
                    className="input-field"
                    placeholder={placeholder}
                    required={required}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                  Job Type <span style={{ color: "#FF6B35" }}>*</span>
                </label>
                <select name="type" value={form.type} onChange={handleFormChange} className="input-field" style={{ cursor: "pointer" }}>
                  {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                  Job Description <span style={{ color: "#FF6B35" }}>*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Describe the role, responsibilities, and what success looks like..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                  Requirements <span style={{ color: "#FF6B35" }}>*</span>
                </label>
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleFormChange}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="React, TypeScript, Node.js, 3+ years experience... (comma-separated skills)"
                  required
                />
                <p className="mt-1 text-xs" style={{ color: "rgba(139,159,200,0.4)", fontFamily: "DM Sans, sans-serif" }}>
                  Separate skills/requirements with commas
                </p>
              </div>

              {formError && (
                <div className="md:col-span-2 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="md:col-span-2 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80" }}>
                  {formSuccess}
                </div>
              )}

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJobForm(false)}
                  className="px-5 py-2.5 rounded-xl text-sm"
                  style={{ background: "rgba(26,42,82,0.6)", color: "#8B9FC8", border: "1px solid rgba(139,159,200,0.15)", fontFamily: "DM Sans, sans-serif", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-7 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #FF6B35, #E5521C)",
                    fontFamily: "DM Sans, sans-serif",
                    opacity: formLoading ? 0.6 : 1,
                    cursor: formLoading ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 18px rgba(255,107,53,0.3)",
                  }}
                >
                  {formLoading ? "Saving..." : editJob ? "Save Changes" : "Post Job →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5,10,24,0.85)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="w-full max-w-sm animate-fade-up rounded-2xl p-8"
            style={{ background: "rgba(13,21,48,0.98)", border: "1px solid rgba(239,68,68,0.25)" }}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Delete Job?</h3>
              <p className="text-sm mb-6" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                This will permanently delete <strong style={{ color: "#fff" }}>{deleteConfirm.title}</strong> and all its applications.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-5 py-2 rounded-xl text-sm"
                  style={{ background: "rgba(26,42,82,0.6)", color: "#8B9FC8", border: "1px solid rgba(139,159,200,0.15)", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteJob(deleteConfirm.id)}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "rgba(239,68,68,0.7)", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
