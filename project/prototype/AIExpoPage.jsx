// AIExpoPage.jsx — AI Expo '26 showcase page

function AIExpoPage({ setPage }) {
  const { useEffect } = React;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const els = document.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const zones = [
    {
      color: "#51FFD5",
      name: "Health & Pharma",
      desc: "AI-assisted diagnostics, drug discovery, telemedicine platforms and on-device clinical models for low-bandwidth environments.",
      count: "12 projects",
    },
    {
      color: "#00EAEE",
      name: "Smart Cities",
      desc: "Urban mobility, energy grids, waste management and civic infrastructure powered by real-time AI inference.",
      count: "8 projects",
    },
    {
      color: "#BF00FF",
      name: "Creative AI",
      desc: "Generative art, music, writing tools and cultural heritage preservation through AI — built for South Asian contexts.",
      count: "9 projects",
    },
    {
      color: "#FFB800",
      name: "Fintech Future",
      desc: "Open finance APIs, fraud detection, SBP-compliant sandboxes and micro-lending models for the unbanked.",
      count: "11 projects",
    },
    {
      color: "#D4FF00",
      name: "DevZone",
      desc: "Developer tooling, code generation, MLOps pipelines and open-source contributions from Pakistan's engineering community.",
      count: "7 projects",
    },
    {
      color: "#FF0F4B",
      name: "Lifestyle Innovation",
      desc: "AI in fashion, food, sports and personal wellness — consumer-facing products built for the next billion users.",
      count: "6 projects",
    },
    {
      color: "#E2E2E2",
      name: "Investor Arena",
      desc: "Curated investment-ready startups presenting to 40+ active investors. Warm intros and deal room access included.",
      count: "Invite-only",
    },
  ];

  const speakers = [
    { name: "Invited Speaker", role: "AI Research Lead", org: "Global Tech", tag: "Keynote" },
    { name: "Invited Speaker", role: "Founder & CEO",   org: "Pakistan Startup", tag: "Panel" },
    { name: "Invited Speaker", role: "Director, Policy", org: "Government of Pakistan", tag: "Roundtable" },
    { name: "Invited Speaker", role: "VP Engineering",  org: "MENA Unicorn", tag: "Workshop" },
    { name: "Invited Speaker", role: "AI Ethics Lead",  org: "University Research", tag: "Keynote" },
    { name: "Invited Speaker", role: "CTO",             org: "Deep-tech Fund", tag: "Panel" },
  ];

  const schedule = [
    { time: "09:00", title: "Opening Ceremony — The Stage Is Set", type: "keynote" },
    { time: "10:00", title: "Keynote: AI in Pakistan — Where We Stand", type: "keynote" },
    { time: "11:30", title: "Zone Demos Open — All 7 Innovation Domains", type: "demo" },
    { time: "13:00", title: "Lunch Break + Networking Lounges", type: "break" },
    { time: "14:00", title: "Panel: Future of Fintech in South Asia", type: "panel" },
    { time: "15:30", title: "Investor Arena Pitch Sessions", type: "investor" },
    { time: "17:00", title: "Hackathon Kickoff — 48-Hour Sprint Begins", type: "hack" },
    { time: "18:30", title: "Closing Keynote Day 1 + Networking", type: "keynote" },
  ];

  const typeColors = {
    keynote: "#316BFF",
    panel: "#BF00FF",
    demo: "#51FFD5",
    break: "var(--fg-4)",
    investor: "#FFB800",
    hack: "#D4FF00",
  };

  return (
    <div className="kx-page">
      {/* ── Page hero ── */}
      <div className="kx-pagehero">
        <div className="grid-bg" />
        <div className="kx-eyebrow">Track 01</div>
        <h1>AI <span className="kx-accent">Expo</span> '26</h1>
        <p className="lead">
          Pakistan's most significant AI exposition. 50+ live projects across 7 innovation domains,
          60+ speakers, hackathon, and investor access — all in one venue.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 32 }}>
          <button className="kx-btn-primary" onClick={() => setPage("submit")}>
            Submit Your Project →
          </button>
          <button className="kx-btn-outline" onClick={() => setPage("register")}>
            Register to Attend
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-strip fade-up">
        {[
          { num: "50", acc: "+", lbl: "AI Projects" },
          { num: "60", acc: "+", lbl: "Speakers" },
          { num: "7",  acc: "",  lbl: "Innovation Domains" },
          { num: "40", acc: "+", lbl: "Investors" },
        ].map(s => (
          <div className="stat" key={s.lbl}>
            <div className="num">{s.num}<span className="acc">{s.acc}</span></div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Innovation Zones ── */}
      <section className="kx-section fade-up">
        <div className="kx-section-head" style={{ marginBottom: 44 }}>
          <div className="kx-eyebrow">Innovation Zones</div>
          <h2>7 domains of <span className="kx-accent">tomorrow</span></h2>
          <p>Each domain is a self-contained zone with live demos, roundtables, networking lounges and dedicated speaker sessions.</p>
        </div>
        <div className="cards-2" style={{ gap: 18 }}>
          {zones.map(z => (
            <div key={z.name} className="card" style={{ padding: "30px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: z.color + "22",
                  border: `1px solid ${z.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 18px ${z.color}33`,
                }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: z.color }} />
                </div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 16, fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>{z.name}</div>
                  <div style={{ fontSize: 11, color: z.color, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginTop: 2 }}>{z.count}</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "var(--fg-3)", lineHeight: 1.65 }}>{z.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Speakers ── */}
      <section className="kx-section subtle fade-up">
        <div className="kx-section-head center" style={{ marginBottom: 44 }}>
          <div className="kx-eyebrow">Speakers</div>
          <h2>100+ voices,<br />one <span className="kx-accent">stage</span></h2>
          <p>Keynotes, panels, workshops and roundtables from the sharpest minds in AI, tech and policy. Full lineup announced closer to the event.</p>
        </div>
        <div className="cards-3">
          {speakers.map((s, i) => (
            <div key={i} className="card" style={{ padding: "22px 20px" }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: "rgba(49,107,255,0.12)",
                border: "1px solid var(--border-blue)",
                marginBottom: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--khi-blue-soft)", fontSize: 22, fontWeight: 800,
                fontFamily: "var(--font-display)",
              }}>
                {String.fromCharCode(65 + i)}
              </div>
              <div style={{ fontSize: 11, color: "var(--khi-blue)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>{s.tag}</div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 13, color: "var(--fg-3)" }}>{s.role} · {s.org}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", color: "var(--fg-4)", marginTop: 28, fontSize: 13 }}>
          Full speaker lineup announced 60 days before the event.
        </p>
      </section>

      {/* ── Schedule (Day 1 sample) ── */}
      <section className="kx-section fade-up">
        <div className="kx-section-head" style={{ marginBottom: 44 }}>
          <div className="kx-eyebrow">Programme</div>
          <h2>Day 1 <span className="kx-accent">schedule</span></h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 760 }}>
          {schedule.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 24,
              padding: "18px 0",
              borderBottom: i < schedule.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{ minWidth: 52, fontFamily: "ui-monospace, monospace", fontSize: 13, color: "var(--fg-4)", paddingTop: 2 }}>{item.time}</div>
              <div style={{
                width: 4, height: 4, borderRadius: 2,
                background: typeColors[item.type] || "var(--border)",
                marginTop: 10, flexShrink: 0,
                boxShadow: `0 0 8px ${typeColors[item.type] || "transparent"}`,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontSize: 15, fontWeight: 500 }}>{item.title}</div>
              </div>
              <div style={{
                fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
                fontWeight: 700, color: typeColors[item.type],
                paddingTop: 3,
              }}>{item.type}</div>
            </div>
          ))}
        </div>
        <p style={{ color: "var(--fg-4)", marginTop: 20, fontSize: 13 }}>Full programme published 30 days before the event. Day 2 follows same format.</p>
      </section>

      {/* ── Submit CTA ── */}
      <section className="kx-section subtle fade-up" style={{ textAlign: "center" }}>
        <div className="kx-eyebrow" style={{ justifyContent: "center", display: "flex", marginBottom: 20 }}>AI Expo Submissions</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,4.5vw,56px)", fontWeight: 800, letterSpacing: "-0.035em", color: "#fff", margin: "0 auto 20px", maxWidth: 600, lineHeight: 1.06 }}>
          Ready to <span className="kx-accent">showcase</span> your AI?
        </h2>
        <p style={{ color: "var(--fg-3)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
          Applications are open for all 7 domains. Individual innovators, student teams and companies are welcome. The top 50 entries get a live demo booth at the event.
        </p>
        <button className="kx-btn-primary" onClick={() => setPage("submit")}>
          Submit Your AI Project →
        </button>
      </section>
    </div>
  );
}

window.AIExpoPage = AIExpoPage;
