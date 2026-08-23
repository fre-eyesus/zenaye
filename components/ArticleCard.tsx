import type { Article } from "@/lib/rss";
import { relativeTime } from "@/lib/time";
import { BookmarkButton } from "@/components/BookmarkButton";

/**
 * A single news article card.
 *
 * Images use a plain <img> (not next/image) on purpose: articles pull thumbnails
 * from many unpredictable feed CDNs, which next/image would require whitelisting.
 * When an article has no image we render a colored placeholder derived from the
 * source's accent color instead.
 *
 * `bookmarked` is optional: when defined (the viewer is logged in) a bookmark
 * toggle is overlaid on the card; when undefined the toggle is hidden. The
 * toggle sits outside the <a> so it never triggers the card's link.
 */
export function ArticleCard({
  article,
  bookmarked,
}: {
  article: Article;
  bookmarked?: boolean;
}) {
  const time = relativeTime(article.publishedAt);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900 transition-colors hover:border-white/25">
      {bookmarked !== undefined && (
        <div className="absolute right-2 top-2 z-10">
          <BookmarkButton article={article} initialBookmarked={bookmarked} />
        </div>
      )}

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-800">
          {article.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.imageUrl}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundColor: article.sourceColor }}
            >
              <span className="text-lg font-semibold text-white/90">
                {article.sourceName}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center gap-2 text-xs">
            <span
              className="rounded-full px-2 py-0.5 font-medium text-white"
              style={{ backgroundColor: article.sourceColor }}
            >
              {article.sourceName}
            </span>
            {time && <span className="text-zinc-500">{time}</span>}
          </div>

          <h2 className="text-base font-semibold leading-snug text-zinc-100 group-hover:text-white">
            {article.title}
          </h2>

          {article.excerpt && (
            <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
              {article.excerpt}
            </p>
          )}
        </div>
      </a>
    </div>
  );
}
