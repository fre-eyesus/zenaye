# Zenaye — Tech News Platform · Build Roadmap

A Next.js platform that aggregates tech news from RSS feeds, shows it in a
beautiful interface, and supports user accounts (login, bookmarks, personalized
feed).

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind v4 · Prisma 6 + SQLite
· Auth.js (NextAuth v5) · rss-parser

---

## ✅ Done

- [x] Scaffold Next.js app (TS, Tailwind, App Router)
- [x] Install deps: prisma, @prisma/client, next-auth, bcryptjs, @auth/prisma-adapter, rss-parser
- [x] Prisma schema: `User` + `Bookmark` models (`prisma/schema.prisma`)
- [x] First migration + SQLite `dev.db` created
- [x] `.env` with `DATABASE_URL` and `AUTH_SECRET` (gitignored)
- [x] `lib/prisma.ts` — Prisma client singleton
- [x] `lib/feeds.ts` — registry of 6 RSS sources
- [x] `lib/rss.ts` — fetch / normalize / image-extract / cache into `Article[]`

---

## ✅ Task 2 — News engine (done)

- [x] **Verify feeds fetch** — all 6 feeds live (techcrunch 20, theverge 10,
      arstechnica 20, hackernews 20, wired 50, engadget 20)
- [x] **`app/api/news/route.ts`** — `GET /api/news?source=<id>` returns the
      aggregated `Article[]`; calls `getArticles()` from `lib/rss.ts`.
      Validates unknown source → 400. Smoke-tested: all=140, hackernews=20,
      bad source → 400.

> Note: `lib/rss.ts` still uses `unstable_cache` (deprecated in Next 16 in
> favor of the `use cache` directive). Deferred by choice — revisit as its
> own task before shipping (see AGENTS.md "heed deprecation notices").

---

## 🔨 Task 3 — Feed UI (the "beautiful interface")

- [ ] **`components/ArticleCard.tsx`** — image (with colored placeholder fallback),
      source badge, title, excerpt, relative time, link to original article
- [ ] **`components/ArticleGrid.tsx`** — responsive card grid
- [ ] **`components/SourceFilter.tsx`** — tabs to filter by source
- [ ] **`components/Header.tsx`** — logo, nav, login/avatar area
- [ ] **`app/page.tsx`** — home feed page wiring the above together
- [ ] **`app/layout.tsx`** — set title/metadata, dark theme, render Header
- [ ] **`app/globals.css`** — dark theme colors / base styles

---

## 🔨 Task 4 — Authentication

- [ ] **`lib/auth.ts`** — Auth.js config: Credentials provider, bcrypt compare,
      Prisma adapter, JWT sessions
- [ ] **`app/api/auth/[...nextauth]/route.ts`** — Auth.js route handlers
- [ ] **`app/api/register/route.ts`** — `POST` create account (hash password)
- [ ] **`components/AuthForm.tsx`** — shared login/signup form
- [ ] **`app/login/page.tsx`** and **`app/signup/page.tsx`**
- [ ] **Session provider** wrapper + make Header show avatar / logout when logged in
- [ ] Wrap protected routes / redirect logic

---

## 🔨 Task 5 — Bookmarks

- [ ] **`app/api/bookmarks/route.ts`** — `GET` (list), `POST` (save), `DELETE` (remove)
- [ ] **`components/BookmarkButton.tsx`** — toggle on each card (auth-gated)
- [ ] **`app/bookmarks/page.tsx`** — list the logged-in user's saved articles

---

## 🔨 Task 6 — Personalization

- [ ] **`app/preferences/page.tsx`** — checkboxes to pick favorite sources
- [ ] Save selection to `User.favoriteSources`
- [ ] Home feed respects favorites when logged in (filter `getArticles`)

---

## 🔨 Task 7 — Polish & ship

- [ ] Loading skeletons for the feed
- [ ] Empty states (no articles / no bookmarks) and error handling
- [ ] Responsive / mobile check
- [ ] Update `README.md` with setup + run instructions
- [ ] `npm run build` passes with no type errors
- [ ] Commit & push

---

## How to run (local dev)

```bash
npm run dev            # start the app at http://localhost:3000
npx prisma studio      # inspect the database (User / Bookmark tables)
npx prisma migrate dev # apply schema changes after editing schema.prisma
```

## Adding a new news source

Append one entry to `SOURCES` in `lib/feeds.ts` (id, name, feedUrl, homepage,
color). Everything else — fetching, filters, preferences — picks it up
automatically.
