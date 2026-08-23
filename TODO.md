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
      

> Note: `lib/rss.ts` previously used `unstable_cache` (deprecated in Next 16).
> ✅ **Resolved** — replaced with an in-process TTL cache (15 min, keyed by the
> source set, with in-flight dedup and rejection eviction). No behavior change
> for callers; `getArticles()` is still an async function.

---

## ✅ Task 3 — Feed UI (done)

- [x] **`components/ArticleCard.tsx`** — plain `<img>` (colored placeholder when
      no image), source badge, title, excerpt, relative time, links to original
- [x] **`components/ArticleGrid.tsx`** — responsive 1/2/3-col grid + empty state
- [x] **`components/SourceFilter.tsx`** — `<Link>`-based tabs (`?source=`), no
      client JS, shareable URLs, active tab uses source accent color
- [x] **`components/Header.tsx`** — Zenaye logo, Feed nav, Log in placeholder
- [x] **`app/page.tsx`** — Server Component; reads `?source=`, calls
      `getArticles()` directly, renders filter + grid
- [x] **`app/layout.tsx`** — real title/metadata, renders Header, dark body
- [x] **`app/globals.css`** — pinned dark theme (no longer OS-dependent)
- [x] **`lib/time.ts`** — `relativeTime()` helper (new)

> Design decisions: images use plain `<img>` (feeds pull from many
> unpredictable CDNs; next/image would need per-host whitelisting). SourceFilter
> uses navigation not client state, so the whole feed stays a Server Component.
> Verified live: `/` → 200 (140 stories, cards + tabs render),
> `/?source=wired` → 200 filtered. tsc clean, no runtime errors.

---

## ✅ Task 4 — Authentication (done)

- [x] **`lib/auth.ts`** — Auth.js config: Credentials provider, bcrypt compare,
      **JWT** sessions, `trustHost: true`. **No Prisma adapter** — the schema is
      credentials-only (no Account/Session tables), so a direct Prisma lookup in
      `authorize` is the right fit; Credentials also requires JWT sessions.
- [x] **`app/api/auth/[...nextauth]/route.ts`** — Auth.js route handlers
- [x] **`app/actions/auth.ts`** — `login` + `signup` Server Actions (hash with
      bcrypt, validate, then `signIn`). Chose Server Actions over a
      `/api/register` route — this version's blessed form pattern (`useActionState`).
- [x] **`components/AuthForm.tsx`** — shared login/signup form
- [x] **`app/login/page.tsx`** and **`app/signup/page.tsx`** (redirect if already in)
- [x] **`components/SessionProviderWrapper.tsx`** + **`components/UserNav.tsx`** —
      Header shows Bookmarks/Preferences + avatar + Log out when logged in
- [x] Protected routes redirect to `/login` (`bookmarks`, `preferences`)

> Runtime-verified: real credentials login sets a session cookie; `/api/auth/session`
> returns the user (with `id`); `trustHost: true` was required — without it a
> self-hosted production build fails every `/api/auth/*` call with `UntrustedHost`
> (dev auto-trusts, so it only shows under `next start`).

---

## ✅ Task 5 — Bookmarks (done)

- [x] **`app/api/bookmarks/route.ts`** — `GET` (list), `POST` (upsert/idempotent),
      `DELETE` (remove). All scoped to the session user; 401 when unauthenticated.
- [x] **`components/BookmarkButton.tsx`** — optimistic toggle on each card,
      overlaid outside the `<a>`, `router.refresh()` to resync server data
- [x] **`app/bookmarks/page.tsx`** — lists the user's saved articles (auth-gated),
      reconstructs the `Article` shape from the stored snapshot

> Runtime-verified: GET/POST/DELETE + idempotent re-POST all behave correctly
> with a real session cookie.

---

## ✅ Task 6 — Personalization (done)

- [x] **`app/preferences/page.tsx`** + **`components/PreferencesForm.tsx`** —
      favorite-source checkboxes
- [x] Save selection to `User.favoriteSources` via **`app/actions/preferences.ts`**
      (validates ids, `revalidatePath("/")`)
- [x] Home feed uses favorites as the default source set when logged in
      (explicit `?source=` always wins) — see `lib/feeds.ts#parseFavoriteSources`

---

## ✅ Task 7 — Polish & ship (done, pending push)

- [x] Loading skeletons for the feed (`app/loading.tsx`, `app/bookmarks/loading.tsx`,
      `components/ArticleGridSkeleton.tsx`)
- [x] Empty states (no articles / no bookmarks) + error handling
      (`app/error.tsx`, `app/not-found.tsx`)
- [x] Responsive / mobile check — Header + SourceFilter wrap; grid is 1/2/3-col
- [x] Rewrote `README.md` with setup + run instructions
- [x] `npm run build` passes with no type errors
- [ ] Commit & push _(awaiting confirmation)_

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
