import type { Metadata } from "next";
import Link from "next/link";
import {
  Gamepad2, Trophy, Headphones, Joystick, Crown, Tv,
  ArrowRight, Calendar, MapPin, Users,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { MouseTilt } from "@/components/ui/MouseTilt";

export const metadata: Metadata = {
  title: "Gaming — Khinext '26",
  description:
    "The Gaming arena at Khinext '26 — esports tournaments, indie showcases, streamer meet-and-greets, and a dedicated AI-in-games stage. Karachi, 7 June 2026.",
};

const ZONES = [
  { icon: Trophy,     title: "Esports tournament", desc: "Open brackets across CS2, Valorant, Tekken 8 and PUBG Mobile. Cash prize pool · live shoutcasting." },
  { icon: Joystick,   title: "Indie showcase",     desc: "12 hand-picked indie studios from Pakistan and South Asia. Playable builds at every booth." },
  { icon: Tv,         title: "Streamer meet-up",   desc: "Top creators from across the region — live streams, Q&As, and a community photo wall." },
  { icon: Gamepad2,   title: "Retro arcade",       desc: "Cabinet collection from the '80s and '90s. CRT monitors, original joysticks, free play all day." },
  { icon: Crown,      title: "AI-in-games stage",  desc: "Talks on procedural generation, agentic NPCs, runtime upscaling and AI-assisted level design." },
  { icon: Headphones, title: "VR / XR lab",        desc: "Try the latest headsets — Quest 4, Vision Pro 2, mixed-reality co-op experiences." },
] as const;

const PROGRAM = [
  { time: "10:00", title: "Arena opens · check-in & warm-ups",            zone: "All" },
  { time: "11:00", title: "Group stage · CS2 / Valorant brackets",         zone: "Esports" },
  { time: "12:00", title: "Indie Showcase opens · 12 studios live",        zone: "Indie" },
  { time: "13:30", title: "AI-in-games keynote · Procedural worlds",       zone: "Stage" },
  { time: "15:00", title: "Tekken 8 quarter-finals",                       zone: "Esports" },
  { time: "16:00", title: "Streamer meet & greet",                         zone: "Creators" },
  { time: "17:30", title: "Grand finals · CS2 / Valorant",                 zone: "Esports" },
  { time: "19:30", title: "Awards · prize ceremony",                       zone: "Main stage" },
  { time: "20:30", title: "After-party · DJ set & community mixer",        zone: "All" },
] as const;

export default function GamingPage() {
  return (
    <>
      <PageHero
        eyebrow="Track · Gaming"
        title={<>Play, build, <span className="kx-accent">win.</span></>}
      >
        Khinext '26 isn't just AI on slides. The Gaming arena runs alongside the Expo —
        tournaments, indie booths, streamer culture and an AI-in-games stage.
      </PageHero>

      {/* Quick info card */}
      <section className="kx-section !py-10">
        <Reveal>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2">
            <Info icon={<Calendar size={18} />} label="When"  value="Sunday, 7 June 2026" />
            <Info icon={<MapPin   size={18} />} label="Where" value="Karachi Expo Centre · Hall B" />
            <Info icon={<Users    size={18} />} label="Open to" value="Players · viewers · creators" />
          </div>
        </Reveal>
      </section>

      {/* Zones */}
      <section aria-labelledby="gaming-zones" className="kx-section">
        <Reveal>
          <p className="kx-eyebrow mb-5">Arena zones</p>
          <h2 id="gaming-zones" className="font-display text-[clamp(30px,4.5vw,52px)] font-extrabold text-white max-w-[700px]"
              style={{ letterSpacing: "-0.035em", lineHeight: 1.05 }}>
            Six zones. <span className="kx-accent">One arena.</span>
          </h2>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ZONES.map((z, i) => (
            <Reveal as="li" key={z.title} delay={i * 0.05}>
              <MouseTilt max={5} scale={1.012}>
                <article className="kx-card group h-full">
                  <div
                    className="grid place-items-center w-12 h-12 rounded-xl mb-4 transition-transform duration-300 ease-soft group-hover:scale-110 group-hover:-rotate-6"
                    style={{
                      background: "rgba(191,0,255,0.10)",
                      border: "1px solid rgba(191,0,255,0.32)",
                      boxShadow: "0 0 22px rgba(191,0,255,0.20)",
                    }}
                  >
                    <z.icon size={20} className="text-[#D78FFF]" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white -tracking-tight mb-2">
                    {z.title}
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed">{z.desc}</p>
                </article>
              </MouseTilt>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Program */}
      <section aria-labelledby="gaming-program" className="kx-section border-t border-white/10">
        <Reveal>
          <p className="kx-eyebrow mb-5">Run sheet</p>
          <h2 id="gaming-program" className="font-display text-[clamp(30px,4.5vw,52px)] font-extrabold text-white max-w-[700px]"
              style={{ letterSpacing: "-0.035em", lineHeight: 1.05 }}>
            From <span className="kx-accent">warm-ups</span> to grand finals.
          </h2>
          <p className="mt-4 max-w-[520px] text-white/45 text-sm">
            Bracket draws confirmed two weeks before the event. Times in PKT.
          </p>
        </Reveal>

        <ol className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">
          {PROGRAM.map((p, i) => (
            <Reveal as="li" key={p.time} delay={i * 0.04}>
              <div className="grid grid-cols-[80px_1fr_auto] md:grid-cols-[110px_1fr_140px] items-center gap-4 px-5 md:px-7 py-4 md:py-5 border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.02] transition-colors duration-200 ease-soft">
                <span className="font-mono text-[#D78FFF] text-sm md:text-base">{p.time}</span>
                <span className="text-white text-sm md:text-base">{p.title}</span>
                <span className="text-[10px] md:text-[11px] uppercase font-bold text-white/35 justify-self-end" style={{ letterSpacing: "0.18em" }}>{p.zone}</span>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="kx-section">
        <Reveal>
          <div
            className="kx-banner rounded-3xl border p-8 md:p-12 text-center"
            style={{
              borderColor: "rgba(191,0,255,0.32)",
              background: "linear-gradient(135deg, rgba(191,0,255,0.14) 0%, transparent 60%)",
            }}
          >
            <h2 className="font-display text-[clamp(28px,4vw,44px)] font-extrabold text-white -tracking-tight">
              Get on the <span className="kx-accent">bracket.</span>
            </h2>
            <p className="mt-4 max-w-[520px] mx-auto text-white/60">
              Tournament sign-ups open with general registration. Indie studios:
              apply via the project submission form.
            </p>
            <div className="mt-7 flex gap-3 flex-wrap justify-center">
              <Link href="/register" className="kx-btn-primary">
                Register Now <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/submit" className="kx-btn-outline">
                Submit an Indie Game
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
      <span className="text-[#D78FFF] mt-0.5" aria-hidden="true">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase text-white/30" style={{ letterSpacing: "0.20em" }}>{label}</div>
        <div className="font-display text-base font-bold text-white mt-1 -tracking-wider">{value}</div>
      </div>
    </div>
  );
}
