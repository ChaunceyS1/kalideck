"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import type { Category, Tool } from "@/lib/tools/types";
import { useFavorites } from "@/lib/favorites";
import { cx } from "@/components/ui";

const ALL = "All";

export function ToolBrowser({
  tools,
  categories,
}: {
  tools: Tool[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>(ALL);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const { favorites, toggle, ready } = useFavorites();

  const chips = [ALL, ...categories];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      if (active !== ALL && tool.category !== active) return false;
      if (favoritesOnly && !favorites.has(tool.slug)) return false;
      if (!q) return true;
      const haystack = [
        tool.name,
        tool.short,
        tool.category,
        tool.apt,
        ...tool.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [tools, active, favoritesOnly, favorites, query]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools, tags, packages…"
          className="h-11 w-full rounded-field border border-line/60 bg-[#0a1113] pl-9 pr-3 font-sans text-[15px] text-ink placeholder:text-muted/70 outline-none transition focus:border-accent/70 focus:ring-1 focus:ring-accent/30"
        />
      </div>

      {/* Category chips */}
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        <button
          type="button"
          onClick={() => setFavoritesOnly((prev) => !prev)}
          className={cx(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[12px] transition",
            favoritesOnly
              ? "border-accent/60 bg-accent/15 text-accent"
              : "border-line/60 text-muted hover:text-ink",
          )}
        >
          <Star
            size={13}
            className={favoritesOnly ? "fill-accent text-accent" : ""}
          />
          Favorites
        </button>
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setActive(chip)}
            className={cx(
              "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[12px] transition",
              active === chip
                ? "border-accent bg-accent font-semibold text-[#052014]"
                : "border-line/60 text-muted hover:text-ink",
            )}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="font-mono text-[11px] text-muted">
        {filtered.length} {filtered.length === 1 ? "tool" : "tools"}
      </p>

      {/* Cards */}
      {filtered.length === 0 ? (
        <p className="rounded-card border border-line/60 bg-surface px-4 py-6 text-center font-sans text-[14px] text-muted">
          Nothing matches that. Try a different search or category.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {filtered.map((tool) => (
            <li key={tool.slug}>
              <div className="flex items-stretch gap-2">
                <Link
                  href={`/tools/${tool.slug}`}
                  className="min-w-0 flex-1 rounded-card border border-line/60 bg-surface p-3.5 transition hover:border-accent/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-sans text-[15px] font-semibold text-white">
                      {tool.name}
                    </span>
                    <span className="shrink-0 rounded-full border border-line/60 px-2 py-0.5 font-mono text-[10px] text-muted">
                      {tool.category}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 font-sans text-[13px] leading-relaxed text-muted">
                    {tool.short}
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={() => toggle(tool.slug)}
                  aria-pressed={favorites.has(tool.slug)}
                  aria-label={
                    favorites.has(tool.slug)
                      ? `Remove ${tool.name} from favorites`
                      : `Add ${tool.name} to favorites`
                  }
                  className={cx(
                    "flex w-11 shrink-0 items-center justify-center rounded-card border transition",
                    favorites.has(tool.slug)
                      ? "border-accent/60 bg-accent/10 text-accent"
                      : "border-line/60 text-muted hover:text-accent",
                    !ready && "opacity-60",
                  )}
                >
                  <Star
                    size={18}
                    className={favorites.has(tool.slug) ? "fill-accent" : ""}
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
