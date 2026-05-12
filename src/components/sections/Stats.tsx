import { Reveal } from "@/components/ui/Reveal";

const STATS = [
  { num: "10K", acc: "+", label: "Attendees" },
  { num: "100", acc: "+", label: "Speakers" },
  { num: "7",   acc: "",  label: "Innovation Domains" },
  { num: "50",  acc: "+", label: "Sessions" },
] as const;

export function Stats() {
  return (
    <section
      aria-labelledby="stats-title"
      className="border-t border-b border-white/10"
    >
      <h2 id="stats-title" className="sr-only">Khinext '26 by the numbers</h2>
      <Reveal>
        <ul className="grid grid-cols-2 lg:grid-cols-4 max-w-page mx-auto">
          {STATS.map((s, i) => (
            <li
              key={s.label}
              className={`text-center py-10 md:py-12 px-5 ${
                i < STATS.length - 1 ? "lg:border-r lg:border-white/10" : ""
              } ${i < 2 ? "md:border-b-0 border-b border-white/10 lg:border-b-0" : ""} ${
                i === 0 ? "border-r border-white/10" : ""
              } ${i === 2 ? "border-r border-white/10 lg:border-r" : ""}`}
            >
              <div
                className="font-display font-extrabold text-white text-[clamp(40px,5.5vw,60px)] leading-none"
                style={{ letterSpacing: "-0.04em" }}
              >
                {s.num}<span className="text-khi-blue">{s.acc}</span>
              </div>
              <div className="mt-2 text-xs md:text-sm text-white/45 tracking-wide">{s.label}</div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
