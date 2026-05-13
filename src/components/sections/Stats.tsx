"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const STATS = [
  { target: 10000, fmt: (n: number) => `${Math.floor(n / 1000)}K`, acc: "+", label: "Attendees" },
  { target: 100,   fmt: (n: number) => `${Math.floor(n)}`,         acc: "+", label: "Speakers" },
  { target: 7,     fmt: (n: number) => `${Math.floor(n)}`,         acc: "",  label: "Innovation Domains" },
  { target: 50,    fmt: (n: number) => `${Math.floor(n)}`,         acc: "+", label: "Sessions" },
] as const;

export function Stats() {
  return (
    <section
      aria-labelledby="stats-title"
      className="border-t border-b border-white/10 relative isolate"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(49,107,255,0.06) 0%, transparent 70%)",
        }}
      />
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
              <Counter target={s.target} fmt={s.fmt} acc={s.acc} />
              <div className="mt-2 text-xs md:text-sm text-white/45 tracking-wide">{s.label}</div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function Counter({
  target,
  fmt,
  acc,
}: {
  target: number;
  fmt: (n: number) => string;
  acc: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <div
      ref={ref}
      className="font-display font-extrabold text-white text-[clamp(40px,5.5vw,60px)] leading-none tabular-nums"
      style={{ letterSpacing: "-0.04em" }}
    >
      {fmt(value)}<span className="text-khi-blue">{acc}</span>
    </div>
  );
}
