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
  Eye,
  CheckCircle2,
  Check,
} from "lucide-react";
import { CodeBlock } from "./CodeBlock";

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
    <div className="max-w-[760px] mb-14 md:mb-20">
      <Rise>
        <div className="flex items-center gap-4 mb-5">
          <span className="font-mono text-sm font-bold text-khi-blue tabular-nums">{index}</span>
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

/* Small technical file-path style label, e.g. .CREATING_PERSONAS */
function MonoTag({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[13px] md:text-sm font-semibold tracking-tight text-white/70">
      <span className="text-khi-blue">.</span>
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   Flow-tree primitives (ref #3 — task flow / IA)
   ───────────────────────────────────────────────────────── */

function FlowNode({
  children,
  variant = "outline",
}: {
  children: ReactNode;
  variant?: "outline" | "filled" | "ghost";
}) {
  const base =
    "inline-flex items-center justify-center text-center rounded-lg px-4 py-2.5 text-[12px] md:text-[13px] font-medium leading-tight";
  const styles =
    variant === "filled"
      ? "bg-khi-blue text-white shadow-[0_8px_24px_rgba(49,107,255,0.4)]"
      : variant === "ghost"
      ? "bg-transparent border border-white/10 text-white/40"
      : "bg-white/[0.04] border border-khi-blue/40 text-white";
  return <span className={`${base} ${styles}`}>{children}</span>;
}

function VLine({ h = "h-7" }: { h?: string }) {
  return <span aria-hidden="true" className={`block w-px ${h} bg-white/15`} />;
}

/* ─────────────────────────────────────────────────────────
   Content data
   ───────────────────────────────────────────────────────── */

const IPD = [
  {
    tag: "IDEA",
    title: "An event operating system",
    body: "Give Khinext '26 more than a website — a single platform that captures every attendee, project and message, and runs the event day-to-day.",
  },
  {
    tag: "PROBLEM",
    title: "A landing page can't scale an event",
    body: "10,000+ attendees, 100+ speakers, an AI Expo and an invite-only Investor Arena. Registration, review, verification and mass communication were spread across tools that didn't talk to each other.",
  },
  {
    tag: "DECISION",
    title: "One typed, realtime platform",
    body: "Build capture (register / submit / cards), operations (a realtime admin dashboard) and communication (a built-in mail engine) on one Postgres source of truth — so the whole team sees the same live state.",
  },
];

const PERSONAS = [
  {
    initial: "A",
    name: "Ayesha, 21",
    role: "Student · AI Expo entrant",
    highlight: true,
    body: "Final-year CS student submitting her capstone AI project. She's on mobile, short on time, and anxious about whether her entry was received. Needs a dead-simple upload and a clear status.",
    traits: ["Simplicity", "Status clarity"],
  },
  {
    initial: "B",
    name: "Bilal, 34",
    role: "Founder · VIP / Sponsor",
    highlight: false,
    body: "Runs an early-stage startup and wants curated access to the Investor Arena. Expects a frictionless, credible VIP flow that proves his tier without a dozen emails back and forth.",
    traits: ["Trust", "Speed"],
  },
  {
    initial: "S",
    name: "Sana, 29",
    role: "Event operations lead",
    highlight: false,
    body: "Manages the whole event from one screen. Needs to see registrations and submissions the instant they arrive, review projects fast, and message thousands of people without leaving the dashboard.",
    traits: ["Realtime", "Reach"],
  },
];

const ATTENDEE_BRANCHES = [
  { title: "Register", items: ["Select track", "Enter details", "Confirmation", "→ live to admin"] },
  { title: "Submit project", items: ["Project details", "Upload file", "Review queue", "Approve / reject"] },
  { title: "Digital card", items: ["Personalise", "Pick template", "Get share slug", "Post to socials"] },
  { title: "Contact", items: ["Message", "Lands in inbox", "Admin reply", "Threaded"] },
];

const ADMIN_BRANCHES = [
  { title: "Submissions", items: ["Filter status", "Preview file", "Approve / reject"] },
  { title: "Registrations", items: ["Confirm", "Bulk / dedupe", "Send confirmation"] },
  { title: "Cards", items: ["Slug + template", "Share analytics"] },
  { title: "Inbox", items: ["IMAP + Gmail sync", "Reply / flag", "Archive"] },
];

const DECISIONS = [
  {
    icon: Radio,
    label: "REALTIME_OVER_POLLING",
    what: "One multiplexed Supabase channel streams INSERT / UPDATE / DELETE across four tables straight into React state, with toasts.",
    why: "At event scale, organizers need zero-latency awareness. Polling feels dead, wastes connections, and misses the moment a VIP registers.",
  },
  {
    icon: Users,
    label: "TRACK_FIRST_SIGNUP",
    what: "Registration opens with a track choice — AI Expo, Gaming, Both, or VIP/Sponsor — before any personal fields.",
    why: "The track routes the attendee's whole journey and tags the record for downstream verification and targeted email.",
  },
  {
    icon: ShieldCheck,
    label: "SERVER_SIDE_TIERS",
    what: "A verification tier (VIP / attendee / community) is resolved on the server by matching email against registrations and delivered invites.",
    why: "Exclusive flows can't trust the client. Deciding tier server-side keeps the gate honest and the UI simple.",
  },
  {
    icon: Mail,
    label: "OWN_THE_MAIL_PIPELINE",
    what: "SMTP send, IMAP + Gmail inbound sync, templating and open-tracking all live inside the app.",
    why: "Owning deliverability, threading and open data beats renting a SaaS that silos the very analytics the team needs.",
  },
  {
    icon: Zap,
    label: "BATCHED_DEDUPED_BLASTS",
    what: "The agenda blast sends in controlled batches, deduping recipients by lowercased email against prior sends.",
    why: "Protects domain reputation and guarantees no one is emailed twice — the fastest way to lose trust at scale.",
  },
  {
    icon: LayoutDashboard,
    label: "RLS_AT_THE_DATA_LAYER",
    what: "Postgres row-level security policies gate every table by role; the admin route is a second, not the only, line of defence.",
    why: "Security enforced at the database survives refactors, new routes and mistakes in the app layer.",
  },
];

const METRICS = [
  { value: "20+", label: "API routes" },
  { value: "4", label: "Realtime tables" },
  { value: "3", label: "Mail channels" },
  { value: "100%", label: "Typed in TS" },
];

const REGISTER_CODE = `// register/RegisterForm.tsx — track-first signup
const [form, setForm] = useState<FormState>({
  track: "ai_expo_and_gaming",   // sensible default
  role: "", email: "", fullName: "",
});

async function onSubmit(e) {
  e.preventDefault();
  const supabase = createClient();
  const { error } = await supabase
    .from("registrations")
    .insert({
      full_name: form.fullName,
      email: form.email.trim().toLowerCase(),
      role: form.role,
      track: form.track,          // routes the journey
    });

  // 23505 = unique violation -> already registered
  if (error?.code === "23505") {
    setError("This email is already registered.");
  }
}`;

const REALTIME_CODE = `// admin/AdminDashboard.tsx — one channel, four tables
useEffect(() => {
  const supabase = createClient();
  const channel = supabase
    .channel("admin-realtime")
    .on("postgres_changes",
      { event: "*", table: "registrations" },
      payload => {
        if (payload.eventType === "INSERT") {
          showToast(\`New registration\`);
          setRegistrations(c => [payload.new, ...c]);
        }
      })
    .subscribe(status => {
      if (status === "SUBSCRIBED") setLiveStatus("live");
    });

  return () => supabase.removeChannel(channel);
}, []);`;

const VIP_CODE = `// api/vip/validate/route.ts — server-side gate
const TOKEN_RE = /^[a-f0-9]{48}$/;

export async function GET(req: Request) {
  const token = new URL(req.url)
    .searchParams.get("token") ?? "";
  if (!TOKEN_RE.test(token)) {
    return NextResponse.json({ valid: false });
  }

  const svc = createServiceClient();  // bypasses RLS
  const { data } = await svc
    .from("vip_invite_tokens")
    .select("id, expires_at, redeemed_at")
    .eq("token", token)
    .single();

  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ valid: false });
  }
  return NextResponse.json({ valid: true });
}`;

const PAIRS = [
  {
    label: "SCREEN_01 · REGISTER",
    title: "Track-first registration",
    blurb: "The signup form defaults to a track and writes straight to Postgres. A unique-constraint code (23505) becomes a friendly 'already registered' message.",
    file: "src/app/register/RegisterForm.tsx",
    code: REGISTER_CODE,
    preview: "register" as const,
  },
  {
    label: "SCREEN_02 · ADMIN",
    title: "Realtime activity feed",
    blurb: "A single subscription fans out INSERT / UPDATE / DELETE across four tables into React state — new registrations appear instantly with a toast, no refresh.",
    file: "src/components/admin/AdminDashboard.tsx",
    code: REALTIME_CODE,
    preview: "dashboard" as const,
  },
  {
    label: "SCREEN_03 · VIP GATE",
    title: "Server-side validation",
    blurb: "VIP tokens are shape-checked, then verified and expiry-checked against the database with a service client — the browser never sees the logic.",
    file: "src/app/api/vip/validate/route.ts",
    code: VIP_CODE,
    preview: "vip" as const,
  },
];

/* ─────────────────────────────────────────────────────────
   Screen preview mockups (ref: browser-framed screens)
   ───────────────────────────────────────────────────────── */

function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-khi-ink-soft overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="ml-3 flex-1 text-center font-mono text-[10px] text-white/35 truncate">{url}</span>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );
}

function RegisterPreview() {
  return (
    <BrowserFrame url="khinext.app/register">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {["Full name", "Email"].map((l) => (
            <div key={l}>
              <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30 mb-1">{l}</div>
              <div className="h-8 rounded-lg bg-white/[0.04] border border-white/10" />
            </div>
          ))}
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30 mb-1.5">Track</div>
          <div className="flex flex-wrap gap-2">
            {[
              ["AI Expo", false],
              ["Gaming", false],
              ["AI Expo + Gaming", true],
              ["VIP / Sponsor", false],
            ].map(([t, active]) => (
              <span
                key={t as string}
                className={`text-[11px] rounded-full px-3 py-1.5 border ${
                  active
                    ? "bg-khi-blue/15 border-khi-blue/55 text-khi-blue-soft"
                    : "bg-white/[0.03] border-white/10 text-white/45"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="pt-2">
          <div className="h-10 rounded-full bg-khi-blue text-white text-[12px] font-medium grid place-items-center shadow-[0_8px_24px_rgba(49,107,255,0.4)]">
            Register for Khinext &apos;26
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function DashboardPreview() {
  const reduced = useReducedMotion();
  return (
    <BrowserFrame url="khinext.app/admin">
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-sm font-extrabold text-white">Khinext &apos;26</span>
        <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-300/80">
          <Radio size={10} className="animate-pulse" aria-hidden="true" /> Live
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          ["124", "Registrations", "#316BFF"],
          ["38", "Submissions", "#51FFD5"],
          ["61", "Cards", "#BF00FF"],
        ].map(([v, l, c]) => (
          <div key={l} className="rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2.5">
            <div className="font-display text-lg font-extrabold leading-none" style={{ color: c }}>
              {v}
            </div>
            <div className="mt-1 text-[9px] text-white/40">{l}</div>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        {[
          ["New registration · Ayesha K.", true],
          ["New submission · Vision-AI", false],
          ["New card · Bilal R.", false],
        ].map(([t, fresh], i) => (
          <motion.div
            key={t as string}
            className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-[11px] text-white/70"
            initial={reduced ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.4, ease: EASE }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${fresh ? "bg-khi-blue" : "bg-white/25"}`} />
            {t}
          </motion.div>
        ))}
      </div>
    </BrowserFrame>
  );
}

function VipPreview() {
  return (
    <BrowserFrame url="khinext.app/vip?token=…">
      <div className="text-center py-4">
        <div className="font-mono text-[10px] text-white/35 mb-4 truncate">GET /api/vip/validate?token=4f9a…c1</div>
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 border border-emerald-400/30 px-4 py-2 text-sm text-emerald-300">
          <ShieldCheck size={16} aria-hidden="true" />
          Verified VIP
        </span>
        <div className="mt-5 flex flex-col gap-1.5 max-w-[220px] mx-auto text-left">
          {[
            ["Token shape", true],
            ["Exists in DB", true],
            ["Not expired", true],
          ].map(([l, ok]) => (
            <div key={l as string} className="flex items-center justify-between text-[11px]">
              <span className="text-white/50">{l}</span>
              <Check size={13} className={ok ? "text-emerald-300" : "text-white/30"} aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

function ScreenPreview({ kind }: { kind: "register" | "dashboard" | "vip" }) {
  if (kind === "register") return <RegisterPreview />;
  if (kind === "dashboard") return <DashboardPreview />;
  return <VipPreview />;
}

/* ─────────────────────────────────────────────────────────
   Flow-tree section (shared render for attendee + admin)
   ───────────────────────────────────────────────────────── */

function FlowTree({
  spine,
  branches,
}: {
  spine: { label: string; variant: "outline" | "filled" }[];
  branches: { title: string; items: string[] }[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-10">
      {/* Spine */}
      <div className="flex flex-col items-center">
        {spine.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center">
            <FlowNode variant={s.variant}>{s.label}</FlowNode>
            {i < spine.length - 1 && <VLine />}
          </div>
        ))}
        <VLine />
      </div>

      {/* Branch */}
      <div className="relative">
        {/* horizontal connector across column centers (desktop) */}
        <span
          aria-hidden="true"
          className="hidden md:block absolute top-0 left-[12.5%] right-[12.5%] h-px bg-white/15"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {branches.map((b) => (
            <div key={b.title} className="flex flex-col items-center">
              <span aria-hidden="true" className="hidden md:block w-px h-5 bg-white/15" />
              <div className="mt-0 md:mt-3">
                <FlowNode variant="outline">{b.title}</FlowNode>
              </div>
              <ul className="mt-4 w-full space-y-1.5 pl-6 md:pl-8 relative">
                <span
                  aria-hidden="true"
                  className="absolute left-2 md:left-3 top-1 bottom-1 w-px border-l border-dashed border-white/15"
                />
                {b.items.map((it) => (
                  <li key={it} className="relative text-[11px] md:text-xs text-khi-blue-soft">
                    <span
                      aria-hidden="true"
                      className="absolute -left-4 md:-left-5 top-1/2 w-3 md:w-4 h-px bg-white/15"
                    />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────── */

export function Showcase() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

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
        className="relative isolate overflow-hidden min-h-[90vh] flex items-center border-b border-white/10 px-6 md:px-14 pt-28 pb-20"
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
            background: "radial-gradient(ellipse 55% 50% at 50% 8%, rgba(49,107,255,0.22) 0%, transparent 60%)",
          }}
        />

        <motion.div className="max-w-page mx-auto w-full" style={{ y: heroY, opacity: heroFade }}>
          <motion.div
            className="mb-6"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <MonoTag>UX_CASE_STUDY / KHINEXT_26</MonoTag>
          </motion.div>

          <motion.h1
            className="font-display font-extrabold text-white text-[clamp(46px,8.5vw,124px)]"
            style={{ letterSpacing: "-0.05em", lineHeight: 0.92 }}
            initial={reduced ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
          >
            Designing an
            <br />
            event <span className="kx-accent">platform.</span>
          </motion.h1>

          <motion.p
            className="mt-8 max-w-[620px] text-white/60 text-base md:text-xl leading-relaxed"
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
          >
            From idea to architecture — the problem, the users, the task flows, and the reasoning
            behind every design and engineering decision on the Khinext &apos;26 platform.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
          >
            <a href="#ipd" className="kx-btn-primary">
              Read the study
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
              ["Discipline", "Product · UX · Eng"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-white/35 text-[11px] font-bold uppercase tracking-[0.16em] mb-1">{k}</div>
                <div className="text-white/80">{v}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── 01 · Idea → Problem → Decision (ref #1) ───────── */}
      <section id="ipd" className="kx-section">
        <SectionHead
          index="01"
          eyebrow="Framing"
          title={<>Idea, problem, <span className="kx-accent">decision.</span></>}
          intro="Before a single screen, the brief was pinned down as a three-step chain — what we wanted to make, why it was hard, and the bet we placed to solve it."
        />

        <Rise>
          <ol className="relative max-w-[820px] ml-1">
            {/* dashed spine */}
            <span
              aria-hidden="true"
              className="absolute left-[7px] top-2 bottom-2 w-px border-l border-dashed border-white/20"
            />
            {IPD.map((s, i) => (
              <li key={s.tag} className="relative pl-10 md:pl-14" style={{ paddingBottom: i < IPD.length - 1 ? 40 : 0 }}>
                {/* node dot */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full bg-khi-blue ring-4 ring-khi-blue/20"
                />
                {/* elbow tick */}
                <span
                  aria-hidden="true"
                  className="absolute left-[15px] top-[7px] w-6 md:w-9 h-px border-t border-dashed border-white/20"
                />
                <div className="md:pl-2" style={{ marginLeft: `${i * 8}px` }}>
                  <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-khi-blue">{s.tag}</span>
                  <h3 className="mt-2 font-display text-2xl md:text-3xl font-extrabold text-white -tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-[560px] text-white/55 italic leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Rise>
      </section>

      {/* ── 02 · Personas (ref #2) ───────────────────────── */}
      <section className="relative border-y border-white/10 bg-khi-ink-soft">
        <div className="kx-section">
          <SectionHead
            index="02"
            eyebrow="Who it's for"
            title={<>Creating <span className="kx-accent">personas.</span></>}
            intro="Three archetypes shaped every trade-off — two on the attendee side, one running the show. When a decision helped one but hurt another, the personas broke the tie."
          />

          <Rise>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-7">
              {/* toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
                <MonoTag>CREATING_PERSONAS</MonoTag>
                <div className="flex flex-wrap gap-2">
                  {["Simplicity", "Trust", "Speed", "Reach"].map((c) => (
                    <span
                      key={c}
                      className="text-[11px] text-white/55 border border-white/12 rounded-full px-3 py-1"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* cards */}
              <div className="grid md:grid-cols-3 gap-4 pt-6">
                {PERSONAS.map((p, i) => (
                  <Rise key={p.name} delay={i * 0.08}>
                    <div
                      className={`h-full rounded-2xl p-6 border transition-colors duration-300 ${
                        p.highlight
                          ? "bg-khi-blue border-khi-blue"
                          : "bg-white/[0.03] border-white/10 hover:border-khi-blue/40"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-full font-display text-2xl font-extrabold ${
                            p.highlight ? "bg-white text-khi-blue" : "bg-khi-blue/15 text-khi-blue"
                          }`}
                        >
                          {p.initial}
                        </span>
                        <span
                          className={`w-7 h-7 rounded-full border-2 grid place-items-center ${
                            p.highlight ? "border-white/70" : "border-white/20"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${p.highlight ? "bg-white" : "bg-white/30"}`} />
                        </span>
                      </div>

                      <h3
                        className={`mt-5 font-display text-xl font-extrabold ${
                          p.highlight ? "text-white" : "text-white"
                        }`}
                      >
                        {p.name}
                      </h3>
                      <p className={`text-xs font-semibold uppercase tracking-wide mt-1 ${p.highlight ? "text-white/80" : "text-khi-blue"}`}>
                        {p.role}
                      </p>
                      <p className={`mt-4 text-sm leading-relaxed ${p.highlight ? "text-white/85" : "text-white/50"}`}>
                        {p.body}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {p.traits.map((t) => (
                          <span
                            key={t}
                            className={`text-[11px] rounded-full px-2.5 py-1 ${
                              p.highlight
                                ? "bg-white/15 text-white"
                                : "bg-white/[0.05] border border-white/10 text-white/60"
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Rise>
                ))}
              </div>
            </div>
          </Rise>
        </div>
      </section>

      {/* ── 03 · Task flows / IA (ref #3) ─────────────────── */}
      <section className="kx-section">
        <SectionHead
          index="03"
          eyebrow="Information architecture"
          title={<>Mapping the <span className="kx-accent">task flows.</span></>}
          intro="Every screen was placed on a flow before it was designed. Two trees carry the product: the attendee's path from landing to done, and the operator's control room."
        />

        <div className="space-y-6">
          <Rise>
            <div className="flex items-center gap-3 mb-3">
              <MonoTag>FLOW_01_ATTENDEE</MonoTag>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <FlowTree
              spine={[
                { label: "Landing page", variant: "outline" },
                { label: "Choose intent", variant: "filled" },
              ]}
              branches={ATTENDEE_BRANCHES}
            />
          </Rise>

          <Rise delay={0.06}>
            <div className="flex items-center gap-3 mb-3 mt-10">
              <MonoTag>FLOW_02_ADMIN_OPS</MonoTag>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <FlowTree
              spine={[
                { label: "/admin/login", variant: "outline" },
                { label: "Auth gate · RLS", variant: "outline" },
                { label: "Dashboard", variant: "filled" },
              ]}
              branches={ADMIN_BRANCHES}
            />
          </Rise>
        </div>
      </section>

      {/* ── 04 · Design decisions — What / Why ───────────── */}
      <section className="relative border-y border-white/10 bg-khi-ink-soft">
        <div className="kx-section">
          <SectionHead
            index="04"
            eyebrow="Rationale"
            title={<>Every choice, <span className="kx-accent">with a reason.</span></>}
            intro="The heart of the study — the decisions that shaped the build, each stated as what was done and why it beat the obvious alternative."
          />
          <div className="grid md:grid-cols-2 gap-4">
            {DECISIONS.map((d, i) => (
              <Rise key={d.label} delay={(i % 2) * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-7 transition-colors duration-300 hover:border-khi-blue/40">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-khi-blue/12 border border-khi-blue/25">
                      <d.icon size={18} className="text-khi-blue" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[12px] font-semibold text-white/70">{d.label}</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-khi-blue">WHAT</span>
                      <p className="mt-1.5 text-sm text-white/70 leading-relaxed">{d.what}</p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/35">WHY</span>
                      <p className="mt-1.5 text-sm text-white/50 leading-relaxed">{d.why}</p>
                    </div>
                  </div>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 · Under the hood — code & screens ─────────── */}
      <section className="kx-section">
        <SectionHead
          index="05"
          eyebrow="Under the hood"
          title={<>Real code, <span className="kx-accent">real screens.</span></>}
          intro="Three representative slices — the actual source paired with the interface it drives. Every snippet is lifted from the codebase, lightly trimmed for reading."
        />
        <div className="space-y-16 md:space-y-24">
          {PAIRS.map((p, i) => (
            <div key={p.label} className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
              {/* text + code */}
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <Rise>
                  <span className="font-mono text-[11px] font-bold tracking-[0.16em] text-khi-blue">{p.label}</span>
                  <h3 className="mt-2 font-display text-2xl md:text-3xl font-extrabold text-white -tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-3 mb-6 text-white/55 text-sm md:text-[15px] leading-relaxed max-w-[520px]">
                    {p.blurb}
                  </p>
                </Rise>
                <Rise delay={0.08}>
                  <CodeBlock file={p.file} code={p.code} />
                </Rise>
              </div>
              {/* screen preview */}
              <Rise delay={0.12} className={i % 2 === 1 ? "lg:order-1" : ""}>
                <ScreenPreview kind={p.preview} />
              </Rise>
            </div>
          ))}
        </div>
      </section>

      {/* ── 06 · Realtime dashboard detail ───────────────── */}
      <section className="kx-section">
        <SectionHead
          index="06"
          eyebrow="The control room"
          title={<>A dashboard that&apos;s <span className="kx-accent">alive.</span></>}
          intro="The decisions above converge here. One Supabase channel, four tables, and the operator sees new activity the instant it happens — animated in, with a toast."
        />

        <Rise>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden mb-10">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-white/[0.02]">
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="ml-3 inline-flex items-center gap-1.5 text-[11px] text-emerald-300/80">
                <Radio size={11} className="animate-pulse" aria-hidden="true" /> Live
              </span>
              <span className="ml-auto font-mono text-[11px] text-white/30">admin · khinext_26</span>
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
          {[
            { icon: FileCheck2, title: "Submission review", desc: "Filter by status, preview uploaded attachments, and approve or reject in one click — every decision timestamped and attributed." },
            { icon: Users, title: "Registrations control", desc: "Confirm, bulk-confirm, de-duplicate and send confirmations. Each row shows invitation history and email open counts." },
            { icon: Share2, title: "Card analytics", desc: "Every generated card is logged with its template and slug, so the team sees which designs actually get shared." },
            { icon: IdCard, title: "VIP validation", desc: "A server-side check resolves verification tier from registrations and delivered invites before exclusive access is granted." },
          ].map((f, i) => (
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

      {/* ── 07 · Communications engine ───────────────────── */}
      <section className="relative border-y border-white/10 bg-khi-ink-soft">
        <div className="kx-section">
          <SectionHead
            index="07"
            eyebrow="Communications engine"
            title={<>Email, <span className="kx-accent">built in.</span></>}
            intro="Rather than bolt on a third-party tool, the platform runs its own mail pipeline — outbound campaigns, deduped agenda blasts, and a genuine two-way inbox synced over IMAP and the Gmail API."
          />
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: Send, title: "Invitation Mailer", desc: "Compose, validate and preview HTML campaigns, then send in controlled batches with full delivery history." },
              { icon: Zap, title: "Agenda Blast", desc: "One-click batched delivery to every past invitee, deduped automatically, with custom-list and single-send modes." },
              { icon: Inbox, title: "Unified inbox", desc: "Contact-form messages and real inbound email merge into one inbox; reply inline with RFC-compliant threading." },
              { icon: Eye, title: "Open tracking", desc: "A tracking-pixel route records opens per recipient, feeding the counts shown against every registration." },
            ].map((f, i) => (
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

      {/* ── 08 · Metrics + capability checklist ──────────── */}
      <section className="kx-section">
        <SectionHead index="08" eyebrow="By the numbers" title={<>Scope at a <span className="kx-accent">glance.</span></>} />
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
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(49,107,255,0.18) 0%, transparent 65%)",
          }}
        />
        <Rise>
          <div className="max-w-[680px] mx-auto text-center">
            <p className="kx-eyebrow justify-center mb-6">Thanks for reading</p>
            <h2
              className="font-display font-extrabold text-white text-[clamp(34px,5.5vw,68px)]"
              style={{ letterSpacing: "-0.045em", lineHeight: 1.02 }}
            >
              Explore the <span className="kx-accent">real thing.</span>
            </h2>
            <p className="mt-6 text-white/55 leading-relaxed max-w-[500px] mx-auto">
              The whole platform is live. Walk through the public flows, or reach out for a guided
              tour of the admin dashboard.
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
