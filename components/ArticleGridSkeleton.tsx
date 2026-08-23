/**
 * Placeholder grid shown while articles are loading. Mirrors the ArticleGrid
 * layout so the swap to real content doesn't shift the page.
 */
export function ArticleGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900"
        >
          <div className="aspect-[16/9] w-full animate-pulse bg-zinc-800" />
          <div className="flex flex-col gap-3 p-4">
            <div className="h-4 w-24 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-5 w-full animate-pulse rounded bg-zinc-800" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-zinc-800" />
            <div className="mt-1 h-4 w-full animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
