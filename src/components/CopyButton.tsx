"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cx } from "./ui";

export function CopyButton({
  value,
  className,
  label = "Copy",
}: {
  value: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for browsers without clipboard permission.
      const area = document.createElement("textarea");
      area.value = value;
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } catch {
        // Nothing more we can do; leave the state unchanged.
      }
      document.body.removeChild(area);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-[9px] border border-line/60 px-2.5 py-1.5 font-mono text-[11px] text-muted transition hover:border-accent/50 hover:text-accent",
        className,
      )}
    >
      {copied ? (
        <>
          <Check size={13} className="text-accent" />
          Copied
        </>
      ) : (
        <>
          <Copy size={13} />
          {label}
        </>
      )}
    </button>
  );
}
