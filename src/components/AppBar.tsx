import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { APP_NAME } from "@/config";
import { AUTH_ENABLED } from "@/lib/auth";
import { LogoTile } from "./Brand";

/** Slim header shown at the top of every in-app page. */
export function AppBar({
  title,
  subtitle,
  back,
}: {
  title: string;
  subtitle?: string;
  back?: { href: string; label: string };
}) {
  return (
    <header className="flex flex-col gap-3">
      {back ? (
        <Link
          href={back.href}
          className="inline-flex w-fit items-center gap-1.5 font-mono text-[12px] text-muted transition hover:text-accent"
        >
          <ArrowLeft size={14} />
          {back.label}
        </Link>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <LogoTile size={44} />
          <div>
            <h1 className="font-sans text-[20px] font-semibold leading-tight text-white">
              {title}
            </h1>
            {subtitle ? (
              <p className="font-sans text-[13px] text-muted">{subtitle}</p>
            ) : null}
          </div>
        </div>

        {AUTH_ENABLED ? (
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-field border border-line/60 px-3 py-2 font-mono text-[11px] text-muted transition hover:text-accent"
            >
              Sign out
            </button>
          </form>
        ) : (
          <Link
            href="/"
            className="rounded-field border border-line/60 px-3 py-2 font-mono text-[11px] text-muted transition hover:text-accent"
          >
            {APP_NAME}
          </Link>
        )}
      </div>
    </header>
  );
}
