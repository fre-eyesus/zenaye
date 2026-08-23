import { ArticleGridSkeleton } from "@/components/ArticleGridSkeleton";

// Shown while the home feed fetches. Dynamic RSS fetching can take a beat, so a
// skeleton keeps the layout stable and signals progress.
export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-zinc-800" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-zinc-800" />
        </div>
        <div className="h-9 w-full max-w-md animate-pulse rounded-lg bg-zinc-900" />
      </div>
      <ArticleGridSkeleton />
    </main>
  );
}
