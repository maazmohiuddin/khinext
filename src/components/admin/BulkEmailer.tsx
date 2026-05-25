"use client";

import { useState } from "react";
import { Mail, Send, CheckSquare, Square, ChevronDown, ChevronUp, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { INVITATION_SUBJECT } from "@/lib/email/invitation";

// ── Types ──────────────────────────────────────────────────────

interface SendResult {
  total: number;
  sent: number;
  failed: number;
  sentList: string[];
  failedList: { email: string; error: string }[];
  skippedInvalid?: string[];
}

type Phase = "input" | "review" | "sending" | "done";

// ── Helpers ────────────────────────────────────────────────────

function parseEmails(raw: string): { valid: string[]; invalid: string[] } {
  const tokens = raw
    .split(/[\n,;]+/)
    .map(t => t.trim())
    .filter(Boolean);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const t of tokens) {
    const lower = t.toLowerCase();
    if (emailRegex.test(lower)) {
      if (!seen.has(lower)) {
        seen.add(lower);
        valid.push(lower);
      }
    } else if (t.length > 0) {
      invalid.push(t);
    }
  }
  return { valid, invalid };
}

// ── Sub-components ─────────────────────────────────────────────

function StatusBadge({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <div className="kx-card !p-4 !rounded-xl text-center">
      <div className="font-display text-3xl font-extrabold -tracking-tight" style={{ color }}>
        {count}
      </div>
      <div className="mt-1 text-[11px] text-white/45">{label}</div>
    </div>
  );
}

function EmailPreviewPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-sm font-medium text-white/70"
      >
        <span className="flex items-center gap-2">
          <Mail size={15} />
          Preview Invitation Email
        </span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && (
        <div className="border-t border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 mb-3">
            Subject: <span className="text-white/70 font-medium">{INVITATION_SUBJECT}</span>
          </p>
          <iframe
            srcDoc={undefined}
            src="/api/admin/bulk-email/preview"
            title="Email Preview"
            className="w-full rounded-xl border border-white/10"
            style={{ height: 560, background: "#fff" }}
          />
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

export function BulkEmailer({ adminEmail }: { adminEmail: string }) {
  const [phase, setPhase] = useState<Phase>("input");
  const [rawInput, setRawInput] = useState("");
  const [parsed, setParsed] = useState<{ valid: string[]; invalid: string[] } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState(INVITATION_SUBJECT);
  const [result, setResult] = useState<SendResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── Parse step ──────────────────────────────────────────────
  function handleParse() {
    const p = parseEmails(rawInput);
    setParsed(p);
    setSelected(new Set(p.valid));
    setPhase("review");
  }

  // ── Selection helpers ───────────────────────────────────────
  const allSelected = parsed ? selected.size === parsed.valid.length : false;
  const someSelected = selected.size > 0;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(parsed?.valid ?? []));
    }
  }

  function toggleOne(email: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  }

  // ── Send ────────────────────────────────────────────────────
  async function handleSend() {
    if (selected.size === 0) return;
    setPhase("sending");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/bulk-email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: Array.from(selected), subject }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Send failed.");
        setPhase("review");
        return;
      }
      setResult(data as SendResult);
      setPhase("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error.");
      setPhase("review");
    }
  }

  // ── Reset ───────────────────────────────────────────────────
  function handleReset() {
    setPhase("input");
    setRawInput("");
    setParsed(null);
    setSelected(new Set());
    setSubject(INVITATION_SUBJECT);
    setResult(null);
    setErrorMsg(null);
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="max-w-page mx-auto px-6 md:px-14 py-12 md:py-16">

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-3"
          >
            <ArrowLeft size={12} /> Back to Dashboard
          </Link>
          <p className="kx-eyebrow mb-3">Bulk Emailer</p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white -tracking-tight">
            Invitation <span className="kx-accent">Mailer</span>
          </h1>
          <p className="mt-2 text-sm text-white/45">
            Send the "You Are Invited" email to multiple recipients from{" "}
            <strong className="text-white/60">info@khinext.com</strong>
          </p>
        </div>
        <span className="text-xs text-white/30">
          Signed in as <strong className="text-white/50">{adminEmail}</strong>
        </span>
      </header>

      {/* ── PHASE: input ── */}
      {phase === "input" && (
        <div className="space-y-6">
          <div className="kx-card !p-6 !rounded-2xl space-y-5">
            <div>
              <label className="kx-label block mb-2">Recipient Emails</label>
              <p className="text-xs text-white/40 mb-3">
                Paste emails separated by commas, semicolons, or new lines. Duplicates are removed automatically.
              </p>
              <textarea
                value={rawInput}
                onChange={e => setRawInput(e.target.value)}
                placeholder={"alice@example.com\nbob@example.com, carol@example.com"}
                rows={10}
                className="kx-input w-full rounded-xl resize-y min-h-[200px] font-mono text-sm"
                spellCheck={false}
              />
            </div>

            <div>
              <label className="kx-label block mb-2">Email Subject (optional override)</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder={INVITATION_SUBJECT}
                className="kx-input w-full rounded-xl"
              />
            </div>

            <button
              onClick={handleParse}
              disabled={!rawInput.trim()}
              className="kx-btn kx-btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Mail size={15} />
              Parse Recipients & Review
            </button>
          </div>

          <EmailPreviewPanel />
        </div>
      )}

      {/* ── PHASE: review ── */}
      {phase === "review" && parsed && (
        <div className="space-y-6">
          {errorMsg && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {errorMsg}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatusBadge count={parsed.valid.length} label="Valid Emails" color="#316BFF" />
            <StatusBadge count={selected.size} label="Selected" color="#51FFD5" />
            <StatusBadge count={parsed.invalid.length} label="Invalid / Skipped" color="#FF6B6B" />
          </div>

          {/* Subject */}
          <div className="kx-card !p-5 !rounded-2xl">
            <label className="kx-label block mb-2">Email Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="kx-input w-full rounded-xl"
            />
          </div>

          {/* Recipients table */}
          <div className="kx-card !p-0 !rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <span className="text-sm font-semibold text-white">
                Recipients ({parsed.valid.length})
              </span>
              <button
                onClick={toggleAll}
                className="inline-flex items-center gap-1.5 text-xs text-khi-blue-soft hover:text-white transition-colors"
              >
                {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="divide-y divide-white/[0.06] max-h-80 overflow-y-auto">
              {parsed.valid.map(email => (
                <label
                  key={email}
                  className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-white/[0.03] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(email)}
                    onChange={() => toggleOne(email)}
                    className="accent-khi-blue w-4 h-4 rounded flex-shrink-0"
                  />
                  <span className="text-sm text-white/80 font-mono truncate">{email}</span>
                </label>
              ))}
            </div>

            {parsed.invalid.length > 0 && (
              <div className="border-t border-white/10 px-5 py-4">
                <p className="text-xs text-white/40 mb-2 uppercase tracking-widest">Skipped (invalid format)</p>
                <div className="space-y-1">
                  {parsed.invalid.map((e, i) => (
                    <p key={i} className="text-xs text-red-400/70 font-mono">{e}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleReset}
              className="kx-btn kx-btn-outline flex-1 justify-center"
            >
              <RefreshCw size={14} />
              Start Over
            </button>
            <button
              onClick={handleSend}
              disabled={!someSelected}
              className="kx-btn kx-btn-primary flex-[2] justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={15} />
              Send to {selected.size} Recipient{selected.size !== 1 ? "s" : ""}
            </button>
          </div>

          <EmailPreviewPanel />
        </div>
      )}

      {/* ── PHASE: sending ── */}
      {phase === "sending" && (
        <div className="kx-card !p-10 !rounded-2xl flex flex-col items-center justify-center gap-6 text-center min-h-[300px]">
          <div className="w-16 h-16 rounded-full border-4 border-khi-blue/30 border-t-khi-blue animate-spin" />
          <div>
            <p className="text-lg font-semibold text-white">Sending invitations…</p>
            <p className="text-sm text-white/45 mt-1">
              Emailing {selected.size} recipient{selected.size !== 1 ? "s" : ""} via mail.khinext.com
            </p>
          </div>
        </div>
      )}

      {/* ── PHASE: done ── */}
      {phase === "done" && result && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <StatusBadge count={result.total} label="Total Recipients" color="#316BFF" />
            <StatusBadge count={result.sent} label="Successfully Sent" color="#51FFD5" />
            <StatusBadge count={result.failed} label="Failed" color={result.failed > 0 ? "#FF6B6B" : "rgba(255,255,255,0.2)"} />
          </div>

          <div className="kx-card !p-6 !rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${result.failed === 0 ? "bg-emerald-500/15" : "bg-amber-500/15"}`}>
                <Send size={18} className={result.failed === 0 ? "text-emerald-400" : "text-amber-400"} />
              </div>
              <div>
                <p className="font-semibold text-white">
                  {result.failed === 0 ? "All invitations sent!" : "Batch completed with some failures"}
                </p>
                <p className="text-xs text-white/45 mt-0.5">
                  {result.sent} of {result.total} delivered · via info@khinext.com
                </p>
              </div>
            </div>

            {result.sentList.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Delivered to</p>
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 divide-y divide-white/[0.04] max-h-52 overflow-y-auto">
                  {result.sentList.map(e => (
                    <p key={e} className="px-4 py-2.5 text-xs font-mono text-emerald-300/80">{e}</p>
                  ))}
                </div>
              </div>
            )}

            {result.failedList.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Failed</p>
                <div className="rounded-xl bg-red-500/5 border border-red-500/15 divide-y divide-white/[0.04] max-h-40 overflow-y-auto">
                  {result.failedList.map(f => (
                    <div key={f.email} className="px-4 py-2.5">
                      <p className="text-xs font-mono text-red-300/80">{f.email}</p>
                      <p className="text-[11px] text-white/30 mt-0.5">{f.error}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.skippedInvalid && result.skippedInvalid.length > 0 && (
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Skipped (invalid format)</p>
                <div className="rounded-xl bg-white/[0.03] border border-white/10 divide-y divide-white/[0.04] max-h-32 overflow-y-auto">
                  {result.skippedInvalid.map(e => (
                    <p key={e} className="px-4 py-2.5 text-xs font-mono text-white/30">{e}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Link href="/admin" className="kx-btn kx-btn-outline flex-1 justify-center">
              <ArrowLeft size={14} />
              Back to Dashboard
            </Link>
            <button onClick={handleReset} className="kx-btn kx-btn-primary flex-1 justify-center">
              <Mail size={15} />
              Send Another Batch
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
