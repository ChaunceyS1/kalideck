import { Suspense } from "react";
import { redirect } from "next/navigation";
import { APP_NAME } from "@/config";
import { BrandBlock, NavCapsule } from "@/components/Brand";
import { FeatureCards, StatChips } from "@/components/FeatureCards";
import { TerminalDemo } from "@/components/TerminalDemo";
import { SignInCard } from "@/components/AuthCard";
import { SiteFooter, WarningLine } from "@/components/SiteFooter";
import { PageShell } from "@/components/Shell";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  if (isSupabaseConfigured) {
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

      <Suspense fallback={null}>
        <SignInCard />
      </Suspense>

      <WarningLine />

      <SiteFooter />
    </PageShell>
  );
}

export const metadata = {
  title: `${APP_NAME} — Sign In`,
};
