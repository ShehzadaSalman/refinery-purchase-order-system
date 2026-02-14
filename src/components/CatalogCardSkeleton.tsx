export function CatalogCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-zinc-200 bg-white p-4">
      <div className="mb-3 h-4 w-24 rounded bg-zinc-200" />
      <div className="mb-2 h-5 w-3/4 rounded bg-zinc-200" />
      <div className="mb-4 h-4 w-5/6 rounded bg-zinc-200" />
      <div className="mb-3 h-4 w-1/2 rounded bg-zinc-200" />
      <div className="h-4 w-1/3 rounded bg-zinc-200" />
    </div>
  );
}
