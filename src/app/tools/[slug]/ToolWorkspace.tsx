"use client";

import Link from "next/link";
import { RotateCcw, Sparkles } from "lucide-react";
import type { ToolCommand } from "@/lib/tools/types";
import {
  VARIABLE_KEYS,
  fillCommand,
  useVariables,
  type VariableKey,
} from "@/lib/variables";
import { CopyButton } from "@/components/CopyButton";

const VARIABLE_LABELS: Record<VariableKey, string> = {
  target: "{target}",
  port: "{port}",
  url: "{url}",
  wordlist: "{wordlist}",
  interface: "{interface}",
};

function explainHref(filledCmd: string): string {
  const prompt = `Explain this command flag by flag, what it does on the network, and how to read the output: ${filledCmd}`;
  return `/assistant?ask=${encodeURIComponent(prompt)}`;
}

export function ToolWorkspace({ commands }: { commands: ToolCommand[] }) {
  const { variables, setVariable, reset } = useVariables();

  return (
    <div className="flex flex-col gap-6">
      {/* Variables panel */}
      <section className="rounded-card border border-line/60 bg-surface p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Variables
          </h2>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted transition hover:text-accent"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
        <p className="mt-1 font-sans text-[12px] text-muted">
          Every command below updates as you type. Values are saved on this
          device.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {VARIABLE_KEYS.map((key) => (
            <label key={key} className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                {VARIABLE_LABELS[key]}
              </span>
              <input
                value={variables[key]}
                onChange={(event) => setVariable(key, event.target.value)}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                className="h-10 w-full rounded-field border border-line/60 bg-[#0a1113] px-2.5 font-mono text-[13px] text-ink outline-none transition focus:border-accent/70 focus:ring-1 focus:ring-accent/30"
              />
            </label>
          ))}
        </div>
      </section>

      {/* Commands */}
      <section className="flex flex-col gap-3">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Commands
        </h2>
        <ul className="flex flex-col gap-3">
          {commands.map((command, index) => {
            const filled = fillCommand(command.cmd, variables);
            return (
              <li
                key={`${command.label}-${index}`}
                className="rounded-card border border-line/60 bg-surface p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-sans text-[13px] font-semibold text-white">
                    {command.label}
                  </span>
                </div>

                <div className="mt-2 overflow-x-auto rounded-[10px] border border-line/60 bg-[#0a1113] px-3 py-2.5">
                  <code className="whitespace-pre font-mono text-[13px] leading-relaxed text-accent">
                    <span className="text-muted">$ </span>
                    {filled}
                  </code>
                </div>

                {command.note ? (
                  <p className="mt-2 font-sans text-[12px] leading-relaxed text-muted">
                    {command.note}
                  </p>
                ) : null}

                <div className="mt-2.5 flex items-center gap-2">
                  <CopyButton value={filled} />
                  <Link
                    href={explainHref(filled)}
                    className="inline-flex items-center gap-1.5 rounded-[9px] border border-line/60 px-2.5 py-1.5 font-mono text-[11px] text-muted transition hover:border-accent/50 hover:text-accent"
                  >
                    <Sparkles size={13} />
                    Explain
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
