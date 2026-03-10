"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import ApplyModal from "../../components/ApplyModal";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const TYPE_COLORS = {
  "Full-Time": { bg: "rgba(0,212,255,0.08)", border: "rgba(0,212,255,0.25)", text: "#00D4FF" },
  "Part-Time": { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.25)", text: "#c084fc" },
  Contract: { bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.25)", text: "#facc15" },
  Internship: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.25)", text: "#4ade80" },
};

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`${API}/api/jobs/${id}`);
      const data = await res.json();
      if (data.success) setJob(data.data);
      else router.push("/");
    } catch {
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mesh-bg min-h-screen">
        <Navbar />
        <div className="pt-32 px-6 max-w-3xl mx-auto">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 rounded-xl" style={{ background: "rgba(13,21,48,0.8)", animation: "shimmer 1.5s infinite" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  const colors = TYPE_COLORS[job.type] || TYPE_COLORS["Full-Time"];
  const requirements = job.requirements.split(",").map((r) => r.trim()).filter(Boolean);

  return (
    <div className="mesh-bg min-h-screen">
      <Navbar />

      {/* Background glow */}
      <div
        className="fixed top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(255,107,53,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <main className="pt-28 pb-24 px-6 relative">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm mb-8 transition-colors hover:text-white group"
            style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}
          >
            <svg className="transition-transform group-hover:-translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Jobs
          </button>

          {/* Header card */}
          <div
            className="animate-fade-up rounded-2xl p-8 mb-6"
            style={{
              background: "rgba(13,21,48,0.7)",
              border: "1px solid rgba(139,159,200,0.12)",
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="badge" style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}>
                    {job.type}
                  </span>
                  <span className="text-xs" style={{ color: "#8B9FC8" }}>{job.department}</span>
                </div>
                <h1
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                    color: "#fff",
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {job.title}
                </h1>
              </div>

              <button
                onClick={() => setShowApply(true)}
                className="px-7 py-3 rounded-xl font-semibold text-white transition-all shrink-0"
                style={{
                  background: "linear-gradient(135deg, #FF6B35, #E5521C)",
                  fontFamily: "DM Sans, sans-serif",
                  boxShadow: "0 8px 24px rgba(255,107,53,0.3)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 32px rgba(255,107,53,0.45)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,107,53,0.3)")}
              >
                Apply Now →
              </button>
            </div>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: "📍", label: job.location },
                { icon: "💼", label: job.experience },
                ...(job.salary ? [{ icon: "💰", label: job.salary }] : []),
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                  style={{
                    background: "rgba(26,42,82,0.6)",
                    border: "1px solid rgba(139,159,200,0.1)",
                    color: "#A8B8D8",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  <span>{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div
            className="animate-fade-up stagger-2 rounded-2xl p-8 mb-6"
            style={{
              background: "rgba(13,21,48,0.7)",
              border: "1px solid rgba(139,159,200,0.12)",
            }}
          >
            <h2
              className="mb-4"
              style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}
            >
              About the Role
            </h2>
            <p
              className="leading-relaxed"
              style={{ color: "#A8B8D8", fontFamily: "DM Sans, sans-serif", fontSize: "0.95rem", lineHeight: 1.75 }}
            >
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div
            className="animate-fade-up stagger-3 rounded-2xl p-8 mb-8"
            style={{
              background: "rgba(13,21,48,0.7)",
              border: "1px solid rgba(139,159,200,0.12)",
            }}
          >
            <h2
              className="mb-5"
              style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}
            >
              What We're Looking For
            </h2>
            <div className="flex flex-wrap gap-2">
              {requirements.map((req, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg text-sm"
                  style={{
                    background: "rgba(0,212,255,0.06)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "#A8B8D8",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.82rem",
                  }}
                >
                  {req}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className="animate-fade-up stagger-4 rounded-2xl p-8 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(229,82,28,0.04) 100%)",
              border: "1px solid rgba(255,107,53,0.2)",
            }}
          >
            <h3
              className="mb-2"
              style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff" }}
            >
              Sounds like your kind of challenge?
            </h3>
            <p className="mb-6 text-sm" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
              We review every application personally. Takes 2 minutes to apply.
            </p>
            <button
              onClick={() => setShowApply(true)}
              className="px-10 py-3.5 rounded-xl font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #FF6B35, #E5521C)",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "1rem",
                boxShadow: "0 8px 24px rgba(255,107,53,0.35)",
              }}
            >
              Apply for {job.title} →
            </button>
          </div>
        </div>
      </main>

      {showApply && <ApplyModal job={job} onClose={() => setShowApply(false)} />}
    </div>
  );
}
