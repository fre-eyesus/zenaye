import { getArticles } from "@/lib/rss";
import { getSource } from "@/lib/feeds";
import { ArticleGrid } from "@/components/ArticleGrid";
import { SourceFilter } from "@/components/SourceFilter";

/**
 * Home feed. Server Component: reads the optional `?source=` filter, fetches
 * articles directly via getArticles() (no self-HTTP round-trip), and renders
 * the filter tabs + grid. `searchParams` is a Promise in this Next version.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const { source } = await searchParams;
  const active = source && getSource(source) ? source : undefined;

  const articles = await getArticles(active ? [active] : undefined);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Latest in tech</h1>
          <p className="text-sm text-zinc-500">
            {articles.length} stories from your favorite sources
          </p>
        </div>
        <SourceFilter active={active} />
      </div>

      <ArticleGrid articles={articles} />
    </main>
  );
}
