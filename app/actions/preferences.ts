"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SOURCES } from "@/lib/feeds";

/** State surfaced back to the preferences form via `useActionState`. */
export type PreferencesState = { ok: boolean; message: string } | undefined;

/**
 * Persist the current user's favorite sources. Only ids we actually carry are
 * stored; an empty selection means "show all sources". Re-authenticates from
 * the session (never trusts a user id from the client).
 */
export async function saveFavoriteSources(
  _prev: PreferencesState,
  formData: FormData,
): Promise<PreferencesState> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "You must be logged in to save preferences." };
  }

  const valid = new Set(SOURCES.map((s) => s.id));
  const selected = formData
    .getAll("sources")
    .filter((v): v is string => typeof v === "string" && valid.has(v));

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { favoriteSources: JSON.stringify(selected) },
    });
  } catch {
    return { ok: false, message: "Couldn't save your preferences. Try again." };
  }

  // The home feed's default source set is derived from these favorites, so make
  // sure it re-renders fresh on the next visit.
  revalidatePath("/");

  return {
    ok: true,
    message:
      selected.length > 0
        ? `Saved. Your feed now shows ${selected.length} ${selected.length === 1 ? "source" : "sources"}.`
        : "Saved. Your feed shows all sources.",
  };
}
