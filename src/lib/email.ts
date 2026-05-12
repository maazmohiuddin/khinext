/**
 * Resend wrapper + Khinext email templates.
 * Server-only — never import from a client component.
 */
import { Resend } from "resend";

let _client: Resend | null = null;
function client() {
  if (!_client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not configured.");
    _client = new Resend(key);
  }
  return _client;
}

const FROM = process.env.EMAIL_FROM ?? "Khinext '26 <info@khinext.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "info@khinext.com";

// ─────────────────────────────────────────────────────────────
// Registration confirmation
// ─────────────────────────────────────────────────────────────

interface RegistrationConfirmationParams {
  to: string;
  fullName: string;
  registrationId: string;
  track: string;
  role: string;
  resend?: boolean;  // true = include "this is a resend" preheader
}

export async function sendRegistrationConfirmation(p: RegistrationConfirmationParams) {
  const subject = `You're confirmed for Khinext '26 — ${p.track}`;
  const html = renderRegistrationConfirmationHTML(p);
  const text = renderRegistrationConfirmationText(p);
  return client().emails.send({
    from: FROM,
    to: p.to,
    replyTo: REPLY_TO,
    subject,
    html,
    text,
    headers: {
      "X-Entity-Ref-ID": p.registrationId,
    },
  });
}

function renderRegistrationConfirmationHTML(p: RegistrationConfirmationParams) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<title>Khinext '26 — registration confirmed</title>
<style>
  @media only screen and (max-width:620px){
    .container{width:100%!important;max-width:100%!important}
    .px{padding-left:24px!important;padding-right:24px!important}
    .h1{font-size:30px!important;line-height:1.1!important}
    .btn{display:block!important;width:100%!important;box-sizing:border-box!important}
  }
  a{color:#316BFF;text-decoration:none}
</style>
</head>
<body style="margin:0;padding:0;background:#02040A;color:#0F1626;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#02040A">
  ${p.resend ? "[Resend] " : ""}Your slot at Khinext '26 is confirmed. Karachi, March 2026.
</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#02040A">
<tr><td align="center" style="padding:40px 16px">
  <table role="presentation" class="container" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.45)">
    <tr><td class="px" style="background:#040B1C;background-image:radial-gradient(ellipse 60% 80% at 80% 0%,rgba(49,107,255,.5) 0%,rgba(4,11,28,0) 60%),radial-gradient(ellipse 60% 80% at 20% 100%,rgba(49,107,255,.32) 0%,rgba(4,11,28,0) 60%);padding:40px 44px 56px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-right:12px;vertical-align:middle">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="36" height="36" style="background:#316BFF;border-radius:10px">
              <tr><td align="center" valign="middle" style="height:36px;width:36px;color:#fff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:900;font-size:18px;line-height:1">K</td></tr>
            </table>
          </td>
          <td style="vertical-align:middle;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:#FFFFFF;letter-spacing:-0.02em">Khi<em style="color:#8FAFFF;font-style:italic;font-weight:800">next</em></td>
        </tr>
      </table>
      <div style="margin-top:28px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#8FAFFF">Registration · Confirmed</div>
      <h1 class="h1" style="margin:12px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:38px;line-height:1.04;letter-spacing:-0.03em;font-weight:900;color:#FFFFFF">
        Your slot is <em style="color:#8FAFFF;font-style:italic;font-weight:900">confirmed.</em>
      </h1>
    </td></tr>
    <tr><td class="px" style="padding:40px 44px 12px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#2A3245">
      <p style="margin:0 0 18px">Hi <strong style="color:#040B1C">${escapeHtml(p.fullName)}</strong>,</p>
      <p style="margin:0 0 18px">You're officially registered for <strong style="color:#040B1C">Khinext '26</strong> — Pakistan's first multi-domain AI Summit. We can't wait to host you in Karachi.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0;background:#F4F7FE;border:1px solid #DEE6FA;border-radius:12px">
        <tr><td style="padding:18px 22px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px">
            <tr><td style="padding:6px 0;color:#6C7894;border-bottom:1px dashed #DEE6FA">Registration ID</td><td align="right" style="padding:6px 0;color:#040B1C;font-weight:700;border-bottom:1px dashed #DEE6FA">R-${p.registrationId.slice(0,8).toUpperCase()}</td></tr>
            <tr><td style="padding:6px 0;color:#6C7894;border-bottom:1px dashed #DEE6FA">Attendee</td><td align="right" style="padding:6px 0;color:#040B1C;font-weight:700;border-bottom:1px dashed #DEE6FA">${escapeHtml(p.fullName)}</td></tr>
            <tr><td style="padding:6px 0;color:#6C7894;border-bottom:1px dashed #DEE6FA">Track</td><td align="right" style="padding:6px 0;color:#040B1C;font-weight:700;border-bottom:1px dashed #DEE6FA">${escapeHtml(p.track)}</td></tr>
            <tr><td style="padding:6px 0;color:#6C7894;border-bottom:1px dashed #DEE6FA">Role</td><td align="right" style="padding:6px 0;color:#040B1C;font-weight:700;border-bottom:1px dashed #DEE6FA">${escapeHtml(p.role)}</td></tr>
            <tr><td style="padding:6px 0;color:#6C7894">Event</td><td align="right" style="padding:6px 0;color:#040B1C;font-weight:700">Khinext '26, Karachi</td></tr>
          </table>
        </td></tr>
      </table>
      <p style="margin:0 0 18px"><strong style="color:#040B1C">What's next?</strong> Save the dates — March 2026, Karachi. You'll receive a venue + agenda update closer to the event. If your plans change, reply to this email and we'll sort it out.</p>
      <div style="margin-top:28px;padding-top:18px;border-top:1px solid #E4EAF6;font-size:13px;color:#6C7894">
        See you in Karachi,<br>
        <strong style="color:#040B1C">The Khinext '26 Team</strong><br>
        <span style="font-size:12px">Pakistan's first multi-domain AI Summit · Karachi, 2026</span>
      </div>
    </td></tr>
    <tr><td style="background:#F4F7FE;padding:22px 44px;text-align:center;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#6C7894;line-height:1.6">
      © 2026 Khinext. Pakistan's first multi-domain AI Summit.<br><span style="color:#9AA4BD">INNOVATE · INSPIRE · IMPACT</span>
    </td></tr>
  </table>
  <p style="margin:24px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:rgba(255,255,255,.32)">You're receiving this because you registered for Khinext '26.</p>
</td></tr>
</table>
</body></html>`;
}

function renderRegistrationConfirmationText(p: RegistrationConfirmationParams) {
  return `KHINEXT '26 — Registration confirmed

Hi ${p.fullName},

You're officially registered for Khinext '26 — Pakistan's first multi-domain AI Summit.

  Registration ID: R-${p.registrationId.slice(0, 8).toUpperCase()}
  Attendee:        ${p.fullName}
  Track:           ${p.track}
  Role:            ${p.role}
  Event:           Khinext '26, Karachi, March 2026

We'll send a venue + agenda update closer to the event. Reply to this email if your plans change.

See you in Karachi,
The Khinext '26 Team
`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
