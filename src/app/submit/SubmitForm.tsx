"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Paperclip, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { DOMAINS } from "@/lib/types";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { ChipRadio } from "@/components/ui/ChipRadio";
import { Success } from "@/components/ui/Success";

const TEAM_SIZES = ["1", "2", "3", "4", "5", "6+"] as const;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED = ".pdf,.ppt,.pptx,.zip,.doc,.docx";

interface FormState {
  fullName: string;
  email: string;
  project: string;
  category: string;
  description: string;
  teamSize: string;
}

export function SubmitForm() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    project: "",
    category: "",
    description: "",
    teamSize: "1",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string; name: string } | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(s => ({ ...s, [key]: value }));
  }

  function handleFile(f: File | null) {
    setFileError(null);
    if (!f) { setFile(null); return; }
    if (f.size > MAX_FILE_BYTES) {
      setFileError("File is too large — keep it under 5 MB.");
      return;
    }
    setFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.project || !form.category || !form.description) return;
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    let filePath: string | null = null;

    try {
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
        const key = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("submissions")
          .upload(key, file, { contentType: file.type, upsert: false });
        if (upErr) throw upErr;
        filePath = key;
      }

      const submissionId = crypto.randomUUID();
      const { error: insErr } = await supabase
        .from("submissions")
        .insert({
          id: submissionId,
          full_name: form.fullName,
          email: form.email.trim().toLowerCase(),
          project: form.project,
          category: form.category,
          description: form.description,
          team_size: form.teamSize,
          file_path: filePath,
        });

      if (insErr) throw insErr;
      setDone({ id: submissionId.slice(0, 8).toUpperCase(), name: form.fullName });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Submission failed. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Success
        title={<>Application <span className="kx-accent">received.</span></>}
        idChip={`S-${done.id}`}
      >
        <p>
          Thank you, <strong className="text-white">{done.name}</strong>. Your AI project has been submitted for Khinext '26 AI Expo review.
          The team will notify you via email within 7–10 working days.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link href="/register" className="kx-btn-primary">
            Also register for the event
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/" className="kx-btn-outline">Back to home</Link>
        </div>
      </Success>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-[640px] flex flex-col gap-5" noValidate>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Full Name" htmlFor="s-name" required>
          <Input id="s-name" type="text" placeholder="Ahmed Raza" autoComplete="name" required value={form.fullName} onChange={e => set("fullName", e.target.value)} />
        </Field>
        <Field label="Email Address" htmlFor="s-email" required>
          <Input id="s-email" type="email" placeholder="you@example.com" autoComplete="email" required value={form.email} onChange={e => set("email", e.target.value)} />
        </Field>
      </div>

      <Field label="Project Name" htmlFor="s-project" required>
        <Input id="s-project" type="text" placeholder="MediScan AI — radiology triage" required value={form.project} onChange={e => set("project", e.target.value)} />
      </Field>

      <ChipRadio
        legend="Innovation Domain"
        name="category"
        required
        value={form.category}
        onChange={v => set("category", v)}
        options={DOMAINS.map(d => d.title)}
      />

      <Field
        label="Project Description"
        htmlFor="s-desc"
        required
        hint="2–4 sentences. What problem does it solve, what is the technology, what is the impact?"
      >
        <Textarea id="s-desc" required value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe your AI project…" />
      </Field>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Team Size" htmlFor="s-team">
          <select
            id="s-team"
            className="kx-input"
            value={form.teamSize}
            onChange={e => set("teamSize", e.target.value)}
          >
            {TEAM_SIZES.map(n => (
              <option key={n} value={n}>{n} {n === "1" ? "person (solo)" : "people"}</option>
            ))}
          </select>
        </Field>
        <Field label="Supporting File (optional)" htmlFor="s-file" error={fileError ?? undefined} hint="PDF, PPT, ZIP — max 5 MB">
          <div
            className={`rounded-2xl border border-dashed px-5 py-7 text-center bg-white/[0.02] transition-all duration-200 ease-soft ${
              drag ? "border-khi-blue bg-khi-blue/5 ring-2 ring-khi-blue/40" : "border-white/15 hover:border-khi-blue/40"
            }`}
            onClick={() => fileRef.current?.click()}
            onKeyDown={e => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => {
              e.preventDefault();
              setDrag(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            role="button"
            tabIndex={0}
            aria-label="Upload supporting file"
          >
            <input
              ref={fileRef}
              id="s-file"
              type="file"
              accept={ACCEPTED}
              className="sr-only"
              onChange={e => handleFile(e.target.files?.[0] ?? null)}
            />
            <div className="font-display text-sm font-bold text-white">
              {file ? "File attached" : "Drop file or click to browse"}
            </div>
            <AnimatePresence>
              {file && (
                <motion.div
                  key="file-badge"
                  initial={{ opacity: 0, scale: 0.85, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 6 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-3 inline-flex items-center gap-2.5 rounded-full bg-khi-blue/10 border border-khi-blue/30 px-3.5 py-1.5 text-xs text-khi-blue-soft"
                >
                  <Paperclip size={12} aria-hidden="true" />
                  <span className="max-w-[140px] truncate">{file.name}</span>
                  <button type="button" aria-label="Remove file" className="text-white/60 hover:text-white" onClick={e => { e.stopPropagation(); setFile(null); }}>
                    <X size={12} aria-hidden="true" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Field>
      </div>

      {error && (
        <p role="alert" className="text-sm text-[#FF6B8E]">{error}</p>
      )}

      <div className="pt-3 border-t border-white/10">
        <motion.div whileTap={{ scale: 0.98 }}>
          <button
            type="submit"
            className="kx-btn-primary w-full justify-center !px-7 !py-4 !text-[15px]"
            disabled={submitting || !form.fullName || !form.email || !form.project || !form.category || !form.description}
          >
            {submitting ? "Submitting…" : "Submit AI Project"}
            {!submitting && <ArrowRight size={16} aria-hidden="true" />}
          </button>
        </motion.div>
        <p className="mt-3 text-center text-[11px] text-white/30">
          By submitting you agree to Khinext's submission guidelines. Applications reviewed within 7–10 working days.
        </p>
      </div>
    </form>
  );
}
