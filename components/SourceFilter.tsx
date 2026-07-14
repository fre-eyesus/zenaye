import Link from "next/link";
import { SOURCES } from "@/lib/feeds";

/**
 * Source filter tabs. Server Component — each tab is a <Link> that sets the
 * `?source=` query param, so filtering is a normal navigation (shareable URLs,
 * no client JS). The active source is highlighted with its accent color.
 */
export function SourceFilter({ active }: { active?: string }) {
  const tabs = [{ id: undefined, name: "All", color: "#3b82f6" }, ...SOURCES];

  return (
    <nav className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id ?? "all"}
            href={tab.id ? `/?source=${tab.id}` : "/"}
            className="rounded-full border px-3 py-1 text-sm font-medium transition-colors"
            style={
              isActive
                ? { backgroundColor: tab.color, borderColor: tab.color, color: "#fff" }
                : { borderColor: "rgba(255,255,255,0.12)", color: "#a1a1aa" }
            }
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
