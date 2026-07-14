export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="skeleton h-8 w-48 rounded-lg mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden skeleton" style={{ height: 260 }} />
        ))}
      </div>
    </div>
  );
}
