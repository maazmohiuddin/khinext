import { Reveal } from "@/components/ui/Reveal";
import { DOMAINS } from "@/lib/types";

export function Domains() {
  return (
    <section
      aria-labelledby="domains-title"
      className="kx-section"
    >
      <Reveal>
        <p className="kx-eyebrow mb-5">Focus Domains</p>
        <h2
          id="domains-title"
          className="font-display text-[clamp(34px,5vw,64px)] font-extrabold text-white max-w-[700px]"
          style={{ letterSpacing: "-0.035em", lineHeight: 1.04 }}
        >
          7 domains of <span className="kx-accent">tomorrow.</span>
        </h2>
        <p className="mt-5 max-w-[560px] text-white/55 leading-relaxed">
          Khinext '26 hosts AI breakthroughs across seven focused innovation zones — each a self-contained track with live demos, roundtables and dedicated speaker sessions.
        </p>
      </Reveal>

      <ul className="mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {DOMAINS.map((d, i) => (
          <Reveal as="li" key={d.key} delay={i * 0.05} className="contents">
            <article
              className="kx-card group h-full focus-within:border-blue-lit"
              tabIndex={0}
              aria-label={`Domain: ${d.title}`}
            >
              <div className="flex items-center gap-3.5 mb-4">
                <div
                  className="grid place-items-center w-12 h-12 rounded-xl transition-transform duration-300 ease-soft group-hover:scale-110"
                  style={{
                    background: `${d.color}22`,
                    border: `1px solid ${d.color}44`,
                    boxShadow: `0 0 18px ${d.color}33`,
                  }}
                  aria-hidden="true"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ background: d.color }}
                  />
                </div>
                <h3 className="font-display text-base font-semibold text-white -tracking-tight">
                  {d.title}
                </h3>
              </div>
              <p className="text-sm text-white/55 leading-relaxed">
                {d.desc}
              </p>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
