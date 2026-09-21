"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, TerminalSquare } from "lucide-react";
import { APP_NAME } from "@/config";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Label, Notice, PrimaryButton, TextInput } from "./ui";

export function AuthShell({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-panel border border-line/60 bg-surface px-5 pb-6 pt-7">
      {/* Mint highlight along the top edge */}
      <span
        aria-hidden
        className="absolute inset-x-6 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(108,247,173,0.9), transparent)",
        }}
      />
      <div className="flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-line bg-[#0c2119] shadow-glow">
          <Lock size={20} strokeWidth={2.2} className="text-accent" />
        </span>
        <h2 className="mt-4 font-sans text-[20px] font-bold text-white">{title}</h2>
        <p className="mt-1 font-sans text-[13px] text-muted">{blurb}</p>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function PasswordField({
  value,
  onChange,
  autoComplete = "current-password",
  id = "password",
}: {
  value: string;
  onChange: (next: string) => void;
  autoComplete?: string;
  id?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <TextInput
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder="••••••••"
        required
        className="pr-11"
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-[10px] text-muted transition hover:text-ink"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}

export function SignInCard() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = params.get("next") ?? "/tools";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
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
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <AuthShell title="Welcome Back" blurb="Sign in to access your tools">
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
          <PasswordField value={password} onChange={setPassword} />
          <Link
            href="/forgot-password"
            className="self-end font-mono text-[12px] text-accent hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {error ? <Notice>{error}</Notice> : null}

        <PrimaryButton type="submit" disabled={busy}>
          <TerminalSquare size={17} strokeWidth={2.4} />
          {busy ? "Connecting…" : "Access Terminal"}
        </PrimaryButton>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line/60" />
        <span className="font-mono text-[11px] text-muted">
          New to {APP_NAME}?
        </span>
        <span className="h-px flex-1 bg-line/60" />
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/signup"
          className="font-mono text-[13px] text-accent hover:underline"
        >
          Create Free Account →
        </Link>
      </div>
    </AuthShell>
  );
}
