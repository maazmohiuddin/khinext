"use client";

import { useState } from "react";
import { ExternalLink, Copy, Check, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import type { CardShare } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://khinext.vercel.app";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

function getImageUrl(id: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/card-images/${id}.jpg`;
}

function getShareUrl(slug: string) {
  const base = SITE_URL.replace(/\/$/, "");
  return `${base}/go/${slug}`;
}

function TemplateBadge({ template }: { template: string }) {
  const isVip = template === "vip";
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
      style={
        isVip
          ? { background: "rgba(255,184,0,0.12)", color: "#FFB800", border: "1px solid rgba(255,184,0,0.3)" }
          : { background: "rgba(49,107,255,0.12)", color: "#8FAFFF", border: "1px solid rgba(49,107,255,0.3)" }
      }
    >
      {isVip ? "VIP" : "Standard"}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button
      onClick={copy}
      title="Copy link"
      className="p-1.5 rounded-md transition-colors text-white/40 hover:text-white hover:bg-white/8"
    >
      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
    </button>
  );
}

function DetailRow({ id, slug, name, designation, template, created_at }: CardShare) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgUrl = getImageUrl(id);
  const shareUrl = getShareUrl(slug);
  const date = new Date(created_at).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const time = new Date(created_at).toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden transition-colors hover:border-white/14">
      {/* Compact row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        onClick={() => setExpanded(v => !v)}
      >
        {/* Thumbnail */}
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
          {imgError ? (
            <ImageIcon size={16} className="text-white/20" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgUrl}
              alt={name ?? "card"}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* Name + designation */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{name || <span className="text-white/30 italic">Unnamed</span>}</p>
          <p className="text-xs text-white/40 truncate">{designation || "—"}</p>
        </div>

        {/* Badge */}
        <TemplateBadge template={template} />

        {/* Date */}
        <div className="hidden sm:flex flex-col items-end text-right min-w-[72px]">
          <span className="text-xs text-white/50">{date}</span>
          <span className="text-[10px] text-white/30">{time}</span>
        </div>

        {/* Expand icon */}
        <span className="text-white/30 ml-1">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-white/8 bg-white/[0.02] px-4 py-4 flex flex-col sm:flex-row gap-5">
          {/* Card image preview */}
          <div className="flex-shrink-0">
            {imgError ? (
              <div className="w-full sm:w-48 h-28 rounded-xl bg-white/5 flex items-center justify-center">
                <ImageIcon size={28} className="text-white/15" />
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgUrl}
                alt={name ?? "card"}
                className="w-full sm:w-48 rounded-xl object-cover shadow-lg"
                style={{ aspectRatio: "1.6 / 1" }}
              />
            )}
          </div>

          {/* Metadata */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div>
                <p className="text-white/35 mb-0.5">Name</p>
                <p className="text-white font-medium">{name || "—"}</p>
              </div>
              <div>
                <p className="text-white/35 mb-0.5">Designation</p>
                <p className="text-white font-medium">{designation || "—"}</p>
              </div>
              <div>
                <p className="text-white/35 mb-0.5">Template</p>
                <TemplateBadge template={template} />
              </div>
              <div>
                <p className="text-white/35 mb-0.5">Generated</p>
                <p className="text-white font-medium">{date} · {time}</p>
              </div>
            </div>

            {/* Share URL */}
            <div>
              <p className="text-white/35 text-xs mb-1">Share URL</p>
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 max-w-xs">
                <span className="text-xs text-khi-blue-soft font-mono truncate flex-1">{shareUrl}</span>
                <CopyButton text={shareUrl} />
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md text-white/40 hover:text-white transition-colors"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CardSharesTable({ items }: { items: CardShare[] }) {
  if (items.length === 0) {
    return (
      <div className="kx-card !p-12 text-center">
        <ImageIcon size={36} className="text-white/15 mx-auto mb-3" />
        <p className="text-white/50 text-sm">No cards generated yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map(card => (
        <DetailRow key={card.id} {...card} />
      ))}
    </div>
  );
}
