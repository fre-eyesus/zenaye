import Link from "next/link";

/**
 * Top navigation bar. Server Component for now — the login/avatar area is a
 * placeholder that Task 4 (auth) will wire up to the session.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            Zenaye
          </span>
          <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Tech
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-zinc-300 hover:text-white">
            Feed
          </Link>
          {/* Auth-gated links land here in Task 4/5. */}
          <Link
            href="/login"
            className="rounded-md bg-white px-3 py-1.5 font-medium text-black hover:bg-zinc-200"
          >
            Log in
          </Link>
        </nav>
      </div>
    </header>
  );
}
