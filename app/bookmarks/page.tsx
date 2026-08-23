import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSource } from "@/lib/feeds";
import { ArticleGrid } from "@/components/ArticleGrid";
import type { Article } from "@/lib/rss";

export const metadata: Metadata = { title: "Bookmarks — Zenaye" };

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const rows = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { savedAt: "desc" },
  });

  // Rebuild the UI Article shape from the stored snapshot; `source` holds the
  // source id, so name/color come back from the registry (falling back if a
  // source was since removed).
  const articles: Article[] = rows.map((b) => {
    const src = getSource(b.source);
    return {
      id: b.id,
      title: b.title,
      url: b.url,
      excerpt: b.excerpt ?? "",
      imageUrl: b.imageUrl,
      sourceId: b.source,
      sourceName: src?.name ?? b.source,
      sourceColor: src?.color ?? "#3f3f46",
      publishedAt: b.publishedAt ? b.publishedAt.toISOString() : null,
    };
  });

  const bookmarkedUrls = new Set(articles.map((a) => a.url));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Your bookmarks</h1>
        <p className="text-sm text-zinc-500">
          {articles.length} saved {articles.length === 1 ? "story" : "stories"}
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <p className="text-lg font-medium text-zinc-300">No bookmarks yet</p>
          <p className="max-w-sm text-sm text-zinc-500">
            Tap the bookmark icon on any story to save it here for later.
          </p>
          <Link
            href="/"
            className="mt-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            Browse the feed
          </Link>
        </div>
      ) : (
        <ArticleGrid articles={articles} bookmarkedUrls={bookmarkedUrls} />
      )}
    </main>
  );
}
