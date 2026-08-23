"use client";

import { useActionState } from "react";
import {
  saveFavoriteSources,
  type PreferencesState,
} from "@/app/actions/preferences";
import type { Source } from "@/lib/feeds";

/**
 * Favorite-sources picker. Uncontrolled checkboxes (defaultChecked) submit
 * their ids under the `sources` field; the server action validates and saves,
 * returning a status message rendered inline via `useActionState`.
 */
export function PreferencesForm({
  sources,
  initialSelected,
}: {
  sources: Source[];
  initialSelected: string[];
}) {
  const [state, formAction, pending] = useActionState<PreferencesState, FormData>(
    saveFavoriteSources,
    undefined,
  );
  const selectedSet = new Set(initialSelected);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sources.map((source) => (
          <label
            key={source.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 transition-colors hover:border-white/25"
          >
            <input
              type="checkbox"
              name="sources"
              value={source.id}
              defaultChecked={selectedSet.has(source.id)}
              className="h-4 w-4 accent-blue-600"
            />
            <span className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: source.color }}
              />
              <span className="text-sm font-medium text-zinc-200">
                {source.name}
              </span>
            </span>
          </label>
        ))}
      </div>

      {state?.message && (
        <p
          role="status"
          className={`text-sm ${state.ok ? "text-green-400" : "text-red-400"}`}
        >
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save preferences"}
        </button>
        <p className="text-xs text-zinc-500">
          Leave everything unchecked to see all sources.
        </p>
      </div>
    </form>
  );
}
