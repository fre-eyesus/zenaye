// Format an ISO timestamp as a compact relative label ("3h ago", "2d ago").
// Returns "" for missing/unparseable dates so callers can omit the element.
export function relativeTime(iso: string | null): string {
  if (!iso) return "";
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";

  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";

  const units: [limit: number, div: number, suffix: string][] = [
    [3600, 60, "m"],
    [86_400, 3600, "h"],
    [604_800, 86_400, "d"],
    [2_629_800, 604_800, "w"],
  ];
  for (const [limit, div, suffix] of units) {
    if (seconds < limit) return `${Math.floor(seconds / div)}${suffix} ago`;
  }
  return `${Math.floor(seconds / 2_629_800)}mo ago`;
}
