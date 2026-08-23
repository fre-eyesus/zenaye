import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SOURCES, parseFavoriteSources } from "@/lib/feeds";
import { PreferencesForm } from "@/components/PreferencesForm";

export const metadata: Metadata = { title: "Preferences — Zenaye" };

export default async function PreferencesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { favoriteSources: true },
  });
  const selected = parseFavoriteSources(user?.favoriteSources);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Preferences</h1>
        <p className="text-sm text-zinc-500">
          Choose the sources that make up your default feed.
        </p>
      </div>
      <PreferencesForm sources={SOURCES} initialSelected={selected} />
    </main>
  );
}
