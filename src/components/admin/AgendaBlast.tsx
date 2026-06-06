"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays, Send, RefreshCw, CheckCircle2,
  Loader2, ChevronDown, ChevronUp, History,
} from "lucide-react";
import { AGENDA_SUBJECT } from "@/lib/email/invitation";

interface BlastStatus {
  total: number;
  sent: number;
  remaining: number;
  remainingEmails: string[];
}

interface BlastResult {
  ok: boolean;
  total: number;
  sent: number;
  failed: number;
  sentList: string[];
  failedList: { email: string; error: string }[];
  remainingAfter: number;
  message?: string;
}

interface AgendaLog {
  id: string;
  sent_at: string;
  subject: string;
  total_count: number;
  sent_count: number;
  failed_count: number;
  unique_openers: number;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="kx-card !p-4 !rounded-xl text-center">
      <div className="font-display text-3xl font-extrabold -tracking-tight" style={{ color }}>
        {value}
      </div>
      <div className="mt-1 text-[11px] text-white/45">{label}</div>
    </div>
  );
}

export function AgendaBlast() {
  const [status, setStatus] = useState<BlastStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [batchSize, setBatchSize] = useState(200);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<BlastResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AgendaLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showRemaining, setShowRemaining] = useState(false);

  async function loadStatus() {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/admin/agenda-blast/status");
      const data = await res.json();
      if (res.ok) setStatus(data);
    } catch { /* ignore */ }
    setLoadingStatus(false);
  }

  async function loadHistory() {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/admin/bulk-email/history");
      const data = await res.json();
      const agendaLogs = (data.logs ?? []).filter(
        (l: AgendaLog) => l.subject === AGENDA_SUBJECT,
      );
      setHistory(agendaLogs);
    } catch { /* ignore */ }
    setLoadingHistory(false);
  }

  useEffect(() => {
    loadStatus();
    loadHistory();
  }, []);

  async function handleSend() {
    setSending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/agenda-blast/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchSize }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Send failed.");
        setSending(false);
        return;
      }
      setResult(data as BlastResult);
      await Promise.all([loadStatus(), loadHistory()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    }
    setSending(false);
  }

  const effectiveBatch = status ? Math.min(batchSize, status.remaining) : 0;
  const canSend = !sending && (status?.remaining ?? 0) > 0;

  return (
    <div className="space-y-6">

      {/* Intro */}
      <div className="rounded-2xl border border-khi-blue/20 bg-khi-blue/[0.04] px-5 py-4 flex items-start gap-3">
        <CalendarDays size={18} className="text-khi-blue-soft flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-white">Agenda Blast</p>
          <p className="text-xs text-white/50 mt-0.5">
            Send the Khinext &apos;26 event agenda to all previous invitees in spam-safe batches.
            The system tracks who has already received the agenda — you will never double-send.
          </p>
        </div>
      </div>

      {/* Delivery status */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Delivery Status</p>
          <button
            onClick={() => { loadStatus(); loadHistory(); }}
            disabled={loadingStatus}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors disabled:opacity-40"
          >
            <RefreshCw size={11} className={loadingStatus ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loadingStatus ? (
          <div className="flex items-center justify-center py-8 gap-2 text-white/30 text-sm">
            <Loader2 size={14} className="animate-spin" />Loading status…
          </div>
        ) : status ? (
          <div className="grid grid-cols-3 gap-3">
            <StatCard value={status.total}     label="Total Invited"  color="#316BFF" />
            <StatCard value={status.sent}      label="Agenda Sent"    color="#51FFD5" />
            <StatCard
              value={status.remaining}
              label="Remaining"
              color={status.remaining > 0 ? "#FCBF17" : "rgba(255,255,255,0.2)"}
            />
          </div>
        ) : (
          <p className="text-sm text-white/30 text-center py-4">Failed to load status.</p>
        )}
      </div>

      {/* Send panel */}
      {status && (
        <div className="kx-card !p-5 !rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Send Next Batch</p>
            {status.remaining === 0 && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 size={13} />All done
              </span>
            )}
          </div>

          {status.remaining > 0 ? (
            <>
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="kx-label block mb-1.5 text-xs">Batch size (max 500)</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={batchSize}
                    onChange={e =>
                      setBatchSize(Math.min(500, Math.max(1, Number(e.target.value) || 1)))
                    }
                    className="kx-input rounded-xl w-28 text-sm text-center"
                  />
                </div>
                <p className="text-xs text-white/40 pb-1">
                  Will send to{" "}
                  <strong className="text-white">{effectiveBatch}</strong> of{" "}
                  <strong className="text-white">{status.remaining}</strong> remaining recipients
                </p>
              </div>

              <button
                onClick={() => setShowRemaining(v => !v)}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                {showRemaining ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                {showRemaining ? "Hide" : "Preview"} remaining list ({status.remaining})
              </button>

              {showRemaining && (
                <div className="rounded-xl border border-white/10 divide-y divide-white/[0.04] max-h-48 overflow-y-auto">
                  {status.remainingEmails.map(email => (
                    <p key={email} className="px-4 py-2 text-xs font-mono text-white/55">{email}</p>
                  ))}
                </div>
              )}

              {error && (
                <p role="alert" className="text-sm text-red-400">{error}</p>
              )}

              <button
                onClick={handleSend}
                disabled={!canSend}
                className="kx-btn kx-btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sending
                  ? <><Loader2 size={15} className="animate-spin" />Sending…</>
                  : <><Send size={15} />Send Agenda to Next {effectiveBatch} Recipients</>}
              </button>
            </>
          ) : (
            <p className="text-sm text-white/40 text-center py-4">
              All {status.total} invitees have received the agenda email.
            </p>
          )}
        </div>
      )}

      {/* Last batch result */}
      {result && (
        <div className={`rounded-2xl border px-5 py-4 space-y-3 ${
          result.failed === 0
            ? "border-emerald-500/25 bg-emerald-500/[0.05]"
            : "border-amber-500/25 bg-amber-500/[0.05]"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              result.failed === 0 ? "bg-emerald-500/20" : "bg-amber-500/20"
            }`}>
              <Send size={14} className={result.failed === 0 ? "text-emerald-400" : "text-amber-400"} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {result.message ?? (result.failed === 0 ? "Batch sent successfully!" : "Batch sent with some failures")}
              </p>
              <p className="text-xs text-white/45 mt-0.5">
                {result.sent} delivered · {result.failed} failed · {result.remainingAfter} still remaining
              </p>
            </div>
          </div>

          {result.failedList.length > 0 && (
            <div className="rounded-xl bg-red-500/5 border border-red-500/15 divide-y divide-white/[0.04] max-h-32 overflow-y-auto">
              {result.failedList.map(f => (
                <div key={f.email} className="px-4 py-2">
                  <p className="text-xs font-mono text-red-300/80">{f.email}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{f.error}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History of agenda blasts */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <History size={13} className="text-white/40" />
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Agenda Blast History</p>
        </div>

        {loadingHistory ? (
          <div className="flex items-center justify-center py-6 gap-2 text-white/30 text-sm">
            <Loader2 size={14} className="animate-spin" />Loading…
          </div>
        ) : history.length === 0 ? (
          <div className="kx-card !p-8 !rounded-2xl text-center text-white/30 text-sm">
            No agenda blasts sent yet. History will appear here after the first batch.
          </div>
        ) : (
          <div className="space-y-2">
            {history.map(log => (
              <div key={log.id} className="kx-card !p-4 !rounded-xl flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white">{fmt(log.sent_at)}</p>
                  <p className="text-[10px] text-white/35 mt-0.5">Batch · {log.total_count} targeted</p>
                </div>
                <div className="flex items-center gap-5 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-sm font-bold text-emerald-400">{log.sent_count}</p>
                    <p className="text-[10px] text-white/30">Sent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: log.failed_count > 0 ? "#FF6B6B" : "rgba(255,255,255,0.2)" }}>
                      {log.failed_count}
                    </p>
                    <p className="text-[10px] text-white/30">Failed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-blue-300">{log.unique_openers}</p>
                    <p className="text-[10px] text-white/30">Opened</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
