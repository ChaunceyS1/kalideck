import Link from "next/link";
import { Crown, Lock, Skull } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/config";
import { cx } from "./ui";

export function NavCapsule({
  active = "signin",
}: {
  active?: "signin" | "pricing";
}) {
  const base =
    "inline-flex h-10 items-center gap-2 rounded-full px-5 font-mono text-[13px] transition";

  return (
    <nav className="flex justify-center">
      <div className="inline-flex items-center gap-1 rounded-full border border-line/60 bg-surface p-1">
        <Link
          href="/"
          aria-current={active === "signin" ? "page" : undefined}
          className={cx(
            base,
            active === "signin"
              ? "bg-accent font-bold text-[#052014]"
              : "text-muted hover:text-ink",
          )}
        >
          <Lock size={14} strokeWidth={2.5} />
          Sign In
        </Link>
        <Link
          href="/pricing"
          aria-current={active === "pricing" ? "page" : undefined}
          className={cx(
            base,
            active === "pricing"
              ? "bg-accent font-bold text-[#052014]"
              : "text-muted hover:text-ink",
          )}
        >
          <Crown size={14} strokeWidth={2.5} />
          Pricing
        </Link>
      </div>
    </nav>
  );
}

export function LogoTile({ size = 80 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-[18px] border border-line bg-[#0c2119] shadow-glow"
      style={{ width: size, height: size }}
    >
      <Skull size={size * 0.45} strokeWidth={1.8} className="text-accent" />
    </div>
  );
}

export function BrandBlock() {
  return (
    <div className="flex items-center gap-4">
      <LogoTile />
      <div>
        <p
          className="font-mono text-[30px] font-bold leading-none text-ink"
          style={{ textShadow: "0 0 18px rgba(108,247,173,0.45)" }}
        >
          {APP_NAME}
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
          {APP_TAGLINE}
        </p>
      </div>
    </div>
  );
}
