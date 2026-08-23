import Parser from "rss-parser";
import { SOURCES, getSource, type Source } from "./feeds";

/** Normalized article shape used everywhere in the UI. */
export type Article = {
  id: string; // stable hash of the url
  title: string;
  url: string;
  excerpt: string;
  imageUrl: string | null;
  sourceId: string;
  sourceName: string;
  sourceColor: string;
  publishedAt: string | null; // ISO string
};

// rss-parser custom fields — different sources expose images differently.
type FeedItem = {
  title?: string;
  link?: string;
  contentSnippet?: string;
  content?: string;
  isoDate?: string;
  pubDate?: string;
  enclosure?: { url?: string };
  "media:content"?: { $?: { url?: string } } | Array<{ $?: { url?: string } }>;
  "media:thumbnail"?: { $?: { url?: string } };
};

const parser: Parser<unknown, FeedItem> = new Parser({
  timeout: 10_000,
  headers: { "User-Agent": "ZenayeNewsReader/1.0 (+https://example.com)" },
  customFields: {
    item: [
      ["media:content", "media:content", { keepArray: false }],
      ["media:thumbnail", "media:thumbnail"],
      ["content:encoded", "content"],
    ],
  },
});

/** Best-effort extraction of a lead image from a feed item. */
function extractImage(item: FeedItem): string | null {
  if (item.enclosure?.url) return item.enclosure.url;

  const media = item["media:content"];
  if (Array.isArray(media)) {
    const withUrl = media.find((m) => m?.$?.url);
    if (withUrl?.$?.url) return withUrl.$.url;
  } else if (media?.$?.url) {
    return media.$.url;
  }

  if (item["media:thumbnail"]?.$?.url) return item["media:thumbnail"].$.url;

  // Fall back to the first <img> in the HTML content.
  const html = item.content ?? "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function cleanText(text: string, max = 240): string {
  const stripped = text
    .replace(/<[^>]*>/g, "") // drop any stray HTML
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length > max ? stripped.slice(0, max).trimEnd() + "…" : stripped;
}

// Small deterministic hash → stable article id.
function hashId(url: string): string {
  let h = 0;
  for (let i = 0; i < url.length; i++) {
    h = (Math.imul(31, h) + url.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

async function fetchSource(source: Source): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.feedUrl);
    return (feed.items ?? [])
      .filter((item) => item.link && item.title)
      .map((item) => ({
        id: hashId(item.link!),
        title: cleanText(item.title!, 160),
        url: item.link!,
        excerpt: cleanText(item.contentSnippet ?? item.content ?? ""),
        imageUrl: extractImage(item),
        sourceId: source.id,
        sourceName: source.name,
        sourceColor: source.color,
        publishedAt:
          item.isoDate ?? (item.pubDate ? new Date(item.pubDate).toISOString() : null),
      }));
  } catch (err) {
    // A single flaky feed shouldn't take down the whole aggregation.
    console.error(`Failed to fetch feed for ${source.id}:`, (err as Error).message);
    return [];
  }
}

/** Fetch and merge the requested sources (or all), newest first. */
async function loadArticles(sourceIds?: string[]): Promise<Article[]> {
  const sources =
    sourceIds && sourceIds.length > 0
      ? sourceIds.map(getSource).filter((s): s is Source => Boolean(s))
      : SOURCES;

  const batches = await Promise.all(sources.map(fetchSource));
  const merged = batches.flat();

  merged.sort((a, b) => {
    const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return tb - ta;
  });

  return merged;
}

// In-process TTL cache: avoids hammering upstream feeds on every request
// without relying on the deprecated `unstable_cache`. Entries store the
// in-flight promise so concurrent cold requests share a single fetch; failed
// loads are evicted so the next call retries rather than serving a rejection.
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const articleCache = new Map<string, { at: number; promise: Promise<Article[]> }>();

/**
 * Fetch and merge all (or a subset of) sources, newest first.
 * Results are cached for 15 minutes, keyed by the (normalized) source set.
 */
export function getArticles(sourceIds?: string[]): Promise<Article[]> {
  const key =
    sourceIds && sourceIds.length > 0
      ? [...sourceIds].sort().join(",")
      : "__all__";

  const now = Date.now();
  const hit = articleCache.get(key);
  if (hit && now - hit.at < CACHE_TTL_MS) {
    return hit.promise;
  }

  const promise = loadArticles(sourceIds);
  articleCache.set(key, { at: now, promise });

  // Don't cache a rejection — drop the entry so a later call can retry.
  promise.catch(() => {
    const current = articleCache.get(key);
    if (current && current.promise === promise) {
      articleCache.delete(key);
    }
  });

  return promise;
}
