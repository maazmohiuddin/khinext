"use client";

import { useEffect, useState } from "react";
import { KxMark } from "@/components/ui/KxMark";

/**
 * Branded preloader. Shows on first paint, fades out once:
 *   • document.readyState === "complete", OR
 *   • 1.4s have elapsed (whichever is first)
 * Only fires on full page loads — not on client-side navigation.
 * Respects prefers-reduced-motion.
 */
export function Preloader() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      setProgress(100);
      window.setTimeout(() => setShow(false), reduced ? 0 : 380);
    };

    const tick = window.setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 18 + 6, 92));
    }, 80);

    const maxWait = window.setTimeout(finish, reduced ? 200 : 1400);

    const onLoad = () => {
      window.clearInterval(tick);
      window.clearTimeout(maxWait);
      finish();
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(maxWait);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div
      aria-hidden={!show}
      role="status"
      className={`fixed inset-0 z-[1000] grid place-items-center transition-opacity duration-500 ease-soft ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #0a1740 0%, #02040A 60%)",
      }}
    >
      <div className="flex flex-col items-center gap-7">
        {/* Logo mark with glow + spin halo */}
        <div className="relative grid place-items-center">
          <div
            aria-hidden="true"
            className="absolute inset-[-32px] rounded-full animate-pulse-slow"
            style={{
              background: "radial-gradient(ellipse at center, rgba(49,107,255,0.45) 0%, transparent 65%)",
              filter: "blur(18px)",
            }}
          />
          <div className="animate-mark-float">
            <KxMark size={72} />
          </div>
        </div>

        {/* Wordmark */}
        <div className="font-display text-3xl font-extrabold text-white -tracking-tight">
          Khi<em className="kx-accent">next</em>
          <span className="text-white/30 font-bold ml-1">'26</span>
        </div>

        {/* Progress */}
        <div className="w-[200px] relative">
          <div className="h-[2px] rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full transition-[width] duration-200 ease-soft"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #316BFF 0%, #8FAFFF 100%)",
                boxShadow: "0 0 12px rgba(49,107,255,0.6)",
              }}
            />
          </div>
          <div
            className="mt-3 text-[10px] uppercase text-white/30 text-center"
            style={{ letterSpacing: "0.28em" }}
          >
            Loading the future
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes markFloat {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-6px) rotate(2deg); }
        }
        :global(.animate-mark-float) { animation: markFloat 2.6s ease-in-out infinite; }

        @keyframes pulseSlow {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(1.08); }
        }
        :global(.animate-pulse-slow) { animation: pulseSlow 2.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
