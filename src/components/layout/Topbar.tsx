"use client";
import { useState, useEffect, useRef } from "react";
import { getCookie } from "@/lib/cookies";
import { Search, Bell, Settings, Command, X, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { loadUserProfile } from "@/lib/curriculumStore";

export function Topbar({ isMobile = false }: { isMobile?: boolean }) {
  const [userName, setUserName] = useState("Analyst");
  const [userInitials, setUserInitials] = useState("A");
  const [profileImage, setProfileImage] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const prof = loadUserProfile();
    setUserName(prof.name || "Analyst");
    setProfileImage(prof.profileImage || "");
    setUserInitials(
      prof.name ? prof.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "A"
    );
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Quick nav items
  const quickLinks = [
    { label: "View Roadmap", href: "/roadmap" },
    { label: "Work Log", href: "/worklog" },
    { label: "Calendar", href: "/calendar" },
    { label: "Job Tracker", href: "/jobs" },
    { label: "Evidence Vault", href: "/evidence" },
    { label: "Resources", href: "/resources" },
    { label: "Settings", href: "/settings" },
  ];
  const filtered = searchQuery
    ? quickLinks.filter((l) => l.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : quickLinks;

  return (
    <>
      <header
        className={`flex-shrink-0 flex items-center justify-between z-20 ${
          isMobile ? "w-full" : "h-[52px] px-5 sticky top-0"
        }`}
        style={isMobile ? {} : {
          background: "rgba(9,11,14,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Left: Quick Search trigger */}
        <div className="flex-1 max-w-xs">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150 group"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border-strong)",
              color: "var(--text-muted)",
            }}
          >
            <Search className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left text-xs">Quick search...</span>
            <div
              className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold"
              style={{ background: "var(--surface-3)", color: "var(--text-muted)" }}
            >
              <Command className="w-2.5 h-2.5" /> K
            </div>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 ml-4">
          {/* Notifications */}
          <button className="btn-icon relative" title="Notifications">
            <Bell className="w-4 h-4" />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--warning)", boxShadow: "0 0 6px var(--warning)" }}
            />
          </button>

          {/* Divider */}
          <div className="w-px h-4 mx-0.5" style={{ background: "var(--border-strong)" }} />

          {/* Theme Toggle */}
          {mounted && (
            <button
              className="btn-icon"
              title="Toggle Theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Settings */}
          <Link href="/settings" className="btn-icon" title="Settings">
            <Settings className="w-4 h-4" />
          </Link>

          {/* Avatar */}
          <Link href="/settings" className="flex items-center gap-2 cursor-pointer ml-1">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover"
                style={{ border: "1.5px solid var(--accent-border)" }}
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, var(--accent), #7c3aed)",
                  boxShadow: "0 0 10px var(--accent-glow)",
                }}
              >
                {userInitials}
              </div>
            )}
            <div className="hidden md:block">
              <p className="text-xs font-semibold leading-none" style={{ color: "var(--text-primary)" }}>
                {userName}
              </p>
            </div>
          </Link>
        </div>
      </header>

      {/* Command Palette */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
            style={{ background: "var(--surface-1)", border: "1px solid var(--border-strong)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-open-sans)" }}
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="btn-icon w-7 h-7">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="py-2 max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>No results</p>
              ) : (
                filtered.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/[0.04] group"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "var(--surface-3)", color: "var(--text-muted)" }}
                    >
                      →
                    </span>
                    {item.label}
                  </Link>
                ))
              )}
            </div>
            <div
              className="px-4 py-2 flex items-center gap-3 text-[11px]"
              style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              <span>↵ to navigate</span>
              <span>⎋ to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
