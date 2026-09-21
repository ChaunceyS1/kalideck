"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { AuthShell } from "@/components/AuthCard";
import { Label, Notice, PrimaryButton, TextInput } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function ForgotPasswordCard() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Supabase keys are missing. Add them to .env.local and restart.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setBusy(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell
      title="Forgot Password"
      blurb="We will email you a reset link"
    >
      {sent ? (
        <Notice kind="ok">
          If an account exists for {email}, a reset link is on its way. The link
          expires after one hour.
        </Notice>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email">
              <Label>Email</Label>
            </label>
            <TextInput
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          {error ? <Notice>{error}</Notice> : null}

          <PrimaryButton type="submit" disabled={busy}>
            <Send size={16} strokeWidth={2.4} />
            {busy ? "Sending…" : "Send Reset Link"}
          </PrimaryButton>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link href="/" className="font-mono text-[13px] text-accent hover:underline">
          ← Back to sign in
        </Link>
      </div>
    </AuthShell>
  );
}
