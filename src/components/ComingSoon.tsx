import type { LucideIcon } from "lucide-react";
import { AppBar } from "./AppBar";
import { PageShell } from "./Shell";
import { WarningLine } from "./SiteFooter";

/** Shared frame for the not-yet-built modules linked from the landing page. */
export function ComingSoon({
  title,
  subtitle,
  icon: Icon,
  blurb,
  planned,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  blurb: string;
  planned: string[];
}) {
  return (
    <PageShell className="flex flex-col gap-6">
      <AppBar title={title} subtitle={subtitle} back={{ href: "/tools", label: "Tools" }} />

      <div className="flex flex-col items-center gap-4 rounded-card border border-line/60 bg-surface px-5 py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-[16px] border border-line bg-[#0c2119] shadow-glow">
          <Icon size={28} strokeWidth={1.8} className="text-accent" />
        </span>
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-accent">
          Coming soon
        </span>
        <p className="max-w-[320px] font-sans text-[14px] leading-relaxed text-muted">
          {blurb}
        </p>
      </div>

      <section className="rounded-card border border-line/60 bg-surface p-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Planned
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {planned.map((item) => (
            <li key={item} className="flex gap-2 font-sans text-[13px] text-muted">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <WarningLine />
    </PageShell>
  );
}
