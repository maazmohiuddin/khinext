/**
 * "You Are Invited" — Khinext '26 invitation email.
 * Used for bulk invitation sends from the admin panel.
 * Params are exported so the admin UI can override any field.
 */
import { renderKhinextEmail, type KhinextEmailParams } from "./layout";

export const DEFAULT_CTA_URL = "https://khinext.vercel.app/register";
export const INVITATION_SUBJECT = "You're Invited — Khinext '26 · AI Summit · Karachi";

export const INVITATION_BODY_PARAMS: KhinextEmailParams = {
  preheader: "You're invited to Khinext '26 — Pakistan's first multi-domain AI Summit. Karachi, 7 June 2026.",
  eyebrow: "Exclusive · Invitation",
  headline: `You are <em data-accent>invited.</em>`,
  body: `
    <p style="margin:0 0 18px">We would like to personally invite you to <strong style="color:#040B1C">Khinext&nbsp;'26</strong> — Pakistan's first multi-domain AI Summit, bringing together the country's brightest minds in technology, business, and innovation.</p>
    <p style="margin:0 0 18px">This is a curated gathering of <strong style="color:#040B1C">builders, founders, researchers, and leaders</strong> who are shaping Pakistan's AI-driven future. Across seven innovation domains — from healthcare to fintech, creative tech to smart cities — Khinext '26 is where ideas become movements.</p>
    <p style="margin:0 0 18px">Your presence would make it exceptional. We've reserved a spot for you — all you need to do is claim it.</p>
  `,
  details: [
    { label: "Event",    value: "Khinext '26 — AI Summit" },
    { label: "Date",     value: "Saturday, 7 June 2026" },
    { label: "Location", value: "Karachi, Pakistan" },
    { label: "Format",   value: "In-Person · Multi-Domain" },
    { label: "Tracks",   value: "AI Expo · Gaming Arena · 7 Domains" },
  ],
  cta: {
    label: "Claim Your Spot",
    url: DEFAULT_CTA_URL,
  },
  signoff: "With excitement,",
  signature: "The Khinext '26 Team",
  footerNote: "You're receiving this invitation because you were personally selected to attend Khinext '26.",
};

export interface CustomInvitationParams {
  subject?: string;
  headline?: string;
  bodyText?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export function buildInvitationParams(custom?: CustomInvitationParams): KhinextEmailParams {
  const base = INVITATION_BODY_PARAMS;
  return {
    ...base,
    headline: custom?.headline
      ? `${custom.headline.includes("data-accent") ? custom.headline : `<em data-accent>${custom.headline}</em>`}`
      : base.headline,
    body: custom?.bodyText
      ? `<p style="margin:0 0 18px">${custom.bodyText}</p>`
      : base.body,
    cta: {
      label: custom?.ctaLabel ?? base.cta!.label,
      url: custom?.ctaUrl ?? DEFAULT_CTA_URL,
    },
  };
}

export function renderInvitationEmail(custom?: CustomInvitationParams): string {
  return renderKhinextEmail(buildInvitationParams(custom));
}
