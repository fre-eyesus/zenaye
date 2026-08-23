import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-400">
        404
      </p>
      <h1 className="text-2xl font-bold text-white">Page not found</h1>
      <p className="max-w-md text-sm text-zinc-500">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
      >
        Back to the feed
      </Link>
    </main>
  );
}
