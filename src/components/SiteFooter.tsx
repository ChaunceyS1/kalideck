import Link from "next/link";
import { APP_NAME } from "@/config";

const LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund", label: "Refund" },
  { href: "/contact", label: "Contact" },
];

export function WarningLine() {
  return (
    <p className="text-center font-mono text-[11px] leading-relaxed text-warn/90">
      Educational purposes only. Use responsibly and legally.
    </p>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 border-t border-line/60 pt-6">
      <div className="flex items-center justify-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-[7px] border border-line/60 bg-[#0c2119] font-mono text-[11px] text-accent">
          &gt;_
        </span>
        <span className="font-mono text-[13px] text-accent">{APP_NAME}</span>
      </div>

      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-mono text-[12px] text-muted transition hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-center font-mono text-[11px] text-muted/80">
        © {year} {APP_NAME}. All rights reserved.
      </p>
    </footer>
  );
}
