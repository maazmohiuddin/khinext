"use client";

import { ReactNode, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Radio,
  LayoutDashboard,
  Users,
  FileCheck2,
  IdCard,
  Mail,
  Inbox,
  Send,
  ShieldCheck,
  Share2,
  Zap,
  Database,
  Layers,
  Eye,
  CheckCircle2,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Motion helpers
   ───────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

function Rise({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <div className="max-w-[720px] mb-14 md:mb-20">
      <Rise>
        <div className="flex items-center gap-4 mb-5">
          <span className="font-display text-sm font-extrabold text-khi-blue tabular-nums">{index}</span>
          <span className="kx-eyebrow">{eyebrow}</span>
        </div>
      </Rise>
      <Rise delay={0.06}>
        <h2
          className="font-display font-extrabold text-white text-[clamp(30px,4.6vw,54px)]"
          style={{ letterSpacing: "-0.045em", lineHeight: 1.03 }}
        >
          {title}
        </h2>
      </Rise>
      {intro && (
        <Rise delay={0.12}>
          <p className="mt-5 text-white/55 text-[15px] md:text-lg leading-relaxed">{intro}</p>
        </Rise>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Content data
   ───────────────────────────────────────────────────────── */

const STACK = [
  { icon: Layers, label: "Next.js 14", sub: "App Router · RSC" },
  { icon: Database, label: "Supabase", sub: "Postgres · Auth · Realtime · Storage" },
  { icon: Zap, label: "Framer Motion", sub: "Motion & scroll design" },
  { icon: Mail, label: "SMTP · IMAP · Gmail", sub: "Full mail pipeline" },
  { icon: ShieldCheck, label: "Row-Level Security", sub: "Postgres RLS gates" },
  { icon: LayoutDashboard, label: "TypeScript · Tailwind", sub: "Typed end-to-end" },
];

const USER_FLOWS = [
  {
    icon: Users,
    title: "Register for the event",
    desc: "A track-aware signup — AI Expo, Gaming Arena, both, or VIP/Sponsor — with organisation, role and referral capture. Writes straight to Postgres and surfaces live on the admin dashboard.",
    steps: ["Pick a track", "Enter details", "Instant confirmation", "Admin notified live"],
  },
  {
    icon: FileCheck2,
    title: "Submit an AI project",
    desc: "Open to individuals, student teams and companies. Category, description, team size and a file upload to Supabase Storage — queued for review with the top 50 winning a demo booth.",
    steps: ["Project details", "Upload deck / file", "Enters review queue", "Approve / reject"],
  },
  {
    icon: IdCard,
    title: "Generate a digital card",
    desc: "Attendees personalise a branded attendance card and share it to LinkedIn, Facebook and Instagram. Each card gets a slug, an OG share route and view tracking.",
    steps: ["Personalise", "Pick template", "Get share link", "Post to socials"],
  },
  {
    icon: ShieldCheck,
    title: "VIP access validation",
    desc: "A server-side gate matches an email against registrations and delivered invitations to resolve a verification tier — VIP, attendee or community — protecting exclusive flows.",
    steps: ["Enter email", "Server match", "Tier resolved", "Access granted"],
  },
];

const ADMIN_FEATURES = [
  {
    icon: Radio,
    title: "Realtime everything",
    desc: "One Supabase channel subscribes to submissions, registrations, card generations and inbox messages. New activity animates in with a toast — no refresh, ever. A live badge shows socket health.",
  },
  {
    icon: FileCheck2,
    title: "Submission review",
    desc: "Filter by pending / approved / rejected, preview uploaded attachments, and approve or reject in one click. Decisions are timestamped and attributed to the reviewer.",
  },
  {
    icon: Users,
    title: "Registrations control",
    desc: "Confirm attendees, send confirmation emails, bulk-confirm, de-duplicate, and bulk-delete. Each row shows invitation history — times invited and email open counts.",
  },
  {
    icon: Share2,
    title: "Card analytics",
    desc: "Every generated card is logged with its template and slug so you can see exactly which designs are being shared and when.",
  },
];

const COMMS = [
  {
    icon: Send,
    title: "Invitation Mailer",
    desc: "Compose, validate and preview HTML campaigns, then send in controlled batches with full delivery history — a spam-safe bulk mailer built into the dashboard.",
  },
  {
    icon: Zap,
    title: "Agenda Blast",
    desc: "One-click batched delivery of the event agenda to every past invitee, with automatic dedup so no one is emailed twice. Custom-list and single-send modes for targeted resends.",
  },
  {
    icon: Inbox,
    title: "Unified inbox",
    desc: "Contact-form messages and real inbound email merge into one inbox via IMAP + Gmail sync. Reply inline with RFC-compliant threading, flag important, archive, and track read state.",
  },
  {
    icon: Eye,
    title: "Open tracking",
    desc: "A tracking-pixel route records opens per recipient, feeding the open counts shown against every registration and invitation.",
  },
];

const METRICS = [
  { value: "20+", label: "API routes" },
  { value: "4", label: "Realtime tables" },
  { value: "3", label: "Mail channels" },
  { value: "100%", label: "Typed in TS" },
];

/* ─────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────── */

export function Showcase() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // Scroll-progress bar
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // Hero parallax
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, reduced ? 0 : 120]);
  const heroFade = useTransform(heroProgress, [0, 0.8], [1, reduced ? 1 : 0]);

  return (
    <>
      {/* Scroll progress */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left bg-khi-blue"
        style={{ scaleX: progress, boxShadow: "0 0 16px rgba(49,107,255,0.7)" }}
      />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative isolate overflow-hidden min-h-[92vh] flex items-center border-b border-white/10 px-6 md:px-14 pt-28 pb-20"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 animate-grid-drift"
          style={{
            backgroundImage:
              "linear-gradient(rgba(49,107,255,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(49,107,255,0.13) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 75% 65% at 50% 35%, #000 0%, transparent 82%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 35%, #000 0%, transparent 82%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 50% 8%, rgba(49,107,255,0.22) 0%, transparent 60%)",
          }}
        />

        <motion.div className="max-w-page mx-auto w-full" style={{ y: heroY, opacity: heroFade }}>
          <motion.p
            className="kx-eyebrow mb-6"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            Case Study · Product & Engineering
          </motion.p>

          <motion.h1
            className="font-display font-extrabold text-white text-[clamp(48px,9vw,132px)]"
            style={{ letterSpacing: "-0.05em", lineHeight: 0.92 }}
            initial={reduced ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
          >
            Khinext <span className="kx-accent">&apos;26</span>
            <br />
            the platform.
          </motion.h1>

          <motion.p
            className="mt-8 max-w-[620px] text-white/60 text-base md:text-xl leading-relaxed"
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
          >
            Not just a landing page — a full event operating system. Public registration and
            submission flows, a realtime admin dashboard, and an end-to-end communications engine.
            Here&apos;s what I built, and why.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
          >
            <a href="#overview" className="kx-btn-primary">
              Explore the build
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <Link href="/" className="kx-btn-outline">
              View live site
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.div
            className="mt-14 flex flex-wrap gap-x-10 gap-y-4 text-sm"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              ["Role", "Design & Full-stack"],
              ["Year", "2026"],
              ["Type", "Event platform"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-white/35 text-[11px] font-bold uppercase tracking-[0.16em] mb-1">{k}</div>
                <div className="text-white/80">{v}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── 01 · Overview / Why ──────────────────────────── */}
      <section id="overview" className="kx-section">
        <SectionHead
          index="01"
          eyebrow="The challenge"
          title={<>Why a landing page <span className="kx-accent">wasn&apos;t enough.</span></>}
          intro={
            <>
              Khinext &apos;26 was billed as Pakistan&apos;s first multi-domain AI Summit — 10,000+
              attendees, 100+ speakers, an AI Expo, a Gaming Arena and an invite-only Investor Arena.
              An event at that scale needs to <em>capture</em>, <em>review</em>, <em>communicate</em>{" "}
              and <em>operate</em> — all in one place. So I built the whole stack around three pillars.
            </>
          }
        />
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              n: "Capture",
              d: "Registration, project submissions and digital cards — every touchpoint writes to a single source of truth.",
              icon: Users,
            },
            {
              n: "Operate",
              d: "A realtime admin dashboard so the team sees registrations, submissions and messages the instant they land.",
              icon: LayoutDashboard,
            },
            {
              n: "Communicate",
              d: "A built-in mail engine: bulk invites, agenda blasts and a unified inbox synced from real email.",
              icon: Mail,
            },
          ].map((p, i) => (
            <Rise key={p.n} delay={i * 0.08}>
              <div className="kx-card h-full">
                <p.icon size={22} className="text-khi-blue mb-5" aria-hidden="true" />
                <h3 className="font-display text-xl font-bold text-white mb-2">{p.n}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.d}</p>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      {/* ── 02 · Stack ───────────────────────────────────── */}
      <section className="kx-section pt-0">
        <SectionHead
          index="02"
          eyebrow="Architecture"
          title={<>A modern, typed <span className="kx-accent">full stack.</span></>}
          intro="Server components for fast public pages, client islands for interactive dashboards, and Supabase doing the heavy lifting — auth, realtime and storage — behind row-level security."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {STACK.map((s, i) => (
            <Rise key={s.label} delay={(i % 3) * 0.06}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-full transition-colors duration-300 hover:border-khi-blue/40">
                <s.icon size={20} className="text-khi-blue mb-4" aria-hidden="true" />
                <div className="font-display font-bold text-white">{s.label}</div>
                <div className="text-white/40 text-xs mt-1">{s.sub}</div>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      {/* ── 03 · User flows ──────────────────────────────── */}
      <section className="relative border-y border-white/10 bg-khi-ink-soft">
        <div className="kx-section">
          <SectionHead
            index="03"
            eyebrow="Attendee experience"
            title={<>Four public <span className="kx-accent">flows.</span></>}
            intro="Every visitor-facing journey was designed to be a few taps from intent to done — and each one quietly feeds the admin dashboard in realtime."
          />
          <div className="grid md:grid-cols-2 gap-5">
            {USER_FLOWS.map((f, i) => (
              <Rise key={f.title} delay={(i % 2) * 0.08}>
                <div className="kx-card h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-khi-blue/12 border border-khi-blue/25">
                      <f.icon size={20} className="text-khi-blue" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-lg font-bold text-white">{f.title}</h3>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">{f.desc}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-1.5 gap-y-2">
                    {f.steps.map((step, si) => (
                      <span key={step} className="inline-flex items-center gap-1.5">
                        <span className="text-[12px] text-white/70 bg-white/[0.05] border border-white/10 rounded-full px-3 py-1">
                          {step}
                        </span>
                        {si < f.steps.length - 1 && (
                          <ArrowRight size={12} className="text-khi-blue/60" aria-hidden="true" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 · Admin dashboard ─────────────────────────── */}
      <section className="kx-section">
        <SectionHead
          index="04"
          eyebrow="The control room"
          title={<>A dashboard that&apos;s <span className="kx-accent">alive.</span></>}
          intro="The admin side is where the platform earns its keep. Everything updates in realtime over a single Supabase channel — the moment someone registers, submits, or messages, it appears with a toast and animates into place."
        />

        {/* Mock dashboard bar */}
        <Rise>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden mb-10">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-white/[0.02]">
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="ml-3 inline-flex items-center gap-1.5 text-[11px] text-emerald-300/80">
                <Radio size={11} className="animate-pulse" aria-hidden="true" /> Live
              </span>
              <span className="ml-auto text-[11px] text-white/30">admin · khinext &apos;26</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/[0.06]">
              {[
                ["Submissions", "#316BFF"],
                ["Pending", "#FFD06B"],
                ["Approved", "#51FFD5"],
                ["Registrations", "rgba(255,255,255,0.7)"],
                ["Cards", "#BF00FF"],
              ].map(([label, color], i) => (
                <div key={label} className="bg-khi-ink px-5 py-6">
                  <motion.div
                    className="font-display text-2xl md:text-3xl font-extrabold leading-none"
                    style={{ color }}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: EASE }}
                  >
                    ●
                  </motion.div>
                  <div className="mt-2 text-[10px] md:text-[11px] text-white/40">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </Rise>

        <div className="grid md:grid-cols-2 gap-5">
          {ADMIN_FEATURES.map((f, i) => (
            <Rise key={f.title} delay={(i % 2) * 0.08}>
              <div className="kx-card h-full">
                <f.icon size={22} className="text-khi-blue mb-4" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      {/* ── 05 · Communications engine ───────────────────── */}
      <section className="relative border-y border-white/10 bg-khi-ink-soft">
        <div className="kx-section">
          <SectionHead
            index="05"
            eyebrow="Communications engine"
            title={<>Email, <span className="kx-accent">built in.</span></>}
            intro="Rather than bolt on a third-party tool, the platform runs its own mail pipeline — outbound campaigns, agenda blasts with dedup, and a genuine two-way inbox synced over IMAP and the Gmail API."
          />
          <div className="grid md:grid-cols-2 gap-5">
            {COMMS.map((f, i) => (
              <Rise key={f.title} delay={(i % 2) * 0.08}>
                <div className="kx-card h-full">
                  <f.icon size={22} className="text-khi-blue mb-4" aria-hidden="true" />
                  <h3 className="font-display text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 · Metrics ─────────────────────────────────── */}
      <section className="kx-section">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {METRICS.map((m, i) => (
            <Rise key={m.label} delay={i * 0.08}>
              <div className="text-center md:text-left">
                <div
                  className="font-display font-extrabold text-white text-[clamp(40px,6vw,72px)] leading-none"
                  style={{ letterSpacing: "-0.05em" }}
                >
                  {m.value}
                </div>
                <div className="mt-3 text-white/45 text-sm">{m.label}</div>
              </div>
            </Rise>
          ))}
        </div>

        <Rise delay={0.1}>
          <ul className="mt-16 grid md:grid-cols-2 gap-x-10 gap-y-3 max-w-[820px]">
            {[
              "Row-level security policies gate every table by role",
              "Server-side verification tiers (VIP / attendee / community)",
              "Batched, deduped bulk mail with delivery + open tracking",
              "Realtime UI over a single multiplexed Supabase channel",
              "File uploads to Supabase Storage with signed access",
              "OG share routes for LinkedIn, Facebook & Instagram cards",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-white/60 text-sm leading-relaxed">
                <CheckCircle2 size={16} className="text-khi-blue mt-0.5 shrink-0" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </Rise>
      </section>

      {/* ── Closing CTA ──────────────────────────────────── */}
      <section className="relative overflow-hidden isolate border-t border-white/10 px-6 md:px-14 py-28 md:py-36">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(49,107,255,0.18) 0%, transparent 65%)",
          }}
        />
        <Rise>
          <div className="max-w-[680px] mx-auto text-center">
            <p className="kx-eyebrow justify-center mb-6">Thanks for scrolling</p>
            <h2
              className="font-display font-extrabold text-white text-[clamp(34px,5.5vw,68px)]"
              style={{ letterSpacing: "-0.045em", lineHeight: 1.02 }}
            >
              Explore the <span className="kx-accent">real thing.</span>
            </h2>
            <p className="mt-6 text-white/55 leading-relaxed max-w-[500px] mx-auto">
              The whole platform is live. Walk through the public flows, or reach out if you&apos;d
              like a guided tour of the admin dashboard.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/" className="kx-btn-primary animate-btn-glow">
                Visit the live site
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/contact" className="kx-btn-outline">
                Get in touch
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Rise>
      </section>
    </>
  );
}
