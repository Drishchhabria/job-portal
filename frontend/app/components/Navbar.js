"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(5,10,24,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(139,159,200,0.1)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{
              background: "linear-gradient(135deg, #FF6B35, #E5521C)",
              boxShadow: "0 4px 12px rgba(255,107,53,0.4)",
            }}
          >
            U
          </div>
          <span
            className="font-display font-700 text-lg tracking-tight text-white group-hover:text-brand transition-colors"
            style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}
          >
            Unizoy
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full border"
            style={{
              borderColor: "rgba(255,107,53,0.4)",
              color: "#FF6B35",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
            }}
          >
            CAREERS
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{
              color: pathname === "/" ? "#FF6B35" : "#8B9FC8",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
            }}
          >
            Open Roles
          </Link>
          {!isAdmin && (
            <Link
              href="/admin"
              className="text-sm px-4 py-1.5 rounded-lg border transition-all"
              style={{
                color: "#8B9FC8",
                borderColor: "rgba(139,159,200,0.25)",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FF6B35";
                e.currentTarget.style.borderColor = "rgba(255,107,53,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#8B9FC8";
                e.currentTarget.style.borderColor = "rgba(139,159,200,0.25)";
              }}
            >
              Admin
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/"
              className="text-sm px-4 py-1.5 rounded-lg border transition-all"
              style={{
                color: "#8B9FC8",
                borderColor: "rgba(139,159,200,0.25)",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
              }}
            >
              ← Back to Board
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-300 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className="block h-0.5 w-5 transition-all"
              style={{
                background: menuOpen ? "#FF6B35" : "#8B9FC8",
                transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none",
              }}
            />
            <span
              className="block h-0.5 w-5 transition-all"
              style={{
                background: menuOpen ? "#FF6B35" : "#8B9FC8",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-0.5 w-5 transition-all"
              style={{
                background: menuOpen ? "#FF6B35" : "#8B9FC8",
                transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none",
              }}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-4 flex flex-col gap-3"
          style={{ background: "rgba(5,10,24,0.98)" }}
        >
          <Link href="/" className="text-sm py-2" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }} onClick={() => setMenuOpen(false)}>
            Open Roles
          </Link>
          <Link href="/admin" className="text-sm py-2" style={{ color: "#8B9FC8", fontFamily: "DM Sans, sans-serif" }} onClick={() => setMenuOpen(false)}>
            Admin Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}
