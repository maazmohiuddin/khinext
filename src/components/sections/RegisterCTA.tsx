"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

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
      <motion.div
        className="text-center max-w-[720px] mx-auto"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.p variants={item} className="kx-eyebrow justify-center mb-5">The Stage Is Set</motion.p>
        <motion.h2
          id="cta-title"
          variants={item}
          className="font-display text-[clamp(38px,5.5vw,72px)] font-extrabold text-white"
          style={{ letterSpacing: "-0.045em", lineHeight: 1.02 }}
        >
          Be part of<br />
          <span className="kx-accent">history.</span>
        </motion.h2>
        <motion.p variants={item} className="mt-6 text-white/55 leading-relaxed max-w-[480px] mx-auto">
          Khinext '26 is Pakistan's flagship AI summit — two days in Karachi that will set the direction for South Asia's next decade of technology.
        </motion.p>
        <motion.div variants={item} className="mt-10 flex flex-wrap justify-center gap-3">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link href="/register" className="kx-btn-primary animate-btn-glow">
              Register for Khinext '26
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link href="/submit" className="kx-btn-outline">
              Submit AI Project
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
