"use client";

import { useEffect, useState } from "react";

export const VARIABLE_KEYS = [
  "target",
  "port",
  "url",
  "wordlist",
  "interface",
] as const;

export type VariableKey = (typeof VARIABLE_KEYS)[number];
export type Variables = Record<VariableKey, string>;

export const DEFAULT_VARIABLES: Variables = {
  target: "target.example",
  port: "80",
  url: "https://target.example",
  wordlist: "/usr/share/wordlists/rockyou.txt",
  interface: "wlan0",
};

const STORAGE_KEY = "kalideck.variables";

/** Substitute {target}, {port}, etc. in a command with the current values. */
export function fillCommand(cmd: string, variables: Variables): string {
  return cmd.replace(/\{(\w+)\}/g, (match, key: string) => {
    if ((VARIABLE_KEYS as readonly string[]).includes(key)) {
      const value = variables[key as VariableKey];
      return value.trim() === "" ? match : value;
    }
    return match;
  });
}

/**
 * Shared variable state persisted to localStorage so the same values follow
 * the user across every tool page.
 */
export function useVariables() {
  const [variables, setVariables] = useState<Variables>(DEFAULT_VARIABLES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Variables>;
        setVariables({ ...DEFAULT_VARIABLES, ...parsed });
      }
    } catch {
      // Ignore unreadable storage and keep the defaults.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(variables));
    } catch {
      // Storage may be blocked; the values still work for this session.
    }
  }, [variables, ready]);

  function setVariable(key: VariableKey, value: string) {
    setVariables((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setVariables(DEFAULT_VARIABLES);
  }

  return { variables, setVariable, reset, ready };
}
