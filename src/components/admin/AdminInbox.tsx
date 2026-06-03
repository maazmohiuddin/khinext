"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Send, Reply, RefreshCw, Inbox, X, CheckCheck,
  AtSign, Globe, Star, Archive, Trash2, MailOpen, Mail,
  MailCheck, AlertCircle, ChevronDown, MoreHorizontal,
  ArrowLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ContactMessage, ContactSource, ContactStatus, ContactReply } from "@/lib/types";
import { Toast } from "./Toast";

// ── helpers ────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)    return "just now";
  if (s < 3600)  return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return new Date(iso).toLocaleDateString("en-PK", { month: "short", day: "numeric" });
}

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function avatarColor(name: string) {
  const colors = ["#316BFF","#BF00FF","#00EAEE","#FF0F4B","#FF4D00","#FCBF17","#51FFD5"];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return colors[Math.abs(h) % colors.length];
}

const SOURCE_LABEL: Record<ContactSource, string> = { contact_form: "Form", email: "Email" };
const SOURCE_STYLE: Record<ContactSource, string> = {
  contact_form: "bg-[#BF00FF]/10 text-[#D580FF] border-[#BF00FF]/30",
  email: "bg-[#FFB800]/10 text-[#FFD06B] border-[#FFB800]/30",
};
const SOURCE_ICON: Record<ContactSource, React.ReactNode> = {
  contact_form: <Globe size={9} />,
  email: <AtSign size={9} />,
};

const STATUS_STYLE: Record<ContactStatus, string> = {
  new:     "bg-khi-blue/20 text-khi-blue-soft border-khi-blue/40",
  read:    "bg-white/[0.06] text-white/40 border-white/10",
  replied: "bg-[#51FFD5]/10 text-[#51FFD5] border-[#51FFD5]/30",
};

interface ToastState { message: string; type: "success" | "error" | "info" }

type Folder = "inbox" | "important" | "archived" | "trash";

// ── api helper ─────────────────────────────────────────────────

async function patchMessage(id: string, patch: Record<string, unknown>) {
  return fetch(`/api/admin/contact/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

// ── component ──────────────────────────────────────────────────

export function AdminInbox({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages]     = useState<ContactMessage[]>(
    initialMessages.map(m => ({ ...m, important: m.important ?? false, archived: m.archived ?? false, deleted_at: m.deleted_at ?? null }))
  );
  const [selected, setSelected]     = useState<ContactMessage | null>(null);
  const [folder, setFolder]         = useState<Folder>("inbox");
  const [search, setSearch]         = useState("");
  const [replyText, setReplyText]   = useState("");
  const [sending, setSending]       = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [syncing, setSyncing]       = useState(false);
  const [toast, setToast]           = useState<ToastState | null>(null);
  const [mobileDetail, setMobileDetail] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  function showToast(message: string, type: ToastState["type"] = "info") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3800);
  }

  // optimistic local update + server sync
  function applyPatch(id: string, patch: Partial<ContactMessage>) {
    setMessages(p => p.map(m => m.id === id ? { ...m, ...patch } : m));
    setSelected(s => s?.id === id ? { ...s, ...patch } : s);
    patchMessage(id, patch).catch(() => showToast("Update failed", "error"));
  }

  // Realtime
  useEffect(() => {
    const supabase = createClient();
    const ch = supabase.channel("inbox-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, payload => {
        if (payload.eventType === "INSERT") {
          const msg = payload.new as ContactMessage;
          setMessages(p => [{ ...msg, important: msg.important ?? false, archived: msg.archived ?? false, deleted_at: msg.deleted_at ?? null }, ...p]);
          showToast(`${msg.source === "email" ? "📧" : "📝"} ${msg.name}`, "info");
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
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (data) setMessages(data as ContactMessage[]);
  }

  async function syncInbox() {
    setSyncing(true);
    try {
      const res  = await fetch("/api/admin/inbox/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.error) { showToast(`Sync failed: ${data.error}`, "error"); }
      else { await refreshMessages(); showToast(data.imported ? `Synced ${data.imported} new email${data.imported > 1 ? "s" : ""}` : "Up to date", data.imported ? "success" : "info"); }
    } catch { showToast("Network error during sync", "error"); }
    finally  { setSyncing(false); }
  }

  async function selectMessage(msg: ContactMessage) {
    setSelected(msg);
    setReplyText("");
    setConfirming(false);
    setMobileDetail(true);
    if (msg.status === "new") applyPatch(msg.id, { status: "read" });
  }

  // ── actions ──────────────────────────────────────────────────

  function toggleImportant(msg: ContactMessage, e?: React.MouseEvent) {
    e?.stopPropagation();
    applyPatch(msg.id, { important: !msg.important });
  }

  function archiveMessage(msg: ContactMessage, e?: React.MouseEvent) {
    e?.stopPropagation();
    applyPatch(msg.id, { archived: true });
    if (selected?.id === msg.id) setSelected(null);
    showToast("Archived", "success");
  }

  function unarchiveMessage(msg: ContactMessage) {
    applyPatch(msg.id, { archived: false });
    showToast("Moved to inbox", "info");
  }

  function deleteMessage(msg: ContactMessage, e?: React.MouseEvent) {
    e?.stopPropagation();
    const now = new Date().toISOString();
    applyPatch(msg.id, { deleted_at: now });
    if (selected?.id === msg.id) setSelected(null);
    showToast("Moved to trash", "info");
  }

  function restoreMessage(msg: ContactMessage) {
    applyPatch(msg.id, { deleted_at: null });
    showToast("Restored", "success");
  }

  function markUnread(msg: ContactMessage) {
    applyPatch(msg.id, { status: "new" });
    showToast("Marked as unread", "info");
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
      if (!res.ok) { const { error } = await res.json().catch(() => ({ error: "Unknown" })); showToast(`Failed: ${error}`, "error"); return; }
      const now      = new Date().toISOString();
      const newReply: ContactReply = { text: replyText.trim(), sent_at: now };
      showToast(`Reply sent to ${selected.email}`, "success");
      setReplyText("");
      setMessages(p => p.map(m => m.id === selected.id ? { ...m, status: "replied" as ContactStatus, replies: [...(m.replies ?? []), newReply], reply_text: replyText.trim(), replied_at: now } : m));
      setSelected(s => s ? { ...s, status: "replied" as ContactStatus, replies: [...(s.replies ?? []), newReply], reply_text: replyText.trim(), replied_at: now } : s);
    } catch { showToast("Network error — reply not sent", "error"); }
    finally  { setSending(false); }
  }

  // ── filtering ─────────────────────────────────────────────────

  const folders = useMemo(() => ({
    inbox:     messages.filter(m => !m.archived && !m.deleted_at),
    important: messages.filter(m => m.important && !m.deleted_at),
    archived:  messages.filter(m => m.archived && !m.deleted_at),
    trash:     messages.filter(m => !!m.deleted_at),
  }), [messages]);

  const filtered = useMemo(() => {
    let list = folders[folder];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q));
    }
    return list;
  }, [folders, folder, search]);

  const counts = useMemo(() => ({
    inbox:     folders.inbox.filter(m => m.status === "new").length,
    important: folders.important.filter(m => m.status === "new").length,
    archived:  folders.archived.length,
    trash:     folders.trash.length,
  }), [folders]);

  const FOLDERS: { id: Folder; label: string; icon: React.ReactNode }[] = [
    { id: "inbox",     label: "Inbox",     icon: <Inbox size={14} /> },
    { id: "important", label: "Important", icon: <Star size={14} /> },
    { id: "archived",  label: "Archived",  icon: <Archive size={14} /> },
    { id: "trash",     label: "Trash",     icon: <Trash2 size={14} /> },
  ];

  // ── render ─────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center w-9 h-9 rounded-xl bg-khi-blue/10 border border-khi-blue/30">
            <Inbox size={16} className="text-khi-blue-soft" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-white -tracking-tight">Inbox</h2>
            <p className="text-[11px] text-white/40">info@khinext.com</p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={syncInbox} disabled={syncing}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/15 bg-white/[0.04] text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-50">
          <motion.span animate={syncing ? { rotate: 360 } : { rotate: 0 }}
            transition={syncing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}>
            <RefreshCw size={11} />
          </motion.span>
          {syncing ? "Syncing…" : "Sync"}
        </motion.button>
      </div>

      {/* Main */}
      <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[220px_340px_1fr] rounded-2xl border border-white/10 overflow-hidden bg-[#070D1E]" style={{ minHeight: 580 }}>

        {/* ── Sidebar ── */}
        <div className="hidden md:flex flex-col border-r border-white/[0.07] py-3 gap-0.5">
          <div className="px-3 pb-2">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                className="w-full rounded-lg bg-white/[0.05] border border-white/[0.08] pl-7 pr-2 py-1.5 text-[11px] text-white placeholder:text-white/25 outline-none focus:border-khi-blue/40" />
            </div>
          </div>
          {FOLDERS.map(f => (
            <button key={f.id} onClick={() => { setFolder(f.id); setSelected(null); }}
              className={`flex items-center justify-between mx-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                folder === f.id ? "bg-khi-blue/15 text-khi-blue-soft" : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
              }`}>
              <span className="flex items-center gap-2.5">{f.icon}{f.label}</span>
              {counts[f.id] > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${folder === f.id ? "bg-khi-blue/30 text-khi-blue-soft" : "bg-white/10 text-white/40"}`}>
                  {counts[f.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Message list ── */}
        <div className={`flex flex-col border-r border-white/[0.07] ${mobileDetail && selected ? "hidden lg:flex" : "flex"}`}>
          {/* Mobile search */}
          <div className="md:hidden p-3 border-b border-white/[0.06]">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                className="w-full rounded-lg bg-white/[0.05] border border-white/[0.08] pl-7 pr-2 py-1.5 text-[11px] text-white placeholder:text-white/25 outline-none focus:border-khi-blue/40" />
            </div>
          </div>
          {/* Mobile folder tabs */}
          <div className="md:hidden flex gap-1 px-2 pt-2 pb-1 overflow-x-auto">
            {FOLDERS.map(f => (
              <button key={f.id} onClick={() => { setFolder(f.id); setSelected(null); }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors ${
                  folder === f.id ? "border-khi-blue/50 bg-khi-blue/15 text-khi-blue-soft" : "border-white/10 text-white/40"
                }`}>
                {f.icon}{f.label}{counts[f.id] > 0 ? ` (${counts[f.id]})` : ""}
              </button>
            ))}
          </div>

          <div className="px-2 py-1.5 border-b border-white/[0.05]">
            <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-1">
              {folder === "inbox" ? "Inbox" : folder === "important" ? "Starred" : folder === "archived" ? "Archive" : "Trash"}
              {" "}· {filtered.length}
            </span>
          </div>

          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-white/20">
                <Mail size={24} strokeWidth={1.2} />
                <p className="text-xs">Nothing here</p>
              </div>
            ) : (
              <ul>
                <AnimatePresence initial={false}>
                  {filtered.map(msg => (
                    <motion.li key={msg.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}>
                      <MessageRow
                        msg={msg}
                        selected={selected?.id === msg.id}
                        onSelect={() => selectMessage(msg)}
                        onToggleImportant={e => toggleImportant(msg, e)}
                        onArchive={e => archiveMessage(msg, e)}
                        onDelete={e => deleteMessage(msg, e)}
                        folder={folder}
                      />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>

        {/* ── Detail pane ── */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div key={selected.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col min-h-0 ${mobileDetail && selected ? "flex" : "hidden lg:flex"}`}>

              {/* Detail header */}
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-start gap-3">
                <button onClick={() => { setSelected(null); setMobileDetail(false); }} className="lg:hidden mt-0.5 text-white/40 hover:text-white transition-colors flex-shrink-0">
                  <ArrowLeft size={16} />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm leading-tight truncate">{selected.subject}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${SOURCE_STYLE[selected.source ?? "contact_form"]}`}>
                      {SOURCE_ICON[selected.source ?? "contact_form"]}{SOURCE_LABEL[selected.source ?? "contact_form"]}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${STATUS_STYLE[selected.status]}`}>
                      {selected.status}
                    </span>
                    {selected.important && <span className="text-[#FCBF17] text-[10px]">★ Important</span>}
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <ActionBtn title={selected.important ? "Unstar" : "Star"} onClick={() => toggleImportant(selected)}>
                    <Star size={13} className={selected.important ? "fill-[#FCBF17] text-[#FCBF17]" : ""} />
                  </ActionBtn>
                  <ActionBtn title="Mark unread" onClick={() => markUnread(selected)}>
                    <Mail size={13} />
                  </ActionBtn>
                  {folder !== "archived" ? (
                    <ActionBtn title="Archive" onClick={() => archiveMessage(selected)}>
                      <Archive size={13} />
                    </ActionBtn>
                  ) : (
                    <ActionBtn title="Unarchive" onClick={() => unarchiveMessage(selected)}>
                      <MailOpen size={13} />
                    </ActionBtn>
                  )}
                  {folder !== "trash" ? (
                    <ActionBtn title="Delete" onClick={() => deleteMessage(selected)} danger>
                      <Trash2 size={13} />
                    </ActionBtn>
                  ) : (
                    <ActionBtn title="Restore" onClick={() => restoreMessage(selected)}>
                      <MailCheck size={13} />
                    </ActionBtn>
                  )}
                  <button onClick={() => setSelected(null)} className="hidden lg:flex p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors ml-1">
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Sender */}
              <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: avatarColor(selected.name) }}>
                  {initials(selected.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white">{selected.name}</p>
                  <a href={`mailto:${selected.email}`} className="text-[11px] text-khi-blue-soft hover:underline">{selected.email}</a>
                </div>
                <span className="ml-auto text-[10px] text-white/30 flex-shrink-0">
                  {new Date(selected.created_at).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>

              {/* Thread */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {/* Original message */}
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4">
                  <p className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
                {/* Replies */}
                {(selected.replies?.length > 0
                  ? selected.replies
                  : selected.reply_text
                    ? [{ text: selected.reply_text, sent_at: selected.replied_at ?? selected.created_at } as ContactReply]
                    : []
                ).map((reply, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="ml-6 rounded-xl bg-khi-blue/[0.08] border border-khi-blue/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCheck size={11} className="text-[#51FFD5]" />
                      <span className="text-[10px] font-semibold text-[#51FFD5]">
                        You · {new Date(reply.sent_at).toLocaleString("en-PK", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </div>
                    <p className="text-xs text-white/65 leading-relaxed whitespace-pre-wrap">{reply.text}</p>
                  </motion.div>
                ))}
              </div>

              {/* Reply box */}
              {folder !== "trash" && (
                <div className="px-4 pb-4 pt-2 border-t border-white/[0.06]">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-khi-blue/40 transition-colors overflow-hidden">
                    <textarea ref={replyRef} value={replyText} onChange={e => setReplyText(e.target.value)}
                      placeholder={`Reply to ${selected.name}…`} rows={3}
                      className="w-full bg-transparent px-4 pt-3 pb-2 text-sm text-white placeholder:text-white/25 outline-none resize-none leading-relaxed" />
                    <div className="flex items-center justify-between px-3 pb-2.5">
                      <span className="text-[10px] text-white/20">→ {selected.email}</span>
                      <AnimatePresence mode="wait">
                        {confirming ? (
                          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-2">
                            <span className="text-[11px] text-white/50">Confirm send?</span>
                            <button onClick={() => setConfirming(false)} className="px-2.5 py-1 rounded-lg text-[11px] text-white/40 hover:text-white border border-white/10 hover:border-white/20 transition-colors">Cancel</button>
                            <motion.button whileTap={{ scale: 0.96 }} onClick={sendReply} disabled={sending}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold text-white bg-khi-blue hover:bg-khi-blue-bright transition-colors disabled:opacity-50">
                              {sending ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><RefreshCw size={10} /></motion.span> : <Send size={10} />}
                              {sending ? "Sending…" : "Send"}
                            </motion.button>
                          </motion.div>
                        ) : (
                          <motion.button key="trigger" whileTap={{ scale: 0.96 }}
                            onClick={() => { if (replyText.trim()) setConfirming(true); }}
                            disabled={!replyText.trim()}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold bg-khi-blue/80 hover:bg-khi-blue text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                            <Reply size={10} />Reply
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="hidden lg:flex flex-col items-center justify-center h-full gap-3 text-white/15 p-12">
              <Inbox size={32} strokeWidth={1} />
              <p className="text-sm text-white/25">Select a message</p>
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

// ── sub-components ─────────────────────────────────────────────

function ActionBtn({ children, onClick, title, danger }: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button title={title} onClick={onClick}
      className={`p-1.5 rounded-lg transition-colors ${danger ? "text-white/30 hover:text-red-400 hover:bg-red-500/10" : "text-white/30 hover:text-white hover:bg-white/[0.07]"}`}>
      {children}
    </button>
  );
}

function MessageRow({ msg, selected, onSelect, onToggleImportant, onArchive, onDelete, folder }: {
  msg: ContactMessage;
  selected: boolean;
  onSelect: () => void;
  onToggleImportant: (e: React.MouseEvent) => void;
  onArchive: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  folder: Folder;
}) {
  const isNew = msg.status === "new";
  return (
    <button onClick={onSelect}
      className={`group w-full text-left flex items-start gap-3 px-3 py-3 border-b border-white/[0.04] transition-colors duration-150 ${
        selected ? "bg-khi-blue/10 border-l-2 border-l-khi-blue" : "hover:bg-white/[0.03]"
      }`}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white mt-0.5"
        style={{ background: avatarColor(msg.name) }}>
        {initials(msg.name)}
        {isNew && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-khi-blue-bright border border-[#070D1E]" style={{ position: "relative", marginLeft: "-6px", marginTop: "-22px" }} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {isNew && <span className="w-1.5 h-1.5 rounded-full bg-khi-blue-bright flex-shrink-0" />}
            <span className={`text-xs truncate ${isNew ? "font-bold text-white" : "font-medium text-white/70"}`}>{msg.name}</span>
          </div>
          <span className="text-[10px] text-white/30 flex-shrink-0">{timeAgo(msg.created_at)}</span>
        </div>
        <p className={`text-[11px] truncate mb-0.5 ${isNew ? "text-white/80" : "text-white/45"}`}>{msg.subject}</p>
        <p className="text-[10px] text-white/25 truncate">{msg.message.slice(0, 55)}{msg.message.length > 55 ? "…" : ""}</p>
      </div>

      {/* Hover actions */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onToggleImportant} title={msg.important ? "Unstar" : "Star"}
          className="p-1 rounded text-white/30 hover:text-[#FCBF17] transition-colors">
          <Star size={11} className={msg.important ? "fill-[#FCBF17] text-[#FCBF17]" : ""} />
        </button>
        {folder !== "trash" && (
          <button onClick={onArchive} title="Archive" className="p-1 rounded text-white/30 hover:text-white/70 transition-colors">
            <Archive size={11} />
          </button>
        )}
        <button onClick={onDelete} title="Delete" className="p-1 rounded text-white/30 hover:text-red-400 transition-colors">
          <Trash2 size={11} />
        </button>
      </div>
    </button>
  );
}
