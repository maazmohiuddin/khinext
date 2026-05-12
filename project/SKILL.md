---
name: khinext-design
description: Use this skill to generate well-branded interfaces and assets for Khinext (Pakistan's first multi-domain AI Summit / AI Expo '26), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

The system is built around four anchors:

1. **`colors_and_type.css`** — drop this in via `<link>` on every page. It registers Helvetica + Helvetica Now Display via `@font-face` and exposes every brand token (`--khi-blue` `#316BFF`, `--khi-ink` `#040B1C`, the 8 zone accents, the foreground alpha ladder, glow shadows, radii, easings).
2. **`fonts/`** — TTF files referenced by `colors_and_type.css`. Don't substitute these on production work; if you must, the closest Google match is **Helvetica → Arimo**, **Helvetica Now Display → Manrope or Inter for the heavy weights, with the *Extra Bold Italic accent* substituted by Manrope ExtraBold Italic** (flag the substitution).
3. **`assets/`** — `logo.png` (full lockup), `logo-mark.png` (square K mark), `glass-hands.png` (chrome dispersion hero), `blueprint-bg.png` (portrait-card backdrop). Copy these out for any visual artifact; don't redraw the logo by hand.
4. **`ui_kits/website/`** — JSX components for the marketing site (Nav, Hero, Stats, Domains, Tiers, Footer). Copy any component into a new artifact to inherit the look exactly.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules in `README.md` (CONTENT FUNDAMENTALS, VISUAL FOUNDATIONS, ICONOGRAPHY) to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick rules of thumb

- Background is always `#040B1C` ink (occasionally pure-black `#02040A` for full-bleed).
- Headlines: **Helvetica Now Display Extra Bold (700–800)**, tight tracking `-0.04em`, line-height `0.96–1.0`. One italic accent word per headline, colored `#316BFF`, font-weight 800 italic, with a soft blue radial halo behind it.
- Eyebrows are ALL CAPS, tracked `+0.22em`, blue, often with a leading 24px×2px blue rule.
- Buttons are pill-shaped (`999px`), 14–15px, weight 500. Primary = solid blue with a soft glow that pulses at rest, brightens to `#4579FF` on hover.
- Cards are 20–24px radius, `rgba(255,255,255,0.04)` background, `1px solid rgba(255,255,255,0.08)` border. Hover: border becomes `rgba(49,107,255,0.30)`, background tints to `rgba(49,107,255,0.06)`, card lifts `-2px`.
- Stats / domains love big italic-tinged numbers (`10K+`, `100+`, `8`) — the `+` and `K+` are colored blue.
- Use Lucide for utility icons. Use the bespoke 8 zone-icon set (geometric cutouts on a colored rounded square) only for the 8 innovation domains.
- **Never** introduce purple→blue gradients, emoji decoration, or icon-font glyphs. The website prototype slips in `☕` and `🏆` — those are placeholders.
- One italic accent per headline. One CTA color (blue). One body family (Helvetica). The whole brand is about restraint plus one electric kiss of color.
