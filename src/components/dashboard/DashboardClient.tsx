"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GameProgression } from "./GameProgression";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { UpNext } from "./UpNext";
import { PomodoroTimer } from "./PomodoroTimer";
import { Pedometer } from "./Pedometer";
import {
  loadUserProfile,
  loadAllDaysState,
  calculateClientStats,
  ClientStats,
  UserProfile,
} from "@/lib/curriculumStore";
import { Resource } from "@/lib/resources";
import {
  Calendar, CheckSquare, FileText, Sparkles, BookOpen,
  TrendingUp, Flame, Clock, Trophy, ChevronRight, Zap, Target
} from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  stats: any;
  weekResources: Resource[];
}

// SVG Progress Ring
function ProgressRing({ pct, size = 72, stroke = 5, color = "var(--accent)" }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="ring-track"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
      />
    </svg>
  );
}

export function DashboardClient({ stats: serverStats, weekResources }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Analyst",
    welcomeMessage: "Ready to crush today's sprint?",
    profileImage: "",
    focus: "SQL",
  });
  const [stats, setStats] = useState<ClientStats>({
    progressPct: 0, streak: 0, hoursLogged: 0, logCount: 0, completedDaysCount: 0,
  });
  const [mounted, setMounted] = useState(false);

  const loadData = () => {
    const prof = loadUserProfile();
    setProfile(prof);
    const daysState = loadAllDaysState();
    const computed = calculateClientStats(daysState);
    setStats(computed);
    setMounted(true);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".kpi-card", {
        opacity: 0, y: 24, duration: 0.7,
        ease: "power3.out", stagger: 0.08, delay: 0.1,
      });
      gsap.from(".widget-card", {
        opacity: 0, y: 32, duration: 0.8,
        ease: "power3.out", stagger: 0.1, delay: 0.3,
      });
    }, container);
    return () => ctx.revert();
  }, [mounted]);

  const xp = stats.completedDaysCount * 250 + stats.hoursLogged * 50;
  const level = xp < 1000 ? 1 : xp < 3000 ? 2 : xp < 6000 ? 3 : xp < 10000 ? 4 : 5;
  const nextLevelXp = [1000, 3000, 6000, 10000, 99999][level - 1];
  const levelPct = Math.min(Math.round((xp / nextLevelXp) * 100), 100);

  const kpis = [
    {
      label: "Sprint Progress",
      value: `${stats.progressPct}%`,
      sub: `${stats.completedDaysCount} / 30 days`,
      icon: Target,
      color: "var(--accent)",
      pct: stats.progressPct,
    },
    {
      label: "Day Streak",
      value: `${stats.streak}`,
      sub: "consecutive days",
      icon: Flame,
      color: "var(--warning)",
      pct: Math.min(stats.streak * 10, 100),
    },
    {
      label: "Hours Logged",
      value: `${stats.hoursLogged}h`,
      sub: `${stats.logCount} sessions`,
      icon: Clock,
      color: "var(--success)",
      pct: Math.min(stats.hoursLogged * 2, 100),
    },
    {
      label: "XP Earned",
      value: xp.toLocaleString(),
      sub: `Level ${level} Analyst`,
      icon: Trophy,
      color: "var(--purple)",
      pct: levelPct,
    },
  ];

  if (!mounted) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-28 skeleton rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 skeleton rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-72 skeleton rounded-xl" />
            <div className="h-36 skeleton rounded-xl" />
          </div>
          <div className="h-[460px] skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div ref={container} className="space-y-6 pb-12">
      {/* Welcome Hero */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 animate-slide-up"
        style={{
          background: "linear-gradient(135deg, var(--surface-1) 0%, var(--surface-2) 100%)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Background orbs */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-[0.07]" style={{ background: "var(--accent)", filter: "blur(50px)" }} />
        <div className="absolute -left-8 bottom-0 w-32 h-32 rounded-full opacity-[0.05]" style={{ background: "var(--purple)", filter: "blur(40px)" }} />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          {/* Left: User info */}
          <div className="flex items-center gap-4">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Avatar"
                className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                style={{ border: "2px solid var(--accent-border)", boxShadow: "0 0 20px var(--accent-glow)" }}
              />
            ) : (
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--accent), #7c3aed)",
                  boxShadow: "0 0 20px var(--accent-glow)",
                }}
              >
                {profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold shimmer-text">
                  Welcome back, {profile.name}!
                </h1>
                <Sparkles className="w-4 h-4 animate-pulse" style={{ color: "var(--accent)" }} />
              </div>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                {profile.welcomeMessage} &nbsp;·&nbsp;
                <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {profile.focus} Track
                </span>
              </p>
              {/* XP Level bar */}
              <div className="flex items-center gap-2 mt-2.5">
                <span className="badge badge-accent text-[10px]">Lv.{level}</span>
                <div className="progress-bar flex-1 w-32">
                  <div className="progress-bar-fill" style={{ width: `${levelPct}%` }} />
                </div>
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>

          {/* Right: CTA buttons */}
          <div className="flex flex-wrap gap-2 items-center">
            <Link href="/roadmap" className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" /> View Roadmap
            </Link>
            <Link href="/worklog" className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Log Activity
            </Link>
            <Link href="/calendar" className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Calendar
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="kpi-card" style={{ animationDelay: `${i * 60}ms` }}>
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${kpi.color}18`, border: `1px solid ${kpi.color}25` }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: kpi.color, width: "18px", height: "18px" }} />
                </div>
                <ProgressRing pct={kpi.pct} size={44} stroke={4} color={kpi.color} />
              </div>
              {/* Value */}
              <div className="stat-value text-3xl font-bold leading-none mb-1">
                {kpi.value}
              </div>
              <div className="text-xs font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{kpi.label}</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{kpi.sub}</div>
              {/* Mini progress */}
              <div className="progress-bar mt-3">
                <div className="progress-bar-fill" style={{ width: `${kpi.pct}%`, background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}aa)` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left: Charts */}
        <div className="flex-1 space-y-6 min-w-0">
          <div className="widget-card">
            <GameProgression />
          </div>
          <div className="widget-card">
            <ActivityHeatmap heatmap={{}} />
          </div>

          {/* Quick Actions row */}
          <div className="grid grid-cols-3 gap-3 widget-card" style={{ display: "grid" }}>
            {[
              { label: "30-Day Roadmap", href: "/roadmap", icon: CheckSquare, color: "var(--accent)", desc: "Track daily tasks" },
              { label: "Job Pipeline", href: "/jobs", icon: Briefcase, color: "var(--purple)", desc: "Manage applications" },
              { label: "Resource Hub", href: "/resources", icon: BookOpen, color: "var(--success)", desc: "Curated learning" },
            ].map(({ label, href, icon: Icon, color, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col gap-2 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${color}40`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{label}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity self-end" style={{ color }} />
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Side widgets */}
        <div className="space-y-6 xl:w-[340px] flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4 xl:gap-6">
            <div className="widget-card relative">
              <PomodoroTimer />
            </div>
            <div className="widget-card relative">
              <Pedometer />
            </div>
          </div>
          <div className="widget-card">
            <UpNext resources={weekResources} currentWeek={Math.ceil((stats.completedDaysCount + 1) / 7)} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing import fix — add Briefcase locally
function Briefcase({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
