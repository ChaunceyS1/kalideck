"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TerminalSquare } from "lucide-react";
import { AuthShell, PasswordField } from "@/components/AuthCard";
import { Label, Notice, PrimaryButton, TextInput } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function SignUpCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords do not match.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/tools`,
      },
    });
    setBusy(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // With email confirmation off, Supabase returns a live session right away.
    if (data.session) {
      router.push("/tools");
      router.refresh();
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell
        title="Check Your Inbox"
        blurb="Confirm your address to finish setting up"
      >
        <Notice kind="ok">
          We sent a confirmation link to {email}. Open it on this device and
          you will land straight in your tool library.
        </Notice>
        <div className="mt-5 text-center">
          <Link href="/" className="font-mono text-[13px] text-accent hover:underline">
            ← Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create Account" blurb="Free plan, no card required">
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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password">
            <Label>Password</Label>
          </label>
          <PasswordField
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm">
            <Label>Confirm Password</Label>
          </label>
          <PasswordField
            id="confirm"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
          />
        </div>

        {error ? <Notice>{error}</Notice> : null}

        <PrimaryButton type="submit" disabled={busy}>
          <TerminalSquare size={17} strokeWidth={2.4} />
          {busy ? "Creating…" : "Create Free Account"}
        </PrimaryButton>
      </form>

      <div className="mt-6 text-center">
        <Link href="/" className="font-mono text-[13px] text-accent hover:underline">
          Already have an account? Sign in →
        </Link>
      </div>
    </AuthShell>
  );
}
