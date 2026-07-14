"use client";
import { useState, useEffect } from "react";
import { PlayCircle, ExternalLink, CheckCircle } from "lucide-react";
import { Resource } from "@/lib/resources";

interface Props {
  resources: Resource[];
  currentWeek: number;
}

export function UpNext({ resources, currentWeek }: Props) {
  const [featuredComplete, setFeaturedComplete] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFeaturedComplete(localStorage.getItem("res_complete_MOzEvNYvbik") === "true");
    }
  }, []);

  const toggleFeatured = () => {
    const nextVal = !featuredComplete;
    setFeaturedComplete(nextVal);
    localStorage.setItem("res_complete_MOzEvNYvbik", String(nextVal));
    // Trigger progress update on dashboard if needed
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="grad-border p-6 h-full flex flex-col space-y-6" style={{ background: "var(--ds-surface-2)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: "var(--ds-text)" }}>
          <PlayCircle className="w-5 h-5" style={{ color: "var(--ds-primary)" }} />
          This Week's Picks
        </h2>
        <span className="text-xs font-medium px-2 py-1 rounded-md" style={{ background: "var(--ds-surface-3)", color: "var(--ds-text-dim)" }}>
          Week {currentWeek}
        </span>
      </div>

      {/* Featured Resource Card (Highly requested video) */}
      <div className="rounded-xl overflow-hidden border p-4 flex flex-col gap-3" style={{ background: "var(--ds-surface-3)", borderColor: "var(--ds-border-strong)" }}>
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 self-start px-2 py-0.5 rounded" style={{ background: "rgba(244,63,94,0.1)" }}>
          Featured YouTube Resource
        </span>
        <div className="relative aspect-video rounded-lg overflow-hidden border" style={{ borderColor: "var(--ds-border)" }}>
          <img 
            src="https://img.youtube.com/vi/MOzEvNYvbik/0.jpg" 
            alt="SQL Portfolio Project" 
            className="w-full h-full object-cover"
          />
          <a 
            href="https://youtu.be/MOzEvNYvbik?si=DrTOc2vZttDZvmOb" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors"
          >
            <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-115">
              <span className="text-white text-lg font-bold">▶</span>
            </div>
          </a>
        </div>
        <div>
          <h4 className="font-semibold text-sm" style={{ color: "var(--ds-text)" }}>
            Data Analyst Portfolio Project | SQL Data Exploration
          </h4>
          <p className="text-xs mt-1" style={{ color: "var(--ds-text-muted)" }}>
            Alex The Analyst • End to end SQL project for portfolio.
          </p>
        </div>

        {/* Action Controls for Featured */}
        <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: "var(--ds-border)" }}>
          <button 
            onClick={toggleFeatured}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              featuredComplete 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                : "border-[var(--ds-border-strong)] text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-2)]"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {featuredComplete ? "Completed" : "Mark Done"}
          </button>
          <a 
            href="https://youtu.be/MOzEvNYvbik?si=DrTOc2vZttDZvmOb" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="ml-auto btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
          >
            Open <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <h3 className="text-sm font-semibold" style={{ color: "var(--ds-primary)" }}>Curated Picks</h3>
        <div className="space-y-3">
          {resources.length > 0 ? (
            resources.map(r => (
              <a 
                key={r.id} 
                href={r.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-3 rounded-lg border transition-all duration-200 group"
                style={{ 
                  background: "var(--ds-surface-3)", 
                  borderColor: "var(--ds-border-strong)" 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--ds-primary)";
                  e.currentTarget.style.background = "var(--ds-primary-muted)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--ds-border-strong)";
                  e.currentTarget.style.background = "var(--ds-surface-3)";
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
                    {r.type}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>
                    {r.topic}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2 mt-2">
                  <p className="text-sm font-medium leading-snug" style={{ color: "var(--ds-text)" }}>{r.title}</p>
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--ds-primary)" }} />
                </div>
              </a>
            ))
          ) : (
             <p className="text-sm" style={{ color: "var(--ds-text-muted)" }}>No resources for this week.</p>
          )}
        </div>
      </div>
      
      <a href="/resources" className="btn-primary w-full justify-center mt-6">
        View All Resources
      </a>
    </div>
  );
}
