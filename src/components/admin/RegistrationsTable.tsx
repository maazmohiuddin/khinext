"use client";

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
        style={{ gridTemplateColumns: "80px 1.4fr 1.8fr 140px 160px", letterSpacing: "0.18em" }}
        aria-hidden="true"
      >
        <span>ID</span>
        <span>Name</span>
        <span>Email</span>
        <span>Role</span>
        <span>Track</span>
      </div>
      <ul>
        {items.map(r => (
          <li
            key={r.id}
            className="grid md:items-center gap-2 md:gap-4 px-5 md:px-6 py-5 border-b border-white/10 last:border-b-0"
            style={{ gridTemplateColumns: "1fr" }}
          >
            {/* desktop */}
            <div
              className="hidden md:grid items-center gap-4"
              style={{ gridTemplateColumns: "80px 1.4fr 1.8fr 140px 160px" }}
            >
              <span className="font-mono text-xs text-white/45">{r.id.slice(0, 8).toUpperCase()}</span>
              <span className="text-white font-medium truncate">{r.full_name}</span>
              <span className="text-xs text-white/55 truncate">{r.email}</span>
              <span className="text-sm text-white/70 truncate">{r.role}</span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs capitalize border w-fit"
                style={{ color: "#51FFD5", background: "rgba(81,255,213,0.10)", borderColor: "rgba(81,255,213,0.32)" }}
              >
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full" style={{ background: "#51FFD5" }} />
                {TRACK_LABELS[r.track]}
              </span>
            </div>

            {/* mobile */}
            <div className="md:hidden flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-mono text-[11px] text-white/30">{r.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-white font-medium truncate">{r.full_name}</span>
                  <span className="text-xs text-white/55 truncate">{r.email}</span>
                </div>
                <span
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs border"
                  style={{ color: "#51FFD5", background: "rgba(81,255,213,0.10)", borderColor: "rgba(81,255,213,0.32)" }}
                >
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full" style={{ background: "#51FFD5" }} />
                  {TRACK_LABELS[r.track]}
                </span>
              </div>
              <span className="text-xs text-white/45">{r.role}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
