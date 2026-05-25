"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mail, Send, CheckSquare, Square, RefreshCw,
  ArrowLeft, History, ChevronDown, ChevronUp, Edit3, Users,
} from "lucide-react";
import Link from "next/link";
import { INVITATION_SUBJECT, DEFAULT_CTA_URL } from "@/lib/email/invitation";

// ── Types ──────────────────────────────────────────────────────

interface SendResult {
  total: number; sent: number; failed: number;
  sentList: string[];
  failedList: { email: string; error: string }[];
  skippedInvalid?: string[];
}

interface EmailLog {
  id: string;
  sent_at: string;
  subject: string;
  total_count: number;
  sent_count: number;
  failed_count: number;
  recipients: string[];
  failed_recipients: { email: string; error: string }[];
}

type Phase = "input" | "review" | "sending" | "done";
type MainTab = "compose" | "history";

interface EmailFields {
  subject: string;
  headline: string;
  bodyText: string;
  ctaLabel: string;
  ctaUrl: string;
}

// ── Helpers ────────────────────────────────────────────────────

function parseEmails(raw: string): { valid: string[]; invalid: string[] } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const t of raw.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean)) {
    const lower = t.toLowerCase();
    if (emailRegex.test(lower)) {
      if (!seen.has(lower)) { seen.add(lower); valid.push(lower); }
    } else {
      invalid.push(t);
    }
  }
  return { valid, invalid };
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Sub-components ─────────────────────────────────────────────

function StatCard({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <div className="kx-card !p-4 !rounded-xl text-center">
      <div className="font-display text-3xl font-extrabold -tracking-tight" style={{ color }}>{n}</div>
      <div className="mt-1 text-[11px] text-white/45">{label}</div>
    </div>
  );
}

function EmailPreview({ fields }: { fields: EmailFields }) {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/admin/bulk-email/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            headline: fields.headline,
            bodyText: fields.bodyText,
            ctaLabel: fields.ctaLabel,
            ctaUrl: fields.ctaUrl,
          }),
        });
        const html = await res.text();
        if (iframeRef.current) {
          iframeRef.current.srcdoc = html;
        }
      } catch { /* ignore */ }
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [open, fields]);

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-sm font-medium text-white/70"
      >
        <span className="flex items-center gap-2"><Mail size={15} /> Preview Email</span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && (
        <div className="border-t border-white/10 p-4">
          <p className="text-xs text-white/40 mb-3">
            Subject: <span className="text-white/70 font-medium">{fields.subject || INVITATION_SUBJECT}</span>
          </p>
          <iframe
            ref={iframeRef}
            title="Email Preview"
            className="w-full rounded-xl border border-white/10"
            style={{ height: 560, background: "#fff" }}
          />
        </div>
      )}
    </div>
  );
}

function HistoryTab() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/bulk-email/history")
      .then(r => r.json())
      .then(d => { setLogs(d.logs ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-white/30 text-sm">Loading history…</div>
  );
  if (logs.length === 0) return (
    <div className="kx-card !p-10 !rounded-2xl text-center text-white/30 text-sm">
      No sends yet. History will appear here after your first bulk send.
    </div>
  );

  return (
    <div className="space-y-3">
      {logs.map(log => (
        <div key={log.id} className="kx-card !p-0 !rounded-2xl overflow-hidden">
          <button
            onClick={() => setExpanded(e => e === log.id ? null : log.id)}
            className="w-full flex flex-wrap items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{log.subject}</p>
              <p className="text-xs text-white/40 mt-0.5">{fmt(log.sent_at)}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-emerald-400 font-medium">{log.sent_count} sent</span>
              {log.failed_count > 0 && (
                <span className="text-xs text-red-400 font-medium">{log.failed_count} failed</span>
              )}
              <span className="text-xs text-white/30">{log.total_count} total</span>
              {expanded === log.id ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
            </div>
          </button>

          {expanded === log.id && (
            <div className="border-t border-white/10 px-5 py-4 space-y-4">
              {log.recipients.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Delivered to ({log.sent_count})</p>
                  <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 max-h-44 overflow-y-auto divide-y divide-white/[0.04]">
                    {log.recipients.map(e => (
                      <p key={e} className="px-4 py-2 text-xs font-mono text-emerald-300/80">{e}</p>
                    ))}
                  </div>
                </div>
              )}
              {log.failed_recipients.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Failed ({log.failed_count})</p>
                  <div className="rounded-xl bg-red-500/5 border border-red-500/15 max-h-32 overflow-y-auto divide-y divide-white/[0.04]">
                    {log.failed_recipients.map(f => (
                      <div key={f.email} className="px-4 py-2">
                        <p className="text-xs font-mono text-red-300/80">{f.email}</p>
                        <p className="text-[11px] text-white/30 mt-0.5">{f.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

export function BulkEmailer({ adminEmail }: { adminEmail: string }) {
  const [mainTab, setMainTab] = useState<MainTab>("compose");
  const [phase, setPhase] = useState<Phase>("input");

  // Email content fields
  const [fields, setFields] = useState<EmailFields>({
    subject: INVITATION_SUBJECT,
    headline: "You are invited.",
    bodyText: "",
    ctaLabel: "Claim Your Spot",
    ctaUrl: DEFAULT_CTA_URL,
  });

  // Recipients
  const [rawInput, setRawInput] = useState("");
  const [parsed, setParsed] = useState<{ valid: string[]; invalid: string[] } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Results
  const [result, setResult] = useState<SendResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Edit section collapse
  const [editOpen, setEditOpen] = useState(true);

  function setField(key: keyof EmailFields, val: string) {
    setFields(f => ({ ...f, [key]: val }));
  }

  // ── Parse ──────────────────────────────────────────────────
  function handleParse() {
    const p = parseEmails(rawInput);
    setParsed(p);
    setSelected(new Set(p.valid));
    setPhase("review");
  }

  // ── Selection ──────────────────────────────────────────────
  const allSelected = parsed ? selected.size === parsed.valid.length : false;
  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(parsed?.valid ?? []));
  }
  function toggleOne(email: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(email)) { next.delete(email); } else { next.add(email); }
      return next;
    });
  }

  // ── Send ───────────────────────────────────────────────────
  async function handleSend() {
    if (selected.size === 0) return;
    setPhase("sending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/bulk-email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: Array.from(selected),
          subject: fields.subject || INVITATION_SUBJECT,
          headline: fields.headline,
          bodyText: fields.bodyText,
          ctaLabel: fields.ctaLabel,
          ctaUrl: fields.ctaUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error ?? "Send failed."); setPhase("review"); return; }
      setResult(data as SendResult);
      setPhase("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error.");
      setPhase("review");
    }
  }

  // ── Reset ──────────────────────────────────────────────────
  function handleReset() {
    setPhase("input");
    setRawInput("");
    setParsed(null);
    setSelected(new Set());
    setResult(null);
    setErrorMsg(null);
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="max-w-page mx-auto px-6 md:px-14 py-12 md:py-16">

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-3">
            <ArrowLeft size={12} /> Back to Dashboard
          </Link>
          <p className="kx-eyebrow mb-3">Bulk Emailer</p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white -tracking-tight">
            Invitation <span className="kx-accent">Mailer</span>
          </h1>
        </div>
        <span className="text-xs text-white/30">
          Signed in as <strong className="text-white/50">{adminEmail}</strong>
        </span>
      </header>

      {/* Main tabs */}
      <div role="tablist" className="inline-flex gap-1 rounded-full bg-white/[0.04] border border-white/10 p-1 mb-8">
        {([["compose", <Edit3 key="e" size={13} />, "Compose"], ["history", <History key="h" size={13} />, "History"]] as const).map(([t, icon, label]) => (
          <button
            key={t}
            role="tab"
            aria-selected={mainTab === t}
            onClick={() => setMainTab(t)}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors duration-200 ${
              mainTab === t ? "bg-khi-blue text-white" : "text-white/60 hover:text-white"
            }`}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {/* ── HISTORY TAB ── */}
      {mainTab === "history" && <HistoryTab />}

      {/* ── COMPOSE TAB ── */}
      {mainTab === "compose" && (
        <div className="space-y-6">

          {/* ─ Edit Email section ─ */}
          <div className="kx-card !p-0 !rounded-2xl overflow-hidden">
            <button
              onClick={() => setEditOpen(v => !v)}
              className="w-full flex items-center justify-between px-5 py-4 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-white">
                <Edit3 size={15} /> Edit Email Content
              </span>
              {editOpen ? <ChevronUp size={15} className="text-white/40" /> : <ChevronDown size={15} className="text-white/40" />}
            </button>

            {editOpen && (
              <div className="border-t border-white/10 p-5 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="kx-label block mb-1.5">Subject Line</label>
                    <input
                      value={fields.subject}
                      onChange={e => setField("subject", e.target.value)}
                      placeholder={INVITATION_SUBJECT}
                      className="kx-input w-full rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="kx-label block mb-1.5">Headline</label>
                    <input
                      value={fields.headline}
                      onChange={e => setField("headline", e.target.value)}
                      placeholder="You are invited."
                      className="kx-input w-full rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="kx-label block mb-1.5">Body Text</label>
                  <p className="text-xs text-white/35 mb-2">Leave blank to use the default invitation copy.</p>
                  <textarea
                    value={fields.bodyText}
                    onChange={e => setField("bodyText", e.target.value)}
                    placeholder="Custom message body... (leave blank for default)"
                    rows={4}
                    className="kx-input w-full rounded-xl resize-y text-sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="kx-label block mb-1.5">CTA Button Label</label>
                    <input
                      value={fields.ctaLabel}
                      onChange={e => setField("ctaLabel", e.target.value)}
                      placeholder="Claim Your Spot"
                      className="kx-input w-full rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="kx-label block mb-1.5">CTA Button URL</label>
                    <input
                      value={fields.ctaUrl}
                      onChange={e => setField("ctaUrl", e.target.value)}
                      placeholder={DEFAULT_CTA_URL}
                      className="kx-input w-full rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─ Preview ─ */}
          <EmailPreview fields={fields} />

          {/* ─ Recipients input phase ─ */}
          {phase === "input" && (
            <div className="kx-card !p-0 !rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
                <Users size={15} className="text-white/60" />
                <span className="text-sm font-semibold text-white">Add Recipients</span>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-xs text-white/40">
                  Paste emails separated by commas, semicolons, or new lines. Duplicates are removed automatically.
                </p>
                <textarea
                  value={rawInput}
                  onChange={e => setRawInput(e.target.value)}
                  placeholder={"alice@example.com\nbob@example.com, carol@example.com"}
                  rows={8}
                  className="kx-input w-full rounded-xl resize-y min-h-[160px] font-mono text-sm"
                  spellCheck={false}
                />
                <button
                  onClick={handleParse}
                  disabled={!rawInput.trim()}
                  className="kx-btn kx-btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Users size={15} /> Parse Recipients & Review
                </button>
              </div>
            </div>
          )}

          {/* ─ Review phase ─ */}
          {phase === "review" && parsed && (
            <div className="space-y-5">
              {errorMsg && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <StatCard n={parsed.valid.length} label="Valid Emails" color="#316BFF" />
                <StatCard n={selected.size} label="Selected" color="#51FFD5" />
                <StatCard n={parsed.invalid.length} label="Invalid" color="#FF6B6B" />
              </div>

              <div className="kx-card !p-0 !rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <span className="text-sm font-semibold text-white">Recipients ({parsed.valid.length})</span>
                  <button onClick={toggleAll} className="inline-flex items-center gap-1.5 text-xs text-khi-blue-soft hover:text-white transition-colors">
                    {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                    {allSelected ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="divide-y divide-white/[0.06] max-h-72 overflow-y-auto">
                  {parsed.valid.map(email => (
                    <label key={email} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-white/[0.03] transition-colors">
                      <input
                        type="checkbox"
                        checked={selected.has(email)}
                        onChange={() => toggleOne(email)}
                        className="accent-khi-blue w-4 h-4 flex-shrink-0"
                      />
                      <span className="text-sm text-white/80 font-mono truncate">{email}</span>
                    </label>
                  ))}
                </div>
                {parsed.invalid.length > 0 && (
                  <div className="border-t border-white/10 px-5 py-4">
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Skipped</p>
                    {parsed.invalid.map((e, i) => <p key={i} className="text-xs text-red-400/60 font-mono">{e}</p>)}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={handleReset} className="kx-btn kx-btn-outline flex-1 justify-center">
                  <RefreshCw size={14} /> Edit Recipients
                </button>
                <button
                  onClick={handleSend}
                  disabled={selected.size === 0}
                  className="kx-btn kx-btn-primary flex-[2] justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={15} /> Send to {selected.size} Recipient{selected.size !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          )}

          {/* ─ Sending phase ─ */}
          {phase === "sending" && (
            <div className="kx-card !p-10 !rounded-2xl flex flex-col items-center justify-center gap-6 text-center min-h-[280px]">
              <div className="w-16 h-16 rounded-full border-4 border-khi-blue/30 border-t-khi-blue animate-spin" />
              <div>
                <p className="text-lg font-semibold text-white">Sending invitations…</p>
                <p className="text-sm text-white/45 mt-1">
                  Emailing {selected.size} recipient{selected.size !== 1 ? "s" : ""} via mail.khinext.com
                </p>
              </div>
            </div>
          )}

          {/* ─ Done phase ─ */}
          {phase === "done" && result && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <StatCard n={result.total} label="Total" color="#316BFF" />
                <StatCard n={result.sent} label="Sent" color="#51FFD5" />
                <StatCard n={result.failed} label="Failed" color={result.failed > 0 ? "#FF6B6B" : "rgba(255,255,255,0.2)"} />
              </div>

              <div className="kx-card !p-6 !rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${result.failed === 0 ? "bg-emerald-500/15" : "bg-amber-500/15"}`}>
                    <Send size={18} className={result.failed === 0 ? "text-emerald-400" : "text-amber-400"} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{result.failed === 0 ? "All invitations sent!" : "Batch completed with some failures"}</p>
                    <p className="text-xs text-white/45 mt-0.5">{result.sent} of {result.total} delivered · info@khinext.com</p>
                  </div>
                </div>

                {result.sentList.length > 0 && (
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Delivered to</p>
                    <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 divide-y divide-white/[0.04] max-h-48 overflow-y-auto">
                      {result.sentList.map(e => <p key={e} className="px-4 py-2.5 text-xs font-mono text-emerald-300/80">{e}</p>)}
                    </div>
                  </div>
                )}

                {result.failedList.length > 0 && (
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Failed</p>
                    <div className="rounded-xl bg-red-500/5 border border-red-500/15 divide-y divide-white/[0.04] max-h-36 overflow-y-auto">
                      {result.failedList.map(f => (
                        <div key={f.email} className="px-4 py-2.5">
                          <p className="text-xs font-mono text-red-300/80">{f.email}</p>
                          <p className="text-[11px] text-white/30 mt-0.5">{f.error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => { handleReset(); setMainTab("history"); }} className="kx-btn kx-btn-outline flex-1 justify-center">
                  <History size={14} /> View History
                </button>
                <button onClick={handleReset} className="kx-btn kx-btn-primary flex-1 justify-center">
                  <Mail size={15} /> Send Another Batch
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
