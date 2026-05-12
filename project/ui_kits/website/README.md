# Khinext '26 Website — UI Kit

This kit recreates the marketing surface of `khinext26-website_1.html` using the **brand-correct** type and color (Helvetica/Helvetica Now Display + `#316BFF`), so designs built on top of it stay consistent with the rest of the design system.

## Run it

Open `index.html` directly. It loads React, Babel, and the components in order. All styles come from `../../colors_and_type.css` and a small per-component scoped stylesheet.

## Components

| File | What it is |
|---|---|
| `Nav.jsx` | Fixed glass nav with K-mark + lockup + pill CTA |
| `Hero.jsx` | Mesh / grid / chrome-hands hero with italic-accent headline, date strip, and badge |
| `Stats.jsx` | 4-up hairline-separated stat strip |
| `Domains.jsx` | 8 innovation-zone cards with per-zone halo |
| `Tiers.jsx` | 5 sponsorship tier cards, "Most Popular" ribbon on Gold |
| `Footer.jsx` | Logo + copy line + social links |

Each component is a thin, mainly-cosmetic recreation. Logic and data are minimal/fake (e.g. domain list and tier features live as in-file arrays).

## Differences vs the prototype

The reference website (`Khinext Website/khinext26-website_1.html`) substituted Syne + DM Sans (Google Fonts) and `#2060FF` because Helvetica is not free. **This kit follows the brand brief**: Helvetica + Helvetica Now Display from `fonts/`, and `#316BFF`. The visual treatment (glow, grid, italic accent, neon-edged cards) is otherwise faithful.

## Not included

- WebGL liquid-gradient hero plane (the prototype uses a raw WebGL canvas; we substitute the chrome-hands brand asset for a static hero).
- Bento gallery, full team grid, sponsor logo slider, venue map block. Add them when you need them — the existing tokens cover everything you'd need.
