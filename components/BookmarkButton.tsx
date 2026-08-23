"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/lib/rss";

/**
 * Toggle a bookmark for an article. Optimistically flips its own icon, calls
 * the /api/bookmarks endpoint, then `router.refresh()` so server data (the
 * bookmarks page list, the home feed's saved set) stays in sync. Reverts the
 * optimistic state if the request fails.
 *
 * Rendered as an overlay on the card, so it stops click propagation to avoid
 * triggering the card's link.
 */
export function BookmarkButton({
  article,
  initialBookmarked,
}: {
  article: Article;
  initialBookmarked: boolean;
}) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, startTransition] = useTransition();

  function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const next = !bookmarked;
    setBookmarked(next); // optimistic

    startTransition(async () => {
      try {
        const res = await fetch("/api/bookmarks", {
          method: next ? "POST" : "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            next
              ? {
                  url: article.url,
                  title: article.title,
                  source: article.sourceId,
                  imageUrl: article.imageUrl,
                  excerpt: article.excerpt,
                  publishedAt: article.publishedAt,
                }
              : { url: article.url },
          ),
        });
        if (!res.ok) throw new Error("Request failed");
        router.refresh();
      } catch {
        setBookmarked(!next); // revert on failure
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
      title={bookmarked ? "Remove bookmark" : "Save bookmark"}
      className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-colors disabled:opacity-60 ${
        bookmarked
          ? "bg-blue-600 text-white hover:bg-blue-500"
          : "bg-black/60 text-white hover:bg-black/80"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
