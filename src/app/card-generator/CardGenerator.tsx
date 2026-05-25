"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Download, Share2, Check, X, ArrowLeft } from "lucide-react";
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

// ── Image helpers ──────────────────────────────────────────────

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

function drawCircleImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number, cy: number, r: number
) {
  const nw = img.naturalWidth, nh = img.naturalHeight;
  const minDim = Math.min(nw, nh);
  const sx = (nw - minDim) / 2;
  const sy = (nh - minDim) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, sx, sy, minDim, minDim, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

function drawPhotoPlaceholder(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  isVip: boolean
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = isVip ? "rgba(255,184,0,0.08)" : "rgba(49,107,255,0.10)";
  ctx.fill();
  // Silhouette
  ctx.fillStyle = isVip ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.10)";
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.28, r * 0.32, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.42, r * 0.52, r * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

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

// ── Standard card ──────────────────────────────────────────────

async function drawStandard(ctx: CanvasRenderingContext2D, s: CardState) {
  // Background
  ctx.fillStyle = "#040B1C";
  ctx.fillRect(0, 0, W, H);

  // Blueprint grid
  ctx.save();
  ctx.strokeStyle = "rgba(49,107,255,0.075)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 56) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 56) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.restore();

  // Top glow
  const tg = ctx.createRadialGradient(W / 2, -40, 0, W / 2, -40, 560);
  tg.addColorStop(0, "rgba(49,107,255,0.30)");
  tg.addColorStop(1, "rgba(49,107,255,0)");
  ctx.fillStyle = tg;
  ctx.fillRect(0, 0, W, H);

  // Logo
  try {
    const logo = await getLogoImg();
    const lw = 220, lh = (logo.naturalHeight / logo.naturalWidth) * lw;
    ctx.drawImage(logo, (W - lw) / 2, 52, lw, lh);
  } catch { /* logo unavailable — continue */ }

  // Accent line under logo
  const al = ctx.createLinearGradient(W / 2 - 100, 0, W / 2 + 100, 0);
  al.addColorStop(0, "transparent");
  al.addColorStop(0.5, "rgba(49,107,255,0.70)");
  al.addColorStop(1, "transparent");
  ctx.fillStyle = al;
  ctx.fillRect(W / 2 - 100, 150, 200, 1.5);

  // "I AM ATTENDING" eyebrow
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 28px "Helvetica Now Display", "Helvetica", sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  // Manual letter-spacing via per-char drawing
  const eyebrow = "I AM ATTENDING";
  const ewTotal = eyebrow.length * 24.5;
  let ex = W / 2 - ewTotal / 2;
  for (const ch of eyebrow) {
    ctx.fillText(ch, ex + 12, 188);
    ex += 24.5;
  }

  // Photo
  const px = W / 2, py = 448, pr = 162;

  // Photo ambient glow
  const pg = ctx.createRadialGradient(px, py, pr - 10, px, py, pr + 70);
  pg.addColorStop(0, "rgba(49,107,255,0.13)");
  pg.addColorStop(1, "rgba(49,107,255,0)");
  ctx.fillStyle = pg;
  ctx.fillRect(0, 0, W, H);

  if (s.photoDataUrl) {
    try {
      const photo = await loadDataUrlImage(s.photoDataUrl);
      drawCircleImage(ctx, photo, px, py, pr);
    } catch { drawPhotoPlaceholder(ctx, px, py, pr, false); }
  } else {
    drawPhotoPlaceholder(ctx, px, py, pr, false);
  }

  // Blue ring
  ctx.beginPath();
  ctx.arc(px, py, pr + 3, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(49,107,255,0.78)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Soft outer ring
  ctx.beginPath();
  ctx.arc(px, py, pr + 15, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(49,107,255,0.16)";
  ctx.lineWidth = 8;
  ctx.stroke();

  // Name
  const nameText = s.name.trim() || "Your Name";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  fitText(ctx, nameText, W / 2, 683, 860,
    (sz) => `800 ${sz}px "Helvetica Now Display", "Helvetica", sans-serif`, 62, 26);

  // Divider
  const dg = ctx.createLinearGradient(W / 2 - 80, 0, W / 2 + 80, 0);
  dg.addColorStop(0, "transparent");
  dg.addColorStop(0.5, "rgba(49,107,255,0.65)");
  dg.addColorStop(1, "transparent");
  ctx.fillStyle = dg;
  ctx.fillRect(W / 2 - 80, 722, 160, 1.5);

  // Tagline
  ctx.font = `400 23px "Helvetica", sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.48)";
  ctx.fillText("Asia's First Multi Domain AI and Innovation Summit", W / 2, 768);

  // Footer info
  ctx.font = `700 21px "Helvetica", sans-serif`;
  ctx.fillStyle = "rgba(143,175,255,0.82)";
  ctx.fillText("PC Hotel, Karachi  ·  June 7, 2026  ·  khinext.com", W / 2, 816);

  // Bottom decor zone
  ctx.fillStyle = "rgba(49,107,255,0.035)";
  ctx.fillRect(0, 880, W, H - 880);

  const bg = ctx.createLinearGradient(0, 0, W, 0);
  bg.addColorStop(0, "transparent");
  bg.addColorStop(0.5, "rgba(49,107,255,0.80)");
  bg.addColorStop(1, "transparent");
  ctx.fillStyle = bg;
  ctx.fillRect(0, H - 3, W, 3);
}

// ── VIP card ───────────────────────────────────────────────────

async function drawVip(ctx: CanvasRenderingContext2D, s: CardState) {
  // Background
  ctx.fillStyle = "#020409";
  ctx.fillRect(0, 0, W, H);

  // Dot grid
  ctx.fillStyle = "rgba(255,184,0,0.05)";
  for (let x = 18; x < W; x += 36) {
    for (let y = 18; y < H; y += 36) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Top gold glow
  const tg = ctx.createRadialGradient(W / 2, -60, 0, W / 2, -60, 520);
  tg.addColorStop(0, "rgba(255,184,0,0.20)");
  tg.addColorStop(1, "rgba(255,184,0,0)");
  ctx.fillStyle = tg;
  ctx.fillRect(0, 0, W, H);

  // Diagonal corner glow (bottom-right)
  const cg = ctx.createRadialGradient(W, H, 0, W, H, 500);
  cg.addColorStop(0, "rgba(255,184,0,0.06)");
  cg.addColorStop(1, "rgba(255,184,0,0)");
  ctx.fillStyle = cg;
  ctx.fillRect(0, 0, W, H);

  // Logo (rendered normally — white logo on dark bg looks premium)
  try {
    const logo = await getLogoImg();
    const lw = 200, lh = (logo.naturalHeight / logo.naturalWidth) * lw;
    ctx.drawImage(logo, (W - lw) / 2, 46, lw, lh);
  } catch { /* continue */ }

  // "I AM ATTENDING AS A"
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 24px "Helvetica Now Display", "Helvetica", sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.38)";
  const sub = "I AM ATTENDING AS A";
  const subW = sub.length * 20;
  let sx = W / 2 - subW / 2;
  for (const ch of sub) {
    ctx.fillText(ch, sx + 10, 158);
    sx += 20;
  }

  // "VIP DELEGATE" — gold gradient text
  const goldGrad = ctx.createLinearGradient(100, 0, W - 100, 0);
  goldGrad.addColorStop(0, "#8A6010");
  goldGrad.addColorStop(0.25, "#FFD060");
  goldGrad.addColorStop(0.5, "#FFF0A0");
  goldGrad.addColorStop(0.75, "#FFD060");
  goldGrad.addColorStop(1, "#8A6010");
  ctx.font = `900 100px "Helvetica Now Display", "Helvetica", sans-serif`;
  ctx.fillStyle = goldGrad;
  ctx.fillText("VIP DELEGATE", W / 2, 268);

  // Gold underline
  const ul = ctx.createLinearGradient(0, 0, W, 0);
  ul.addColorStop(0, "transparent");
  ul.addColorStop(0.25, "rgba(255,184,0,0.45)");
  ul.addColorStop(0.5, "rgba(255,240,160,0.65)");
  ul.addColorStop(0.75, "rgba(255,184,0,0.45)");
  ul.addColorStop(1, "transparent");
  ctx.fillStyle = ul;
  ctx.fillRect(0, 330, W, 1.5);

  // Photo
  const px = W / 2, py = 495, pr = 150;

  // Gold halo
  const halo = ctx.createRadialGradient(px, py, pr, px, py, pr + 55);
  halo.addColorStop(0, "rgba(255,184,0,0.13)");
  halo.addColorStop(1, "rgba(255,184,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  if (s.photoDataUrl) {
    try {
      const photo = await loadDataUrlImage(s.photoDataUrl);
      drawCircleImage(ctx, photo, px, py, pr);
    } catch { drawPhotoPlaceholder(ctx, px, py, pr, true); }
  } else {
    drawPhotoPlaceholder(ctx, px, py, pr, true);
  }

  // Gold ring
  const ringGrad = ctx.createLinearGradient(px - pr, py - pr, px + pr, py + pr);
  ringGrad.addColorStop(0, "#7A5010");
  ringGrad.addColorStop(0.25, "#FFD060");
  ringGrad.addColorStop(0.5, "#FFF0A0");
  ringGrad.addColorStop(0.75, "#FFD060");
  ringGrad.addColorStop(1, "#7A5010");
  ctx.beginPath();
  ctx.arc(px, py, pr + 3, 0, Math.PI * 2);
  ctx.strokeStyle = ringGrad;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Outer soft ring
  ctx.beginPath();
  ctx.arc(px, py, pr + 16, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,184,0,0.12)";
  ctx.lineWidth = 8;
  ctx.stroke();

  // Name
  const nameText = s.name.trim() || "Your Name";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  fitText(ctx, nameText, W / 2, 706, 840,
    (sz) => `800 ${sz}px "Helvetica Now Display", "Helvetica", sans-serif`, 58, 26);

  const hasDesig = s.designation.trim().length > 0;

  // Designation
  if (hasDesig) {
    ctx.font = `400 30px "Helvetica Now Display", "Helvetica", sans-serif`;
    ctx.fillStyle = "rgba(255,200,60,0.88)";
    fitText(ctx, s.designation.trim(), W / 2, 758, 780,
      (sz) => `400 ${sz}px "Helvetica Now Display", "Helvetica", sans-serif`, 30, 20);
  }

  const divY = hasDesig ? 798 : 752;

  // Gold divider
  const dg = ctx.createLinearGradient(W / 2 - 80, 0, W / 2 + 80, 0);
  dg.addColorStop(0, "transparent");
  dg.addColorStop(0.5, "rgba(255,184,0,0.62)");
  dg.addColorStop(1, "transparent");
  ctx.fillStyle = dg;
  ctx.fillRect(W / 2 - 80, divY, 160, 1.5);

  const tY = divY + 52;

  // Tagline
  ctx.font = `400 22px "Helvetica", sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.44)";
  ctx.fillText("Asia's First Multi Domain AI and Innovation Summit", W / 2, tY);

  // Footer
  ctx.font = `700 20px "Helvetica", sans-serif`;
  ctx.fillStyle = "rgba(255,184,0,0.72)";
  ctx.fillText("PC Hotel, Karachi  ·  June 7, 2026  ·  khinext.com", W / 2, tY + 46);

  // Bottom gold accent
  ctx.fillStyle = "rgba(255,184,0,0.03)";
  ctx.fillRect(0, 940, W, H - 940);

  const bg = ctx.createLinearGradient(0, 0, W, 0);
  bg.addColorStop(0, "transparent");
  bg.addColorStop(0.5, "rgba(255,184,0,0.78)");
  bg.addColorStop(1, "transparent");
  ctx.fillStyle = bg;
  ctx.fillRect(0, H - 3, W, 3);
}

// ── Main component ─────────────────────────────────────────────

export function CardGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<CardState>({
    template: "standard",
    name: "",
    designation: "",
    photoDataUrl: null,
  });
  const [downloading, setDownloading] = useState(false);
  const [shared, setShared] = useState(false);
  const [fmt, setFmt] = useState<"jpeg" | "png">("jpeg");

  const redraw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    if (state.template === "standard") await drawStandard(ctx, state);
    else await drawVip(ctx, state);
  }, [state]);

  useEffect(() => { redraw(); }, [redraw]);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setState(s => ({ ...s, photoDataUrl: ev.target?.result as string }));
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
    const url = canvas.toDataURL(mime, fmt === "jpeg" ? 0.96 : undefined);
    const a = document.createElement("a");
    a.href = url;
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
          await navigator.share({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(({ files: [file] } as any)),
            title: "I'm attending KHINEXT '26 — Asia's First Multi Domain AI Summit",
          });
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

  const isVip = state.template === "vip";
  const accentColor = isVip ? "#FFB800" : "#316BFF";
  const accentMuted = isVip ? "rgba(255,184,0,0.22)" : "rgba(49,107,255,0.22)";

  return (
    <div className="max-w-page mx-auto px-6 md:px-14 py-12 md:py-16">

      {/* Header */}
      <header className="mb-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-4">
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

      {/* Template tabs */}
      <div role="tablist" className="inline-flex gap-1 rounded-full bg-white/[0.04] border border-white/10 p-1 mb-10">
        <button
          role="tab"
          aria-selected={!isVip}
          onClick={() => setState(s => ({ ...s, template: "standard" }))}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            !isVip ? "bg-khi-blue text-white shadow-lg" : "text-white/50 hover:text-white"
          }`}
        >
          Standard
        </button>
        <button
          role="tab"
          aria-selected={isVip}
          onClick={() => setState(s => ({ ...s, template: "vip" }))}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            isVip ? "text-white shadow-lg" : "text-white/50 hover:text-white"
          }`}
          style={isVip ? { background: "linear-gradient(135deg, #5C3D00, #B8860B, #5C3D00)" } : {}}
        >
          ✦ VIP Delegate
        </button>
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">

        {/* ── Controls ── */}
        <div className="space-y-4">

          {/* Photo upload */}
          <div className="kx-card !p-6 !rounded-2xl">
            <p className="kx-label block mb-3">Your Photo</p>

            {state.photoDataUrl ? (
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2"
                  style={{ borderColor: accentColor }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={state.photoDataUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/75">Photo uploaded</p>
                  <p className="text-xs text-white/35 mt-0.5">Cropped to circle on the card</p>
                </div>
                <button
                  onClick={removePhoto}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/35 hover:text-white flex-shrink-0"
                  aria-label="Remove photo"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center gap-3 py-8 rounded-xl border-2 border-dashed border-white/12 hover:border-white/25 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: accentMuted }}>
                  <Upload size={20} style={{ color: accentColor }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/65 group-hover:text-white transition-colors">Upload Photo</p>
                  <p className="text-xs text-white/30 mt-1">JPG or PNG · Best results with a headshot</p>
                </div>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handlePhotoUpload}
            />
          </div>

          {/* Name */}
          <div className="kx-card !p-6 !rounded-2xl">
            <label htmlFor="card-name" className="kx-label block mb-2">Your Name</label>
            <input
              id="card-name"
              type="text"
              value={state.name}
              onChange={e => setState(s => ({ ...s, name: e.target.value }))}
              placeholder="Dr. Ayesha Khan"
              maxLength={50}
              className="kx-input w-full rounded-xl"
            />
          </div>

          {/* Designation — VIP only */}
          {isVip && (
            <div
              className="kx-card !p-6 !rounded-2xl"
              style={{ borderColor: "rgba(255,184,0,0.18)" }}
            >
              <label
                htmlFor="card-designation"
                className="block mb-2 text-[11px] font-bold uppercase"
                style={{ color: "#FFB800", letterSpacing: "0.14em" }}
              >
                Designation / Title
              </label>
              <input
                id="card-designation"
                type="text"
                value={state.designation}
                onChange={e => setState(s => ({ ...s, designation: e.target.value }))}
                placeholder="CEO · AI Research Director"
                maxLength={55}
                className="kx-input w-full rounded-xl"
                style={{ borderColor: "rgba(255,184,0,0.20)" }}
              />
              <p className="text-xs text-white/32 mt-2">Appears in gold below your name</p>
            </div>
          )}

          {/* Card contents summary */}
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

          {/* Format selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">Format:</span>
            <div className="inline-flex gap-0.5 rounded-full bg-white/[0.05] border border-white/10 p-0.5">
              {(["jpeg", "png"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFmt(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors ${
                    fmt === f ? "bg-white/15 text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="kx-btn kx-btn-primary w-full justify-center disabled:opacity-60"
          >
            <Download size={16} />
            {downloading ? "Generating…" : `Download ${fmt.toUpperCase()}`}
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="kx-btn kx-btn-outline w-full justify-center"
          >
            {shared ? <Check size={16} /> : <Share2 size={16} />}
            {shared ? "Shared!" : "Share via device"}
          </button>

          {/* Social share row */}
          <div>
            <p className="text-xs text-white/30 text-center mb-3">Share on</p>
            <div className="flex items-stretch gap-2">
              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://khinext.com/card-generator")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/12 hover:border-[#0077B5] hover:bg-[#0077B5]/10 transition-all text-xs text-white/45 hover:text-white font-medium"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://khinext.com/card-generator")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/12 hover:border-[#1877F2] hover:bg-[#1877F2]/10 transition-all text-xs text-white/45 hover:text-white font-medium"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>

              {/* Instagram — download + tip */}
              <button
                onClick={handleDownload}
                title="Download then share on Instagram"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/12 hover:border-[#E1306C] hover:bg-[#E1306C]/10 transition-all text-xs text-white/45 hover:text-white font-medium"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </button>
            </div>
            <p className="text-[11px] text-white/22 text-center mt-2">
              Instagram: download the card, then post from the app
            </p>
          </div>
        </div>

        {/* ── Canvas Preview ── */}
        <div className="sticky top-6">
          <p className="text-xs text-white/30 text-center mb-3">
            Live preview · 1080 × 1080 px
          </p>
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              boxShadow: isVip
                ? "0 0 80px rgba(255,184,0,0.14), 0 0 0 1px rgba(255,184,0,0.12)"
                : "0 0 80px rgba(49,107,255,0.14), 0 0 0 1px rgba(49,107,255,0.12)",
            }}
          >
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
          <p className="text-[11px] text-white/22 text-center mt-3">
            1080 × 1080 · Optimised for LinkedIn, Instagram &amp; Facebook
          </p>
        </div>
      </div>
    </div>
  );
}
