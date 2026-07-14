export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="skeleton h-8 w-48 rounded-lg mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden" style={{ background: "var(--ds-surface)" }}>
            <div className="skeleton aspect-[4/3]" />
            <div className="p-4 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
