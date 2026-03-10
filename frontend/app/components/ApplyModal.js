"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", resume_link: "", cover_note: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, job_id: job.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to submit application");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(5,10,24,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg animate-fade-up"
        style={{
          background: "rgba(13,21,48,0.98)",
          border: "1px solid rgba(139,159,200,0.15)",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="px-7 pt-7 pb-5"
          style={{ borderBottom: "1px solid rgba(139,159,200,0.1)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#FF6B35", fontFamily: "DM Sans, sans-serif", letterSpacing: "0.12em" }}>
                Apply Now
              </p>
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "#fff", lineHeight: 1.2 }}>
                {job.title}
              </h2>
              <p className="mt-1 text-sm" style={{ color: "#8B9FC8" }}>
                {job.department} · {job.location}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 -mr-1 -mt-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          {success ? (
            <div className="text-center py-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", marginBottom: "8px" }}>
                Application Submitted!
              </h3>
              <p className="text-sm" style={{ color: "#8B9FC8" }}>
                Thanks for applying to <strong style={{ color: "#fff" }}>{job.title}</strong>. We'll review your application and reach out soon.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                style={{ background: "linear-gradient(135deg, #FF6B35, #E5521C)", fontFamily: "DM Sans, sans-serif" }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                  Full Name <span style={{ color: "#FF6B35" }}>*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Alex Johnson"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                  Email Address <span style={{ color: "#FF6B35" }}>*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="alex@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                  Resume Link <span style={{ color: "#FF6B35" }}>*</span>
                </label>
                <input
                  name="resume_link"
                  type="url"
                  value={form.resume_link}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://drive.google.com/your-resume"
                  required
                />
                <p className="mt-1 text-xs" style={{ color: "rgba(139,159,200,0.5)" }}>
                  Google Drive, Dropbox, LinkedIn, or any public link
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                  Cover Note <span style={{ color: "rgba(139,159,200,0.4)" }}>(optional)</span>
                </label>
                <textarea
                  name="cover_note"
                  value={form.cover_note}
                  onChange={handleChange}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Tell us briefly why you're a great fit..."
                />
              </div>

              {error && (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all mt-1"
                style={{
                  background: loading ? "rgba(255,107,53,0.5)" : "linear-gradient(135deg, #FF6B35, #E5521C)",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.95rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 8px 24px rgba(255,107,53,0.3)",
                  transform: loading ? "none" : undefined,
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Application →"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
