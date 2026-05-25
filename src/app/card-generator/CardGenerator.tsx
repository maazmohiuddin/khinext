"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Download, Share2, Check, X, ArrowLeft, Link2 } from "lucide-react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────

type Template = "standard" | "vip";

interface CardState {
  template: Template;
  name: string;
  designation: string;
  photoDataUrl: string | null;
}

// ── Canvas constants ───────────────────────────────────────────

const W = 1080;
const H = 1080;

// ── Helpers ───────────────────────────────────────────────────

let logoCache: HTMLImageElement | null = null;
let logoPromise: Promise<HTMLImageElement> | null = null;

function getLogoImg(): Promise<HTMLImageElement> {
  if (logoCache) return Promise.resolve(logoCache);
  if (logoPromise) return logoPromise;
  logoPromise = new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { logoCache = img; resolve(img); };
    img.onerror = reject;
    img.src = "/brand/logo.png";
  });
  return logoPromise;
}

function loadDataUrlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Center-crop image into circle
function drawCircleImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number, cy: number, r: number
) {
  const nw = img.naturalWidth, nh = img.naturalHeight;
  const minDim = Math.min(nw, nh);
  const sx = (nw - minDim) / 2, sy = (nh - minDim) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, sx, sy, minDim, minDim, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

function drawPhotoPlaceholder(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number, isVip: boolean
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = isVip ? "rgba(255,184,0,0.07)" : "rgba(49,107,255,0.08)";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.09)";
  // head
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.26, r * 0.30, 0, Math.PI * 2);
  ctx.fill();
  // body
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.44, r * 0.50, r * 0.40, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Fit text to maxWidth by shrinking font size
function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  maxWidth: number,
  makeFont: (size: number) => string,
  startSize: number,
  minSize = 24
) {
  let size = startSize;
  ctx.font = makeFont(size);
  while (ctx.measureText(text).width > maxWidth && size > minSize) {
    size -= 2;
    ctx.font = makeFont(size);
  }
  ctx.fillText(text, x, y);
}

// Draw letter-spaced text by walking each character
function drawSpaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number, cy: number,
  spacing: number
) {
  const total = text.length * spacing;
  let x = cx - total / 2;
  for (const ch of text) {
    ctx.fillText(ch, x + spacing / 2, cy);
    x += spacing;
  }
}

// ── Standard card ──────────────────────────────────────────────

async function drawStandard(ctx: CanvasRenderingContext2D, s: CardState) {
  // ── 1. Background fill
  ctx.fillStyle = "#040B1C";
  ctx.fillRect(0, 0, W, H);

  // ── 2. Blueprint grid — only drawn in outer / corner zones
  // First draw full grid, then suppress center with a dark radial mask
  ctx.save();
  ctx.strokeStyle = "rgba(49,107,255,0.065)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 56) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 56) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.restore();

  // Suppress grid behind content zone (center ellipse darkener)
  const suppress = ctx.createRadialGradient(W / 2, H * 0.47, 100, W / 2, H * 0.47, 530);
  suppress.addColorStop(0,   "rgba(4,11,28,0.92)");
  suppress.addColorStop(0.6, "rgba(4,11,28,0.60)");
  suppress.addColorStop(1,   "rgba(4,11,28,0)");
  ctx.fillStyle = suppress;
  ctx.fillRect(0, 0, W, H);

  // ── 3. Top glow — drawn only from top edge, limited radius
  const tg = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, 480);
  tg.addColorStop(0,   "rgba(49,107,255,0.28)");
  tg.addColorStop(0.6, "rgba(49,107,255,0.08)");
  tg.addColorStop(1,   "rgba(49,107,255,0)");
  ctx.fillStyle = tg;
  ctx.fillRect(0, 0, W, 480);

  // ── 4. Logo
  try {
    const logo = await getLogoImg();
    const lw = 200, lh = (logo.naturalHeight / logo.naturalWidth) * lw;
    ctx.drawImage(logo, (W - lw) / 2, 52, lw, lh);
  } catch { /* logo unavailable */ }

  // Accent line under logo
  const al = ctx.createLinearGradient(W / 2 - 90, 0, W / 2 + 90, 0);
  al.addColorStop(0, "transparent");
  al.addColorStop(0.5, "rgba(49,107,255,0.65)");
  al.addColorStop(1, "transparent");
  ctx.fillStyle = al;
  ctx.fillRect(W / 2 - 90, 132, 180, 1.5);

  // ── 5. "I AM ATTENDING"
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.40)";
  ctx.font = `700 24px "Helvetica Now Display", "Helvetica", sans-serif`;
  drawSpaced(ctx, "I AM ATTENDING", W / 2, 166, 22);

  // ── 6. "KHINEXT" display text
  ctx.font = `900 90px "Helvetica Now Display", "Helvetica", sans-serif`;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("KHINEXT", W / 2, 268);

  // ── 7. Photo
  const px = W / 2, py = 488, pr = 150;

  // Photo halo — drawn as a disc, not full-canvas rect (avoids bleed)
  const haloGrad = ctx.createRadialGradient(px, py, pr, px, py, pr + 62);
  haloGrad.addColorStop(0,   "rgba(49,107,255,0.14)");
  haloGrad.addColorStop(0.7, "rgba(49,107,255,0.04)");
  haloGrad.addColorStop(1,   "transparent");
  ctx.beginPath();
  ctx.arc(px, py, pr + 62, 0, Math.PI * 2);
  ctx.fillStyle = haloGrad;
  ctx.fill();

  // Photo image / placeholder
  if (s.photoDataUrl) {
    try {
      drawCircleImage(ctx, await loadDataUrlImage(s.photoDataUrl), px, py, pr);
    } catch { drawPhotoPlaceholder(ctx, px, py, pr, false); }
  } else {
    drawPhotoPlaceholder(ctx, px, py, pr, false);
  }

  // Blue ring
  ctx.beginPath();
  ctx.arc(px, py, pr + 3, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(49,107,255,0.80)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Outer soft ring
  ctx.beginPath();
  ctx.arc(px, py, pr + 14, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(49,107,255,0.15)";
  ctx.lineWidth = 7;
  ctx.stroke();

  // ── 8. Name
  const nameText = s.name.trim() || "Your Name";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  fitText(ctx, nameText, W / 2, 718, 860,
    (sz) => `800 ${sz}px "Helvetica Now Display", "Helvetica", sans-serif`, 58, 26);

  // Divider
  const dg = ctx.createLinearGradient(W / 2 - 70, 0, W / 2 + 70, 0);
  dg.addColorStop(0, "transparent");
  dg.addColorStop(0.5, "rgba(49,107,255,0.60)");
  dg.addColorStop(1, "transparent");
  ctx.fillStyle = dg;
  ctx.fillRect(W / 2 - 70, 756, 140, 1.5);

  // ── 9. Tagline + footer
  ctx.font = `400 22px "Helvetica", sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.46)";
  ctx.fillText("Asia's First Multi Domain AI and Innovation Summit", W / 2, 798);

  ctx.font = `700 20px "Helvetica", sans-serif`;
  ctx.fillStyle = "rgba(143,175,255,0.80)";
  ctx.fillText("PC Hotel, Karachi  ·  June 7, 2026  ·  khinext.com", W / 2, 844);

  // ── 10. Bottom decor zone
  const bz = ctx.createLinearGradient(0, 900, 0, H);
  bz.addColorStop(0, "rgba(4,11,28,0)");
  bz.addColorStop(1, "rgba(4,11,28,0.4)");
  ctx.fillStyle = bz;
  ctx.fillRect(0, 900, W, H - 900);

  const bl = ctx.createLinearGradient(0, 0, W, 0);
  bl.addColorStop(0, "transparent");
  bl.addColorStop(0.5, "rgba(49,107,255,0.75)");
  bl.addColorStop(1, "transparent");
  ctx.fillStyle = bl;
  ctx.fillRect(0, H - 3, W, 3);
}

// ── VIP card ───────────────────────────────────────────────────

async function drawVip(ctx: CanvasRenderingContext2D, s: CardState) {
  // ── 1. Background fill
  ctx.fillStyle = "#020409";
  ctx.fillRect(0, 0, W, H);

  // ── 2. Dot grid — only in outer zones (suppressed behind content)
  ctx.fillStyle = "rgba(255,184,0,0.045)";
  for (let x = 18; x < W; x += 36) {
    for (let y = 18; y < H; y += 36) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Suppress dots behind content zone
  const suppress = ctx.createRadialGradient(W / 2, H * 0.48, 100, W / 2, H * 0.48, 520);
  suppress.addColorStop(0,   "rgba(2,4,9,0.94)");
  suppress.addColorStop(0.6, "rgba(2,4,9,0.62)");
  suppress.addColorStop(1,   "rgba(2,4,9,0)");
  ctx.fillStyle = suppress;
  ctx.fillRect(0, 0, W, H);

  // ── 3. Top gold glow — restricted to top half
  const tg = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, 480);
  tg.addColorStop(0,   "rgba(255,184,0,0.20)");
  tg.addColorStop(0.6, "rgba(255,184,0,0.05)");
  tg.addColorStop(1,   "rgba(255,184,0,0)");
  ctx.fillStyle = tg;
  ctx.fillRect(0, 0, W, 480);

  // Bottom-right accent glow (very subtle)
  const cg = ctx.createRadialGradient(W, H, 0, W, H, 420);
  cg.addColorStop(0,   "rgba(255,184,0,0.06)");
  cg.addColorStop(1,   "rgba(255,184,0,0)");
  ctx.fillStyle = cg;
  ctx.fillRect(W - 420, H - 420, 420, 420);

  // ── 4. Logo
  try {
    const logo = await getLogoImg();
    const lw = 192, lh = (logo.naturalHeight / logo.naturalWidth) * lw;
    ctx.drawImage(logo, (W - lw) / 2, 46, lw, lh);
  } catch { /* continue */ }

  // ── 5. "I AM ATTENDING AS A"
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.36)";
  ctx.font = `700 22px "Helvetica Now Display", "Helvetica", sans-serif`;
  drawSpaced(ctx, "I AM ATTENDING AS A", W / 2, 146, 19.5);

  // ── 6. "VIP DELEGATE" gold gradient text
  const goldGrad = ctx.createLinearGradient(100, 0, W - 100, 0);
  goldGrad.addColorStop(0,    "#7A5010");
  goldGrad.addColorStop(0.25, "#FFD060");
  goldGrad.addColorStop(0.5,  "#FFF0A0");
  goldGrad.addColorStop(0.75, "#FFD060");
  goldGrad.addColorStop(1,    "#7A5010");
  ctx.font = `900 94px "Helvetica Now Display", "Helvetica", sans-serif`;
  ctx.fillStyle = goldGrad;
  ctx.fillText("VIP DELEGATE", W / 2, 254);

  // Gold line — below VIP text, above photo
  const ul = ctx.createLinearGradient(0, 0, W, 0);
  ul.addColorStop(0,    "transparent");
  ul.addColorStop(0.2,  "rgba(255,184,0,0.40)");
  ul.addColorStop(0.5,  "rgba(255,240,160,0.60)");
  ul.addColorStop(0.8,  "rgba(255,184,0,0.40)");
  ul.addColorStop(1,    "transparent");
  ctx.fillStyle = ul;
  ctx.fillRect(0, 314, W, 1.5);

  // ── 7. Photo  (py=514 → top=369 → 55px clear gap after line at y=314)
  const px = W / 2, py = 514, pr = 145;

  // Gold halo — drawn as a disc, NOT full canvas fillRect (avoids bleed)
  const haloGrad = ctx.createRadialGradient(px, py, pr, px, py, pr + 60);
  haloGrad.addColorStop(0,   "rgba(255,184,0,0.14)");
  haloGrad.addColorStop(0.7, "rgba(255,184,0,0.04)");
  haloGrad.addColorStop(1,   "transparent");
  ctx.beginPath();
  ctx.arc(px, py, pr + 60, 0, Math.PI * 2);
  ctx.fillStyle = haloGrad;
  ctx.fill();

  // Photo image / placeholder
  if (s.photoDataUrl) {
    try {
      drawCircleImage(ctx, await loadDataUrlImage(s.photoDataUrl), px, py, pr);
    } catch { drawPhotoPlaceholder(ctx, px, py, pr, true); }
  } else {
    drawPhotoPlaceholder(ctx, px, py, pr, true);
  }

  // Gold ring — gradient follows the circle
  const ringGrad = ctx.createLinearGradient(px - pr, py - pr, px + pr, py + pr);
  ringGrad.addColorStop(0,    "#7A5010");
  ringGrad.addColorStop(0.25, "#FFD060");
  ringGrad.addColorStop(0.5,  "#FFF0A0");
  ringGrad.addColorStop(0.75, "#FFD060");
  ringGrad.addColorStop(1,    "#7A5010");
  ctx.beginPath();
  ctx.arc(px, py, pr + 3, 0, Math.PI * 2);
  ctx.strokeStyle = ringGrad;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Outer soft glow ring
  ctx.beginPath();
  ctx.arc(px, py, pr + 15, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,184,0,0.11)";
  ctx.lineWidth = 7;
  ctx.stroke();

  // ── 8. Name
  const nameText = s.name.trim() || "Your Name";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  fitText(ctx, nameText, W / 2, 736, 860,
    (sz) => `800 ${sz}px "Helvetica Now Display", "Helvetica", sans-serif`, 56, 26);

  const hasDesig = s.designation.trim().length > 0;

  // Designation
  if (hasDesig) {
    ctx.fillStyle = "rgba(255,200,55,0.88)";
    fitText(ctx, s.designation.trim(), W / 2, 786, 820,
      (sz) => `400 ${sz}px "Helvetica Now Display", "Helvetica", sans-serif`, 28, 18);
  }

  const divY = hasDesig ? 826 : 776;

  // Gold divider
  const dg = ctx.createLinearGradient(W / 2 - 70, 0, W / 2 + 70, 0);
  dg.addColorStop(0, "transparent");
  dg.addColorStop(0.5, "rgba(255,184,0,0.58)");
  dg.addColorStop(1, "transparent");
  ctx.fillStyle = dg;
  ctx.fillRect(W / 2 - 70, divY, 140, 1.5);

  const tY = divY + 50;

  // ── 9. Tagline + footer
  ctx.font = `400 21px "Helvetica", sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.fillText("Asia's First Multi Domain AI and Innovation Summit", W / 2, tY);

  ctx.font = `700 19px "Helvetica", sans-serif`;
  ctx.fillStyle = "rgba(255,184,0,0.70)";
  ctx.fillText("PC Hotel, Karachi  ·  June 7, 2026  ·  khinext.com", W / 2, tY + 44);

  // ── 10. Bottom decor zone
  const bz = ctx.createLinearGradient(0, tY + 80, 0, H);
  bz.addColorStop(0, "rgba(2,4,9,0)");
  bz.addColorStop(1, "rgba(2,4,9,0.5)");
  ctx.fillStyle = bz;
  ctx.fillRect(0, tY + 80, W, H - (tY + 80));

  const bl = ctx.createLinearGradient(0, 0, W, 0);
  bl.addColorStop(0, "transparent");
  bl.addColorStop(0.5, "rgba(255,184,0,0.72)");
  bl.addColorStop(1, "transparent");
  ctx.fillStyle = bl;
  ctx.fillRect(0, H - 3, W, 3);
}

// ── Shareable URL generator ─────────────────────────────────────

function makeShareUrl(s: CardState): string {
  const base = typeof window !== "undefined" ? window.location.origin : "https://khinext.com";
  const p = new URLSearchParams({ t: s.template });
  if (s.name.trim()) p.set("n", s.name.trim());
  if (s.designation.trim()) p.set("d", s.designation.trim());
  // unique ID busts LinkedIn/Facebook link-preview cache on every share
  p.set("_v", Math.random().toString(36).slice(2, 8));
  return `${base}/card-generator?${p}`;
}

// ── Main component ─────────────────────────────────────────────

export function CardGenerator() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<CardState>({
    template: "standard",
    name: "",
    designation: "",
    photoDataUrl: null,
  });

  const [downloading,  setDownloading]  = useState(false);
  const [shared,       setShared]       = useState(false);
  const [linkCopied,   setLinkCopied]   = useState(false);
  const [fmt,          setFmt]          = useState<"jpeg" | "png">("jpeg");

  // Pre-fill from URL params on first mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p   = new URLSearchParams(window.location.search);
    const t   = p.get("t") as Template | null;
    const n   = p.get("n") ?? "";
    const d   = p.get("d") ?? "";
    if (t || n || d) {
      setState(prev => ({
        ...prev,
        template:    (t === "vip" || t === "standard") ? t : prev.template,
        name:        n || prev.name,
        designation: d || prev.designation,
      }));
    }
  }, []);

  // Redraw canvas whenever state changes
  const redraw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Wait for fonts so custom typeface is used
    if (typeof document !== "undefined") await document.fonts.ready;
    ctx.clearRect(0, 0, W, H);
    if (state.template === "standard") await drawStandard(ctx, state);
    else await drawVip(ctx, state);
  }, [state]);

  useEffect(() => { redraw(); }, [redraw]);

  // ── Handlers ────────────────────────────────────────────────

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setState(s => ({ ...s, photoDataUrl: ev.target?.result as string }));
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setState(s => ({ ...s, photoDataUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    await redraw();
    const mime = fmt === "jpeg" ? "image/jpeg" : "image/png";
    const url  = canvas.toDataURL(mime, fmt === "jpeg" ? 0.96 : undefined);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `khinext-${state.template}-card.${fmt}`;
    a.click();
    setDownloading(false);
  }

  async function handleShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    await redraw();
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        const blob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob(b => b ? res(b) : rej(new Error("toBlob")), "image/jpeg", 0.96)
        );
        const file = new File([blob], "khinext-card.jpg", { type: "image/jpeg" });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((navigator as any).canShare?.({ files: [file] })) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (navigator as any).share({ files: [file],
            title: "I'm attending KHINEXT '26 — Asia's First Multi Domain AI Summit" });
          setShared(true);
          setTimeout(() => setShared(false), 2500);
          return;
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }
    await handleDownload();
  }

  async function handleCopyLink() {
    const url = makeShareUrl(state);
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2200);
    } catch {
      // Fallback: select text from prompt
      window.prompt("Copy this link:", url);
    }
  }

  function handleShareLinkedIn() {
    const url = makeShareUrl(state);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank", "noopener,noreferrer,width=600,height=480"
    );
  }

  function handleShareFacebook() {
    const url = makeShareUrl(state);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank", "noopener,noreferrer,width=600,height=480"
    );
  }

  // ── Derived ─────────────────────────────────────────────────

  const isVip      = state.template === "vip";
  const accent     = isVip ? "#FFB800"              : "#316BFF";
  const accentMute = isVip ? "rgba(255,184,0,0.18)" : "rgba(49,107,255,0.18)";

  // ── Render ──────────────────────────────────────────────────

  return (
    <div className="max-w-page mx-auto px-6 md:px-14 py-12 md:py-16">

      {/* Header */}
      <header className="mb-10">
        <Link href="/"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-4">
          <ArrowLeft size={12} /> Back to Home
        </Link>
        <p className="kx-eyebrow mb-3">Khinext &apos;26</p>
        <h1 className="font-display font-extrabold text-white text-4xl md:text-5xl -tracking-tight mb-3">
          Your <span className="kx-accent">Digital Card</span>
        </h1>
        <p className="text-white/50 text-sm max-w-lg">
          Personalise your attendance card and share it on LinkedIn, Instagram, and Facebook.
        </p>
      </header>

      {/* Template selector */}
      <div role="tablist"
        className="inline-flex gap-1 rounded-full bg-white/[0.04] border border-white/10 p-1 mb-10">
        <button
          role="tab" aria-selected={!isVip}
          onClick={() => setState(s => ({ ...s, template: "standard" }))}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            !isVip ? "bg-khi-blue text-white shadow-lg" : "text-white/50 hover:text-white"
          }`}>
          Standard
        </button>
        <button
          role="tab" aria-selected={isVip}
          onClick={() => setState(s => ({ ...s, template: "vip" }))}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            isVip ? "text-white shadow-lg" : "text-white/50 hover:text-white"
          }`}
          style={isVip ? { background: "linear-gradient(135deg,#5C3D00,#B8860B,#5C3D00)" } : {}}>
          ✦ VIP Delegate
        </button>
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">

        {/* ── Controls panel ── */}
        <div className="space-y-4">

          {/* Photo upload */}
          <div className="kx-card !p-6 !rounded-2xl">
            <p className="kx-label block mb-3">Your Photo</p>
            {state.photoDataUrl ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2"
                  style={{ borderColor: accent }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={state.photoDataUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/75">Photo uploaded</p>
                  <p className="text-xs text-white/35 mt-0.5">Auto-cropped to circle</p>
                </div>
                <button onClick={removePhoto}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/35 hover:text-white"
                  aria-label="Remove photo">
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center gap-3 py-8 rounded-xl border-2 border-dashed border-white/12 hover:border-white/28 transition-colors group">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: accentMute }}>
                  <Upload size={20} style={{ color: accent }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/65 group-hover:text-white transition-colors">
                    Upload Photo
                  </p>
                  <p className="text-xs text-white/30 mt-1">JPG or PNG · Best with a headshot</p>
                </div>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*"
              className="sr-only" onChange={handlePhotoUpload} />
          </div>

          {/* Name */}
          <div className="kx-card !p-6 !rounded-2xl">
            <label htmlFor="card-name" className="kx-label block mb-2">Your Name</label>
            <input id="card-name" type="text" value={state.name}
              onChange={e => setState(s => ({ ...s, name: e.target.value }))}
              placeholder="Dr. Ayesha Khan" maxLength={50}
              className="kx-input w-full rounded-xl" />
          </div>

          {/* Designation — VIP only */}
          {isVip && (
            <div className="kx-card !p-6 !rounded-2xl"
              style={{ borderColor: "rgba(255,184,0,0.18)" }}>
              <label htmlFor="card-designation"
                className="block mb-2 text-[11px] font-bold uppercase"
                style={{ color: "#FFB800", letterSpacing: "0.14em" }}>
                Designation / Title
              </label>
              <input id="card-designation" type="text" value={state.designation}
                onChange={e => setState(s => ({ ...s, designation: e.target.value }))}
                placeholder="CEO · AI Research Director" maxLength={55}
                className="kx-input w-full rounded-xl"
                style={{ borderColor: "rgba(255,184,0,0.20)" }} />
              <p className="text-xs text-white/32 mt-2">Appears in gold below your name</p>
            </div>
          )}

          {/* Card summary */}
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 text-xs text-white/38 space-y-1.5">
            <p className="text-white/55 font-semibold mb-2.5">
              {isVip ? "VIP Delegate" : "Standard"} card includes:
            </p>
            {isVip ? (
              <>
                <p>✦ &ldquo;I am attending as a VIP Delegate&rdquo;</p>
                <p>✦ Your photo · Gold ring frame</p>
                <p>✦ Your name + designation</p>
              </>
            ) : (
              <>
                <p>✦ &ldquo;I am attending KHINEXT&rdquo;</p>
                <p>✦ Your photo · Blue ring frame</p>
                <p>✦ Your name</p>
              </>
            )}
            <p>✦ Asia&apos;s First Multi Domain AI Summit</p>
            <p>✦ PC Hotel, Karachi · June 7, 2026 · khinext.com</p>
          </div>

          {/* Format toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">Format:</span>
            <div className="inline-flex gap-0.5 rounded-full bg-white/[0.05] border border-white/10 p-0.5">
              {(["jpeg", "png"] as const).map(f => (
                <button key={f} onClick={() => setFmt(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors ${
                    fmt === f ? "bg-white/15 text-white" : "text-white/40 hover:text-white"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Download */}
          <button onClick={handleDownload} disabled={downloading}
            className="kx-btn kx-btn-primary w-full justify-center disabled:opacity-60">
            <Download size={16} />
            {downloading ? "Generating…" : `Download ${fmt.toUpperCase()}`}
          </button>

          {/* Share via device */}
          <button onClick={handleShare}
            className="kx-btn kx-btn-outline w-full justify-center">
            {shared ? <Check size={16} /> : <Share2 size={16} />}
            {shared ? "Shared!" : "Share via device"}
          </button>

          {/* Copy unique link */}
          <button onClick={handleCopyLink}
            className={`kx-btn w-full justify-center transition-all ${
              linkCopied
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                : "kx-btn-outline"
            }`}>
            {linkCopied ? <Check size={16} /> : <Link2 size={16} />}
            {linkCopied ? "Link copied!" : "Copy unique link"}
          </button>

          {/* Social share */}
          <div>
            <p className="text-xs text-white/30 text-center mb-3">Share on</p>
            <div className="flex items-stretch gap-2">
              {/* LinkedIn */}
              <button onClick={handleShareLinkedIn}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/12 hover:border-[#0077B5] hover:bg-[#0077B5]/10 transition-all text-xs text-white/45 hover:text-white font-medium">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>

              {/* Facebook */}
              <button onClick={handleShareFacebook}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/12 hover:border-[#1877F2] hover:bg-[#1877F2]/10 transition-all text-xs text-white/45 hover:text-white font-medium">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>

              {/* Instagram */}
              <button onClick={handleDownload}
                title="Download then share on Instagram"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/12 hover:border-[#E1306C] hover:bg-[#E1306C]/10 transition-all text-xs text-white/45 hover:text-white font-medium">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </button>
            </div>
            <p className="text-[11px] text-white/22 text-center mt-2">
              Each share uses a unique URL · Instagram: download then post from the app
            </p>
          </div>
        </div>

        {/* ── Canvas preview ── */}
        <div className="sticky top-6">
          <p className="text-xs text-white/30 text-center mb-3">Live preview · 1080 × 1080 px</p>
          <div className="relative rounded-2xl overflow-hidden"
            style={{
              boxShadow: isVip
                ? "0 0 80px rgba(255,184,0,0.14), 0 0 0 1px rgba(255,184,0,0.12)"
                : "0 0 80px rgba(49,107,255,0.14), 0 0 0 1px rgba(49,107,255,0.12)",
            }}>
            <canvas ref={canvasRef} width={W} height={H}
              style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
          <p className="text-[11px] text-white/22 text-center mt-3">
            1080 × 1080 · Optimised for LinkedIn, Instagram &amp; Facebook
          </p>
        </div>
      </div>
    </div>
  );
}
