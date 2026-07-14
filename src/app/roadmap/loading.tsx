export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <div className="w-1/3 rounded-xl skeleton" />
      <div className="flex-1 rounded-xl skeleton" />
    </div>
  );
}
