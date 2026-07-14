"use client";
import { useState, useEffect } from "react";
import { getCookie } from "@/lib/cookies";
import { Search, Bell, Moon } from "lucide-react";

export function Topbar() {
  const [userName, setUserName] = useState("Job Seeker");
  const [userInitials, setUserInitials] = useState("JS");

  useEffect(() => {
    const name = getCookie("user_name");
    if (name) {
      setUserName(name);
      setUserInitials(name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2));
    }
  }, []);

  return (
    <header
      className="h-14 flex-shrink-0 flex items-center justify-between px-6 z-20 sticky top-0"
      style={{
        background: "rgba(13,15,20,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Left: Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: "var(--ds-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search tasks, resources, logs..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-all duration-200"
            style={{
              background: "var(--ds-surface-2)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "var(--ds-text)",
              fontFamily: "var(--font-open-sans)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(79,110,247,0.5)";
              e.target.style.boxShadow = "0 0 0 3px rgba(79,110,247,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.07)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Theme toggle (visual-only for now) */}
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
          style={{ color: "var(--ds-text-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--ds-surface-2)";
            (e.currentTarget as HTMLElement).style.color = "var(--ds-text)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--ds-text-muted)";
          }}
        >
          <Moon className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center relative transition-colors duration-200"
          style={{ color: "var(--ds-text-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--ds-surface-2)";
            (e.currentTarget as HTMLElement).style.color = "var(--ds-text)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--ds-text-muted)";
          }}
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--ds-warning)" }}
          />
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #4f6ef7, #7c3aed)",
              boxShadow: "0 0 12px rgba(79,110,247,0.3)",
            }}
          >
            {userInitials}
          </div>
          <div className="hidden sm:block">
            <p
              className="text-xs font-semibold text-white leading-none"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              {userName}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--ds-text-muted)" }}>
              Level 3
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
