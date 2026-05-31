import type { Metadata } from "next";
import Link from "next/link";
import {
  Brain, Cpu, Code2, FlaskConical, Rocket, Users,
  ArrowRight, Calendar, MapPin, Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { MouseTilt } from "@/components/ui/MouseTilt";

export const metadata: Metadata = {
  title: "AI Expo — Khinext '26",
  description:
    "The AI Expo at Khinext '26 — keynotes, live demos, roundtables and hands-on labs across 7 innovation domains. Karachi, 7 June 2026.",
};

const HIGHLIGHTS = [
  { icon: Brain,         title: "Keynotes",     desc: "World-class speakers from labs, foundries and applied AI teams. Plenary sessions kick off each domain." },
  { icon: FlaskConical,  title: "Live demos",   desc: "On-floor demos from selected startups — see real AI products running on real data, not slide decks." },
  { icon: Users,         title: "Roundtables",  desc: "Closed-door sessions with builders, regulators and academic leads. Limited seats; invite-only." },
  { icon: Code2,         title: "Hands-on labs",desc: "Practical workshops on fine-tuning, evals, agentic systems and on-device inference." },
  { icon: Cpu,           title: "Hardware row", desc: "Touch the silicon: GPU clusters, edge accelerators, robotics platforms and quantum prototypes." },
  { icon: Rocket,        title: "Investor arena",desc:"Curated startups present to 40+ active investors. Hosted matchmaking after every pitch block." },
] as const;

const PROGRAM = [
  { time: "09:00", title: "Doors open · registration & coffee",          domain: "All" },
  { time: "10:00", title: "Opening keynote · The state of AI in 2026",   domain: "Plenary" },
  { time: "11:00", title: "AI in Health & Pharma · panel + live demos",  domain: "Health" },
  { time: "12:30", title: "Smart Cities · infrastructure roundtable",    domain: "Cities" },
  { time: "14:00", title: "Creative AI showcase · generative arts",       domain: "Creative" },
  { time: "15:30", title: "Fintech Future · open-finance keynote",       domain: "Fintech" },
  { time: "16:30", title: "DevZone · MLOps and tooling deep-dive",       domain: "DevZone" },
  { time: "18:00", title: "Investor Arena · pitch night & matchmaking",  domain: "Investor" },
  { time: "20:00", title: "Closing reception",                           domain: "All" },
] as const;

export default function AIExpoPage() {
  return (
    <>
      <PageHero
        eyebrow="Track · AI Expo"
        title={<>Where AI gets <span className="kx-accent">real.</span></>}
      >
        Two-thousand square metres of demos, talks, labs and roundtables — split across seven domains.
        One day to see, touch, learn, fund and ship.
      </PageHero>

      {/* Quick info card */}
      <section className="kx-section !py-10">
        <Reveal>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2">
            <Info icon={<Calendar size={18} />} label="When"  value="Sunday, 7 June 2026" />
            <Info icon={<MapPin   size={18} />} label="Where" value="Karachi Expo Centre · Hall A" />
            <Info icon={<Sparkles size={18} />} label="Format" value="Keynotes + demos + labs" />
          </div>
        </Reveal>
      </section>

      {/* Highlights */}
      <section aria-labelledby="ai-expo-highlights" className="kx-section">
        <Reveal>
          <p className="kx-eyebrow mb-5">Highlights</p>
          <h2 id="ai-expo-highlights" className="font-display text-[clamp(30px,4.5vw,52px)] font-extrabold text-white max-w-[700px]"
              style={{ letterSpacing: "-0.035em", lineHeight: 1.05 }}>
            Six experiences, <span className="kx-accent">one floor.</span>
          </h2>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal as="li" key={h.title} delay={i * 0.05}>
              <MouseTilt max={5} scale={1.012}>
                <article className="kx-card group h-full">
                  <div
                    className="grid place-items-center w-12 h-12 rounded-xl mb-4 transition-transform duration-300 ease-soft group-hover:scale-110 group-hover:-rotate-6"
                    style={{
                      background: "rgba(49,107,255,0.10)",
                      border: "1px solid rgba(49,107,255,0.32)",
                      boxShadow: "0 0 22px rgba(49,107,255,0.20)",
                    }}
                  >
                    <h.icon size={20} className="text-khi-blue-soft" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white -tracking-tight mb-2">
                    {h.title}
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed">{h.desc}</p>
                </article>
              </MouseTilt>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Program */}
      <section aria-labelledby="ai-expo-program" className="kx-section border-t border-white/10">
        <Reveal>
          <p className="kx-eyebrow mb-5">Indicative program</p>
          <h2 id="ai-expo-program" className="font-display text-[clamp(30px,4.5vw,52px)] font-extrabold text-white max-w-[700px]"
              style={{ letterSpacing: "-0.035em", lineHeight: 1.05 }}>
            A single, focused <span className="kx-accent">day.</span>
          </h2>
          <p className="mt-4 max-w-[520px] text-white/45 text-sm">
            Final agenda confirmed two weeks before the event. Times in PKT.
          </p>
        </Reveal>

        <ol className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">
          {PROGRAM.map((p, i) => (
            <Reveal as="li" key={p.time} delay={i * 0.04}>
              <div className="grid grid-cols-[80px_1fr_auto] md:grid-cols-[110px_1fr_120px] items-center gap-4 px-5 md:px-7 py-4 md:py-5 border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.02] transition-colors duration-200 ease-soft">
                <span className="font-mono text-khi-blue-soft text-sm md:text-base">{p.time}</span>
                <span className="text-white text-sm md:text-base">{p.title}</span>
                <span className="text-[10px] md:text-[11px] uppercase font-bold text-white/35 justify-self-end" style={{ letterSpacing: "0.18em" }}>{p.domain}</span>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="kx-section">
        <Reveal>
          <div className="rounded-3xl border border-khi-blue/30 bg-gradient-to-br from-khi-blue/15 via-transparent to-transparent p-8 md:p-12 text-center">
            <h2 className="font-display text-[clamp(28px,4vw,44px)] font-extrabold text-white -tracking-tight">
              Reserve your <span className="kx-accent">seat.</span>
            </h2>
            <p className="mt-4 max-w-[520px] mx-auto text-white/60">
              The AI Expo runs from 09:00 to 20:00 on Sunday, 7 June 2026.
              Free entry — registration required.
            </p>
            <div className="mt-7 flex gap-3 flex-wrap justify-center">
              <Link href="/register" className="kx-btn-primary">
                Register Now <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/submit" className="kx-btn-outline">
                Submit your AI Project
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 md:px-4 md:py-2">
      <span className="text-khi-blue mt-0.5" aria-hidden="true">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase text-white/30" style={{ letterSpacing: "0.20em" }}>{label}</div>
        <div className="font-display text-base font-bold text-white mt-1 -tracking-wider">{value}</div>
      </div>
    </div>
  );
}
