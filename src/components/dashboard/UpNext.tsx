import { PlayCircle, ExternalLink } from "lucide-react";
import { Resource } from "@/lib/resources";

interface Props {
  resources: Resource[];
  currentWeek: number;
}

export function UpNext({ resources, currentWeek }: Props) {
  return (
    <div className="grad-border p-6 h-full flex flex-col" style={{ background: "var(--ds-surface-2)" }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: "var(--ds-text)" }}>
          <PlayCircle className="w-5 h-5" style={{ color: "var(--ds-primary)" }} />
          This Week's Picks
        </h2>
        <span className="text-xs font-medium px-2 py-1 rounded-md" style={{ background: "var(--ds-surface-3)", color: "var(--ds-text-dim)" }}>
          Week {currentWeek}
        </span>
      </div>

      <div className="space-y-4 flex-1">
        <h3 className="text-sm font-medium mb-3" style={{ color: "var(--ds-primary)" }}>Curated Resources</h3>
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
