/**
 * Resend wrapper + Khinext email templates.
 *
 * Server-only — never import from a client component.
 * All transactional emails inherit the shell in `lib/email/layout.ts`
 * so brand chrome (header, footer, dark gradient) stays consistent.
 */
import { Resend } from "resend";
import { renderKhinextEmail, type KhinextEmailParams } from "./email/layout";

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
// Generic send — re-export of the shell, for any one-off email
// ─────────────────────────────────────────────────────────────
export interface SendKhinextEmailParams extends KhinextEmailParams {
  to: string | string[];
  subject: string;
  /** Plain-text fallback (auto-generated from body if omitted). */
  text?: string;
  /** Optional Resend tag for analytics. */
  refId?: string;
}

export async function sendKhinextEmail(p: SendKhinextEmailParams) {
  const html = renderKhinextEmail(p);
  const text = p.text ?? stripHtml(p.body);
  return client().emails.send({
    from: FROM,
    to: p.to,
    replyTo: REPLY_TO,
    subject: p.subject,
    html,
    text,
    ...(p.refId ? { headers: { "X-Entity-Ref-ID": p.refId } } : {}),
  });
}

// ─────────────────────────────────────────────────────────────
// Registration confirmation (uses the shell)
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
  const shortId = `R-${p.registrationId.slice(0, 8).toUpperCase()}`;
  return sendKhinextEmail({
    to: p.to,
    subject: `You're confirmed for Khinext '26 — ${p.track}`,
    refId: p.registrationId,
    preheader: `${p.resend ? "[Resend] " : ""}Your slot at Khinext '26 is confirmed. Karachi, 7 June 2026.`,
    eyebrow: "Registration · Confirmed",
    headline: `Your slot is <em data-accent>confirmed.</em>`,
    greeting: `Hi <strong style="color:#040B1C">${escapeHtml(p.fullName)}</strong>,`,
    body: `
      <p style="margin:0 0 18px">You're officially registered for <strong style="color:#040B1C">Khinext '26</strong> — Pakistan's first multi-domain AI Summit. We can't wait to host you in Karachi.</p>
      <p style="margin:0 0 18px"><strong style="color:#040B1C">What's next?</strong> Save the date — Saturday, 7 June 2026. You'll receive a venue + agenda update closer to the event. If your plans change, reply to this email and we'll sort it out.</p>
    `,
    details: [
      { label: "Registration ID", value: shortId },
      { label: "Attendee", value: p.fullName },
      { label: "Track", value: p.track },
      { label: "Role", value: p.role },
      { label: "Event", value: "Sat · 7 June 2026 · Karachi" },
    ],
    footerNote: "You're receiving this because you registered for Khinext '26.",
  });
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
