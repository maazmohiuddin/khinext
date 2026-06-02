"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, MailOpen, Mail, Reply, RefreshCw, Inbox, ChevronRight, X, CheckCheck, AtSign, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ContactMessage, ContactSource, ContactStatus } from "@/lib/types";
import { Toast } from "./Toast";

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)   return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const STATUS_LABEL: Record<ContactStatus, string> = {
  new:     "New",
  read:    "Read",
  replied: "Replied",
};

const STATUS_STYLE: Record<ContactStatus, string> = {
  new:     "bg-khi-blue/20 text-khi-blue-soft border-khi-blue/40",
  read:    "bg-white/[0.06] text-white/50 border-white/10",
  replied: "bg-[#51FFD5]/10 text-[#51FFD5] border-[#51FFD5]/30",
};

const SOURCE_LABEL: Record<ContactSource, string> = {
  contact_form: "Form",
  email: "Email",
};

const SOURCE_STYLE: Record<ContactSource, string> = {
  contact_form: "bg-[#BF00FF]/10 text-[#D580FF] border-[#BF00FF]/30",
  email:        "bg-[#FFB800]/10 text-[#FFD06B] border-[#FFB800]/30",
};

const SOURCE_ICON: Record<ContactSource, React.ReactNode> = {
  contact_form: <Globe size={9} />,
  email:        <AtSign size={9} />,
};

interface ToastState { message: string; type: "success" | "error" | "info" }

export function AdminInbox({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<"all" | ContactStatus>("all");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  function showToast(message: string, type: ToastState["type"] = "info") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3800);
  }

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    const ch = supabase.channel("inbox-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, payload => {
        if (payload.eventType === "INSERT") {
          const msg = payload.new as ContactMessage;
          setMessages(p => [msg, ...p]);
          const src = msg.source === "email" ? "📧 Email" : "📝 Form";
          showToast(`${src} · ${msg.name}`, "info");
        }
        if (payload.eventType === "UPDATE") {
          const upd = payload.new as ContactMessage;
          setMessages(p => p.map(m => m.id === upd.id ? upd : m));
          setSelected(s => s?.id === upd.id ? upd : s);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function refreshMessages() {
    const supabase = createClient();
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data as ContactMessage[]);
  }

  async function syncInbox() {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/inbox/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(`Sync failed: ${data.error}`, "error");
      } else if (data.imported === 0) {
        showToast("Inbox up to date — no new emails.", "info");
        await refreshMessages();
      } else {
        await refreshMessages();
        showToast(`Synced ${data.imported} new email${data.imported > 1 ? "s" : ""} from inbox.`, "success");
      }
    } catch {
      showToast("Sync failed — network error.", "error");
    } finally {
      setSyncing(false);
    }
  }

  async function selectMessage(msg: ContactMessage) {
    setSelected(msg);
    setReplyText("");
    setConfirming(false);
    if (msg.status === "new") {
      await fetch(`/api/admin/contact/${msg.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });
    }
  }

  async function sendReply() {
    if (!selected || !replyText.trim()) return;
    setSending(true);
    setConfirming(false);
    try {
      const res = await fetch(`/api/admin/contact/${selected.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText: replyText.trim() }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
        showToast(`Failed: ${error}`, "error");
        return;
      }
      showToast(`Reply sent to ${selected.email}`, "success");
      setReplyText("");
    } catch {
      showToast("Network error — reply not sent.", "error");
    } finally {
      setSending(false);
    }
  }

  const filtered = useMemo(() => {
    let list = messages;
    if (filter !== "all") list = list.filter(m => m.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }
    return list;
  }, [messages, filter, search]);

  const counts = useMemo(() => ({
    all: messages.length,
    new: messages.filter(m => m.status === "new").length,
    read: messages.filter(m => m.status === "read").length,
    replied: messages.filter(m => m.status === "replied").length,
  }), [messages]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-khi-blue/10 border border-khi-blue/30">
            <Inbox size={18} className="text-khi-blue-soft" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white -tracking-tight">Inbox</h2>
            <p className="text-xs text-white/40">info@khinext.com · {counts.new > 0 ? `${counts.new} unread` : "all caught up"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Sync button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={syncInbox}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-white/15 bg-white/[0.04] text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-50"
          >
            <motion.span
              animate={syncing ? { rotate: 360 } : { rotate: 0 }}
              transition={syncing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
            >
              <RefreshCw size={12} />
            </motion.span>
            {syncing ? "Syncing…" : "Sync Inbox"}
          </motion.button>

          {/* Filter pills */}
          <div className="flex gap-1.5 flex-wrap">
            {(["all", "new", "read", "replied"] as const).map(f => (
              <motion.button
                key={f}
                whileTap={{ scale: 0.94 }}
                onClick={() => setFilter(f)}
                className={`relative px-3.5 py-1.5 rounded-full text-[11px] font-semibold capitalize transition-colors duration-200 border ${
                  filter === f
                    ? "border-khi-blue/55 text-khi-blue-soft"
                    : "bg-white/[0.03] border-white/10 text-white/45 hover:border-khi-blue/30 hover:text-white/70"
                }`}
              >
                {filter === f && (
                  <motion.span
                    layoutId="inbox-filter-pill"
                    className="absolute inset-0 rounded-full bg-khi-blue/15"
                    transition={{ type: "spring", stiffness: 420, damping: 35 }}
                  />
                )}
                <span className="relative">
                  {f === "all" ? `All (${counts.all})` : f === "new" ? `New (${counts.new})` : f === "read" ? `Read (${counts.read})` : `Replied (${counts.replied})`}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main pane */}
      <div className="grid md:grid-cols-[340px_1fr] rounded-2xl border border-white/10 overflow-hidden bg-white/[0.015]" style={{ minHeight: 560 }}>

        {/* ── Left: Message list ── */}
        <div className="border-b md:border-b-0 md:border-r border-white/10 flex flex-col">
          <div className="p-3 border-b border-white/[0.06]">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search messages…"
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-8 pr-3 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-khi-blue/50 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1" style={{ maxHeight: 520 }}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-white/30">
                <Mail size={28} strokeWidth={1.2} />
                <p className="text-xs">No messages</p>
              </div>
            ) : (
              <motion.ul>
                <AnimatePresence initial={false}>
                  {filtered.map(msg => (
                    <motion.li
                      key={msg.id}
                      layout
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button
                        onClick={() => selectMessage(msg)}
                        className={`w-full text-left px-4 py-3.5 border-b border-white/[0.04] transition-colors duration-150 ${
                          selected?.id === msg.id ? "bg-khi-blue/10" : "hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            {msg.status === "new" && (
                              <span className="w-1.5 h-1.5 rounded-full bg-khi-blue-bright flex-shrink-0" style={{ boxShadow: "0 0 8px #4579FF" }} />
                            )}
                            <span className={`text-xs font-semibold truncate ${msg.status === "new" ? "text-white" : "text-white/70"}`}>
                              {msg.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${SOURCE_STYLE[msg.source ?? "contact_form"]}`}>
                              {SOURCE_ICON[msg.source ?? "contact_form"]}
                              {SOURCE_LABEL[msg.source ?? "contact_form"]}
                            </span>
                            <span className="text-[10px] text-white/30">{timeAgo(msg.created_at)}</span>
                          </div>
                        </div>
                        <p className={`text-xs truncate mb-1 ${msg.status === "new" ? "text-white/80" : "text-white/50"}`}>{msg.subject}</p>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] text-white/30 truncate">{msg.message.slice(0, 60)}{msg.message.length > 60 ? "…" : ""}</p>
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase border flex-shrink-0 ${STATUS_STYLE[msg.status]}`}>
                            {STATUS_LABEL[msg.status]}
                          </span>
                        </div>
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </div>
        </div>

        {/* ── Right: Detail + Reply ── */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col h-full"
            >
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-display font-semibold text-white text-sm">{selected.subject}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${SOURCE_STYLE[selected.source ?? "contact_form"]}`}>
                      {SOURCE_ICON[selected.source ?? "contact_form"]}
                      {SOURCE_LABEL[selected.source ?? "contact_form"]}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_STYLE[selected.status]}`}>
                      {STATUS_LABEL[selected.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MailOpen size={11} />
                      {selected.name}
                    </span>
                    <span>·</span>
                    <a href={`mailto:${selected.email}`} className="text-khi-blue-soft hover:underline">{selected.email}</a>
                    <span>·</span>
                    <span>{new Date(selected.created_at).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white transition-colors flex-shrink-0" aria-label="Close">
                  <X size={16} />
                </button>
              </div>

              <div className="px-6 py-5 flex-1 overflow-y-auto">
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{selected.message}</p>

                {selected.reply_text && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-xl bg-[#51FFD5]/5 border border-[#51FFD5]/20 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCheck size={13} className="text-[#51FFD5]" />
                      <span className="text-[11px] font-semibold text-[#51FFD5]">
                        Replied {selected.replied_at ? new Date(selected.replied_at).toLocaleString("en-PK", { dateStyle: "short", timeStyle: "short" }) : ""}
                      </span>
                    </div>
                    <p className="text-xs text-white/55 leading-relaxed whitespace-pre-wrap">{selected.reply_text}</p>
                  </motion.div>
                )}
              </div>

              <div className="px-6 pb-5 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 mb-3">
                  <Reply size={13} className="text-white/40" />
                  <span className="text-xs font-semibold text-white/50">Reply to {selected.name}</span>
                </div>

                <textarea
                  ref={replyRef}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={`Write your reply to ${selected.name}…`}
                  rows={4}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-khi-blue/50 focus:bg-khi-blue/[0.04] transition-all duration-200 resize-none leading-relaxed"
                />

                <AnimatePresence>
                  {confirming ? (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3"
                    >
                      <p className="text-xs text-white/60">
                        Send reply to <strong className="text-white">{selected.email}</strong>?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirming(false)}
                          className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/25 transition-colors"
                        >
                          Cancel
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={sendReply}
                          disabled={sending}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-khi-blue hover:bg-khi-blue-bright transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {sending ? (
                            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                              <RefreshCw size={11} />
                            </motion.span>
                          ) : <Send size={11} />}
                          {sending ? "Sending…" : "Confirm Send"}
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 flex justify-end">
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => { if (replyText.trim()) setConfirming(true); }}
                        disabled={!replyText.trim()}
                        className="kx-btn kx-btn-primary !py-2.5 !px-5 !text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Send size={12} />
                        Send Reply
                        <ChevronRight size={12} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-4 text-white/20 p-12"
            >
              <div className="grid place-items-center w-16 h-16 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <Inbox size={28} strokeWidth={1.2} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white/30">Select a message</p>
                <p className="text-xs text-white/20 mt-1">Choose a message from the list to read and reply</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && <Toast key={toast.message + toast.type} message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
}
