"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

/**
 * Right-hand side of the Header. Reactively reflects auth state via
 * `useSession()`: shows Bookmarks/Preferences + avatar + logout when signed in,
 * a Log in button otherwise.
 */
export function UserNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 w-24 animate-pulse rounded-md bg-white/10" />;
  }

  if (session?.user) {
    const label = session.user.name || session.user.email || "Account";
    const initial = label.charAt(0).toUpperCase();

    return (
      <>
        <Link href="/bookmarks" className="text-zinc-300 hover:text-white">
          Bookmarks
        </Link>
        <Link href="/preferences" className="text-zinc-300 hover:text-white">
          Preferences
        </Link>
        <span
          title={label}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white"
        >
          {initial}
        </span>
        <button
          type="button"
          onClick={() => signOut({ redirectTo: "/" })}
          className="text-zinc-400 hover:text-white"
        >
          Log out
        </button>
      </>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-md bg-white px-3 py-1.5 font-medium text-black hover:bg-zinc-200"
    >
      Log in
    </Link>
  );
}
