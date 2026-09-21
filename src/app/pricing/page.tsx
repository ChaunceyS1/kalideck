import { Check, Crown } from "lucide-react";
import { BrandBlock, NavCapsule } from "@/components/Brand";
import { PageShell } from "@/components/Shell";
import { SiteFooter, WarningLine } from "@/components/SiteFooter";
import { MESSAGE_LIMITS } from "@/config";

export const metadata = { title: "Pricing" };

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    lines: [
      "Full tool database and command reference",
      "Variable-aware command builder",
      `${MESSAGE_LIMITS.free} assistant messages per day`,
      "Favorites synced to your account",
    ],
  },
  {
    name: "Pro",
    price: "TBD",
    period: "not yet available",
    lines: [
      "Everything in Free",
      `${MESSAGE_LIMITS.pro} assistant messages per day`,
      "Priority support queue",
      "Early access to new modules",
    ],
  },
];

export default function PricingPage() {
  return (
    <PageShell className="flex flex-col gap-7">
      <NavCapsule active="pricing" />
      <BrandBlock />

      <div>
        <h1 className="font-sans text-[26px] font-semibold leading-tight text-white">
          Plans
        </h1>
        <p className="mt-2 font-sans text-[14px] leading-relaxed text-muted">
          Checkout is not wired up yet. Every account starts on the free plan and
          the plan column in the database is what gates limits.
        </p>
      </div>

      {PLANS.map((plan) => (
        <section
          key={plan.name}
          className="rounded-card border border-line/60 bg-surface p-5"
        >
          <div className="flex items-baseline justify-between">
            <h2 className="flex items-center gap-2 font-mono text-[15px] font-bold text-accent">
              {plan.name === "Pro" ? <Crown size={15} /> : null}
              {plan.name}
            </h2>
            <p className="font-mono text-[13px] text-muted">
              <span className="text-[20px] font-bold text-ink">{plan.price}</span>{" "}
              {plan.period}
            </p>
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {plan.lines.map((line) => (
              <li key={line} className="flex gap-2 font-sans text-[13px] text-muted">
                <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                {line}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <WarningLine />
      <SiteFooter />
    </PageShell>
  );
}
