export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12">
      <div className="skeleton h-8 w-48 rounded-lg" />
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--ds-surface)" }}>
        <div className="skeleton h-14 border-b" style={{ borderColor: "var(--ds-border)" }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-5 flex gap-4 border-b" style={{ borderColor: "var(--ds-border)" }}>
            <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
