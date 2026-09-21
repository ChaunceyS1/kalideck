"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Circle, RotateCcw } from "lucide-react";
import { ROADMAP } from "@/lib/roadmap";
import { cx } from "@/components/ui";

const STORAGE_KEY = "kalideck.roadmap.done";

/** Completed phase numbers, persisted per device. */
function useProgress() {
  const [done, setDone] = useState<Set<number>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(new Set(JSON.parse(raw) as number[]));
    } catch {
      // Ignore unreadable storage.
    }
    setReady(true);
  }, []);

  function persist(next: Set<number>) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // Storage blocked; keep the value in memory.
    }
  }

  function toggle(n: number) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      persist(next);
      return next;
    });
  }

  function reset() {
    setDone(new Set());
    persist(new Set());
  }

  return { done, toggle, reset, ready };
}

export function RoadmapView({
  toolNames,
}: {
  toolNames: Record<string, string>;
}) {
  const { done, toggle, reset, ready } = useProgress();
  const [open, setOpen] = useState<number | null>(1);

  const completed = done.size;
  const total = ROADMAP.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="flex flex-col gap-5">
      {/* Progress summary */}
      <section className="rounded-card border border-line/60 bg-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Progress
            </p>
            <p className="mt-1 font-sans text-[15px] font-semibold text-white">
              {completed} of {total} phases
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-[26px] font-bold text-accent">
              {pct}%
            </span>
            {completed > 0 ? (
              <button
                type="button"
                onClick={reset}
                className="mt-1 flex items-center gap-1 font-mono text-[11px] text-muted transition hover:text-accent"
              >
                <RotateCcw size={11} />
                Reset
              </button>
            ) : null}
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#0a1113]">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${ready ? pct : 0}%` }}
          />
        </div>
      </section>

      {/* Phases */}
      <ol className="flex flex-col gap-2.5">
        {ROADMAP.map((phase) => {
          const isDone = done.has(phase.n);
          const isOpen = open === phase.n;

          return (
            <li
              key={phase.n}
              className={cx(
                "overflow-hidden rounded-card border bg-surface transition",
                isDone ? "border-accent/50" : "border-line/60",
              )}
            >
              <div className="flex items-stretch">
                {/* Complete toggle */}
                <button
                  type="button"
                  onClick={() => toggle(phase.n)}
                  aria-pressed={isDone}
                  aria-label={
                    isDone
                      ? `Mark phase ${phase.n} not done`
                      : `Mark phase ${phase.n} done`
                  }
                  className={cx(
                    "flex w-12 shrink-0 items-center justify-center border-r transition",
                    isDone
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : "border-line/60 text-muted hover:text-accent",
                  )}
                >
                  {isDone ? <Check size={18} /> : <Circle size={16} />}
                </button>

                {/* Header (expands) */}
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : phase.n)}
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line/60 font-mono text-[13px] font-bold text-accent">
                    {phase.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cx(
                        "block truncate font-sans text-[15px] font-semibold",
                        isDone ? "text-muted line-through" : "text-white",
                      )}
                    >
                      {phase.title}
                    </span>
                    <span className="block truncate font-sans text-[12px] text-muted">
                      {phase.tagline}
                    </span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={cx(
                      "shrink-0 text-muted transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
              </div>

              {isOpen ? (
                <div className="border-t border-line/60 px-4 pb-4 pt-3">
                  <p className="font-sans text-[13px] leading-relaxed text-ink">
                    {phase.focus}
                  </p>

                  <h3 className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    What you learn
                  </h3>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {phase.skills.map((skill) => (
                      <li
                        key={skill}
                        className="flex gap-2 font-sans text-[13px] leading-relaxed text-muted"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                        {skill}
                      </li>
                    ))}
                  </ul>

                  {phase.tools.length > 0 ? (
                    <>
                      <h3 className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                        Tools for this phase
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {phase.tools.map((slug) => (
                          <Link
                            key={slug}
                            href={`/tools/${slug}`}
                            className="rounded-full border border-line/60 bg-[#0a1113] px-3 py-1 font-mono text-[12px] text-accent transition hover:border-accent/50"
                          >
                            {toolNames[slug] ?? slug}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
