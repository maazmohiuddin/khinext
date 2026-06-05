/**
 * "You Are Invited" — Khinext '26 invitation email.
 * Used for bulk invitation sends from the admin panel.
 */
import { renderKhinextEmail, renderAgendaBlock, type KhinextEmailParams } from "./layout";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://khinext.vercel.app").replace(/\/$/, "");

export const INVITATION_SUBJECT     = "You're Invited — Khinext '26 · AI Summit · Karachi";
export const VIP_INVITATION_SUBJECT = "Your VIP Invitation — Khinext '26 · AI Summit · Karachi";
export const AGENDA_SUBJECT         = "The Agenda is Live — Khinext '26 · AI Summit · Karachi";

/** Default CTA: standard card generator (no VIP access) */
export const DEFAULT_CTA_URL = `${SITE_URL}/card-generator`;

export const VIP_CARD_BODY =
  `As a personally selected VIP invitee, you have been given exclusive early access to generate your own personalised VIP Delegate card for Khinext '26. Your access link is unique to you and valid for 48 hours — use the button below to create and download your card.`;

export const STANDARD_BODY = `
  <p style="margin:0 0 18px">We would like to personally invite you to <strong style="color:#040B1C">Khinext&nbsp;'26</strong> — Pakistan's first multi-domain AI Summit, bringing together the country's brightest minds in technology, business, and innovation.</p>
  <p style="margin:0 0 18px">This is a curated gathering of <strong style="color:#040B1C">builders, founders, researchers, and leaders</strong> who are shaping Pakistan's AI-driven future. Across seven innovation domains — from healthcare to fintech, creative tech to smart cities — Khinext '26 is where ideas become movements.</p>
  <p style="margin:0 0 18px">Your presence would make it exceptional. We've reserved a spot for you — create your personalised attendance card and share it with the world.</p>
`;

// ── Standard (normal) invitation ──────────────────────────────

export const INVITATION_BODY_PARAMS: KhinextEmailParams = {
  variant: "standard",
  preheader: "You're invited to Khinext '26 — Pakistan's first multi-domain AI Summit. Karachi, 7 June 2026.",
  eyebrow: "Exclusive · Invitation",
  headline: `You are <em data-accent>invited.</em>`,
  body: STANDARD_BODY,
  details: [
    { label: "Event",    value: "Khinext '26 — AI Summit" },
    { label: "Date",     value: "Sunday, 7 June 2026" },
    { label: "Location", value: "Karachi, Pakistan" },
    { label: "Format",   value: "In-Person · Multi-Domain" },
    { label: "Tracks",   value: "AI Expo · Gaming Arena · 7 Domains" },
  ],
  cta: {
    label: "Create Your Attendance Card",
    url: DEFAULT_CTA_URL,
  },
  signoff: "With excitement,",
  signature: "The Khinext '26 Team",
  footerNote: "You're receiving this invitation because you were personally selected to attend Khinext '26.",
};

// ── VIP invitation ─────────────────────────────────────────────

export const VIP_INVITATION_BODY_PARAMS: KhinextEmailParams = {
  variant: "vip",
  preheader: "You've been selected as a VIP Delegate for Khinext '26. Your exclusive access link awaits.",
  eyebrow: "VIP · Exclusive Access",
  headline: `You are <em data-accent>VIP.</em>`,
  body: `<p style="margin:0 0 18px">${VIP_CARD_BODY}</p>`,
  details: [
    { label: "Event",    value: "Khinext '26 — AI Summit" },
    { label: "Date",     value: "Sunday, 7 June 2026" },
    { label: "Location", value: "Karachi, Pakistan" },
    { label: "Access",   value: "VIP Delegate · 48-hour link" },
  ],
  cta: {
    label: "Create Your VIP Card",
    url: DEFAULT_CTA_URL, // overridden per-recipient in send route
  },
  signoff: "With honour,",
  signature: "The Khinext '26 Team",
  footerNote: "This VIP invitation was personally sent to you. Your access link is unique and expires in 48 hours.",
};

// ── Builder / renderer ─────────────────────────────────────────

export interface CustomInvitationParams {
  subject?: string;
  headline?: string;
  bodyText?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  isVip?: boolean;
  includeAgenda?: boolean;
}

const SITE_URL_INV = (process.env.NEXT_PUBLIC_SITE_URL || "https://khinext.vercel.app").replace(/\/$/, "");

export function buildInvitationParams(custom?: CustomInvitationParams): KhinextEmailParams {
  const isVip = custom?.isVip === true;
  const base = isVip ? VIP_INVITATION_BODY_PARAMS : INVITATION_BODY_PARAMS;

  const mainBody = custom?.bodyText
    ? `<p style="margin:0 0 18px">${custom.bodyText}</p>`
    : base.body;

  const agendaSuffix = custom?.includeAgenda ? renderAgendaBlock() : "";

  // When agenda is included and no custom CTA, switch to a registration CTA
  const agendaCtaLabel = "Haven't registered yet? Register here";
  const agendaCtaUrl   = `${SITE_URL_INV}/register`;

  const ctaLabel = custom?.ctaLabel
    ?? (custom?.includeAgenda ? agendaCtaLabel : base.cta!.label);
  const ctaUrl = custom?.ctaUrl
    ?? (custom?.includeAgenda ? agendaCtaUrl : base.cta!.url);

  return {
    ...base,
    headline: custom?.headline
      ? (custom.headline.includes("data-accent")
          ? custom.headline
          : `<em data-accent>${custom.headline}</em>`)
      : base.headline,
    body: mainBody + agendaSuffix,
    cta: { label: ctaLabel, url: ctaUrl },
  };
}

export function renderInvitationEmail(custom?: CustomInvitationParams): string {
  return renderKhinextEmail(buildInvitationParams(custom));
}
