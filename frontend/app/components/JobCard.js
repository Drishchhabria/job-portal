"use client";
import Link from "next/link";

const TYPE_COLORS = {
  "Full-Time": { bg: "rgba(0,212,255,0.08)", border: "rgba(0,212,255,0.25)", text: "#00D4FF" },
  "Part-Time": { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.25)", text: "#c084fc" },
  Contract: { bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.25)", text: "#facc15" },
  Internship: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.25)", text: "#4ade80" },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function JobCard({ job, index = 0 }) {
  const colors = TYPE_COLORS[job.type] || TYPE_COLORS["Full-Time"];

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block animate-fade-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div
        className="gradient-border glow-card group cursor-pointer"
        style={{
          background: "rgba(13,21,48,0.7)",
          border: "1px solid rgba(139,159,200,0.1)",
          borderRadius: "14px",
          padding: "24px",
          transition: "all 0.3s ease",
        }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          {/* Icon + title */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{
                background: "rgba(255,107,53,0.1)",
                border: "1px solid rgba(255,107,53,0.2)",
              }}
            >
              {getDeptEmoji(job.department)}
            </div>
            <div>
              <h3
                className="font-semibold text-white group-hover:text-brand transition-colors leading-tight"
                style={{ fontFamily: "Outfit, sans-serif", fontSize: "1rem" }}
              >
                {job.title}
              </h3>
              <p style={{ color: "#8B9FC8", fontSize: "0.8rem", fontFamily: "DM Sans, sans-serif" }}>
                {job.department}
              </p>
            </div>
          </div>

          {/* Type badge */}
          <span
            className="badge shrink-0"
            style={{
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              color: colors.text,
            }}
          >
            {job.type}
          </span>
        </div>

        {/* Description snippet */}
        <p
          className="text-sm leading-relaxed mb-4 line-clamp-2"
          style={{ color: "rgba(139,159,200,0.8)", fontFamily: "DM Sans, sans-serif" }}
        >
          {job.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(139,159,200,0.08)" }}>
          <div className="flex items-center gap-4">
            {/* Location */}
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "#8B9FC8" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {job.location}
            </span>
            {/* Experience */}
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "#8B9FC8" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              {job.experience}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {job.salary && (
              <span className="text-xs font-medium" style={{ color: "#4ade80", fontFamily: "DM Sans, sans-serif" }}>
                {job.salary}
              </span>
            )}
            <span className="text-xs" style={{ color: "rgba(139,159,200,0.4)" }}>
              {timeAgo(job.created_at)}
            </span>
          </div>
        </div>

        {/* Arrow indicator */}
        <div
          className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"
          style={{ color: "#FF6B35" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function getDeptEmoji(dept) {
  const map = {
    Engineering: "⚙️",
    Design: "🎨",
    Marketing: "📣",
    Sales: "💼",
    Product: "🧩",
    Finance: "📊",
    Operations: "🔧",
    HR: "🤝",
    Legal: "⚖️",
    Data: "📈",
  };
  for (const key of Object.keys(map)) {
    if (dept.toLowerCase().includes(key.toLowerCase())) return map[key];
  }
  return "🏢";
}
