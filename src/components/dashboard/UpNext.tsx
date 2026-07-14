"use client";
import { useState, useEffect } from "react";
import { PlayCircle, ExternalLink, CheckCircle, Plus, X, Link as LinkIcon, Loader2 } from "lucide-react";
import { Resource } from "@/lib/resources";

interface CustomResource {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  done: boolean;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function getYouTubeThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/0.jpg`;
}

function extractDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

async function fetchResourceMeta(url: string): Promise<Partial<CustomResource>> {
  // For YouTube: extract video ID
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return {
      thumbnail: getYouTubeThumbnail(ytId),
      title: `YouTube: ${extractDomain(url)}`,
      description: url,
    };
  }

  // Use oEmbed for known providers or just use domain as title
  try {
    const res = await fetch(`/api/oembed?url=${encodeURIComponent(url)}`);
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title || extractDomain(url),
        description: data.author_name || extractDomain(url),
        thumbnail: data.thumbnail_url || "",
      };
    }
  } catch (e) {}

  return {
    title: extractDomain(url),
    description: url,
    thumbnail: "",
  };
}

interface Props {
  resources: Resource[];
  currentWeek: number;
}

export function UpNext({ resources, currentWeek }: Props) {
  const [featuredComplete, setFeaturedComplete] = useState(false);
  const [customResources, setCustomResources] = useState<CustomResource[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFeaturedComplete(localStorage.getItem("res_complete_MOzEvNYvbik") === "true");
      const raw = localStorage.getItem("custom_resources");
      if (raw) {
        try { setCustomResources(JSON.parse(raw)); } catch (e) {}
      }
    }
  }, []);

  const saveCustom = (list: CustomResource[]) => {
    setCustomResources(list);
    localStorage.setItem("custom_resources", JSON.stringify(list));
  };

  const toggleFeatured = () => {
    const next = !featuredComplete;
    setFeaturedComplete(next);
    localStorage.setItem("res_complete_MOzEvNYvbik", String(next));
    window.dispatchEvent(new Event("storage"));
  };

  const handleAddUrl = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setIsLoading(true);
    const meta = await fetchResourceMeta(trimmed);
    const ytId = extractYouTubeId(trimmed);
    const newRes: CustomResource = {
      id: Date.now().toString(),
      url: trimmed,
      title: ytId ? `YouTube: ${ytId}` : (meta.title || extractDomain(trimmed)),
      description: meta.description || trimmed,
      thumbnail: meta.thumbnail || (ytId ? getYouTubeThumbnail(ytId) : ""),
      done: false,
    };
    saveCustom([newRes, ...customResources]);
    setUrlInput("");
    setShowAdd(false);
    setIsLoading(false);
  };

  const toggleCustomDone = (id: string) => {
    const updated = customResources.map((r) =>
      r.id === id ? { ...r, done: !r.done } : r
    );
    saveCustom(updated);
  };

  const removeCustom = (id: string) => {
    saveCustom(customResources.filter((r) => r.id !== id));
  };

  return (
    <div
      className="grad-border p-6 h-full flex flex-col space-y-5"
      style={{ background: "var(--ds-surface-2)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: "var(--ds-text)" }}>
          <PlayCircle className="w-5 h-5" style={{ color: "var(--ds-primary)" }} />
          This Week's Picks
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-1 rounded-md" style={{ background: "var(--ds-surface-3)", color: "var(--ds-text-dim)" }}>
            Week {currentWeek}
          </span>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: "var(--ds-primary-muted)", color: "var(--ds-primary)" }}
            title="Add resource from URL"
          >
            {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* URL Paste Box */}
      {showAdd && (
        <div
          className="rounded-xl p-3 flex flex-col gap-2 animate-fade-in"
          style={{ background: "var(--ds-surface-3)", border: "1px solid var(--ds-border-strong)" }}
        >
          <p className="text-xs font-semibold" style={{ color: "var(--ds-text-muted)" }}>
            📎 Paste any URL (YouTube, article, course…)
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
              placeholder="https://youtu.be/..."
              className="flex-1 px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--ds-primary)]"
              style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)", color: "var(--ds-text)" }}
              autoFocus
            />
            <button
              onClick={handleAddUrl}
              disabled={isLoading}
              className="btn-primary py-2 px-3 text-xs flex items-center gap-1.5"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LinkIcon className="w-3.5 h-3.5" />}
              Add
            </button>
          </div>
        </div>
      )}

      {/* Featured Resource Card */}
      <div
        className="rounded-xl overflow-hidden border p-4 flex flex-col gap-3"
        style={{ background: "var(--ds-surface-3)", borderColor: "var(--ds-border-strong)" }}
      >
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
            <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
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
            {featuredComplete ? "Completed ✓" : "Mark Done"}
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

      {/* Custom Added Resources */}
      {customResources.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ds-text-muted)" }}>
            Your Added Resources
          </h3>
          {customResources.map((r) => (
            <div
              key={r.id}
              className="rounded-lg p-3 border flex gap-3 group transition-all animate-fade-in"
              style={{
                background: "var(--ds-surface-3)",
                borderColor: r.done ? "rgba(34,197,94,0.3)" : "var(--ds-border-strong)",
              }}
            >
              {r.thumbnail ? (
                <img src={r.thumbnail} alt="" className="w-14 h-10 object-cover rounded shrink-0" />
              ) : (
                <div className="w-14 h-10 rounded shrink-0 flex items-center justify-center" style={{ background: "var(--ds-surface-2)" }}>
                  <LinkIcon className="w-4 h-4" style={{ color: "var(--ds-text-muted)" }} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: r.done ? "var(--ds-text-muted)" : "var(--ds-text)", textDecoration: r.done ? "line-through" : "none" }}>
                  {r.title}
                </p>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[10px] truncate block hover:underline" style={{ color: "var(--ds-primary)" }}>
                  {extractDomain(r.url)}
                </a>
              </div>
              <div className="flex flex-col gap-1 shrink-0 items-end">
                <button onClick={() => removeCustom(r.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3.5 h-3.5 text-red-400" />
                </button>
                <button
                  onClick={() => toggleCustomDone(r.id)}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    r.done ? "bg-emerald-500 border-emerald-500" : "border-[var(--ds-border-strong)]"
                  }`}
                >
                  {r.done && <span className="text-white text-[10px] font-bold">✓</span>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Curated Picks */}
      <div className="space-y-3 flex-1">
        <h3 className="text-sm font-semibold" style={{ color: "var(--ds-primary)" }}>Curated Picks</h3>
        {resources.length > 0 ? (
          resources.map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg border transition-all duration-200 group"
              style={{ background: "var(--ds-surface-3)", borderColor: "var(--ds-border-strong)" }}
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

      <a href="/resources" className="btn-primary w-full justify-center mt-4">
        View All Resources
      </a>
    </div>
  );
}
