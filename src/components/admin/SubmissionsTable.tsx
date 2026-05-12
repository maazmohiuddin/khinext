"use client";

import { useState } from "react";
import type { Submission } from "@/lib/types";
import { EmailPreview } from "./EmailPreview";

const STATUS_COLOR: Record<Submission["status"], { text: string; bg: string; border: string }> = {
  pending:  { text: "#FFD06B", bg: "rgba(255,184,0,0.10)",  border: "rgba(255,184,0,0.32)" },
  approved: { text: "#51FFD5", bg: "rgba(81,255,213,0.10)", border: "rgba(81,255,213,0.32)" },
  rejected: { text: "#FF6B8E", bg: "rgba(255,15,75,0.10)",  border: "rgba(255,15,75,0.32)" },
};

export function SubmissionsTable({
  items,
  onDecide,
}: {
  items: Submission[];
  onDecide: (id: string, decision: "approved" | "rejected") => Promise<void>;
}) {
  const [previewing, setPreviewing] = useState<Submission | null>(null);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-white/45">
        No submissions in this view.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
        {/* desktop header */}
        <div
          className="hidden md:grid items-center gap-4 px-6 py-3 text-[10px] font-bold uppercase text-white/30 bg-white/[0.02] border-b border-white/10"
          style={{ gridTemplateColumns: "80px 1.4fr 1.8fr 130px 220px", letterSpacing: "0.18em" }}
          aria-hidden="true"
        >
          <span>ID</span>
          <span>Applicant</span>
          <span>Project</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        <ul>
          {items.map(s => {
            const c = STATUS_COLOR[s.status];
            return (
              <li
                key={s.id}
                className="grid md:items-center gap-3 md:gap-4 px-5 md:px-6 py-5 border-b border-white/10 last:border-b-0"
                style={{ gridTemplateColumns: "1fr", }}
              >
                <div
                  className="grid gap-3 md:gap-4 items-center"
                  style={{ gridTemplateColumns: "minmax(0, 1fr)" }}
                >
                  {/* mobile: stacked layout */}
                  <div className="md:hidden flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[11px] text-white/30">{s.id.slice(0, 8).toUpperCase()}</span>
                      <span className="font-medium text-white text-sm">{s.full_name}</span>
                      <span className="text-xs text-white/45">{s.email}</span>
                    </div>
                    <Pill text={s.status} colors={c} />
                  </div>
                  <div className="md:hidden">
                    <p className="text-white text-sm font-medium">{s.project}</p>
                    <span className="mt-1.5 inline-block rounded-full bg-khi-blue/10 border border-khi-blue/30 px-2.5 py-0.5 text-[10px] text-khi-blue-soft">{s.category}</span>
                    <p className="mt-2 text-xs text-white/55 leading-relaxed">{s.description}</p>
                  </div>
                </div>

                {/* desktop: single-row layout */}
                <div
                  className="hidden md:grid items-center gap-4 -mt-3"
                  style={{ gridTemplateColumns: "80px 1.4fr 1.8fr 130px 220px" }}
                >
                  <span className="font-mono text-xs text-white/45">{s.id.slice(0, 8).toUpperCase()}</span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-white font-medium truncate">{s.full_name}</span>
                    <span className="text-xs text-white/45 truncate">{s.email}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white truncate">{s.project}</p>
                    <span className="mt-1 inline-block rounded-full bg-khi-blue/10 border border-khi-blue/30 px-2.5 py-0.5 text-[10px] text-khi-blue-soft">{s.category}</span>
                  </div>
                  <Pill text={s.status} colors={c} />
                  <div className="flex justify-end gap-2 flex-wrap">
                    {s.status === "pending" && (
                      <>
                        <button
                          className="kx-btn-primary !px-4 !py-2 !text-xs"
                          onClick={() => setPreviewing(s)}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="rounded-full text-xs font-medium px-4 py-2 transition-colors border bg-[rgba(255,15,75,0.12)] border-[rgba(255,15,75,0.32)] text-[#FF6B8E] hover:bg-[rgba(255,15,75,0.2)] hover:text-white"
                          onClick={() => onDecide(s.id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {s.status === "approved" && (
                      <button className="kx-btn-outline !px-4 !py-2 !text-xs" onClick={() => setPreviewing(s)}>
                        Resend email
                      </button>
                    )}
                    {s.status === "rejected" && (
                      <button className="kx-btn-outline !px-4 !py-2 !text-xs" onClick={() => onDecide(s.id, "approved")}>
                        Undo
                      </button>
                    )}
                  </div>
                </div>

                {/* mobile actions */}
                <div className="md:hidden flex gap-2 flex-wrap pt-2 border-t border-white/5">
                  {s.status === "pending" && (
                    <>
                      <button className="kx-btn-primary !px-4 !py-2 !text-xs flex-1" onClick={() => setPreviewing(s)}>Approve</button>
                      <button
                        type="button"
                        className="flex-1 rounded-full text-xs font-medium px-4 py-2 transition-colors border bg-[rgba(255,15,75,0.12)] border-[rgba(255,15,75,0.32)] text-[#FF6B8E] hover:bg-[rgba(255,15,75,0.2)] hover:text-white"
                        onClick={() => onDecide(s.id, "rejected")}
                      >Reject</button>
                    </>
                  )}
                  {s.status === "approved" && (
                    <button className="kx-btn-outline !px-4 !py-2 !text-xs flex-1" onClick={() => setPreviewing(s)}>Resend email</button>
                  )}
                  {s.status === "rejected" && (
                    <button className="kx-btn-outline !px-4 !py-2 !text-xs flex-1" onClick={() => onDecide(s.id, "approved")}>Undo</button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {previewing && (
        <EmailPreview
          submission={previewing}
          onClose={() => setPreviewing(null)}
          onConfirm={async () => {
            await onDecide(previewing.id, "approved");
            setPreviewing(null);
          }}
        />
      )}
    </>
  );
}

function Pill({ text, colors }: { text: string; colors: { text: string; bg: string; border: string } }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs capitalize border w-fit"
      style={{ color: colors.text, background: colors.bg, borderColor: colors.border }}
    >
      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full" style={{ background: colors.text }} />
      {text}
    </span>
  );
}
