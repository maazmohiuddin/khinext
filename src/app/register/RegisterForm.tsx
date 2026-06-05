"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { RegistrationTrack } from "@/lib/types";
import { TRACK_LABELS } from "@/lib/types";
import { Field, Input } from "@/components/ui/Field";
import { ChipRadio } from "@/components/ui/ChipRadio";
import { Success } from "@/components/ui/Success";

// Registration closes at this UTC timestamp. Adjust as needed.
const DEADLINE = new Date("2026-06-05T21:36:00Z");

function useCountdown(deadline: Date) {
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline.getTime() - Date.now()));

  useEffect(() => {
    if (remaining === 0) return;
    const id = setInterval(() => {
      const left = Math.max(0, deadline.getTime() - Date.now());
      setRemaining(left);
      if (left === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [deadline, remaining]);

  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);
  return { remaining, h, m, s, closed: remaining === 0 };
}

const ROLES = [
  "Student / Developer",
  "Founder / Entrepreneur",
  "Investor / VC",
  "Corporate / Enterprise",
  "Researcher / Academic",
  "Government / Policy",
  "Media / Press",
  "Other",
] as const;

const TRACK_OPTIONS = (Object.entries(TRACK_LABELS) as [RegistrationTrack, string][]).map(
  ([value, label]) => ({ value, label })
);

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  organisation: string;
  role: string;
  track: RegistrationTrack;
  referral: string;
}

export function RegisterForm() {
  const countdown = useCountdown(DEADLINE);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    organisation: "",
    role: "",
    track: "ai_expo_and_gaming",
    referral: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string; name: string; email: string; track: string } | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(s => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.role) return;
    if (Date.now() >= DEADLINE.getTime()) { setError("Registration is now closed."); return; }
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const id = crypto.randomUUID();
    const { error } = await supabase
      .from("registrations")
      .insert({
        id,
        full_name: form.fullName,
        email: form.email.trim().toLowerCase(),
        phone: form.phone || null,
        organisation: form.organisation || null,
        role: form.role,
        track: form.track,
        referral: form.referral || null,
      });
    setSubmitting(false);
    if (error) {
      // Unique constraint violation → email already registered
      const msg = (error as { code?: string }).code === "23505"
        ? "This email is already registered for Khinext '26."
        : (error.message ?? "Could not register. Please try again.");
      setError(msg);
      return;
    }
    setDone({ id: id.slice(0, 8).toUpperCase(), name: form.fullName, email: form.email, track: TRACK_LABELS[form.track] });
  }

  if (countdown.closed) {
    return (
      <div className="mx-auto max-w-[640px] flex flex-col items-center gap-6 py-16 text-center">
        <div className="grid place-items-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20">
          <Clock size={28} className="text-red-400" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-white -tracking-tight mb-2">
            Registration Closed
          </h3>
          <p className="text-white/50 text-sm max-w-sm mx-auto">
            The registration window for Khinext '26 has ended. Follow us on social media for updates.
          </p>
        </div>
        <Link href="/" className="kx-btn-outline">Back to home</Link>
      </div>
    );
  }

  if (done) {
    return (
      <Success
        title={<>You're <span className="kx-accent">registered.</span></>}
        idChip={`R-${done.id}`}
      >
        <p>
          Welcome aboard, <strong className="text-white">{done.name}</strong>. Your registration for Khinext '26 is confirmed.
          A confirmation email has been sent to <strong className="text-white">{done.email}</strong>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link href="/submit" className="kx-btn-primary">
            Also submit an AI project
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/" className="kx-btn-outline">Back to home</Link>
        </div>
      </Success>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-[640px] flex flex-col gap-5" noValidate>
      {/* Countdown banner */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-2 text-white/50 text-xs">
          <Clock size={13} />
          <span>Registration closes in</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-sm font-semibold tabular-nums">
          <span className="w-8 text-center text-white">{String(countdown.h).padStart(2, "0")}</span>
          <span className="text-white/30">:</span>
          <span className="w-8 text-center text-white">{String(countdown.m).padStart(2, "0")}</span>
          <span className="text-white/30">:</span>
          <span className={`w-8 text-center ${countdown.h === 0 && countdown.m < 5 ? "text-red-400" : "text-white"}`}>
            {String(countdown.s).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Full Name" htmlFor="r-name" required>
          <Input
            id="r-name"
            name="name"
            type="text"
            placeholder="Ahmed Raza"
            autoComplete="name"
            required
            value={form.fullName}
            onChange={e => set("fullName", e.target.value)}
          />
        </Field>
        <Field label="Email Address" htmlFor="r-email" required>
          <Input
            id="r-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={form.email}
            onChange={e => set("email", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Phone (optional)" htmlFor="r-phone">
          <Input
            id="r-phone"
            type="tel"
            placeholder="+92 300 0000000"
            autoComplete="tel"
            value={form.phone}
            onChange={e => set("phone", e.target.value)}
          />
        </Field>
        <Field label="Organisation (optional)" htmlFor="r-org">
          <Input
            id="r-org"
            type="text"
            placeholder="Company / University"
            autoComplete="organization"
            value={form.organisation}
            onChange={e => set("organisation", e.target.value)}
          />
        </Field>
      </div>
      <ChipRadio
        legend="I am a"
        name="role"
        required
        value={form.role}
        onChange={v => set("role", v)}
        options={ROLES}
      />
      <ChipRadio
        legend="Track"
        name="track"
        value={form.track}
        onChange={v => set("track", v as RegistrationTrack)}
        options={TRACK_OPTIONS}
      />
      <Field label="How did you hear about Khinext? (optional)" htmlFor="r-referral">
        <Input
          id="r-referral"
          type="text"
          placeholder="Social media, a friend, news article…"
          value={form.referral}
          onChange={e => set("referral", e.target.value)}
        />
      </Field>

      {error && (
        <p role="alert" className="text-sm text-[#FF6B8E]">{error}</p>
      )}

      <div className="pt-3 border-t border-white/10">
        <motion.div whileTap={{ scale: 0.98 }}>
          <button
            type="submit"
            className="kx-btn-primary w-full justify-center !px-7 !py-4 !text-[15px]"
            disabled={submitting || !form.fullName || !form.email || !form.role || countdown.closed}
          >
            {submitting ? "Registering…" : "Register for Khinext '26"}
            {!submitting && <ArrowRight size={16} aria-hidden="true" />}
          </button>
        </motion.div>
        <p className="mt-3 text-center text-[11px] text-white/30">
          Free to attend. Your details are used only for event logistics.
        </p>
      </div>
    </form>
  );
}
