"use client";
// FIX: This MUST be a Client Component — event handlers (onMouseEnter etc.)
// are forbidden in async Server Components and cause production crashes.
import { useState } from "react";
import { Resource } from "@/lib/resources";
import { ExternalLink, PlayCircle, BookOpen, Code2, BarChart3, CheckCircle2 } from "lucide-react";

const TOPIC_COLORS: Record<string, { bg: string; accent: string; text: string }> = {
  SQL:       { bg: "linear-gradient(135deg,#1e2a4a,#0f1730)", accent: "#5b6cf9", text: "#5b6cf9" },
  Python:    { bg: "linear-gradient(135deg,#2a1e4a,#1a0f30)", accent: "#a855f7", text: "#a855f7" },
  Excel:     { bg: "linear-gradient(135deg,#1a3a1e,#0f2310)", accent: "#10b981", text: "#10b981" },
  Tableau:   { bg: "linear-gradient(135deg,#3a2a1a,#231500)", accent: "#f59e0b", text: "#f59e0b" },
  "Power BI":{ bg: "linear-gradient(135deg,#3a2a1a,#231500)", accent: "#f59e0b", text: "#f59e0b" },
  Stats:     { bg: "linear-gradient(135deg,#1a2e3a,#0f1f2a)", accent: "#06b6d4", text: "#06b6d4" },
  Portfolio: { bg: "linear-gradient(135deg,#3a1e2a,#230f16)", accent: "#f43f5e", text: "#f43f5e" },
  Interview: { bg: "linear-gradient(135deg,#2a3a1e,#162300)", accent: "#84cc16", text: "#84cc16" },
  general:   { bg: "linear-gradient(135deg,#1e253a,#0f1520)", accent: "#5b6cf9", text: "#5b6cf9" },
  sql:       { bg: "linear-gradient(135deg,#1e2a4a,#0f1730)", accent: "#5b6cf9", text: "#5b6cf9" },
  power_bi:  { bg: "linear-gradient(135deg,#3a2a1a,#231500)", accent: "#f59e0b", text: "#f59e0b" },
  excel:     { bg: "linear-gradient(135deg,#1a3a1e,#0f2310)", accent: "#10b981", text: "#10b981" },
  statistics:{ bg: "linear-gradient(135deg,#1a2e3a,#0f1f2a)", accent: "#06b6d4", text: "#06b6d4" },
  portfolio: { bg: "linear-gradient(135deg,#3a1e2a,#230f16)", accent: "#f43f5e", text: "#f43f5e" },
  advanced:  { bg: "linear-gradient(135deg,#2a1e4a,#1a0f30)", accent: "#a855f7", text: "#a855f7" },
};

const TYPE_BADGE_COLOR: Record<string, string> = {
  YouTube: "#f43f5e",
  Course:  "#5b6cf9",
  Article: "#10b981",
  Practice:"#f59e0b",
  Channel: "#06b6d4",
};

function getThumb(resource: Resource): string | null {
  // Standard video thumbnail
  if (resource.youtubeId) {
    return `https://img.youtube.com/vi/${resource.youtubeId}/hqdefault.jpg`;
  }
  return null;
}

export function ResourceCard({ resource }: { resource: Resource }) {
  const [done, setDone] = useState(false);
  const [hovered, setHovered] = useState(false);
  const thumb = getThumb(resource);
  const meta = TOPIC_COLORS[resource.topic] || TOPIC_COLORS["general"];
  const typeColor = TYPE_BADGE_COLOR[resource.type] || "#5b6cf9";

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col group transition-all duration-200"
      style={{
        background: "var(--surface-1)",
        border: `1px solid ${hovered ? meta.accent + "40" : "var(--border)"}`,
        boxShadow: hovered ? `0 12px 32px -8px ${meta.accent}25` : "none",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16/9", background: meta.bg, flexShrink: 0 }}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={resource.title}
            className="w-full h-full object-cover transition-all duration-300"
            style={{ opacity: hovered ? 1 : 0.8, transform: hovered ? "scale(1.04)" : "scale(1)" }}
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          /* Placeholder for non-video resources */
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `${meta.accent}20`, border: `1px solid ${meta.accent}30` }}
            >
              {resource.type === "Channel" ? (
                <PlayCircle className="w-6 h-6" style={{ color: meta.accent }} />
              ) : resource.type === "Practice" ? (
                <Code2 className="w-6 h-6" style={{ color: meta.accent }} />
              ) : resource.type === "Course" ? (
                <BarChart3 className="w-6 h-6" style={{ color: meta.accent }} />
              ) : (
                <BookOpen className="w-6 h-6" style={{ color: meta.accent }} />
              )}
            </div>
            {resource.channel && (
              <span className="text-xs font-semibold" style={{ color: meta.accent }}>{resource.channel}</span>
            )}
          </div>
        )}

        {/* Play overlay for YouTube / Channel */}
        {(resource.type === "YouTube" || resource.type === "Channel") && (
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
            style={{ opacity: hovered ? 1 : 0 }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "rgba(244,63,94,0.9)", backdropFilter: "blur(4px)" }}
            >
              <PlayCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ background: "rgba(0,0,0,0.7)", color: meta.text, backdropFilter: "blur(8px)" }}
          >
            {resource.topic}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: `${typeColor}22`, color: typeColor, border: `1px solid ${typeColor}40` }}
          >
            {resource.type}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3
            className="text-sm font-semibold line-clamp-2 flex-1 leading-snug"
            style={{ color: "var(--text-primary)" }}
          >
            {resource.title}
          </h3>
        </div>

        <p className="text-xs line-clamp-2 mb-4 leading-relaxed flex-1" style={{ color: "var(--text-muted)" }}>
          {resource.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2">
            {resource.channel && (
              <span className="text-[11px] font-medium truncate max-w-[100px]" style={{ color: "var(--text-muted)" }}>
                {resource.channel}
              </span>
            )}
            {resource.week > 0 && (
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
                style={{ background: "var(--surface-3)", color: "var(--text-muted)" }}
              >
                Wk {resource.week}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Progress/Done toggle */}
            <button
              onClick={(e) => { e.preventDefault(); setDone(!done); }}
              className="p-1.5 rounded-lg transition-all duration-150"
              title={done ? "Mark as not done" : "Mark as done"}
              style={{
                background: done ? "var(--success-subtle)" : "var(--surface-3)",
                border: `1px solid ${done ? "rgba(16,185,129,0.3)" : "var(--border)"}`,
              }}
            >
              <CheckCircle2
                className="w-3.5 h-3.5 transition-colors"
                style={{ color: done ? "var(--success)" : "var(--text-muted)" }}
              />
            </button>

            {/* Open button */}
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150"
              style={{
                background: `${meta.accent}15`,
                color: meta.accent,
                border: `1px solid ${meta.accent}25`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              Open
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
