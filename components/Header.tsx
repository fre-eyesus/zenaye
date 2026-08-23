import Link from "next/link";
import { UserNav } from "@/components/UserNav";

/**
 * Top navigation bar. The auth-aware area (UserNav) is a client island that
 * reflects the session; the rest renders on the server.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            Zenaye
          </span>
          <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Tech
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <Link href="/" className="text-zinc-300 hover:text-white">
            Feed
          </Link>
          <UserNav />
        </nav>
      </div>
    </header>
  );
}
