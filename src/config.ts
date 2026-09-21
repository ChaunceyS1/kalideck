/**
 * Single source of truth for product naming. Rename here and the whole app follows.
 */
export const APP_NAME = "KaliDeck";
export const APP_TAGLINE = "CYBERSECURITY COPILOT";
export const APP_DESCRIPTION =
  "An indexed Kali Linux tool reference with a command library and an AI tutor, built for authorized labs and CTF practice.";

/** Terminal prompt string used in the demo window and the shell headers. */
export const SHELL_PROMPT = "user@app:~";

/** Daily assistant message allowances, enforced server-side. */
export const MESSAGE_LIMITS = {
  free: 20,
  pro: 200,
} as const;
