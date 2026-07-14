"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Calendar, FileText, CheckSquare,
  Briefcase, GraduationCap, BookOpen, Settings, Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import { getCookie } from "@/lib/cookies";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { name: "Overview",       href: "/",         icon: LayoutDashboard },
      { name: "Roadmap",        href: "/roadmap",   icon: CheckSquare },
      { name: "Work Log",       href: "/worklog",   icon: FileText },
      { name: "Calendar",       href: "/calendar",  icon: Calendar },
    ],
  },
  {
    label: "Career",
    items: [
      { name: "Job Tracker",    href: "/jobs",      icon: Briefcase },
      { name: "Evidence Vault", href: "/evidence",  icon: GraduationCap },
      { name: "Resources",      href: "/resources", icon: BookOpen },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("Job Seeker");
  const [userInitials, setUserInitials] = useState("JS");
  const [dayOfSprint, setDayOfSprint] = useState(1);
  const [progressPercent, setProgressPercent] = useState(3);
  const [track, setTrack] = useState("SQL Track");

  useEffect(() => {
    const name = getCookie("user_name");
    if (name) {
      setUserName(name);
      setUserInitials(name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2));
    }
    const focus = getCookie("sprint_focus");
    if (focus) {
      setTrack(`${focus} Track`);
    }
    const startDateStr = getCookie("sprint_start_date");
    if (startDateStr) {
      const start = new Date(startDateStr);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      const clampedDays = Math.min(Math.max(diffDays, 1), 30);
      setDayOfSprint(clampedDays);
      setProgressPercent(Math.round((clampedDays / 30) * 100));
    }
  }, []);

  return (
    <aside
      style={{ background: "var(--ds-surface)" }}
      className="w-64 flex-shrink-0 flex flex-col h-full border-r border-white/[0.06] animate-slide-up"
    >
      {/* ── Logo ── */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          {/* Glowing icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #4f6ef7 0%, #7c3aed 100%)",
              boxShadow: "0 0 20px rgba(79,110,247,0.35)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 13V8M9 13V4M14 13V10" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <span
              className="font-bold text-white tracking-tight text-base leading-none block"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              DA Sprint
            </span>
            <span
              className="text-[10px] tracking-widest uppercase"
              style={{
                color: "var(--ds-primary)",
                fontFamily: "var(--font-barlow-condensed)",
              }}
            >
              OS v2
            </span>
          </div>
        </div>
      </div>

      {/* ── Sprint progress mini bar ── */}
      <div className="px-5 py-3 border-b border-white/[0.04]">
        <div className="flex justify-between items-center mb-1.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--ds-text-muted)", fontFamily: "var(--font-barlow-condensed)" }}
          >
            Day {dayOfSprint} of 30
          </span>
          <span className="text-[10px] font-bold" style={{ color: "var(--ds-primary)" }}>{progressPercent}%</span>
        </div>
        <div className="h-1 rounded-full" style={{ background: "var(--ds-surface-3)" }}>
          <div
            className="h-1 rounded-full transition-all duration-700 animate-bar-fill"
            style={{
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #4f6ef7, #7c3aed)",
              boxShadow: "0 0 8px rgba(79,110,247,0.6)",
            }}
          />
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p
              className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest"
              style={{
                color: "var(--ds-text-muted)",
                fontFamily: "var(--font-barlow-condensed)",
                letterSpacing: "0.12em",
              }}
            >
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive ? "nav-active" : "hover:bg-white/[0.04]"
                    )}
                    style={{
                      color: isActive ? "var(--ds-primary)" : "var(--ds-text-dim)",
                      fontFamily: "var(--font-open-sans)",
                    }}
                  >
                    <Icon
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: isActive ? "var(--ds-primary)" : "var(--ds-text-muted)" }}
                    />
                    {item.name}
                    {isActive && (
                      <div
                        className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse-glow"
                        style={{ background: "var(--ds-primary)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Upgrade CTA ── */}
      <div className="px-3 pb-3">
        <div
          className="rounded-xl p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(79,110,247,0.15) 0%, rgba(124,58,237,0.1) 100%)",
            border: "1px solid rgba(79,110,247,0.2)",
          }}
        >
          <div
            className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20"
            style={{ background: "var(--ds-primary)", filter: "blur(16px)" }}
          />
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3.5 h-3.5" style={{ color: "var(--ds-primary)" }} />
            <span className="text-xs font-bold text-white">Sprint Active</span>
          </div>
          <p className="text-[11px]" style={{ color: "var(--ds-text-muted)" }}>
            {30 - dayOfSprint} days remaining
          </p>
        </div>
      </div>

      {/* ── User footer ── */}
      <div
        className="p-4 border-t border-white/[0.06] flex items-center gap-3"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #4f6ef7, #7c3aed)",
            color: "#fff",
          }}
        >
          {userInitials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-white truncate">{userName}</p>
          <p className="text-[10px] truncate" style={{ color: "var(--ds-text-muted)" }}>
            {track}
          </p>
        </div>
        <Link href="/settings">
          <Settings className="w-4 h-4" style={{ color: "var(--ds-text-muted)" }} />
        </Link>
      </div>
    </aside>
  );
}
