"use client";

import { useEffect, useRef, useState } from "react";
import { SHELL_PROMPT } from "@/config";

const SAMPLES = [
  "nmap -sV -p- target.example",
  "gobuster dir -u https://target.example -w words.txt",
  "sqlmap -u 'https://target.example/?id=1' --batch",
  "nikto -h https://target.example",
  "hydra -l admin -P rockyou.txt target.example ssh",
];

const TYPE_MS = 40;
const DELETE_MS = 22;
const HOLD_MS = 1400;

export function TerminalDemo() {
  const [text, setText] = useState("");
  const [reduced, setReduced] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) {
      setText(SAMPLES[0]);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });

    const run = async () => {
      while (!cancelled) {
        const command = SAMPLES[indexRef.current % SAMPLES.length];

        for (let i = 1; i <= command.length; i += 1) {
          if (cancelled) return;
          setText(command.slice(0, i));
          await wait(TYPE_MS);
        }

        await wait(HOLD_MS);

        for (let i = command.length; i >= 0; i -= 1) {
          if (cancelled) return;
          setText(command.slice(0, i));
          await wait(DELETE_MS);
        }

        indexRef.current += 1;
      }
    };

    void run();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduced]);

  return (
    <div className="overflow-hidden rounded-card border border-line/60 bg-surface">
      <div className="flex items-center gap-2 border-b border-line/60 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#5c3336]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#5c4f2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#2e5c45]" />
        <span className="ml-2 font-mono text-[12px] text-[#7fa494]">
          {SHELL_PROMPT}
        </span>
      </div>
      <div className="px-3 py-4">
        <p className="break-all font-mono text-[13px] leading-relaxed text-ink">
          <span className="text-accent">$ </span>
          {text}
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] animate-blink bg-accent"
          />
        </p>
      </div>
    </div>
  );
}
