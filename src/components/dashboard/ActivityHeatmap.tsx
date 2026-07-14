import { SPRINT_START_DATE } from "@/lib/data";

interface Props {
  heatmap: Record<string, number>;
}

export function ActivityHeatmap({ heatmap }: Props) {
  // Generate 30 days based on SPRINT_START_DATE
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(SPRINT_START_DATE);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const hours = heatmap[dateStr] || 0;
    
    let intensity = 0;
    if (hours > 0 && hours < 2) intensity = 1;
    else if (hours >= 2 && hours < 4) intensity = 2;
    else if (hours >= 4) intensity = 3;

    return { day: i + 1, dateStr, hours: hours > 0 ? hours.toFixed(1) : 0, intensity };
  });

  return (
    <div className="glass-card p-6 rounded-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold" style={{ color: "var(--ds-text)" }}>Sprint Heatmap</h2>
          <p className="text-sm mt-1" style={{ color: "var(--ds-text-muted)" }}>Your daily hours logged over the 30-day sprint.</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex gap-1.5 flex-wrap">
          {days.map((d, i) => {
            const bgClass =
              d.intensity === 0 ? "bg-[var(--ds-surface-3)]" :
              d.intensity === 1 ? "bg-[rgba(79,110,247,0.3)]" :
              d.intensity === 2 ? "bg-[rgba(79,110,247,0.6)]" : "bg-[var(--ds-primary)]";
            return (
              <div
                key={i}
                title={`Day ${d.day} (${d.dateStr}): ${d.hours}h`}
                className={`heatmap-cell w-5 h-5 rounded-sm cursor-pointer ${bgClass}`}
                style={{
                  border: d.intensity === 0 ? "1px solid var(--ds-border-strong)" : "none",
                }}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 justify-end mt-4 text-xs" style={{ color: "var(--ds-text-muted)" }}>
          <span>Less</span>
          <div className="w-3 h-3 rounded-[2px]" style={{ background: "var(--ds-surface-3)", border: "1px solid var(--ds-border-strong)" }} />
          <div className="w-3 h-3 rounded-[2px]" style={{ background: "rgba(79,110,247,0.3)" }} />
          <div className="w-3 h-3 rounded-[2px]" style={{ background: "rgba(79,110,247,0.6)" }} />
          <div className="w-3 h-3 rounded-[2px]" style={{ background: "var(--ds-primary)" }} />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
