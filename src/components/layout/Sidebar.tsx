"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Calendar, FileText, CheckSquare,
  Briefcase, GraduationCap, BookOpen, Settings, Zap,
  TrendingUp, Shield,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getCookie } from "@/lib/cookies";
import { cn } from "@/lib/utils";
import { loadUserProfile, calculateClientStats, loadAllDaysState } from "@/lib/curriculumStore";

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
  const [userName, setUserName] = useState("Analyst");
  const [userInitials, setUserInitials] = useState("A");
  const [profileImage, setProfileImage] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [daysLeft, setDaysLeft] = useState(30);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const prof = loadUserProfile();
      setUserName(prof.name || "Analyst");
      setProfileImage(prof.profileImage || "");
      setUserInitials(
        prof.name ? prof.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "A"
      );
      const daysState = loadAllDaysState();
      const stats = calculateClientStats(daysState);
      setProgressPercent(stats.progressPct);
      setStreak(stats.streak);
      setDaysLeft(Math.max(0, 30 - stats.completedDaysCount));
    };
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col h-full relative animate-slide-up"
      style={{
        background: "var(--surface-0)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div className="h-[52px] flex items-center px-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)",
              boxShadow: "0 0 16px var(--accent-glow)",
            }}
          >
            <TrendingUp className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block" style={{ color: "var(--text-primary)", fontFamily: "var(--font-barlow)" }}>
              DA Sprint OS
            </span>
            <span className="text-[10px] tracking-widest uppercase block" style={{ color: "var(--accent)", fontFamily: "var(--font-barlow-condensed)", lineHeight: 1 }}>
              30-Day Sprint
            </span>
          </div>
        </div>
      </div>

      {/* Sprint Progress Block */}
      <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex justify-between items-center mb-2">
          <span className="section-label">Sprint Progress</span>
          <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>{progressPercent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" style={{ color: "var(--warning)" }} />
            <span className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
              {streak} day streak
            </span>
          </div>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{daysLeft}d left</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="section-label px-2 mb-1.5">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
                      isActive ? "nav-active" : "hover:bg-white/[0.03]"
                    )}
                    style={{ color: isActive ? "var(--accent)" : "var(--text-muted)" }}
                  >
                    <Icon
                      className="w-4 h-4 flex-shrink-0 transition-colors"
                      style={{ color: isActive ? "var(--accent)" : "var(--text-muted)" }}
                    />
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                        style={{ background: "var(--accent)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sprint Status Widget */}
      <div className="px-3 pb-2">
        <div
          className="rounded-xl p-3.5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(91,108,249,0.12) 0%, rgba(124,58,237,0.08) 100%)",
            border: "1px solid rgba(91,108,249,0.18)",
          }}
        >
          <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full opacity-20" style={{ background: "var(--accent)", filter: "blur(14px)" }} />
          <div className="flex items-center gap-2 mb-1.5">
            <Shield className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
            <span className="text-xs font-bold text-white">Sprint Active</span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {daysLeft > 0 ? `${daysLeft} days until completion` : "Sprint complete! 🎉"}
          </p>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2.5">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              style={{ border: "1.5px solid var(--accent-border)" }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--accent), #7c3aed)",
                boxShadow: "0 0 10px var(--accent-glow)",
              }}
            >
              {userInitials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{userName}</p>
            <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>Data Analyst Track</p>
          </div>
          <Link href="/settings" className="btn-icon w-7 h-7 rounded-md">
            <Settings className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
