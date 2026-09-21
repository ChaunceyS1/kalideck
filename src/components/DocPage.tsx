import Link from "next/link";
import type { ReactNode } from "react";
import { PageShell } from "./Shell";
import { SiteFooter } from "./SiteFooter";
import { LogoTile } from "./Brand";
import { APP_NAME } from "@/config";

/** Shared frame for the legal and informational pages. */
export function DocPage({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker: string;
  children: ReactNode;
}) {
  return (
    <PageShell className="flex flex-col gap-7">
      <div className="flex items-center gap-3">
        <LogoTile size={44} />
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {kicker}
          </p>
          <h1 className="font-sans text-[24px] font-semibold text-white">
            {title}
          </h1>
        </div>
      </div>

      <div className="rounded-card border border-warn/40 bg-[#1a1608] px-4 py-3">
        <p className="font-mono text-[11px] leading-relaxed text-warn">
          PLACEHOLDER TEXT — this page has not been reviewed by a lawyer. Replace
          every section below before {APP_NAME} takes real users or payments.
        </p>
      </div>

      <div className="flex flex-col gap-5 font-sans text-[14px] leading-relaxed text-muted [&_h2]:font-sans [&_h2]:text-[15px] [&_h2]:font-semibold [&_h2]:text-ink">
        {children}
      </div>

      <Link href="/" className="font-mono text-[13px] text-accent hover:underline">
        ← Back to sign in
      </Link>

      <SiteFooter />
    </PageShell>
  );
}
