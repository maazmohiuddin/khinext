import type { Metadata } from "next";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Registrations Closed — Khinext '26",
  description: "Khinext '26 has concluded. Stay tuned for Khinext '27.",
};

export default function RegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Khinext '26 · Concluded"
        title={<>Registrations <span className="kx-accent">Closed</span></>}
      >
        Khinext &apos;26 has concluded. Thank you to every attendee, speaker, and partner who made it happen.
      </PageHero>

      <section className="kx-section">
        <Reveal>
          <div className="max-w-[560px] mx-auto rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 md:p-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 px-3.5 py-1.5 text-xs font-medium text-white/50 tracking-wide uppercase mb-8">
              <Lock size={12} className="opacity-70" aria-hidden="true" />
              Registrations closed
            </span>

            <h2 className="font-display font-extrabold text-white text-2xl md:text-3xl mb-4" style={{ letterSpacing: "-0.04em" }}>
              See you at Khinext&nbsp;&apos;27
            </h2>
            <p className="text-white/50 text-sm md:text-base leading-relaxed mb-8">
              The Khinext &apos;26 AI Summit has wrapped up. Registration for the next edition will open in 2026 — keep an eye out.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-khi-blue hover:text-white transition-colors duration-200"
            >
              Back to homepage
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
