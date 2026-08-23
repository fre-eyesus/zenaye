"use client";

import { useEffect } from "react";

// Route-level error boundary. Feeds can be flaky, so give users a clear message
// and a way to retry without a full reload.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for observability (dev console / server logs).
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
      <p className="max-w-md text-sm text-zinc-500">
        We couldn&apos;t load this page. This is often a temporary feed hiccup —
        give it another try.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
      >
        Try again
      </button>
    </main>
  );
}
