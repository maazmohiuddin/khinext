# Khinext Design System

> **Khinext** is Pakistan's first multi-domain AI summit — "AI in everything: future starts here." Karachi, 2026. The brand is built for an AI Expo/Summit context: glass-morphic, low-key futuristic, with a single electric blue (`#316BFF`) doing all the lifting against deep ink black.

## What this is

This folder is the design source of truth for anything wearing the Khinext brand: posts, decks, the website, sponsorship proposals, on-venue collateral. It contains:

- Real brand assets (logo, glass / chrome imagery)
- Webfont files (`fonts/`) for Helvetica + Helvetica Now Display
- A canonical CSS token sheet (`colors_and_type.css`)
- Preview cards (`preview/`) that surface in the Design System tab
- A website UI kit (`ui_kits/website/`)
- A short skill file (`SKILL.md`) so this can ship as an Agent Skill

## Source materials we built this from

- **Figma** (mounted as a virtual filesystem) — *Khinext'26 Design (Copy)*: 3 pages, 630 frames.
  - `/Brand-Guide` — brand guide, 614 frames (logo + glass shapes + 25× social posts + 8 domain icon studies + moodboard)
  - `/Posting-Printing` — print collateral
  - `/Proposal` — sponsorship proposal A4 spreads (15 frames)
- **Khinext Website codebase** — `Khinext Website/khinext26-website_1.html`, a single-file marketing page (3,044 lines). The bulk of confirmed copy + interaction patterns lives here.
- **Uploaded fonts** — full Helvetica and Helvetica Now Display weight family.
- **Uploaded raster logos** — `Logo.png` (wordmark + mark), `Logo Only.png` (the glassy K + arrow mark).
- **GitHub** — `maazmohiuddin/khinext` (not pulled — codebase covers what we need).

> Note on a minor source conflict: the website's CSS uses `#2060FF` and pulls Syne + DM Sans from Google Fonts as a substitution. The user's brief calls the truth: **`#316BFF` with Helvetica + Helvetica Now Display Extra Bold Italic for highlights**. The system below follows the brief, not the prototype's substitutions. The Figma file confirms `rgb(49,107,255)` is the canonical blue (1,130 occurrences, second only to white).

---

## Brand at a glance

| | |
|---|---|
| **Name** | Khinext (Karachi × Next) |
| **Event** | Khinext '26 — AI Summit / AI Expo |
| **Tagline** | *AI in everything: future starts here* |
| **Where** | Karachi, Pakistan, 2026 |
| **Scale** | 10,000+ attendees · 100+ speakers · 8 innovation zones · 50+ sessions |
| **Vibe** | Low-key minima futuristic. Glass-morphic. AI-tech-forward. |

---

## Content fundamentals

**Voice.** Confident, future-tense, slightly hype-aware — but always grounded in numbers and proper nouns. Khinext writes like a summit, not a startup. The we is plural ("We are organizing…", "Our vision is…") and you is the partner/sponsor/attendee being addressed.

**Casing.**
- Headlines use **Title Case** ("From Every Corner To One Core", "Choose Your Tier") OR **sentence case with one accent word** ("Karachi becomes the *Epicenter*").
- The accent word is *always* italic + brand blue, and there is only one per headline.
- Eyebrows / section tags are ALL CAPS, +0.22em tracked ("ABOUT THE SUMMIT", "SPONSORSHIP TIERS").
- Stats are short and unitless when possible: `10K+`, `100+`, `8`, `2 Days`.

**Tone examples (lifted from the brief + site copy):**
- > "Introducing KHINEXT — Pakistan's first multi-domain AI summit."
- > "Karachi is about to make history."
- > "10,000+ Attendees · The largest tech gathering in Pakistan."
- > "AI Expo '26 / Reveal."
- > "Innovate. Inspire. Impact." (the three-word brand triad, period-separated, all caps, wide-tracked)
- > "The stage is set. The innovation is real."
- > "Choose your *Tier*."

**Vocabulary that recurs.** *AI*, *future*, *innovation*, *summit*, *expo*, *reveal*, *zones*, *domains*, *ecosystem*, *Pakistan*, *Karachi*, *South Asia*, *epicenter*, *stage*, *historic*, *roundtable*, *hackathon*, *lounge*. Numbers are first-class citizens — `10K+`, `100+`, `50+`, `8`, `2018`, `2026` show up constantly and are treated as design elements (oversized, blue, italic).

**Punctuation & quirks.**
- Em-dashes are used liberally (`—`) as the connective tissue ("Karachi becomes the Epicenter — Pakistan's flagship AI summit").
- Curly apostrophes and en-dashes everywhere ('26, not '26).
- A standalone middle-dot `·` separates inline stats ("`10,000+ Attendees · 100+ Speakers · 8 Domains`").
- Triads use period-separated all-caps: `INNOVATE . INSPIRE . IMPACT` (with literal spaces around each period).
- Lower-case "i" is sometimes elided for the brand voice (`AI in everything : Future Starts Here` — colon used with spaces; that's intentional).

**Emoji.** Not part of the brand system. The website prototype slips in `☕` and `🏆` on the "What to Expect" grid; treat those as **placeholders** to swap for the proper SVG zone-icons. **Never introduce new emoji into Khinext layouts.**

**No-go phrases.** Avoid soft-tech filler ("solutions", "platforms", "synergy"), avoid generic conference language ("don't miss out!"), avoid hashtag stacks. The tone is closer to a national flagship event than a SaaS landing page.

---

## Visual foundations

**Palette.** Three primary colors carry everything:

- `#316BFF` electric blue — the single accent. Used for: italic accent words, primary CTAs, eyebrows, dividers, key glows, ~one element per surface.
- `#040B1C` deep ink — the canonical background. Not pure black; there's a hint of navy in it. `#02040A` is reserved for full-bleed black-out frames.
- `#FFFFFF` white — primary text and the logo lockup.

A small, structured set of **zone accents** appears only when representing the 8 innovation domains — one hue per zone (mint, cyan, purple, amber, lime, orange, magenta, silver). Never use them as decoration outside their domain context.

**Type.** Body and headlines both use Helvetica/Helvetica Now Display. The brand's signature move is *one italicized highlight word* per headline, set in **Helvetica Now Display Extra Bold Italic** and colored `#316BFF`. Display headlines are tightly tracked (-3% to -5%), line-height pinched (0.96–1.0), and very large. Eyebrows are all-caps with +0.22em tracking.

**Spacing.** Generous. Cards have 32–48px internal padding; sections breathe at 100–120px vertical. Hairline borders (`rgba(255,255,255,0.08)`) do most of the structural work — heavy filled chrome is avoided.

**Backgrounds.** Almost always full-bleed `#040B1C` ink. On top of that, the brand layers (in order of how often they appear):

1. **Soft blue mesh glow** — large radial gradients at ~`rgba(49,107,255,0.18)` blurred to ~70px, drifting slowly.
2. **Faint graph-paper grid** — `rgba(49,107,255,0.16)` 56px squares, masked with a radial fade so it appears only in the center of hero areas.
3. **Y2K dispersion-glass / chrome 3D objects** — the iconic motif. Spectral-edged liquid metal / glass hands, blobs, shards. Photographic, not vector. Always centered or asymmetric on dark ink.
4. **Neon-edge rounded rectangles** — saturated blue (`#316BFF`) bevel-glow strips at a diagonal, occasionally used as the entire backdrop of a poster.
5. **Film grain** at ~22% opacity, `mix-blend-mode: overlay`, to keep the dark gradients from banding.

Gradients are used *very* restrictively: only `#003ACE → #316BFF` on the logo K mark, and the diagonal-flow shimmer on the year "26" text. **No purple→blue gradients**, no pastel washes.

**Imagery vibe.** Cool, dark, monochrome with one spectral kiss of color (the dispersion rainbow on glass edges). Photography is metallic / chrome / liquid mercury — never warm, never matte, never people-stock-photo. Headshots, when used, are tightly cropped in B&W or with a deep blue cast, dropped onto a blue-tinted card.

**Hover states.**
- Default: lift `translateY(-2px)`, swap `--border` to `--border-blue` (`rgba(49,107,255,0.30)`), tint background with `rgba(49,107,255,0.06)`.
- CTA: keep blue, brighten to `#4579FF`, add the blue glow (`--glow-blue-cta`), kill the resting pulse animation.
- Links: subtle 1px underline grows from left (`linear-gradient(90deg, var(--blue-bright), transparent)`).

**Press states.** Quick `0.15s` `transform: scale(0.98)`, no color shift. Khinext does not flash darker on press.

**Borders.** Always hairline. `1px solid rgba(255,255,255,0.08)` is the default. The "lit" version is `1px solid rgba(49,107,255,0.30)`. The "very lit" version is `1px solid rgba(49,107,255,0.55)` reserved for the featured pricing tier and active state.

**Shadows.**
- Cards rest *without* shadow on the ink background. Elevation is communicated by the blue glow ring instead.
- Glow rings come in two stops: `sm` (resting) and `md` (hover). See `--glow-blue-sm` / `--glow-blue-md` in CSS.
- There is one baked-in `0px 4px 4px 0px rgba(0,0,0,0.25)` shadow that the figma applies to logo K marks — preserve it on the mark, do not extend it elsewhere.
- CTAs use a slow `btnGlowPulse` (3.5s) at rest and a hard `--glow-blue-cta` on hover.

**Transparency & blur.** Heavy use of `backdrop-filter: blur(20px)` on the fixed nav. Cards use `rgba(255,255,255,0.04)` glass tint without blur (the dark backdrop is already textured). Modal overlays would use `blur(40px)` over `rgba(4,11,28,0.85)`.

**Corner radii.** Pill (`999px`) for buttons / chips / badges. `20–24px` for cards. `10–14px` for small icon containers. `6px` for inline tags. Nothing in the system uses sharp 0px corners except hairline dividers.

**Animation.** Subtle, cinematic. The system relies on a single easing curve: `cubic-bezier(0.22, 1, 0.36, 1)` for everything UI-related (the "soft" curve). Standard durations: `0.18s` quick / `0.28s` base / `0.55s` slow. Hero elements have ambient idle animations (3.4s–9s loops): floating glow orbs, pulsing neon edges, slow grid drift, blue-italic-aura breathing. No bounces. No spring overshoot. Entrances are 22px slide-up + scale-from-0.96 + 0.75s ease.

**Layout rules.** Fixed top nav with glass + backdrop-blur. 1200px max content width. Sections are 100–120px vertical padding, 60px horizontal on desktop, 24px on mobile. Stats / domain grids snap to 4 columns; expect / why grids to 3 or 2. Hero is always centered and full-viewport.

---

## Iconography

**The brand uses TWO icon systems, side by side.**

1. **Lucide Icons** (open-source SVG, 1.5px stroke).
   The figma file's `components/` registry is pure Lucide: `camera`, `banknote`, `book-copy`, `briefcase-medical`, `building-2`, `coffee`, `cloud-hail`, `folder-open`, `megaphone`, `mic-vocal`, `network`, `phone`, `qr-code`, `sofa`, `webhook`, `drama`. All these are Lucide names exactly. **For any utility icon, use Lucide via CDN** — see `assets/icons/lucide.html` for the import pattern. Color them `var(--fg-2)` at rest, `var(--khi-blue)` on hover.

2. **Domain-Zone Icons** — bespoke geometric set, one per innovation zone.
   These are NOT generic icons. They are simple 2-shape compositions (rhombus, half-circle pair, beak, clover, four-quadrant, crystal, etc.) on a solid rounded square (`22.5px` radius) in the zone's accent color, with the icon mark cut out in `#040B1C`. Live SVGs are inlined in `ui_kits/website/Domains.jsx` and stamped onto Brand-Guide post 1 in Figma. Always render at 56×56 (compact) or 112×112 (poster) with a matching outer glow halo (`--icon-glow-rgb` set per zone).

3. **The Khinext K mark** — the glassy "K-with-arrow" rounded-square logo. This is the single recognizable brand mark and lives at `assets/logo-mark.png`. It is also reconstructed in SVG inside the Figma but treat the PNG as the master.

**Unicode / emoji.** Not in the system. The two emoji that appear on the marketing prototype (`☕` `🏆`) are flagged as placeholders to be replaced.

**Logo files.**
- `assets/logo.png` — full lockup ("Khi" white + "next" italic blue + glass K mark), 1016×233, transparent PNG.
- `assets/logo-mark.png` — square K mark only, 146×148.

---

## Index

```
.
├── README.md                  ← you are here
├── SKILL.md                   ← Agent Skill manifest
├── colors_and_type.css        ← @font-face + CSS tokens (import everywhere)
├── assets/
│   ├── logo.png               ← full lockup
│   ├── logo-mark.png          ← square mark
│   ├── glass-hands.png        ← signature chrome-hands hero image
│   ├── blueprint-bg.png       ← announcer-style portrait backdrop
│   └── icons/                 ← Lucide import helper
├── fonts/                     ← Helvetica + Helvetica Now Display TTFs
├── preview/                   ← cards rendered into the Design System tab
└── ui_kits/
    └── website/               ← Khinext '26 marketing site recreation
        ├── README.md
        ├── index.html
        ├── Hero.jsx
        ├── Nav.jsx
        ├── Stats.jsx
        ├── Domains.jsx
        ├── Tiers.jsx
        └── Footer.jsx
```

**Where to start.** Most prototypes only need `colors_and_type.css` + a few assets. If you're building a page for the summit, copy the kit's `Hero` and `Domains` components and you've already got 80% of the look.
