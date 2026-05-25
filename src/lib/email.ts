/**
 * Transactional email — now sent via SMTP (nodemailer) instead of Resend.
 * Server-only — never import from a client component.
 */
import nodemailer from "nodemailer";
import { renderKhinextEmail, type KhinextEmailParams } from "./email/layout";

function createTransport() {
  const host = process.env.SMTP_HOST ?? "mail.khinext.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER ?? "info@khinext.com";
  const pass = process.env.SMTP_PASS;
  if (!pass) throw new Error("SMTP_PASS is not configured.");
  return nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

const FROM_ADDRESS = process.env.SMTP_USER ?? "info@khinext.com";
const FROM = `Khinext '26 <${FROM_ADDRESS}>`;

export interface SendKhinextEmailParams extends KhinextEmailParams {
  to: string | string[];
  subject: string;
  text?: string;
}

export async function sendKhinextEmail(p: SendKhinextEmailParams) {
  const transport = createTransport();
  const html = renderKhinextEmail(p);
  const text = p.text ?? stripHtml(p.body);
  return transport.sendMail({
    from: FROM,
    to: Array.isArray(p.to) ? p.to.join(", ") : p.to,
    replyTo: FROM_ADDRESS,
    subject: p.subject,
    html,
    text,
  });
}

// ─────────────────────────────────────────────────────────────
// Registration confirmation
// ─────────────────────────────────────────────────────────────

interface RegistrationConfirmationParams {
  to: string;
  fullName: string;
  registrationId: string;
  track: string;
  role: string;
  resend?: boolean;
}

export async function sendRegistrationConfirmation(p: RegistrationConfirmationParams) {
  const shortId = `R-${p.registrationId.slice(0, 8).toUpperCase()}`;
  return sendKhinextEmail({
    to: p.to,
    subject: `You're confirmed for Khinext '26 — ${p.track}`,
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
      { label: "Attendee",        value: p.fullName },
      { label: "Track",           value: p.track },
      { label: "Role",            value: p.role },
      { label: "Event",           value: "Sat · 7 June 2026 · Karachi" },
    ],
    footerNote: "You're receiving this because you registered for Khinext '26.",
  });
}

// ─────────────────────────────────────────────────────────────
// AI Expo submission decision email
// ─────────────────────────────────────────────────────────────

interface SubmissionDecisionParams {
  to: string;
  fullName: string;
  projectName: string;
  decision: "approved" | "rejected";
  note?: string | null;
}

export async function sendSubmissionDecision(p: SubmissionDecisionParams) {
  const approved = p.decision === "approved";
  return sendKhinextEmail({
    to: p.to,
    subject: approved
      ? `Your AI Expo submission is approved — Khinext '26`
      : `Update on your AI Expo submission — Khinext '26`,
    preheader: approved
      ? `Congratulations! "${p.projectName}" has been approved for Khinext '26 AI Expo.`
      : `We reviewed your submission "${p.projectName}" for Khinext '26.`,
    eyebrow: approved ? "AI Expo · Approved" : "AI Expo · Update",
    headline: approved
      ? `Your project is <em data-accent>approved.</em>`
      : `Submission <em data-accent>reviewed.</em>`,
    greeting: `Hi <strong style="color:#040B1C">${escapeHtml(p.fullName)}</strong>,`,
    body: approved
      ? `
        <p style="margin:0 0 18px">Congratulations — your project <strong style="color:#040B1C">"${escapeHtml(p.projectName)}"</strong> has been approved for the <strong style="color:#040B1C">Khinext '26 AI Expo</strong>!</p>
        <p style="margin:0 0 18px">Our team will be in touch with next steps, including setup details and your allocated showcase slot. Get ready to present to Pakistan's top investors, engineers, and decision-makers.</p>
        ${p.note ? `<p style="margin:0 0 18px"><strong style="color:#040B1C">Note from the team:</strong> ${escapeHtml(p.note)}</p>` : ""}
      `
      : `
        <p style="margin:0 0 18px">Thank you for submitting <strong style="color:#040B1C">"${escapeHtml(p.projectName)}"</strong> to the Khinext '26 AI Expo. After review, we're unable to include this project in the current cohort.</p>
        <p style="margin:0 0 18px">We encourage you to keep building — Khinext '26 is about the journey as much as the showcase. Stay connected for future opportunities.</p>
        ${p.note ? `<p style="margin:0 0 18px"><strong style="color:#040B1C">Feedback:</strong> ${escapeHtml(p.note)}</p>` : ""}
      `,
    details: [
      { label: "Project",  value: p.projectName },
      { label: "Decision", value: approved ? "✓ Approved" : "✗ Not selected" },
      { label: "Event",    value: "Sat · 7 June 2026 · Karachi" },
    ],
    footerNote: "You're receiving this because you submitted a project to Khinext '26 AI Expo.",
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
