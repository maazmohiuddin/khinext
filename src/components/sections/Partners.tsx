"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const STRATEGIC = [
  { name: "TCN Executive Forum", src: "/partners/tcn.png", label: "Strategic Partner" },
  { name: "JBS Works Better", src: "/partners/jbs.png", label: "Official Partner" },
  { name: "TFS Events", src: "/partners/tfs.png", label: "Event Management Partner" },
];

const FEATURED = [
  { name: "VIPER", src: "/partners/viper.png" },
  { name: "Dreamworld", src: "/partners/dreamworld.png" },
  { name: "Startup Pakistan", src: "/partners/image357.png" },
  { name: "P@SHA", src: "/partners/isolation-mode.png" },
  { name: "Pakola", src: "/partners/pakola.png" },
];

const SUPPORTING = [
  { name: "LOUG", src: "/partners/loug.png" },
  { name: "PAFLA", src: "/partners/pafla.png" },
  { name: "THE BOTSS", src: "/partners/botss.png" },
  { name: "CEO Today", src: "/partners/ceo-today.png" },
  { name: "Server4Sale", src: "/partners/s4s.png" },
  { name: "HKHM", src: "/partners/hkhm.png" },
];

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};
const gridItem = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function LogoCell({
  name,
  src,
  size = "md",
  label,
}: {
  name: string;
  src: string;
  size?: "lg" | "md" | "sm";
  label?: string;
}) {
  const h = size === "lg" ? "h-[100px] md:h-[120px]" : size === "md" ? "h-[80px]" : "h-[64px]";
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-5 group">
      <div className={`relative w-full ${h}`}>
        <Image
          src={src}
          alt={name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      {label && (
        <span className="text-[9px] uppercase font-semibold tracking-[0.2em] text-khi-blue-soft/70">
          {label}
        </span>
      )}
    </div>
  );
}

export function Partners() {
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="partners-title" className="kx-section">
      <Reveal>
        <div className="text-center max-w-[600px] mx-auto">
          <p className="kx-eyebrow justify-center mb-5">Thank You</p>
          <h2
            id="partners-title"
            className="font-display text-[clamp(32px,4.5vw,52px)] font-extrabold text-white"
            style={{ letterSpacing: "-0.035em", lineHeight: 1.06 }}
          >
            Built with our <span className="kx-accent">partners.</span>
          </h2>
          <p className="mt-5 text-white/55 leading-relaxed">
            Khinext &apos;26 was made possible by Pakistan&apos;s leading enterprises,
            platforms, and community partners.
          </p>
        </div>
      </Reveal>

      {/* Strategic / Featured partners */}
      <motion.ul
        className="mt-12 grid grid-cols-1 sm:grid-cols-3 border border-white/10 rounded-2xl overflow-hidden bg-white/[0.012]"
        aria-label="Strategic partners"
        variants={reduced ? undefined : gridContainer}
        initial={reduced ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {STRATEGIC.map((p, i) => (
          <motion.li
            key={p.name}
            variants={reduced ? undefined : gridItem}
            className={`min-h-[140px] hover:bg-khi-blue/[0.06] transition-colors duration-300 ${
              i < STRATEGIC.length - 1 ? "border-b sm:border-b-0 sm:border-r border-white/10" : ""
            }`}
          >
            <LogoCell name={p.name} src={p.src} size="lg" label={p.label} />
          </motion.li>
        ))}
      </motion.ul>

      {/* Featured partners */}
      <motion.ul
        className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border border-white/10 rounded-2xl overflow-hidden bg-white/[0.012]"
        aria-label="Featured partners"
        variants={reduced ? undefined : gridContainer}
        initial={reduced ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {FEATURED.map((p, i) => (
          <motion.li
            key={p.name}
            variants={reduced ? undefined : gridItem}
            className={`min-h-[120px] hover:bg-khi-blue/[0.06] transition-colors duration-300 ${
              i % 5 !== 4 ? "lg:border-r border-white/10" : ""
            } ${i % 3 !== 2 ? "sm:border-r lg:border-r-0 border-white/10" : ""} ${
              i % 2 !== 1 ? "border-r sm:border-r-0 lg:border-r border-white/10" : ""
            } ${i < FEATURED.length - 2 ? "border-b lg:border-b-0 border-white/10" : ""}`}
          >
            <LogoCell name={p.name} src={p.src} size="md" />
          </motion.li>
        ))}
      </motion.ul>

      {/* Supporting partners */}
      <motion.ul
        className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border border-white/10 rounded-2xl overflow-hidden bg-white/[0.012]"
        aria-label="Supporting partners"
        variants={reduced ? undefined : gridContainer}
        initial={reduced ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {SUPPORTING.map((p, i) => (
          <motion.li
            key={p.name}
            variants={reduced ? undefined : gridItem}
            className={`min-h-[100px] hover:bg-khi-blue/[0.06] transition-colors duration-300 ${
              i % 6 !== 5 ? "lg:border-r border-white/10" : ""
            } ${i % 3 !== 2 ? "sm:border-r lg:border-r-0 border-white/10" : ""} ${
              i % 2 !== 1 ? "border-r sm:border-r-0 lg:border-r border-white/10" : ""
            } ${i < SUPPORTING.length - 3 ? "border-b sm:border-b border-white/10" : ""}`}
          >
            <LogoCell name={p.name} src={p.src} size="sm" />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
