"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GameProgression } from "./GameProgression";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { UpNext } from "./UpNext";
import { SprintStats } from "@/lib/data";
import { Resource } from "@/lib/resources";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  stats: SprintStats;
  weekResources: Resource[];
}

export function DashboardClient({ stats, weekResources }: Props) {
  const container = useRef<HTMLDivElement>(null);

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

        // 1. Headings
        tl.from(".section-heading", { 
          opacity: 0, y: 40, filter: "blur(6px)", duration: 1, ease: "power3.out" 
        });
        
        // 2. Subheading / Body
        tl.from(".section-body", { 
          opacity: 0, y: 20, duration: 0.8, ease: "power2.out" 
        }, "-=0.85");

        // 3. Stat Blocks (KPIs)
        tl.from(".stat-block", {
          opacity: 0, y: 24, duration: 0.75, ease: "power2.out", stagger: 0.08
        }, "-=0.5");

        // 4. Main Charts & Widgets
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
      {/* Overview GSAP Animated Section */}
      <div>
        <h1 className="section-heading text-3xl font-bold tracking-tight" style={{ color: "var(--ds-text)" }}>Overview</h1>
        <p className="section-body text-sm mt-1" style={{ color: "var(--ds-text-muted)" }}>Your progress on the 30-day Data Analyst sprint.</p>
      </div>

      {/* Top KPI Cards (Bento style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Sprint Progress", value: `${stats.progressPct}%`, trend: `Week ${stats.currentWeek}` },
          { label: "Day Streak", value: stats.streak, trend: "Keep it up!" },
          { label: "Hours Logged", value: stats.hoursLogged, trend: `${stats.logCount} sessions` },
          { label: "XP Gained", value: "1,250", trend: "Level 3 Analyst" },
        ].map((kpi, i) => (
          <div key={i} className="stat-block glass-card p-5 rounded-xl flex flex-col">
            <span className="text-sm font-medium" style={{ color: "var(--ds-text-muted)" }}>{kpi.label}</span>
            <span className="stat-value text-3xl font-bold mt-2">{kpi.value}</span>
            <span className="text-xs font-medium mt-1" style={{ color: "var(--ds-success)" }}>{kpi.trend}</span>
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
            <ActivityHeatmap heatmap={stats.heatmap} />
          </div>
        </div>

        {/* Right Sidebar Widget Area */}
        <div className="space-y-6">
          <div className="widget-card force3d">
            <UpNext resources={weekResources} currentWeek={stats.currentWeek} />
          </div>
        </div>
      </div>
    </div>
  );
}
