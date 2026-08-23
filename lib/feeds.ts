// Central registry of tech-news RSS sources. Add a source by appending one
// entry here — the rest of the app (fetching, filters, preferences) picks it
// up automatically.

export type Source = {
  /** Stable id used in URLs, filters, and stored preferences. */
  id: string;
  /** Human-facing name shown on cards and filter tabs. */
  name: string;
  /** RSS/Atom feed URL. */
  feedUrl: string;
  /** Public homepage, used for favicons / branding. */
  homepage: string;
  /** Accent color (Tailwind-friendly hex) for the source badge & placeholder. */
  color: string;
};

export const SOURCES: Source[] = [
  {
    id: "techcrunch",
    name: "TechCrunch",
    feedUrl: "https://techcrunch.com/feed/",
    homepage: "https://techcrunch.com",
    color: "#0a9d5a",
  },
  {
    id: "theverge",
    name: "The Verge",
    feedUrl: "https://www.theverge.com/rss/index.xml",
    homepage: "https://www.theverge.com",
    color: "#e5127d",
  },
  {
    id: "arstechnica",
    name: "Ars Technica",
    feedUrl: "https://feeds.arstechnica.com/arstechnica/index",
    homepage: "https://arstechnica.com",
    color: "#ff4e00",
  },
  {
    id: "hackernews",
    name: "Hacker News",
    feedUrl: "https://hnrss.org/frontpage",
    homepage: "https://news.ycombinator.com",
    color: "#ff6600",
  },
  {
    id: "wired",
    name: "Wired",
    feedUrl: "https://www.wired.com/feed/rss",
    homepage: "https://www.wired.com",
    color: "#4b5563",
  },
  {
    id: "engadget",
    name: "Engadget",
    feedUrl: "https://www.engadget.com/rss.xml",
    homepage: "https://www.engadget.com",
    color: "#2c6fb3",
  },
];

const SOURCE_BY_ID = new Map(SOURCES.map((s) => [s.id, s]));

export function getSource(id: string): Source | undefined {
  return SOURCE_BY_ID.get(id);
}

/**
 * Parse a stored `favoriteSources` JSON string into a clean list of source ids,
 * dropping anything malformed or pointing at a source we no longer carry.
 */
export function parseFavoriteSources(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (id): id is string => typeof id === "string" && SOURCE_BY_ID.has(id),
    );
  } catch {
    return [];
  }
}
