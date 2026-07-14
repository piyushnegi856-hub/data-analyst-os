// Root loading skeleton — shows while the overview page server component hydrates
export default function Loading() {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="skeleton h-7 w-40 rounded-lg" />
        <div className="skeleton h-4 w-64 rounded" />
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)" }}
          >
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-7 w-16 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 rounded-xl p-6 skeleton"
          style={{ height: 360 }}
        />
        <div className="rounded-xl skeleton" style={{ height: 360 }} />
      </div>
    </div>
  );
}
