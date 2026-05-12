import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        khi: {
          blue: "#316BFF",
          "blue-deep": "#003ACE",
          "blue-bright": "#4579FF",
          "blue-soft": "#8FAFFF",
          ink: "#040B1C",
          "ink-soft": "#02040A",
        },
        zone: {
          health:    "#51FFD5",
          cities:    "#00EAEE",
          creative:  "#BF00FF",
          fintech:   "#FFB800",
          devzone:   "#D4FF00",
          culture:   "#FF4D00",
          lifestyle: "#FF0F4B",
          investor:  "#E2E2E2",
        },
      },
      fontFamily: {
        sans:    ['"Helvetica"', "system-ui", "Arial", "sans-serif"],
        display: ['"Helvetica Now Display"', '"Helvetica"', "system-ui", "sans-serif"],
        mono:    ["ui-monospace", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter:  "-0.035em",
        eyebrow:   "0.22em",
      },
      boxShadow: {
        "glow-sm":  "0 0 0 1px rgba(49,107,255,0.24), 0 0 22px rgba(49,107,255,0.24)",
        "glow-md":  "0 0 0 1px rgba(49,107,255,0.42), 0 0 34px rgba(49,107,255,0.52)",
        "glow-cta": "0 0 28px 2px rgba(74,143,255,0.35), 0 6px 28px rgba(49,107,255,0.35)",
        "stamp":    "0 4px 4px rgba(0,0,0,0.25)",
      },
      animation: {
        "pulse-dot":    "pulseDot 2s ease-in-out infinite",
        "year-shimmer": "yearShimmer 5s ease-in-out infinite",
        "grid-drift":   "gridDrift 24s linear infinite",
        "hero-float":   "heroFloat 9s ease-in-out infinite",
        "aura":         "kxAura 3.2s ease-in-out infinite",
        "btn-glow":     "btnGlow 3.5s ease-in-out infinite",
      },
      keyframes: {
        pulseDot: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%":     { opacity: "0.45", transform: "scale(0.78)" },
        },
        yearShimmer: {
          "0%,100%": { backgroundPosition: "0% 40%" },
          "50%":     { backgroundPosition: "100% 60%" },
        },
        gridDrift: {
          "0%":   { backgroundPosition: "0 0, 0 0" },
          "100%": { backgroundPosition: "56px 56px, 56px 56px" },
        },
        heroFloat: {
          "0%,100%": { transform: "translate(-50%, 0)" },
          "50%":     { transform: "translate(-50%, -28px)" },
        },
        kxAura: {
          "0%,100%": { opacity: "0.46", filter: "blur(8px)",  transform: "scaleX(0.92)" },
          "50%":     { opacity: "0.9",  filter: "blur(13px)", transform: "scaleX(1.08)" },
        },
        btnGlow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(49,107,255,0.40), 0 6px 22px rgba(49,107,255,0.32)" },
          "50%":     { boxShadow: "0 0 24px 6px rgba(49,107,255,0.18), 0 6px 22px rgba(49,107,255,0.32)" },
        },
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        page: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
