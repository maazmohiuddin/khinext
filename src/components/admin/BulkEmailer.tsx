"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mail, Send, CheckSquare, Square, RefreshCw, ArrowLeft,
  History, ChevronDown, ChevronUp, Edit3, Users,
  CheckCircle2, XCircle, AlertCircle, Loader2, Eye, EyeOff, Key,
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

interface MxResult { email: string; domain: string; mx: boolean; reason?: string; }

interface SendRecord {
  id: string; email: string; delivery_status: string;
  mx_valid: boolean | null; opened_at: string | null;
  open_count: number; last_opened_at: string | null; smtp_error: string | null;
  vip_token: string | null; token_expires_at: string | null; token_redeemed_at: string | null;
}

interface EmailLog {
  id: string; sent_at: string; subject: string;
  total_count: number; sent_count: number; failed_count: number;
  total_opens: number; unique_openers: number; vip_tokens_sent: number;
  records: SendRecord[];
}

type Phase = "input" | "review" | "sending" | "done";
type MainTab = "compose" | "history";
interface EmailFields { subject: string; headline: string; bodyText: string; ctaLabel: string; ctaUrl: string; }

// ── Helpers ────────────────────────────────────────────────────

function parseEmails(raw: string) {
  const seen = new Set<string>(); const valid: string[] = []; const invalid: string[] = [];
  for (const t of raw.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean)) {
    const lower = t.toLowerCase();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)) {
      if (!seen.has(lower)) { seen.add(lower); valid.push(lower); }
    } else { invalid.push(t); }
  }
  return { valid, invalid };
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function openRate(log: EmailLog) {
  if (log.sent_count === 0) return "—";
  return `${Math.round((log.unique_openers / log.sent_count) * 100)}%`;
}

function fmtExpiry(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const expired = d < now;
  const label = expired ? "Expired" : `Expires ${fmt(iso)}`;
  return { label, expired };
}

// ── Micro-components ───────────────────────────────────────────

function Stat({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <div className="kx-card !p-4 !rounded-xl text-center">
      <div className="font-display text-3xl font-extrabold -tracking-tight" style={{ color }}>{n}</div>
      <div className="mt-1 text-[11px] text-white/45">{label}</div>
    </div>
  );
}

function MxBadge({ mx, reason }: { mx: boolean | null; reason?: string }) {
  if (mx === null) return <span className="text-white/30 text-[11px]">—</span>;
  if (mx) return <span className="flex items-center gap-1 text-[11px] text-emerald-400"><CheckCircle2 size={11} />MX OK</span>;
  return (
    <span className="flex items-center gap-1 text-[11px] text-red-400" title={reason}>
      <XCircle size={11} />No MX
    </span>
  );
}

function DeliveryBadge({ status }: { status: string }) {
  if (status === "sent") return <span className="flex items-center gap-1 text-[11px] text-emerald-400"><CheckCircle2 size={11} />Delivered</span>;
  if (status === "failed") return <span className="flex items-center gap-1 text-[11px] text-red-400"><XCircle size={11} />Failed</span>;
  return <span className="text-[11px] text-white/30">Pending</span>;
}

function OpenBadge({ count, openedAt }: { count: number; openedAt: string | null }) {
  if (count === 0) return <span className="flex items-center gap-1 text-[11px] text-white/25"><EyeOff size={11} />Not opened</span>;
  return (
    <span className="flex items-center gap-1 text-[11px] text-blue-300" title={openedAt ? `First opened: ${fmt(openedAt)}` : undefined}>
      <Eye size={11} />{count} open{count !== 1 ? "s" : ""}
    </span>
  );
}

function TokenBadge({ token, redeemed }: { token: string | null; redeemed: boolean }) {
  if (!token) return null;
  if (redeemed) return <span className="flex items-center gap-1 text-[11px] text-amber-400"><Key size={11} />Redeemed</span>;
  return <span className="flex items-center gap-1 text-[11px] text-white/40"><Key size={11} />VIP sent</span>;
}

// ── Expandable record row ──────────────────────────────────────

function RecordRow({ rec }: { rec: SendRecord }) {
  const [open, setOpen] = useState(false);
  const hasToken = !!rec.vip_token;

  return (
    <>
      <div
        className={`grid gap-2 items-center px-5 py-3 cursor-pointer hover:bg-white/[0.03] transition-colors ${hasToken ? "grid-cols-[1fr_80px_90px_90px_90px]" : "grid-cols-[1fr_80px_90px_90px]"}`}
        onClick={() => setOpen(v => !v)}
      >
        <div className="min-w-0 flex items-center gap-2">
          {open ? <ChevronUp size={11} className="text-white/30 flex-shrink-0" /> : <ChevronDown size={11} className="text-white/30 flex-shrink-0" />}
          <div className="min-w-0">
            <p className="text-xs font-mono text-white/75 truncate">{rec.email}</p>
            {rec.smtp_error && <p className="text-[10px] text-red-400/60 truncate mt-0.5">{rec.smtp_error}</p>}
          </div>
        </div>
        <MxBadge mx={rec.mx_valid} />
        <DeliveryBadge status={rec.delivery_status} />
        <OpenBadge count={rec.open_count} openedAt={rec.opened_at} />
        {hasToken && <TokenBadge token={rec.vip_token} redeemed={!!rec.token_redeemed_at} />}
      </div>

      {open && (
        <div className="px-5 pb-3 pt-0 bg-white/[0.015] border-t border-white/[0.04] space-y-2">
          {rec.open_count > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-white/50">
              {rec.opened_at && <span>First opened: <span className="text-white/70">{fmt(rec.opened_at)}</span></span>}
              {rec.last_opened_at && rec.last_opened_at !== rec.opened_at &&
                <span>Last opened: <span className="text-white/70">{fmt(rec.last_opened_at)}</span></span>}
              <span>Total opens: <span className="text-blue-300">{rec.open_count}</span></span>
            </div>
          )}
          {rec.vip_token && (
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-white/50">
              <span>Token: <span className="font-mono text-white/40">{rec.vip_token.slice(0, 12)}…</span></span>
              {rec.token_expires_at && (() => {
                const { label, expired } = fmtExpiry(rec.token_expires_at);
                return <span className={expired ? "text-red-400/60" : "text-white/50"}>{label}</span>;
              })()}
              {rec.token_redeemed_at
                ? <span className="text-amber-400">Redeemed: {fmt(rec.token_redeemed_at)}</span>
                : <span className="text-white/30">Not yet redeemed</span>}
            </div>
          )}
          {rec.open_count === 0 && !rec.vip_token && (
            <p className="text-[11px] text-white/25">No activity yet.</p>
          )}
        </div>
      )}
    </>
  );
}

// ── Email Preview ──────────────────────────────────────────────

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
          body: JSON.stringify({ headline: fields.headline, bodyText: fields.bodyText, ctaLabel: fields.ctaLabel, ctaUrl: fields.ctaUrl }),
        });
        if (iframeRef.current) iframeRef.current.srcdoc = await res.text();
      } catch { /* ignore */ }
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [open, fields]);

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-sm font-medium text-white/70">
        <span className="flex items-center gap-2"><Mail size={15} />Preview Email</span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && (
        <div className="border-t border-white/10 p-4">
          <p className="text-xs text-white/40 mb-3">Subject: <span className="text-white/70 font-medium">{fields.subject || INVITATION_SUBJECT}</span></p>
          <iframe ref={iframeRef} title="Email Preview" className="w-full rounded-xl border border-white/10" style={{ height: 560, background: "#fff" }} />
        </div>
      )}
    </div>
  );
}

// ── History Tab ────────────────────────────────────────────────

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

  if (loading) return <div className="flex items-center justify-center py-20 gap-2 text-white/30 text-sm"><Loader2 size={16} className="animate-spin" />Loading…</div>;
  if (logs.length === 0) return (
    <div className="kx-card !p-10 !rounded-2xl text-center text-white/30 text-sm">
      No sends yet. History will appear here after your first batch.
    </div>
  );

  return (
    <div className="space-y-3">
      {logs.map(log => (
        <div key={log.id} className="kx-card !p-0 !rounded-2xl overflow-hidden">
          {/* Log header row */}
          <button onClick={() => setExpanded(e => e === log.id ? null : log.id)}
            className="w-full flex flex-wrap items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{log.subject}</p>
              <p className="text-xs text-white/40 mt-0.5">{fmt(log.sent_at)}</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
              <div className="text-center">
                <p className="text-sm font-bold text-emerald-400">{log.sent_count}</p>
                <p className="text-[10px] text-white/30">Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold" style={{ color: log.failed_count > 0 ? "#FF6B6B" : "rgba(255,255,255,0.2)" }}>{log.failed_count}</p>
                <p className="text-[10px] text-white/30">Failed</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-blue-300">{log.unique_openers}</p>
                <p className="text-[10px] text-white/30">Opened</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white/60">{openRate(log)}</p>
                <p className="text-[10px] text-white/30">Open rate</p>
              </div>
              {log.vip_tokens_sent > 0 && (
                <div className="text-center">
                  <p className="text-sm font-bold text-amber-400">{log.vip_tokens_sent}</p>
                  <p className="text-[10px] text-white/30">VIP tokens</p>
                </div>
              )}
              {expanded === log.id ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
            </div>
          </button>

          {/* Per-recipient records — each row is individually expandable */}
          {expanded === log.id && log.records.length > 0 && (
            <div className="border-t border-white/10">
              <div className={`grid gap-2 px-5 py-2 bg-white/[0.02] text-[10px] uppercase tracking-widest text-white/30 font-semibold ${log.vip_tokens_sent > 0 ? "grid-cols-[1fr_80px_90px_90px_90px]" : "grid-cols-[1fr_80px_90px_90px]"}`}>
                <span>Email</span><span>Domain</span><span>Delivery</span><span>Opens</span>
                {log.vip_tokens_sent > 0 && <span>VIP Token</span>}
              </div>
              <div className="divide-y divide-white/[0.04] max-h-72 overflow-y-auto">
                {log.records.map(rec => (
                  <RecordRow key={rec.id} rec={rec as SendRecord} />
                ))}
              </div>
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

  const [fields, setFields] = useState<EmailFields>({
    subject: INVITATION_SUBJECT, headline: "You are invited.",
    bodyText: "", ctaLabel: "", ctaUrl: "",
  });
  const [includeVipToken, setIncludeVipToken] = useState(false);

  const [rawInput, setRawInput] = useState("");
  const [parsed, setParsed] = useState<{ valid: string[]; invalid: string[] } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [mxResults, setMxResults] = useState<Map<string, MxResult>>(new Map());
  const [validating, setValidating] = useState(false);

  const [result, setResult] = useState<SendResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(true);

  function setField(k: keyof EmailFields, v: string) { setFields(f => ({ ...f, [k]: v })); }

  // When VIP token is toggled on, pre-fill CTA defaults
  function handleVipToggle(on: boolean) {
    setIncludeVipToken(on);
    if (on) {
      setFields(f => ({
        ...f,
        ctaLabel: f.ctaLabel || "Create Your VIP Card",
        ctaUrl: "",
      }));
    } else {
      setFields(f => ({
        ...f,
        ctaLabel: f.ctaLabel === "Create Your VIP Card" ? "" : f.ctaLabel,
        ctaUrl: f.ctaUrl || "",
      }));
    }
  }

  function handleParse() {
    const p = parseEmails(rawInput);
    setParsed(p);
    setSelected(new Set(p.valid));
    setMxResults(new Map());
    setPhase("review");
  }

  async function handleValidate() {
    if (!parsed || parsed.valid.length === 0) return;
    setValidating(true);
    try {
      const res = await fetch("/api/admin/bulk-email/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: parsed.valid }),
      });
      const data = await res.json();
      if (data.results) {
        const map = new Map<string, MxResult>();
        for (const r of data.results) map.set(r.email, r);
        setMxResults(map);
      }
    } catch { /* ignore */ }
    setValidating(false);
  }

  const allSelected = parsed ? selected.size === parsed.valid.length : false;
  function toggleAll() { setSelected(allSelected ? new Set() : new Set(parsed?.valid ?? [])); }
  function toggleOne(email: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(email)) { next.delete(email); } else { next.add(email); }
      return next;
    });
  }

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
          includeVipToken,
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

  function handleReset() {
    setPhase("input"); setRawInput(""); setParsed(null);
    setSelected(new Set()); setMxResults(new Map());
    setResult(null); setErrorMsg(null);
  }

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
        <span className="text-xs text-white/30">Signed in as <strong className="text-white/50">{adminEmail}</strong></span>
      </header>

      {/* Main tabs */}
      <div role="tablist" className="inline-flex gap-1 rounded-full bg-white/[0.04] border border-white/10 p-1 mb-8">
        {([["compose", <Edit3 key="e" size={13} />, "Compose"], ["history", <History key="h" size={13} />, "History"]] as const).map(([t, icon, label]) => (
          <button key={t} role="tab" aria-selected={mainTab === t} onClick={() => setMainTab(t)}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${mainTab === t ? "bg-khi-blue text-white" : "text-white/60 hover:text-white"}`}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* ── HISTORY TAB ── */}
      {mainTab === "history" && <HistoryTab />}

      {/* ── COMPOSE TAB ── */}
      {mainTab === "compose" && (
        <div className="space-y-6">

          {/* Edit Email */}
          <div className="kx-card !p-0 !rounded-2xl overflow-hidden">
            <button onClick={() => setEditOpen(v => !v)}
              className="w-full flex items-center justify-between px-5 py-4 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <span className="flex items-center gap-2 text-sm font-semibold text-white"><Edit3 size={15} />Edit Email Content</span>
              {editOpen ? <ChevronUp size={15} className="text-white/40" /> : <ChevronDown size={15} className="text-white/40" />}
            </button>
            {editOpen && (
              <div className="border-t border-white/10 p-5 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="kx-label block mb-1.5">Subject Line</label>
                    <input value={fields.subject} onChange={e => setField("subject", e.target.value)} placeholder={INVITATION_SUBJECT} className="kx-input w-full rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="kx-label block mb-1.5">Headline</label>
                    <input value={fields.headline} onChange={e => setField("headline", e.target.value)} placeholder="You are invited." className="kx-input w-full rounded-xl text-sm" />
                  </div>
                </div>
                <div>
                  <label className="kx-label block mb-1.5">Body Text</label>
                  <p className="text-xs text-white/35 mb-2">Leave blank to use the default copy{includeVipToken ? " (VIP card access)" : ""}.</p>
                  <textarea value={fields.bodyText} onChange={e => setField("bodyText", e.target.value)} placeholder="Custom message body… (leave blank for default)" rows={4} className="kx-input w-full rounded-xl resize-y text-sm" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="kx-label block mb-1.5">CTA Button Label</label>
                    <input
                      value={fields.ctaLabel}
                      onChange={e => setField("ctaLabel", e.target.value)}
                      placeholder={includeVipToken ? "Create Your VIP Card" : "Claim Your Spot"}
                      className="kx-input w-full rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="kx-label block mb-1.5">CTA Button URL</label>
                    <input
                      value={fields.ctaUrl}
                      onChange={e => setField("ctaUrl", e.target.value)}
                      placeholder={includeVipToken ? "Auto-generated per recipient" : DEFAULT_CTA_URL}
                      disabled={includeVipToken}
                      className="kx-input w-full rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                    {includeVipToken && (
                      <p className="text-[11px] text-amber-400/70 mt-1.5">URL is auto-generated with each recipient&apos;s unique 48h VIP token.</p>
                    )}
                  </div>
                </div>

                {/* VIP Token toggle */}
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-4 py-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeVipToken}
                      onChange={e => handleVipToggle(e.target.checked)}
                      className="mt-0.5 accent-amber-400 w-4 h-4 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <Key size={13} className="text-amber-400" />
                        Include VIP Card Access
                      </p>
                      <p className="text-xs text-white/45 mt-0.5">
                        Each recipient gets a unique access token (valid 48 hours) embedded in the CTA link. Clicking it auto-unlocks the VIP card generator. Token redemption is tracked.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <EmailPreview fields={fields} />

          {/* Input phase */}
          {phase === "input" && (
            <div className="kx-card !p-0 !rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
                <Users size={15} className="text-white/60" />
                <span className="text-sm font-semibold text-white">Add Recipients</span>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-xs text-white/40">Paste emails separated by commas, semicolons, or new lines. Duplicates are removed automatically.</p>
                <textarea value={rawInput} onChange={e => setRawInput(e.target.value)}
                  placeholder={"alice@example.com\nbob@example.com, carol@example.com"}
                  rows={8} className="kx-input w-full rounded-xl resize-y min-h-[160px] font-mono text-sm" spellCheck={false} />
                <button onClick={handleParse} disabled={!rawInput.trim()} className="kx-btn kx-btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                  <Users size={15} />Parse Recipients & Review
                </button>
              </div>
            </div>
          )}

          {/* Review phase */}
          {phase === "review" && parsed && (
            <div className="space-y-5">
              {errorMsg && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">{errorMsg}</div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <Stat n={parsed.valid.length} label="Valid Emails" color="#316BFF" />
                <Stat n={selected.size} label="Selected" color="#51FFD5" />
                <Stat n={parsed.invalid.length} label="Invalid" color="#FF6B6B" />
              </div>

              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 bg-white/[0.02]">
                  <div>
                    <p className="text-sm font-semibold text-white">Domain Validation</p>
                    <p className="text-xs text-white/40 mt-0.5">Check if each email&apos;s domain has active mail servers (MX records).</p>
                  </div>
                  <button onClick={handleValidate} disabled={validating}
                    className="kx-btn kx-btn-outline !py-2 !px-4 !text-xs flex-shrink-0 disabled:opacity-50">
                    {validating
                      ? <><Loader2 size={13} className="animate-spin" />Checking…</>
                      : <><CheckCircle2 size={13} />Validate Domains</>}
                  </button>
                </div>
                {mxResults.size > 0 && (
                  <div className="border-t border-white/10 px-5 py-3 bg-white/[0.01]">
                    {(() => {
                      const valid = Array.from(mxResults.values()).filter(r => r.mx).length;
                      const invalid = mxResults.size - valid;
                      return (
                        <div className="flex gap-5 text-xs">
                          <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle2 size={12} />{valid} domains valid</span>
                          {invalid > 0 && <span className="flex items-center gap-1.5 text-red-400"><XCircle size={12} />{invalid} domains invalid</span>}
                          <span className="text-white/30">{mxResults.size} of {Array.from(new Set(parsed.valid.map(e => e.split("@")[1]))).length} domains checked</span>
                        </div>
                      );
                    })()}
                  </div>
                )}
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
                  {parsed.valid.map(email => {
                    const mx = mxResults.get(email);
                    return (
                      <label key={email} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-white/[0.03] transition-colors">
                        <input type="checkbox" checked={selected.has(email)} onChange={() => toggleOne(email)} className="accent-khi-blue w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-sm text-white/80 font-mono truncate">{email}</span>
                        {mx ? <MxBadge mx={mx.mx} reason={mx.reason} /> : <span className="text-[11px] text-white/20">not checked</span>}
                        {mx && !mx.mx && <span title={mx.reason}><AlertCircle size={13} className="text-amber-400 flex-shrink-0" /></span>}
                      </label>
                    );
                  })}
                </div>
                {parsed.invalid.length > 0 && (
                  <div className="border-t border-white/10 px-5 py-4">
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Skipped (invalid format)</p>
                    {parsed.invalid.map((e, i) => <p key={i} className="text-xs text-red-400/60 font-mono">{e}</p>)}
                  </div>
                )}
              </div>

              {includeVipToken && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-4 py-3 flex items-center gap-3 text-sm text-amber-300/80">
                  <Key size={15} className="flex-shrink-0 text-amber-400" />
                  {selected.size} unique VIP token{selected.size !== 1 ? "s" : ""} will be generated — each valid for 48 hours.
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={handleReset} className="kx-btn kx-btn-outline flex-1 justify-center">
                  <RefreshCw size={14} />Edit Recipients
                </button>
                <button onClick={handleSend} disabled={selected.size === 0}
                  className="kx-btn kx-btn-primary flex-[2] justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send size={15} />Send to {selected.size} Recipient{selected.size !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          )}

          {/* Sending phase */}
          {phase === "sending" && (
            <div className="kx-card !p-10 !rounded-2xl flex flex-col items-center justify-center gap-6 text-center min-h-[280px]">
              <div className="w-16 h-16 rounded-full border-4 border-khi-blue/30 border-t-khi-blue animate-spin" />
              <div>
                <p className="text-lg font-semibold text-white">Sending invitations…</p>
                <p className="text-sm text-white/45 mt-1">Emailing {selected.size} recipient{selected.size !== 1 ? "s" : ""} via mail.khinext.com</p>
              </div>
            </div>
          )}

          {/* Done phase */}
          {phase === "done" && result && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <Stat n={result.total} label="Total" color="#316BFF" />
                <Stat n={result.sent} label="Delivered" color="#51FFD5" />
                <Stat n={result.failed} label="Failed" color={result.failed > 0 ? "#FF6B6B" : "rgba(255,255,255,0.2)"} />
              </div>

              <div className="kx-card !p-6 !rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${result.failed === 0 ? "bg-emerald-500/15" : "bg-amber-500/15"}`}>
                    <Send size={18} className={result.failed === 0 ? "text-emerald-400" : "text-amber-400"} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{result.failed === 0 ? "All invitations sent!" : "Batch completed with some failures"}</p>
                    <p className="text-xs text-white/45 mt-0.5">
                      {result.sent} of {result.total} delivered · Open tracking active
                      {includeVipToken ? ` · ${result.sent} VIP tokens generated` : ""}
                    </p>
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
                  <History size={14} />View History
                </button>
                <button onClick={handleReset} className="kx-btn kx-btn-primary flex-1 justify-center">
                  <Mail size={15} />Send Another Batch
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
