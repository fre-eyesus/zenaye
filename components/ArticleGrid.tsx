import type { Article } from "@/lib/rss";
import { ArticleCard } from "./ArticleCard";

/**
 * Responsive grid of article cards. Server Component.
 * Shows an empty state when there are no articles (e.g. a source is down).
 */
export function ArticleGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-lg font-medium text-zinc-300">No articles right now</p>
        <p className="text-sm text-zinc-500">
          The feed came back empty. Try another source or check back shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
