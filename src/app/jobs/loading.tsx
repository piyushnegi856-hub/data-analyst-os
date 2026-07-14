export default function Loading() {
  return (
    <div className="h-full flex flex-col pb-12">
      <div className="skeleton h-8 w-48 rounded-lg mb-8" />
      <div className="flex-1 flex gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-80 rounded-xl skeleton" style={{ height: 400 }} />
        ))}
      </div>
    </div>
  );
}
