"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Field, Input } from "@/components/ui/Field";

export function LoginForm() {
  const params = useSearchParams();
  const nextParam = params.get("next") ?? "/admin";
  const errFromUrl = params.get("error");

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(errFromUrl);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    setError(null);

    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(nextParam)}`;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: redirectTo },
    });

    setSending(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  }

  if (sent) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mx-auto max-w-[440px] rounded-3xl border border-khi-blue/30 bg-white/[0.04] p-8 md:p-10 text-center"
      >
        <div
          className="mx-auto mb-5 grid place-items-center w-14 h-14 rounded-full bg-khi-blue/15 border border-khi-blue/30 text-khi-blue-bright"
          style={{ boxShadow: "0 0 32px rgba(49,107,255,0.32)" }}
        >
          <Mail size={22} aria-hidden="true" />
        </div>
        <h3 className="font-display text-2xl font-extrabold text-white">
          Check your <span className="kx-accent">email.</span>
        </h3>
        <p className="mt-3 text-white/70">
          We sent a magic-link to <strong className="text-white">{email}</strong>.
          Click it to sign in. The link expires in 1 hour.
        </p>
        <p className="mt-4 text-[11px] text-white/30">
          Didn't get it? Check spam, or have an admin add your email to the <code className="font-mono">admins</code> table.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-[440px] rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10 flex flex-col gap-5"
    >
      <div className="text-center">
        <h3 className="font-display text-2xl font-extrabold text-white">Sign in</h3>
        <p className="mt-2 text-sm text-white/55">Enter your whitelisted admin email — we'll send a one-time magic link.</p>
      </div>
      <Field label="Admin email" htmlFor="admin-email" required>
        <Input
          id="admin-email"
          type="email"
          placeholder="admin@khinext.pk"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </Field>
      {error && <p role="alert" className="text-sm text-[#FF6B8E]">{error}</p>}
      <button
        type="submit"
        className="kx-btn-primary w-full justify-center"
        disabled={sending || !email}
      >
        {sending ? "Sending link…" : "Send magic link"}
      </button>
      <p className="text-center text-[11px] text-white/30">
        Your email must exist in the <code className="font-mono">admins</code> table to access the dashboard.
      </p>
    </form>
  );
}
