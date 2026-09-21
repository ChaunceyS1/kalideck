import { isSupabaseConfigured } from "./supabase/env";

/**
 * Solo mode: with no Supabase keys, or with NEXT_PUBLIC_SKIP_AUTH=true, the
 * whole app is open and nothing is gated behind a sign-in. Per-user data
 * (favorites, chat history) falls back to local storage.
 */
const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

export const AUTH_ENABLED = isSupabaseConfigured && !SKIP_AUTH;
