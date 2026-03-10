"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import JobCard from "./components/JobCard";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const JOB_TYPES = ["All", "Full-Time", "Part-Time", "Contract", "Internship"];
const DEPARTMENTS = ["All", "Engineering", "Design", "Marketing", "Product", "Sales", "Operations"];

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeDept, setActiveDept] = useState("All");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/jobs`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
        setFiltered(data.data);
      }
    } catch {
      setError("Could not load jobs. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering
  useEffect(() => {
    let result = [...jobs];
    if (activeType !== "All") result = result.filter((j) => j.type === activeType);
    if (activeDept !== "All") result = result.filter((j) => j.department === activeDept);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [jobs, activeType, activeDept, search]);

  return (
    <div className="mesh-bg min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 text-center relative overflow-hidden">
        {/* Decorative circles */}
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative max-w-3xl mx-auto">
          <div className="animate-fade-up stagger-1">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{
                background: "rgba(255,107,53,0.1)",
                border: "1px solid rgba(255,107,53,0.25)",
                color: "#FF8C5A",
                fontFamily: "DM Sans, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#FF6B35", boxShadow: "0 0 6px #FF6B35", animation: "pulse 2s infinite" }}
              />
              We're hiring across {jobs.length}+ open positions
            </span>
          </div>

          <h1
            className="animate-fade-up stagger-2"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              lineHeight: 1.1,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: "20px",
            }}
          >
            Build the future
            <br />
            <span style={{ color: "#FF6B35" }}>with Unizoy.</span>
          </h1>

          <p
            className="animate-fade-up stagger-3 text-lg leading-relaxed mx-auto"
            style={{
              color: "#8B9FC8",
              maxWidth: "500px",
              fontFamily: "DM Sans, sans-serif",
              marginBottom: "40px",
            }}
          >
            We're a team of builders who ship fast, care deeply, and believe work should be meaningful.
          </p>

          {/* Search */}
          <div className="animate-fade-up stagger-4 relative max-w-md mx-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B9FC8"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles, departments..."
              className="input-field pl-10 py-3.5"
              style={{ fontSize: "0.95rem", borderRadius: "12px" }}
            />
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: activeType === type ? "rgba(255,107,53,0.15)" : "rgba(13,21,48,0.6)",
                  border: activeType === type ? "1px solid rgba(255,107,53,0.4)" : "1px solid rgba(139,159,200,0.15)",
                  color: activeType === type ? "#FF6B35" : "#8B9FC8",
                  fontFamily: "DM Sans, sans-serif",
                  cursor: "pointer",
                }}
              >
                {type}
              </button>
            ))}
            <div className="w-px h-7 self-center" style={{ background: "rgba(139,159,200,0.15)" }} />
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: activeDept === dept ? "rgba(0,212,255,0.1)" : "rgba(13,21,48,0.6)",
                  border: activeDept === dept ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(139,159,200,0.15)",
                  color: activeDept === dept ? "#00D4FF" : "#8B9FC8",
                  fontFamily: "DM Sans, sans-serif",
                  cursor: "pointer",
                }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Job Listings ── */}
      <main className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* Result count */}
          {!loading && (
            <p className="text-sm mb-6" style={{ color: "rgba(139,159,200,0.6)", fontFamily: "DM Sans, sans-serif" }}>
              {filtered.length === 0 ? "No roles match your filters." : `Showing ${filtered.length} role${filtered.length !== 1 ? "s" : ""}`}
              {(activeType !== "All" || activeDept !== "All" || search) && (
                <button
                  onClick={() => { setActiveType("All"); setActiveDept("All"); setSearch(""); }}
                  className="ml-3 underline hover:text-brand transition-colors"
                  style={{ color: "#FF6B35" }}
                >
                  Clear filters
                </button>
              )}
            </p>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl h-32"
                  style={{
                    background: "linear-gradient(90deg, rgba(13,21,48,0.8) 25%, rgba(26,42,82,0.4) 50%, rgba(13,21,48,0.8) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                    border: "1px solid rgba(139,159,200,0.08)",
                  }}
                />
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div
              className="text-center py-16 px-8 rounded-2xl"
              style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}
            >
              <p style={{ color: "#fca5a5", fontFamily: "DM Sans, sans-serif" }}>{error}</p>
              <button
                onClick={fetchJobs}
                className="mt-4 px-5 py-2 rounded-lg text-sm"
                style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Jobs grid */}
          {!loading && !error && (
            <div className="grid gap-4">
              {filtered.length === 0 ? (
                <div className="text-center py-20" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }}>
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-lg font-medium text-white mb-2">No roles found</p>
                  <p className="text-sm">Try adjusting your search or filters.</p>
                </div>
              ) : (
                filtered.map((job, i) => <JobCard key={job.id} job={job} index={i} />)
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="border-t px-6 py-8 text-center"
        style={{ borderColor: "rgba(139,159,200,0.08)", color: "rgba(139,159,200,0.4)" }}
      >
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem" }}>
          © {new Date().getFullYear()} Unizoy. Built with care.
        </p>
      </footer>
    </div>
  );
}
