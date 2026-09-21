import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TerminalSquare } from "lucide-react";
import { APP_NAME } from "@/config";
import { BrandBlock, NavCapsule } from "@/components/Brand";
import { FeatureCards, StatChips } from "@/components/FeatureCards";
import { TerminalDemo } from "@/components/TerminalDemo";
import { SignInCard } from "@/components/AuthCard";
import { SiteFooter, WarningLine } from "@/components/SiteFooter";
import { PageShell } from "@/components/Shell";
import { createClient } from "@/lib/supabase/server";
import { AUTH_ENABLED } from "@/lib/auth";

export const metadata = {
  title: `${APP_NAME} — Cybersecurity Copilot`,
};

/** Solo mode stand-in for the login card: one button straight into the app. */
function EnterCard() {
  return (
    <section className="relative overflow-hidden rounded-panel border border-line/60 bg-surface px-5 pb-6 pt-7">
      <span
        aria-hidden
        className="absolute inset-x-6 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(108,247,173,0.9), transparent)",
        }}
      />
      <div className="text-center">
        <h2 className="font-sans text-[20px] font-bold text-white">
          Solo Mode
        </h2>
        <p className="mt-1 font-sans text-[13px] text-muted">
          Sign-in is off. Everything is open.
        </p>
      </div>

      <Link
        href="/tools"
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-field bg-accent font-sans text-[15px] font-semibold text-[#052014] shadow-glow transition hover:brightness-105 active:brightness-95"
      >
        <TerminalSquare size={17} strokeWidth={2.4} />
        Access Terminal
      </Link>

      <p className="mt-4 text-center font-mono text-[11px] leading-relaxed text-muted">
        Set Supabase keys and drop NEXT_PUBLIC_SKIP_AUTH to bring accounts back.
      </p>
    </section>
  );
}

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  if (AUTH_ENABLED) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect(next ?? "/tools");
  }

  return (
    <PageShell className="flex flex-col gap-7">
      <NavCapsule active="signin" />

      <BrandBlock />

      <div>
        <h1 className="font-sans text-[30px] font-semibold leading-[1.15] text-white">
          Your <span className="text-accent">AI-Powered</span> Copilot for
          Cybersecurity Mastery
        </h1>
        <p className="mt-3 font-sans text-[14px] leading-relaxed text-muted">
          Search an indexed Kali Linux tool library, keep the commands you
          actually use within reach, and get flag-by-flag explanations while you
          practice in your own lab.
        </p>
      </div>

      <StatChips />

      <FeatureCards />

      <TerminalDemo />

      {AUTH_ENABLED ? (
        <Suspense fallback={null}>
          <SignInCard />
        </Suspense>
      ) : (
        <EnterCard />
      )}

      <WarningLine />

      <SiteFooter />
    </PageShell>
  );
}
