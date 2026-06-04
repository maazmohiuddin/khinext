"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Download, Eye, MailCheck, Search, X } from "lucide-react";
import type { InviteInfo, Registration, RegistrationTrack } from "@/lib/types";
import { TRACK_LABELS } from "@/lib/types";

// VIP/sponsor vs all-other tracks
const VIP_TRACKS: RegistrationTrack[] = ["vip_sponsor"];
const DELEGATE_TRACKS: RegistrationTrack[] = ["ai_expo_only", "gaming_only", "ai_expo_and_gaming"];

type TrackFilter = "all" | "vip" | "delegates";

const FILTER_LABELS: Record<TrackFilter, string> = {
  all:       "All",
  vip:       "VIP / Sponsors",
  delegates: "Delegates",
};

function exportToExcel(rows: Registration[]) {
  // Dynamic import keeps xlsx out of the initial JS bundle.
  import("xlsx").then(XLSX => {
    const data = rows.map(r => ({
      ID:               r.id.slice(0, 8).toUpperCase(),
      "Full Name":      r.full_name,
      Email:            r.email,
      Phone:            r.phone ?? "",
      Organisation:     r.organisation ?? "",
      Role:             r.role,
      Track:            TRACK_LABELS[r.track],
      Referral:         r.referral ?? "",
      Status:           r.confirmed_at ? "Confirmed" : "Pending",
      "Confirmed At":   r.confirmed_at ?? "",
      "Admin Note":     r.admin_note ?? "",
      "Registered At":  r.created_at,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, `khinext-registrations-${new Date().toISOString().slice(0, 10)}.xlsx`);
  });
}

export function RegistrationsTable({ items, invitedEmails }: { items: Registration[]; invitedEmails: Record<string, InviteInfo> }) {
  const [search, setSearch]           = useState("");
  const [trackFilter, setTrackFilter] = useState<TrackFilter>("all");

  const filtered = useMemo(() => {
    let list = items;

    if (trackFilter === "vip")       list = list.filter(r => VIP_TRACKS.includes(r.track));
    if (trackFilter === "delegates") list = list.filter(r => DELEGATE_TRACKS.includes(r.track));

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.organisation ?? "").toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        TRACK_LABELS[r.track].toLowerCase().includes(q)
      );
    }

    return list;
  }, [items, search, trackFilter]);

  const counts = useMemo(() => ({
    all:       items.length,
    vip:       items.filter(r => VIP_TRACKS.includes(r.track)).length,
    delegates: items.filter(r => DELEGATE_TRACKS.includes(r.track)).length,
  }), [items]);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-white/45">
        No registrations yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, org…"
            className="w-full rounded-xl bg-white/[0.05] border border-white/[0.08] pl-8 pr-8 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-khi-blue/40 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Track filter pills */}
          <div className="flex gap-1">
            {(["all", "vip", "delegates"] as TrackFilter[]).map(f => {
              const active = trackFilter === f;
              return (
                <button key={f} onClick={() => setTrackFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors border ${
                    active
                      ? f === "vip"
                        ? "bg-[#FCBF17]/15 border-[#FCBF17]/40 text-[#FCBF17]"
                        : "bg-khi-blue/15 border-khi-blue/40 text-khi-blue-soft"
                      : "bg-transparent border-white/10 text-white/45 hover:border-white/25"
                  }`}>
                  {FILTER_LABELS[f]}
                  <span className="ml-1.5 text-[10px] opacity-60">{counts[f]}</span>
                </button>
              );
            })}
          </div>

          {/* Export */}
          <button
            onClick={() => exportToExcel(filtered)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#51FFD5]/30 text-[#51FFD5] bg-[#51FFD5]/[0.06] hover:bg-[#51FFD5]/10 transition-colors">
            <Download size={11} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Results summary */}
      {(search || trackFilter !== "all") && (
        <p className="text-[11px] text-white/35">
          Showing {filtered.length} of {items.length} registrations
          {trackFilter !== "all" && ` · ${FILTER_LABELS[trackFilter]}`}
          {search && ` · "${search}"`}
        </p>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-white/35 text-sm">
          No registrations match your filters.
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
          <div
            className="hidden md:grid items-center gap-4 px-6 py-3 text-[10px] font-bold uppercase text-white/30 bg-white/[0.02] border-b border-white/10"
            style={{ gridTemplateColumns: "70px 1.4fr 1.6fr 130px 120px 110px 28px", letterSpacing: "0.18em" }}
            aria-hidden="true"
          >
            <span>ID</span>
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Invited</span>
            <span />
          </div>
          <ul>
            {filtered.map(r => {
              const confirmed   = !!r.confirmed_at;
              const isVip       = VIP_TRACKS.includes(r.track);
              const invite      = invitedEmails[r.email.toLowerCase()];
              const statusColor = confirmed
                ? { text: "#51FFD5", bg: "rgba(81,255,213,0.10)", border: "rgba(81,255,213,0.32)", label: "Confirmed" }
                : { text: "#FFD06B", bg: "rgba(255,184,0,0.10)", border: "rgba(255,184,0,0.32)", label: "Pending" };

              return (
                <li key={r.id} className="group border-b border-white/10 last:border-b-0">
                  <Link
                    href={`/admin/registrations/${r.id}`}
                    className="grid md:items-center gap-2 md:gap-4 px-5 md:px-6 py-5 hover:bg-khi-blue/[0.05] transition-colors duration-200 ease-soft focus-visible:bg-khi-blue/[0.05] focus-visible:outline-none"
                    style={{ gridTemplateColumns: "1fr" }}
                    aria-label={`Open registration for ${r.full_name}`}
                  >
                    {/* Desktop */}
                    <div
                      className="hidden md:grid items-center gap-4"
                      style={{ gridTemplateColumns: "70px 1.4fr 1.6fr 130px 120px 110px 28px" }}
                    >
                      <span className="font-mono text-xs text-white/45">{r.id.slice(0, 8).toUpperCase()}</span>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-white font-medium truncate">{r.full_name}</span>
                        {isVip && (
                          <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#FCBF17]/15 text-[#FCBF17] border border-[#FCBF17]/30">
                            VIP
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-white/55 truncate">{r.email}</span>
                      <span className="text-sm text-white/70 truncate">{r.role}</span>
                      <Pill colors={statusColor} />
                      <InviteBadge invite={invite} />
                      <ChevronRight size={14} className="text-white/30 group-hover:text-white/70 transition-colors" aria-hidden="true" />
                    </div>

                    <div className="hidden md:block ml-[86px] -mt-1">
                      <span className={`text-[11px] ${isVip ? "text-[#FCBF17]/70" : "text-khi-blue-soft/70"}`}>{TRACK_LABELS[r.track]}</span>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden flex flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-mono text-[11px] text-white/30">{r.id.slice(0, 8).toUpperCase()}</span>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-medium truncate">{r.full_name}</span>
                            {isVip && <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#FCBF17]/15 text-[#FCBF17] border border-[#FCBF17]/30">VIP</span>}
                            {invite && <InviteBadge invite={invite} />}
                          </div>
                          <span className="text-xs text-white/55 truncate">{r.email}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Pill colors={statusColor} />
                          <ChevronRight size={14} className="text-white/30" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 text-[11px]">
                        <span className="text-white/45">{r.role}</span>
                        <span className={isVip ? "text-[#FCBF17]/70" : "text-khi-blue-soft/70"}>{TRACK_LABELS[r.track]}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function InviteBadge({ invite }: { invite: InviteInfo | undefined }) {
  if (!invite) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold border border-white/10 text-white/25 bg-transparent whitespace-nowrap">
        Not invited
      </span>
    );
  }
  const date = new Date(invite.last_sent_at).toLocaleDateString("en-PK", { day: "numeric", month: "short" });
  return (
    <span
      title={`Invited ${invite.times_sent}× · last ${date}${invite.open_count > 0 ? ` · opened ${invite.open_count}×` : ""}`}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold border whitespace-nowrap bg-[#316BFF]/10 border-[#316BFF]/30 text-khi-blue-soft"
    >
      <MailCheck size={9} />
      Invited
      {invite.open_count > 0 && (
        <span className="flex items-center gap-0.5 ml-0.5 text-[#51FFD5]">
          <Eye size={8} />{invite.open_count}
        </span>
      )}
    </span>
  );
}

function Pill({ colors }: { colors: { text: string; bg: string; border: string; label: string } }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs capitalize border w-fit shrink-0"
      style={{ color: colors.text, background: colors.bg, borderColor: colors.border }}
    >
      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full" style={{ background: colors.text }} />
      {colors.label}
    </span>
  );
}
