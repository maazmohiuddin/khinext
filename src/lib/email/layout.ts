/**
 * Khinext '26 — master email layout.
 * Pass variant:"vip" to get gold accents throughout.
 */

export interface EmailDetailRow {
  label: string;
  value: string;
}

export interface EmailCTAButton {
  label: string;
  url: string;
}

export interface KhinextEmailParams {
  preheader: string;
  eyebrow: string;
  headline: string;
  greeting?: string;
  body: string;
  details?: EmailDetailRow[];
  cta?: EmailCTAButton;
  signoff?: string;
  signature?: string;
  footerNote?: string;
  /** "vip" renders gold glows, eyebrow, accents and CTA. Default: "standard" (blue). */
  variant?: "standard" | "vip";
}

const DEFAULTS = {
  signoff:      "See you in Karachi,",
  signature:    "The Khinext '26 Team",
  footerNote:   "You're receiving this because you interacted with Khinext '26.",
  brandHomeUrl: "https://khinext.vercel.app",
};

export function renderKhinextEmail(p: KhinextEmailParams): string {
  const vip = p.variant === "vip";

  // Colour palette
  const glowRgb1  = vip ? "201,148,10"  : "49,107,255";   // header glow inner
  const glowRgb2  = vip ? "201,148,10"  : "49,107,255";   // header glow outer
  const lightAccent = vip ? "#FFB800"   : "#8FAFFF";       // eyebrow, em, logo text
  const chipBg    = vip ? "#96700A"     : "#316BFF";        // brand "K" chip + CTA bg
  const ctaBg     = vip ? "#96700A"     : "#316BFF";        // CTA button

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${esc(p.eyebrow)} — Khinext '26</title>
<style>
  body, table, td, p { margin:0; padding:0; }
  table, td { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { display:block; border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { text-decoration:none; }
  a[data-accent], em[data-accent] {
    color:${lightAccent} !important;
    font-style:italic !important;
    font-weight:900 !important;
  }
  @media only screen and (max-width:620px){
    .kx-container { width:100% !important; max-width:100% !important; }
    .kx-px { padding-left:24px !important; padding-right:24px !important; }
    .kx-h1 { font-size:30px !important; line-height:1.08 !important; }
    .kx-btn { display:block !important; width:100% !important; box-sizing:border-box !important; }
  }
  @media (prefers-color-scheme: dark){
    .kx-light-bg { background:#0c1226 !important; }
    .kx-body-text { color:#cdd4e8 !important; }
    .kx-headline-dark { color:#FFFFFF !important; }
    .kx-divider { border-color:#1c2540 !important; }
    .kx-details-bg { background:#0c1226 !important; border-color:#2a3358 !important; }
    .kx-details-label { color:#8a93b3 !important; }
    .kx-details-value { color:#FFFFFF !important; }
    .kx-footer-bg { background:#0c1226 !important; color:#7a83a0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#02040A;color:#0F1626;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#02040A">${esc(p.preheader)}</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#02040A">
<tr><td align="center" style="padding:40px 16px">
  <table role="presentation" class="kx-container" cellpadding="0" cellspacing="0" border="0" width="600"
         style="width:600px;max-width:600px;background:#FFFFFF;border-radius:18px;overflow:hidden;
                box-shadow:0 30px 80px rgba(0,0,0,.45)">

    <!-- Hero header -->
    <tr><td class="kx-px" style="
      background:#040B1C;
      background-image:
        radial-gradient(ellipse 60% 80% at 80% 0%,rgba(${glowRgb1},.48) 0%,rgba(4,11,28,0) 60%),
        radial-gradient(ellipse 60% 80% at 20% 100%,rgba(${glowRgb2},.30) 0%,rgba(4,11,28,0) 60%);
      padding:40px 44px 52px">
      ${renderBrandLockup(lightAccent, chipBg)}
      <div style="margin-top:28px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:${lightAccent}">${esc(p.eyebrow)}</div>
      <h1 class="kx-h1" style="margin:12px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:38px;line-height:1.04;letter-spacing:-0.03em;font-weight:900;color:#FFFFFF">${p.headline}</h1>
    </td></tr>

    <!-- Body -->
    <tr><td class="kx-px kx-light-bg kx-body-text" style="padding:40px 44px 8px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#2A3245;background:#FFFFFF">
      ${p.greeting ? `<p style="margin:0 0 18px">${p.greeting}</p>` : ""}
      <div>${p.body}</div>

      ${p.details ? renderDetails(p.details) : ""}
      ${p.cta ? renderCTA(p.cta, ctaBg) : ""}

      <div class="kx-divider" style="margin-top:28px;padding-top:18px;border-top:1px solid #E4EAF6;font-size:13px;color:#6C7894">
        ${esc(p.signoff ?? DEFAULTS.signoff)}<br>
        <strong class="kx-headline-dark" style="color:#040B1C">${esc(p.signature ?? DEFAULTS.signature)}</strong><br>
        <span style="font-size:12px">Pakistan's first multi-domain AI Summit · Karachi, 7 June 2026</span>
      </div>
    </td></tr>

    <!-- Footer -->
    <tr><td class="kx-footer-bg" style="background:#F4F7FE;padding:22px 44px;text-align:center;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#6C7894;line-height:1.6">
      © 2026 Khinext. Pakistan's first multi-domain AI Summit.<br>
      <span style="color:#9AA4BD">INNOVATE · INSPIRE · IMPACT</span>
    </td></tr>
  </table>

  <p style="margin:24px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:rgba(255,255,255,.32);max-width:600px">${esc(p.footerNote ?? DEFAULTS.footerNote)}</p>
</td></tr>
</table>
</body></html>`;
}

// ── partials ──────────────────────────────────────────────────

function renderBrandLockup(lightAccent: string, chipBg: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding-right:12px;vertical-align:middle">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="36" height="36" style="background:${chipBg};border-radius:10px">
          <tr><td align="center" valign="middle" style="height:36px;width:36px;color:#fff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:900;font-size:18px;line-height:1">K</td></tr>
        </table>
      </td>
      <td style="vertical-align:middle;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:#FFFFFF;letter-spacing:-0.02em">Khi<em style="color:${lightAccent};font-style:italic;font-weight:800">next</em></td>
    </tr>
  </table>`;
}

function renderDetails(rows: EmailDetailRow[]): string {
  const trs = rows.map((r, i) => {
    const last = i === rows.length - 1;
    const border = last ? "" : "border-bottom:1px dashed #DEE6FA";
    return `<tr>
      <td class="kx-details-label" style="padding:6px 0;color:#6C7894;${border}">${esc(r.label)}</td>
      <td align="right" class="kx-details-value" style="padding:6px 0;color:#040B1C;font-weight:700;${border}">${esc(r.value)}</td>
    </tr>`;
  }).join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="kx-details-bg" style="margin:24px 0;background:#F4F7FE;border:1px solid #DEE6FA;border-radius:12px">
    <tr><td style="padding:18px 22px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px">
        ${trs}
      </table>
    </td></tr>
  </table>`;
}

function renderCTA(cta: EmailCTAButton, bg: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px">
    <tr><td>
      <a href="${esc(cta.url)}" class="kx-btn"
         style="display:inline-block;background:${bg};color:#FFFFFF;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.01em;padding:14px 28px;border-radius:999px;text-decoration:none">${esc(cta.label)} →</a>
    </td></tr>
  </table>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
