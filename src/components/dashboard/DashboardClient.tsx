"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GameProgression } from "./GameProgression";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { UpNext } from "./UpNext";
import { 
  loadUserProfile, 
  loadAllDaysState, 
  calculateClientStats, 
  ClientStats, 
  UserProfile 
} from "@/lib/curriculumStore";
import { Resource } from "@/lib/resources";
import { Calendar, CheckSquare, FileText, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  stats: any; // fallback
  weekResources: Resource[];
}

export function DashboardClient({ stats: serverStats, weekResources }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Job Seeker",
    welcomeMessage: "Ready to crush SQL today?",
    profileImage: "",
    focus: "SQL"
  });

  const [stats, setStats] = useState<ClientStats>({
    progressPct: 0,
    streak: 0,
    hoursLogged: 0,
    logCount: 0,
    completedDaysCount: 0
  });

  const loadData = () => {
    const prof = loadUserProfile();
    setProfile(prof);

    const daysState = loadAllDaysState();
    const computed = calculateClientStats(daysState);
    setStats(computed);
  };

  useEffect(() => {
    loadData();

    // Listen for storage changes to keep dashboard synced
    window.addEventListener("storage", loadData);
    return () => {
      window.removeEventListener("storage", loadData);
    };
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();
      
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          }
        });

        tl.from(".section-heading", { 
          opacity: 0, y: 40, filter: "blur(6px)", duration: 1, ease: "power3.out" 
        });
        
        tl.from(".section-body", { 
          opacity: 0, y: 20, duration: 0.8, ease: "power2.out" 
        }, "-=0.85");

        tl.from(".stat-block", {
          opacity: 0, y: 24, duration: 0.75, ease: "power2.out", stagger: 0.08
        }, "-=0.5");

        tl.from(".widget-card", {
          opacity: 0, y: 40, duration: 0.75, ease: "power2.out", stagger: 0.1
        }, "-=0.4");
      });
      
      mm.add("(max-width: 767px)", () => {
         const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          }
        });
        tl.from(".section-heading", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" })
          .from(".section-body", { opacity: 0, y: 15, duration: 0.6, ease: "power2.out" }, "-=0.6")
          .from(".stat-block", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out", stagger: 0.05 }, "-=0.4")
          .from(".widget-card", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out", stagger: 0.1 }, "-=0.3");
      });
      
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="space-y-6 pb-12 overflow-hidden">
      {/* Overview GSAP Animated Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card rounded-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10" style={{ background: "var(--ds-primary)", filter: "blur(40px)" }} />
        <div className="flex items-center gap-4">
          {profile.profileImage ? (
            <img 
              src={profile.profileImage} 
              alt="Avatar" 
              className="w-14 h-14 rounded-full object-cover border-2" 
              style={{ borderColor: "var(--ds-primary)" }}
            />
          ) : (
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }}
            >
              {profile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
          )}
          <div>
            <h1 className="section-heading text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Welcome back, {profile.name}!
              <Sparkles className="w-5 h-5 text-[#4f6ef7] animate-pulse" />
            </h1>
            <p className="section-body text-sm mt-1" style={{ color: "var(--ds-text-muted)" }}>
              {profile.welcomeMessage} • Track: <span className="font-semibold text-white">{profile.focus}</span>
            </p>
          </div>
        </div>

        {/* Global Action CTA Buttons */}
        <div className="flex flex-wrap gap-2 md:self-center z-10">
          <Link href="/roadmap" className="btn-primary py-2 px-3 text-xs flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5" /> View Roadmap
          </Link>
          <Link href="/worklog" className="btn-ghost py-2 px-3 text-xs flex items-center gap-1.5 border border-white/10">
            <FileText className="w-3.5 h-3.5" /> Log Activity
          </Link>
          <Link href="/calendar" className="btn-ghost py-2 px-3 text-xs flex items-center gap-1.5 border border-white/10">
            <Calendar className="w-3.5 h-3.5" /> View Calendar
          </Link>
        </div>
      </div>

      {/* Top KPI Cards (Bento style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Sprint Progress", value: `${stats.progressPct}%`, trend: `${stats.completedDaysCount} days complete` },
          { label: "Day Streak", value: `${stats.streak} Days`, trend: "Keep it up!" },
          { label: "Hours Logged", value: `${stats.hoursLogged}h`, trend: `${stats.logCount} study sessions` },
          { label: "XP Gained", value: (stats.completedDaysCount * 250 + stats.hoursLogged * 50).toLocaleString(), trend: "Level 3 Analyst" },
        ].map((kpi, i) => (
          <div key={i} className="stat-block glass-card p-5 rounded-xl flex flex-col">
            <span className="text-sm font-medium" style={{ color: "var(--ds-text-muted)" }}>{kpi.label}</span>
            <span className="stat-value text-3xl font-bold mt-2 text-white">{kpi.value}</span>
            <span className="text-xs font-medium mt-1 animate-pulse" style={{ color: "var(--ds-success)" }}>{kpi.trend}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main XP / Radar Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="widget-card force3d">
            <GameProgression />
          </div>
          <div className="widget-card force3d">
            {/* Direct fallback mapping for mock dates if localStorage has no log data yet */}
            <ActivityHeatmap heatmap={{}} />
          </div>
        </div>

        {/* Right Sidebar Widget Area */}
        <div className="space-y-6">
          <div className="widget-card force3d">
            <UpNext resources={weekResources} currentWeek={Math.ceil((stats.completedDaysCount + 1) / 7)} />
          </div>
        </div>
      </div>
    </div>
  );
}
