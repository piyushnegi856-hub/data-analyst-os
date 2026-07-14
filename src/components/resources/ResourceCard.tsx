import { Resource } from "@/lib/resources";
import { ExternalLink, PlayCircle } from "lucide-react";

export async function ResourceCard({ resource }: { resource: Resource }) {
  // Fetch thumbnail from our proxy route if it's a YouTube video
  let thumbnailUrl: string | null = null;
  
  if (resource.youtubeId) {
    // In production we would fetch to our local API route, but since this is a server component 
    // rendering during build, we can just use the youtube URL directly to prevent self-fetch loops
    thumbnailUrl = `https://img.youtube.com/vi/${resource.youtubeId}/hqdefault.jpg`;
  }

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden group transition-all duration-300"
      style={{
        background: "var(--ds-surface-2)",
        border: "1px solid var(--ds-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--ds-primary)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px -10px rgba(79,110,247,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--ds-border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="relative aspect-video w-full bg-[#141720] overflow-hidden">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={thumbnailUrl} 
            alt={resource.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1c2130] to-[#141720]">
            <PlayCircle className="w-12 h-12 text-[#334155] opacity-50" />
          </div>
        )}
        
        {/* Play overlay for YouTube */}
        {resource.type === "YouTube" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
              <PlayCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
           <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/60 text-white backdrop-blur-md">
             {resource.topic}
           </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-semibold line-clamp-2" style={{ color: "var(--ds-text)" }}>
            {resource.title}
          </h3>
          <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: "var(--ds-primary)" }} />
        </div>
        
        <p className="text-xs line-clamp-2 mb-3" style={{ color: "var(--ds-text-muted)" }}>
          {resource.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[10px] font-medium" style={{ color: "var(--ds-text-dim)" }}>
            {resource.channel || "External Resource"}
          </span>
          <span className="text-[10px] font-semibold px-2 py-1 rounded" style={{ background: "var(--ds-surface-3)", color: "var(--ds-text-muted)" }}>
            Week {resource.week}
          </span>
        </div>
      </div>
    </a>
  );
}
