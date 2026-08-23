import { getArticles } from "@/lib/rss";
import { getSource, parseFavoriteSources } from "@/lib/feeds";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArticleGrid } from "@/components/ArticleGrid";
import { SourceFilter } from "@/components/SourceFilter";

/**
 * Home feed. Server Component: reads the optional `?source=` filter, and for a
 * logged-in user loads their saved favorites (to shape the default feed) and
 * bookmarked urls (to light up the bookmark toggles). Fetches articles directly
 * via getArticles() (no self-HTTP round-trip). `searchParams` is a Promise in
 * this Next version.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const { source } = await searchParams;
  const active = source && getSource(source) ? source : undefined;

  const session = await auth();

  let favorites: string[] = [];
  let bookmarkedUrls: Set<string> | undefined;
  if (session?.user) {
    const [user, marks] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { favoriteSources: true },
      }),
      prisma.bookmark.findMany({
        where: { userId: session.user.id },
        select: { url: true },
      }),
    ]);
    favorites = parseFavoriteSources(user?.favoriteSources);
    bookmarkedUrls = new Set(marks.map((m) => m.url));
  }

  // Source selection: an explicit ?source= filter always wins; otherwise a
  // logged-in user's saved favorites drive the default feed; otherwise all.
  const sourceIds = active
    ? [active]
    : favorites.length > 0
      ? favorites
      : undefined;

  const articles = await getArticles(sourceIds);
  const personalized = !active && favorites.length > 0;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {personalized ? "Your feed" : "Latest in tech"}
          </h1>
          <p className="text-sm text-zinc-500">
            {articles.length} {articles.length === 1 ? "story" : "stories"}
            {personalized ? " from your favorite sources" : ""}
          </p>
        </div>
        <SourceFilter active={active} />
      </div>

      <ArticleGrid articles={articles} bookmarkedUrls={bookmarkedUrls} />
    </main>
  );
}
