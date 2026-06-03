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

// ── Event Agenda block ────────────────────────────────────────

interface AgendaRow {
  num: string;
  time: string;
  session: string;
  speaker?: string;
  role?: string;
  /** left-edge accent colour */
  accent?: "blue" | "gold" | "red" | "teal" | "orange" | null;
}

const AGENDA_ROWS: AgendaRow[] = [
  { num: "01", time: "10:00 – 10:30", session: "Registration", accent: "blue" },
  { num: "02", time: "11:00 – 11:10", session: "Welcome Note / Opening Remarks", speaker: "Syed Wajid Hussain Shah", accent: "blue" },
  { num: "03", time: "11:15 – 11:25", session: "Protocol", speaker: "Syed Abdul Qadir", accent: null },
  { num: "04", time: "11:30 – 11:45", session: "Special Keynote", speaker: "Chief Guest Sardar M. Bux Khan Mahar", accent: "gold" },
  { num: "05", time: "11:50 – 12:00", session: "Keynote", speaker: "Mr. Munawar Mahesar", accent: "gold" },
  { num: "06", time: "12:05 – 12:15", session: "1st Speaker Session", speaker: "Raza Abbas", role: "CTO Unilever Pakistan", accent: "blue" },
  { num: "07", time: "12:20 – 12:45", session: "1st Panel Discussion", speaker: "How AI is Reshaping Attention...", accent: "red" },
  { num: "08", time: "12:50 – 1:10",  session: "1st Activity", accent: null },
  { num: "09", time: "1:15 – 1:30",   session: "1st Fireside Chat", speaker: "Saif Ali", role: "Founder [ Stealth ]", accent: "gold" },
  { num: "10", time: "1:35 – 1:45",   session: "2nd Speaker", speaker: "Umair Nizam", role: "Senior Vice Chairman P@sha", accent: "blue" },
  { num: "11", time: "1:50 – 2:00",   session: "3rd Speaker", speaker: "Khushnood Aftab", role: "CEO Viper Technologies", accent: "blue" },
  { num: "12", time: "2:05 – 2:30",   session: "2nd Panel Discussion", speaker: "How AI is Powering a Nation's Backbone", accent: "teal" },
  { num: "13", time: "2:35 – 2:50",   session: "Activity 2", accent: null },
  { num: "14", time: "2:55 – 3:05",   session: "4th Speaker", speaker: "Huma Yahya", role: "CEO ELFA (EV Technologies)", accent: "blue" },
  { num: "15", time: "3:10 – 3:25",   session: "2nd Fireside Chat", speaker: "Imran Batada", role: "CTO Unilever Pakistan", accent: "gold" },
  { num: "16", time: "3:30 – 3:40",   session: "5th Speaker", speaker: "Saad Zuberi", role: "CEO Luckyone", accent: "blue" },
  { num: "17", time: "3:45 – 4:05",   session: "6th Speaker", speaker: "Ansar Muhammad", role: "VP Engineering 10Pearls", accent: "blue" },
  { num: "18", time: "4:10 – 4:30",   session: "3rd Panel Discussion", speaker: "AI-Powered Pakistan: Building the Next Generation", accent: "orange" },
  { num: "19", time: "4:35 – 4:45",   session: "Closing & Thank You Note", accent: null },
  { num: "20", time: "4:50 – 5:10",   session: "Shield Distribution / Group Photo / Networking", accent: null },
];

const ACCENT_COLOR: Record<string, string> = {
  blue:   "#316BFF",
  gold:   "#FCBF17",
  red:    "#FF0F4B",
  teal:   "#00EAEE",
  orange: "#FF4D00",
};

export function renderAgendaBlock(): string {
  const rows = AGENDA_ROWS.map((r, i) => {
    const bg     = i % 2 === 0 ? "#0E1628" : "#080E1C";
    const accent = r.accent ? ACCENT_COLOR[r.accent] : "transparent";
    const numColor = r.accent ? ACCENT_COLOR[r.accent] : "rgba(49,107,255,0.4)";

    const speakerHtml = r.speaker
      ? `<br><span style="font-size:11px;font-weight:700;font-style:italic;color:#316BFF">${esc(r.speaker)}</span>${r.role ? `<span style="font-size:10px;color:#666;letter-spacing:.08em;text-transform:uppercase"> &nbsp;${esc(r.role)}</span>` : ""}`
      : "";

    return `<tr>
      <td style="width:4px;background:${accent};padding:0"></td>
      <td style="background:${bg};padding:10px 10px 10px 14px;border-bottom:1px solid #1a2236;white-space:nowrap">
        <span style="font-size:10px;font-weight:700;color:${numColor};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(r.num)}</span>
        <br><span style="font-size:12px;font-weight:600;color:#cdd4e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(r.time)}</span>
      </td>
      <td style="background:${bg};padding:10px 14px;border-bottom:1px solid #1a2236;border-left:1px solid #1a2236">
        <span style="font-size:13px;font-weight:700;color:#f0f4ff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(r.session)}${speakerHtml}</span>
      </td>
    </tr>`;
  }).join("");

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
       style="margin:32px 0 8px;border-radius:14px;overflow:hidden;border:1px solid #1a2236;background:#080E1C">
  <!-- Header -->
  <tr>
    <td colspan="3" style="background:#040B1C;padding:20px 18px 14px;border-bottom:2px solid #316BFF">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td>
            <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:20px;font-weight:900;color:#FFFFFF;letter-spacing:-0.03em">Event <em style="color:#316BFF;font-style:italic">Schedule</em></span><br>
            <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;color:#7a8ab0;letter-spacing:.18em;text-transform:uppercase">7th June 2026 &nbsp;·&nbsp; PC Hotel, Karachi</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- Col headers -->
  <tr>
    <td style="width:4px;background:#316BFF;padding:0"></td>
    <td style="background:#0c1530;padding:7px 10px 7px 14px;border-bottom:1px solid #1a2236">
      <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#316BFF">TIME</span>
    </td>
    <td style="background:#0c1530;padding:7px 14px;border-bottom:1px solid #1a2236;border-left:1px solid #1a2236">
      <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#316BFF">SESSION</span>
    </td>
  </tr>
  ${rows}
  <!-- Footer bar -->
  <tr>
    <td colspan="3" style="background:#316BFF;padding:6px 18px;text-align:center">
      <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;color:#FFFFFF;letter-spacing:.12em;text-transform:uppercase">Khinext '26 &nbsp;·&nbsp; Pakistan's First Multi-Domain AI Summit</span>
    </td>
  </tr>
</table>`;
}
