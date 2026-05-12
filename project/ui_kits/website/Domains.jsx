// Khinext Domains — 8 innovation-zone cards with per-zone halo.
// Each icon is a 2-shape geometric composition (rounded square + cutout)
// in the zone's accent color. SVG payloads are lifted from the
// Figma file's component registry, simplified for clarity.

const ZONES = [
  {
    name: "Health & Pharma",
    desc: "AI-driven diagnostics, digital health, and biotech innovation.",
    rgb: "81,255,213",
    icon: (
      <svg viewBox="0 0 208 209" xmlns="http://www.w3.org/2000/svg">
        <path d="M74.64 103.48c0 15.26 12.37 27.62 27.63 27.62V75.85c-15.26 0-27.63 12.37-27.63 27.63z" fill="#040B1C"/>
        <path d="M102.27 103.48c0 15.26 12.37 27.62 27.62 27.62V75.85c-15.26 0-27.62 12.37-27.62 27.63z" fill="#040B1C"/>
      </svg>
    ),
  },
  {
    name: "Smart Cities",
    desc: "Telecom, safety, urban tech, sustainability & mobility.",
    rgb: "0,234,238",
    icon: (
      <svg viewBox="0 0 208 211" xmlns="http://www.w3.org/2000/svg">
        <path d="M140.78 96.83c0 20.1-16.3 36.39-36.39 36.39-20.1 0-36.39-16.3-36.39-36.39h19.89c-.01.28-.04.55-.04.83 0 9.13 7.4 16.54 16.54 16.54s16.54-7.4 16.54-16.54c0-.28-.03-.55-.04-.83h19.89zm-19.89 0c-.43-8.75-7.64-15.71-16.5-15.71-8.86 0-16.07 6.96-16.5 15.71h33z" fill="#040B1C"/>
      </svg>
    ),
  },
  {
    name: "Creativity & Media",
    desc: "Design, storytelling, and generative AI converge.",
    rgb: "191,0,255",
    icon: (
      <svg viewBox="0 0 208 208" xmlns="http://www.w3.org/2000/svg">
        <path d="M104.14 86.78L87.44 103.48 70.74 86.78 87.44 70.08l16.7 16.7zm33.4 0L120.84 70.08l-16.7 16.7 16.7 16.7 16.7-16.7zM70.74 120.18l16.7 16.7 16.7-16.7-16.7-16.7-16.7 16.7zm33.4 0l16.7 16.7 16.7-16.7-16.7-16.7-16.7 16.7z" fill="#040B1C"/>
      </svg>
    ),
  },
  {
    name: "Fintech Future",
    desc: "The evolution of finance through AI and automation.",
    rgb: "255,184,0",
    icon: (
      <svg viewBox="0 0 208 211" xmlns="http://www.w3.org/2000/svg">
        <path d="M132.62 135.93h-28.66c-15.83 0-28.66-12.83-28.66-28.66h28.66c-15.83 0-28.66-12.83-28.66-28.66h28.66c15.83 0 28.66 12.83 28.66 28.66h-28.66c15.83 0 28.66 12.83 28.66 28.66z" fill="#040B1C"/>
      </svg>
    ),
  },
  {
    name: "DevZone & Learning",
    desc: "AI hackathons, workshops, and hands-on coding sessions.",
    rgb: "212,255,0",
    icon: (
      <svg viewBox="0 0 207 207" xmlns="http://www.w3.org/2000/svg">
        <path d="M103.75 76.68H74.38v29.38c16.22 0 29.38-13.15 29.38-29.38z" fill="#040B1C"/>
        <path d="M133.13 76.68h-29.38v29.38c16.22 0 29.38-13.15 29.38-29.38z" fill="#040B1C"/>
        <path d="M133.13 135.44v-29.38h-29.38c0 16.23 13.15 29.38 29.38 29.38z" fill="#040B1C"/>
        <path d="M103.75 135.44v-29.38H74.38c0 16.23 13.15 29.38 29.38 29.38z" fill="#040B1C"/>
      </svg>
    ),
  },
  {
    name: "Culture & Heritage",
    desc: "AI and innovation in culture, tourism, and heritage ecosystems.",
    rgb: "255,77,0",
    icon: (
      <svg viewBox="0 0 208 208" xmlns="http://www.w3.org/2000/svg">
        <circle cx="104" cy="104" r="9" fill="#040B1C"/>
        <circle cx="80"  cy="80"  r="6" fill="#040B1C"/>
        <circle cx="128" cy="80"  r="6" fill="#040B1C"/>
        <circle cx="80"  cy="128" r="6" fill="#040B1C"/>
        <circle cx="128" cy="128" r="6" fill="#040B1C"/>
        <path d="M104 90c0 8-12 14-12 14s12 6 12 14 12-14 12-14-12-6-12-14z" fill="#040B1C"/>
      </svg>
    ),
  },
  {
    name: "Lifestyle Innovation",
    desc: "Improving physical and mental well-being through technology.",
    rgb: "255,15,75",
    icon: (
      <svg viewBox="0 0 208 211" xmlns="http://www.w3.org/2000/svg">
        <path d="M119.84 105.2c4.2-1.63 8.14-4.03 10.36-6.25 5.18-5.18 5.18-13.57 0-18.74-5.18-5.18-13.57-5.18-18.74 0-2.22 2.22-4.62 6.16-6.25 10.35-1.63-4.2-4.03-8.14-6.25-10.36-5.18-5.18-13.57-5.18-18.74 0-5.18 5.18-5.18 13.57 0 18.74 2.22 2.22 6.16 4.62 10.35 6.25-4.2 1.63-8.14 4.03-10.36 6.25-5.18 5.18-5.18 13.57 0 18.74 5.18 5.18 13.57 5.18 18.74 0 2.22-2.22 4.62-6.16 6.25-10.35 1.63 4.2 4.03 8.14 6.25 10.36 5.18 5.18 13.57 5.18 18.74 0 5.18-5.18 5.18-13.57 0-18.74-2.22-2.22-6.16-4.62-10.35-6.25z" fill="#040B1C"/>
      </svg>
    ),
  },
  {
    name: "Investor & Startup Arena",
    desc: "Founder pitches, VC networking, and growth mentoring.",
    rgb: "226,226,226",
    icon: (
      <svg viewBox="0 0 208 211" xmlns="http://www.w3.org/2000/svg">
        <circle cx="91" cy="91" r="14" fill="#040B1C"/>
        <circle cx="119" cy="91" r="14" fill="#040B1C"/>
        <circle cx="91" cy="119" r="14" fill="#040B1C"/>
        <circle cx="119" cy="119" r="14" fill="#040B1C"/>
      </svg>
    ),
  },
];

function Domain({ zone }) {
  return (
    <div className="kx-domain" style={{ "--c": zone.rgb }}>
      <div className="kx-domain-icon">{zone.icon}</div>
      <div className="kx-domain-name">{zone.name}</div>
      <div className="kx-domain-desc">{zone.desc}</div>
    </div>
  );
}

function Domains() {
  return (
    <section className="kx-section subtle" id="domains" data-screen-label="Domains">
      <div className="kx-section-head center">
        <div className="kx-eyebrow">Focus Domains</div>
        <h2>8 Innovation <span className="kx-accent">Zones</span></h2>
        <p>Each domain features dedicated talks, showcases, and networking sessions led by world-class experts.</p>
      </div>
      <div className="kx-domains">
        {ZONES.map((z) => <Domain key={z.name} zone={z} />)}
      </div>
    </section>
  );
}

Object.assign(window, { Domains, Domain, ZONES });
