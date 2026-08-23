import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Bookmarks API. All handlers are scoped to the authenticated user — the user
 * id comes from the session, never from the request body, so one user can never
 * touch another's bookmarks.
 *
 * Route Handlers are not cached by default in this Next version, which is what
 * we want for per-user, mutating endpoints.
 */

// GET /api/bookmarks — list the current user's bookmarks, newest first.
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { savedAt: "desc" },
  });

  return NextResponse.json({ bookmarks });
}

// POST /api/bookmarks — save an article. Idempotent via upsert on (userId, url).
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const url = typeof data.url === "string" ? data.url : "";
  const title = typeof data.title === "string" ? data.title : "";
  const source = typeof data.source === "string" ? data.source : "";
  if (!url || !title || !source) {
    return NextResponse.json(
      { error: "url, title and source are required" },
      { status: 400 },
    );
  }

  const publishedAt =
    typeof data.publishedAt === "string" && !Number.isNaN(Date.parse(data.publishedAt))
      ? new Date(data.publishedAt)
      : null;

  const bookmark = await prisma.bookmark.upsert({
    where: { userId_url: { userId: session.user.id, url } },
    update: {}, // already saved — no-op, keeps the call idempotent
    create: {
      userId: session.user.id,
      url,
      title,
      source,
      imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : null,
      excerpt: typeof data.excerpt === "string" ? data.excerpt : null,
      publishedAt,
    },
  });

  return NextResponse.json({ bookmark }, { status: 201 });
}

// DELETE /api/bookmarks — remove a saved article by url.
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const url = typeof (body as Record<string, unknown>).url === "string"
    ? (body as Record<string, string>).url
    : "";
  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  // deleteMany (not delete) so removing a non-existent bookmark is a no-op
  // rather than throwing.
  await prisma.bookmark.deleteMany({
    where: { userId: session.user.id, url },
  });

  return NextResponse.json({ ok: true });
}
