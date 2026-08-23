# Zenaye

A tech-news aggregator. Zenaye pulls stories from popular tech RSS feeds into a
single fast, dark-themed feed — with accounts, bookmarks, and a personalizable
default view.

## Features

- **Aggregated feed** — merges articles from TechCrunch, The Verge, Ars Technica,
  Hacker News, Wired, and Engadget, newest first. Feeds are fetched server-side
  and cached for 15 minutes.
- **Source filtering** — narrow the feed to any single source via `?source=`.
- **Accounts** — email + password auth (Auth.js Credentials, bcrypt-hashed
  passwords, JWT sessions).
- **Bookmarks** — save any story to read later; bookmarks are per-user.
- **Personalization** — pick your favorite sources; your logged-in default feed
  shows only those.
- **Polish** — loading skeletons, empty/error states, and a responsive layout.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions)
- [React 19](https://react.dev)
- [Auth.js v5](https://authjs.dev) (`next-auth`) — Credentials provider, JWT sessions
- [Prisma 6](https://www.prisma.io) with SQLite
- [Tailwind CSS v4](https://tailwindcss.com)
- [`rss-parser`](https://github.com/rbren/rss-parser) for feed ingestion

## Getting started

### Prerequisites

- Node.js 20+
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```bash
# SQLite database file (relative to the prisma/ directory)
DATABASE_URL="file:./dev.db"

# Secret used to sign session tokens. Generate one with:
#   npx auth secret        (writes it for you)
#   openssl rand -base64 32
AUTH_SECRET="your-generated-secret"
```

`.env` is gitignored — never commit real secrets.

### 3. Set up the database

```bash
npx prisma migrate dev
```

This applies the migrations and generates the Prisma client.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run ESLint                           |

## Project structure

```
app/
  page.tsx                    # Home feed (source selection + bookmarks)
  layout.tsx                  # Root layout, session provider, header
  loading.tsx / error.tsx     # Feed skeleton + error boundary
  not-found.tsx               # 404
  login/ · signup/            # Auth pages
  bookmarks/                  # Saved stories (auth-gated)
  preferences/                # Favorite-source picker (auth-gated)
  actions/                    # Server Actions (auth, preferences)
  api/
    auth/[...nextauth]/       # Auth.js route handlers
    bookmarks/                # Bookmarks REST endpoint (GET/POST/DELETE)
components/                   # Header, article cards/grid, forms, buttons
lib/
  feeds.ts                    # Source registry + helpers
  rss.ts                      # Feed fetching, normalization, TTL cache
  auth.ts                     # Auth.js configuration
  prisma.ts                   # Prisma client singleton
  time.ts                     # Relative-time formatting
prisma/
  schema.prisma               # User + Bookmark models
```

## How it works

- **Feeds** are fetched and normalized in `lib/rss.ts` into a common `Article`
  shape, then merged and sorted. An in-process TTL cache (keyed by the source
  set) avoids re-fetching upstream feeds on every request.
- **Auth** uses the Auth.js Credentials provider with a direct Prisma lookup and
  a bcrypt comparison; sessions are JWTs (no database session table). The user
  id is exposed on the session so server code can scope queries.
- **Bookmarks** store a denormalized snapshot of the article (title, url, source,
  image, excerpt) so saved stories render without re-fetching the feed. Every
  endpoint is scoped to the session user.
- **Personalization** stores favorite source ids on the user; the home feed uses
  them as the default source set when no explicit `?source=` filter is present.

## Notes

This project targets **Next.js 16**, which changed a number of APIs from earlier
versions (async `cookies()`/`searchParams`, `proxy` in place of `middleware`, and
updated cache-revalidation primitives). See `AGENTS.md` before making changes.
