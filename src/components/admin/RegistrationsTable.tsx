"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Registration } from "@/lib/types";
import { TRACK_LABELS } from "@/lib/types";

export function RegistrationsTable({ items }: { items: Registration[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-white/45">
        No registrations yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
      <div
        className="hidden md:grid items-center gap-4 px-6 py-3 text-[10px] font-bold uppercase text-white/30 bg-white/[0.02] border-b border-white/10"
        style={{ gridTemplateColumns: "70px 1.4fr 1.6fr 130px 150px 28px", letterSpacing: "0.18em" }}
        aria-hidden="true"
      >
        <span>ID</span>
        <span>Name</span>
        <span>Email</span>
        <span>Role</span>
        <span>Status</span>
        <span />
      </div>
      <ul>
        {items.map(r => {
          const confirmed = !!r.confirmed_at;
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
                  style={{ gridTemplateColumns: "70px 1.4fr 1.6fr 130px 150px 28px" }}
                >
                  <span className="font-mono text-xs text-white/45">{r.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-white font-medium truncate">{r.full_name}</span>
                  <span className="text-xs text-white/55 truncate">{r.email}</span>
                  <span className="text-sm text-white/70 truncate">{r.role}</span>
                  <Pill colors={statusColor} />
                  <ChevronRight size={14} className="text-white/30 group-hover:text-white/70 transition-colors" aria-hidden="true" />
                </div>

                {/* Track row (desktop only, supplemental) */}
                <div className="hidden md:block ml-[86px] -mt-1">
                  <span className="text-[11px] text-khi-blue-soft/70">{TRACK_LABELS[r.track]}</span>
                </div>

                {/* Mobile */}
                <div className="md:hidden flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-mono text-[11px] text-white/30">{r.id.slice(0, 8).toUpperCase()}</span>
                      <span className="text-white font-medium truncate">{r.full_name}</span>
                      <span className="text-xs text-white/55 truncate">{r.email}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Pill colors={statusColor} />
                      <ChevronRight size={14} className="text-white/30" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 text-[11px]">
                    <span className="text-white/45">{r.role}</span>
                    <span className="text-khi-blue-soft/70">{TRACK_LABELS[r.track]}</span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
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
