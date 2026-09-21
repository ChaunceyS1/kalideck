import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Mint-filled primary action with the house glow. */
export function PrimaryButton({
  className,
  children,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={cx(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-field bg-accent font-sans text-[15px] font-semibold text-[#052014] shadow-glow transition hover:brightness-105 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "rounded-card border border-line/60 bg-surface",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
      {children}
    </span>
  );
}

export function MonoLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cx("font-mono text-[13px] text-accent hover:underline", className)}
    >
      {children}
    </Link>
  );
}

/** Uppercase mono section heading used above lists and panels. */
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
      {children}
    </h2>
  );
}

export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={cx(
        "h-11 w-full rounded-field border border-line/60 bg-[#0a1113] px-3 font-sans text-[15px] text-ink placeholder:text-muted/70 outline-none transition focus:border-accent/70 focus:ring-1 focus:ring-accent/30",
        className,
      )}
    />
  );
}

export function Notice({
  kind = "error",
  children,
}: {
  kind?: "error" | "ok";
  children: ReactNode;
}) {
  return (
    <p
      role="status"
      className={cx(
        "rounded-field border px-3 py-2 font-mono text-[12px] leading-relaxed",
        kind === "error"
          ? "border-[#7a2b2b]/70 bg-[#1a0f10] text-[#f4a3a3]"
          : "border-line/60 bg-[#0a1113] text-accent",
      )}
    >
      {children}
    </p>
  );
}
