export type SubmissionStatus = "pending" | "approved" | "rejected";

export type RegistrationTrack =
  | "ai_expo_only"
  | "gaming_only"
  | "ai_expo_and_gaming"
  | "vip_sponsor";

export interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  organisation: string | null;
  role: string;
  track: RegistrationTrack;
  referral: string | null;
  created_at: string;
  // Confirmation flow (migration 002)
  confirmed_at: string | null;
  confirmation_email_sent_at: string | null;
  confirmation_email_count: number;
  confirmed_by: string | null;
  admin_note: string | null;
}

export interface Submission {
  id: string;
  full_name: string;
  email: string;
  project: string;
  category: string;
  description: string;
  team_size: string | null;
  file_path: string | null;
  status: SubmissionStatus;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_note: string | null;
  created_at: string;
}

export interface CardShare {
  id: string;
  slug: string;
  name: string | null;
  template: string;
  designation: string | null;
  created_at: string;
}

export const DOMAINS = [
  { key: "health",    color: "#51FFD5", title: "AI in Health & Pharma",   desc: "AI-assisted diagnostics, drug discovery, telemedicine — built for low-bandwidth clinics in South Asia." },
  { key: "cities",    color: "#00EAEE", title: "Smart Cities",            desc: "Urban mobility, energy grids and civic infrastructure powered by real-time AI inference." },
  { key: "creative",  color: "#BF00FF", title: "Creative AI",             desc: "Generative art, music, writing tools and cultural heritage preservation through AI." },
  { key: "fintech",   color: "#FFB800", title: "Fintech Future",          desc: "Open finance APIs, fraud detection and micro-lending models for the unbanked." },
  { key: "devzone",   color: "#D4FF00", title: "DevZone",                 desc: "Developer tooling, code generation, MLOps and open-source from Pakistan's engineers." },
  { key: "lifestyle", color: "#FF0F4B", title: "Lifestyle Innovation",    desc: "AI in fashion, food, sports and wellness — consumer-facing products for the next billion." },
  { key: "investor",  color: "#E2E2E2", title: "Investor Arena",          desc: "Curated investment-ready startups presenting to 40+ active investors. Invite-only." },
] as const;

export const TRACK_LABELS: Record<RegistrationTrack, string> = {
  ai_expo_only: "AI Expo Only",
  gaming_only: "Gaming Arena Only",
  ai_expo_and_gaming: "AI Expo + Gaming",
  vip_sponsor: "VIP / Sponsor",
};
