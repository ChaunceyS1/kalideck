"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { AuthShell, PasswordField } from "@/components/AuthCard";
import { Label, Notice, PrimaryButton } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function ResetPasswordCard() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
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
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/tools");
    router.refresh();
  }

  return (
    <AuthShell
      title="New Password"
      blurb="Open this page from your reset email"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password">
            <Label>New Password</Label>
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
          <KeyRound size={16} strokeWidth={2.4} />
          {busy ? "Saving…" : "Save Password"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
