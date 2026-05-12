import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

export function RegisterCTA() {
  return (
    <section
      aria-labelledby="cta-title"
      className="kx-section relative overflow-hidden isolate"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(49,107,255,0.18) 0%, transparent 65%)",
        }}
      />
      <Reveal>
        <div className="text-center max-w-[720px] mx-auto">
          <p className="kx-eyebrow justify-center mb-5">The Stage Is Set</p>
          <h2
            id="cta-title"
            className="font-display text-[clamp(38px,5.5vw,72px)] font-extrabold text-white"
            style={{ letterSpacing: "-0.045em", lineHeight: 1.02 }}
          >
            Be part of<br />
            <span className="kx-accent">history.</span>
          </h2>
          <p className="mt-6 text-white/55 leading-relaxed max-w-[480px] mx-auto">
            Khinext '26 is Pakistan's flagship AI summit — two days in Karachi that will set the direction for South Asia's next decade of technology.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="kx-btn-primary">
              Register for Khinext '26
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/submit" className="kx-btn-outline">
              Submit AI Project
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
