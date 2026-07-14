export default function Loading() {
  return (
    <div className="h-full flex flex-col pb-12">
      <div className="skeleton h-8 w-48 rounded-lg mb-8" />
      <div className="flex-1 rounded-xl skeleton" />
    </div>
  );
}
