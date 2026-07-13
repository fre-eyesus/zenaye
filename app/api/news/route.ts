import type { NextRequest } from "next/server";
import { getArticles } from "@/lib/rss";
import { getSource } from "@/lib/feeds";

/**
 * GET /api/news
 * GET /api/news?source=techcrunch
 *
 * Returns the aggregated, newest-first list of articles. When a `source`
 * query param is present it is validated against the registry and the feed
 * is filtered to that single source; an unknown id yields a 400.
 */
export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("source");

  if (source && !getSource(source)) {
    return Response.json(
      { error: `Unknown source: ${source}` },
      { status: 400 },
    );
  }

  const articles = await getArticles(source ? [source] : undefined);

  return Response.json({ count: articles.length, articles });
}
