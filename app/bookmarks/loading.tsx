import { ArticleGridSkeleton } from "@/components/ArticleGridSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="h-8 w-48 animate-pulse rounded bg-zinc-800" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-zinc-800" />
      </div>
      <ArticleGridSkeleton count={6} />
    </main>
  );
}
