"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const reduced = useReducedMotion();
  const initial = reduced ? false : { opacity: 0, y: 28 };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-[calc(100svh-76px)] grid place-items-center text-center px-5 md:px-10 py-20 md:py-24 overflow-hidden isolate bg-khi-ink-soft"
    >
      {/* photographic background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30"
        style={{
          backgroundImage: "url('/brand/glass-hands.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.72,
          maskImage: "radial-gradient(ellipse 90% 100% at 50% 60%, #000 30%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 100% at 50% 60%, #000 30%, transparent 95%)",
        }}
      />
      {/* mesh blue glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 pointer-events-none"
        style={{
          background: "radial-gradient(closest-side at 88% 30%, rgba(60,40,140,0.35) 0%, transparent 55%), radial-gradient(closest-side at 8% 70%, rgba(30,50,120,0.32) 0%, transparent 50%)",
          filter: "blur(70px)",
          mixBlendMode: "soft-light",
          opacity: 0.6,
        }}
      />
      {/* faint blueprint grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 pointer-events-none animate-grid-drift"
        style={{
          backgroundImage: "linear-gradient(rgba(49,107,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(49,107,255,0.16) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 85% 65% at 50% 42%, #000 0%, transparent 82%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 65% at 50% 42%, #000 0%, transparent 82%)",
          opacity: 0.18,
        }}
      />
      {/* top centered glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 top-[6%] w-[740px] max-w-full h-[420px] -z-10 pointer-events-none animate-hero-float"
        style={{
          background: "radial-gradient(ellipse, rgba(49,107,255,0.30) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={initial}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-khi-blue/10 border border-khi-blue/30 text-[11px] md:text-xs font-medium uppercase text-khi-blue-soft mb-8"
          style={{ letterSpacing: "0.16em" }}
        >
          <span
            aria-hidden="true"
            className="w-[7px] h-[7px] rounded-full bg-khi-blue-bright animate-pulse-dot"
            style={{ boxShadow: "0 0 12px #4579FF" }}
          />
          Karachi · 2026 · AI Expo + Gaming
        </motion.div>

        <motion.h1
          id="hero-title"
          initial={initial}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(44px,8.5vw,112px)] font-extrabold leading-[0.96] text-white max-w-[1100px]"
          style={{ letterSpacing: "-0.045em" }}
        >
          Pakistan's first<br />
          <span className="kx-accent">multi-domain</span><br />
          AI Summit.
        </motion.h1>

        <motion.p
          initial={initial}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 text-[11px] md:text-sm uppercase text-white/45"
          style={{ letterSpacing: "0.36em" }}
        >
          AI in everything · future starts here
        </motion.p>

        <motion.p
          initial={initial}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-[560px] text-[15px] md:text-base text-white/55 leading-relaxed"
        >
          10,000+ attendees. 100+ speakers. 7 innovation domains.<br className="hidden md:inline" />
          Two days that will define South Asia's tech decade.
        </motion.p>

        <motion.div
          initial={initial}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex gap-3 flex-wrap justify-center"
        >
          <Link href="/register" className="kx-btn-primary">
            Register Now
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/submit" className="kx-btn-outline">
            Submit AI Project
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
