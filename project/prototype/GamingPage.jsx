// GamingPage.jsx — Gaming Arena at Dilkusha Hall

function GamingPage({ setPage }) {
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

  const stations = [
    {
      tag: "Console Gaming",
      count: "30",
      unit: "Stations",
      name: "PS5 Tournament Zone",
      items: [
        "30 Sony PS5 consoles with 4K monitors",
        "FIFA, COD, NBA 2K bracket tournaments",
        "Live commentary and streaming setup",
        "Custom Khinext controller skins",
        "PKR 500K+ prize pool",
      ],
      zoneColor: "rgba(49,107,255,0.20)",
    },
    {
      tag: "PC Gaming",
      count: "50",
      unit: "Rigs",
      name: "PC Battle Station Arena",
      items: [
        "50 high-performance rigs (RTX 4090, 360Hz)",
        "Valorant, CS2, PUBG PC, Dota 2 tournaments",
        "Sponsored peripherals by top gaming brands",
        "Open scrimmage slots for attendees",
        "PKR 750K+ prize pool",
      ],
      zoneColor: "rgba(212,255,0,0.12)",
    },
    {
      tag: "Immersive Tech",
      count: "10",
      unit: "VR Pods",
      name: "VR Experience Zone",
      items: [
        "Meta Quest 3 + Valve Index headsets",
        "AI-generated immersive environments",
        "VR shooter and puzzle league",
        "Beat Saber time-attack tournament",
        "First-time VR guided experiences",
      ],
      zoneColor: "rgba(191,0,255,0.12)",
    },
  ];

  const brackets = [
    { game: "FIFA '25", platform: "PS5", format: "1v1 Knockout", prizePool: "PKR 150K", slots: 64 },
    { game: "Call of Duty",platform: "PS5", format: "4v4 Team",   prizePool: "PKR 200K", slots: 32 },
    { game: "Valorant",   platform: "PC",  format: "5v5 Team",    prizePool: "PKR 300K", slots: 16 },
    { game: "CS2",        platform: "PC",  format: "5v5 Team",    prizePool: "PKR 250K", slots: 16 },
    { game: "PUBG PC",    platform: "PC",  format: "Squad (4)",   prizePool: "PKR 200K", slots: 20 },
    { game: "Beat Saber", platform: "VR",  format: "Solo Sprint",  prizePool: "PKR 50K",  slots: 32 },
  ];

  return (
    <div className="kx-page">
      {/* ── Page hero ── */}
      <div className="kx-pagehero" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,255,0,0.14) 0%, transparent 60%), #02040A" }}>
        <div className="grid-bg" style={{ backgroundImage: "linear-gradient(rgba(212,255,0,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(212,255,0,0.10) 1px, transparent 1px)" }} />
        <div className="kx-eyebrow" style={{ color: "#D4FF00" }}>
          <span style={{ background: "#D4FF00" }} />
          Track 02
        </div>
        <h1>Gaming <span className="kx-accent">Arena</span></h1>
        <p className="lead">
          Pakistan's largest live gaming event — PS5 tournaments, high-performance PC battle stations and VR experiences at Dilkusha Hall. Brought to life by the country's biggest gaming community.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 32 }}>
          <button className="kx-btn-primary" style={{ background: "#D4FF00", color: "#040B1C", boxShadow: "0 6px 22px rgba(212,255,0,0.32)" }}
            onClick={() => setPage("register")}>
            Register to Play →
          </button>
          <button className="kx-btn-outline" onClick={() => setPage("register")}>
            Spectator Pass
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-strip fade-up">
        {[
          { num: "30",   acc: "+", lbl: "PS5 Stations" },
          { num: "50",   acc: "+", lbl: "PC Rigs" },
          { num: "10",   acc: "",  lbl: "VR Pods" },
          { num: "1.4",  acc: "M+",lbl: "Prize Pool (PKR)" },
        ].map(s => (
          <div className="stat" key={s.lbl}>
            <div className="num">{s.num}<span className="acc">{s.acc}</span></div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Gaming Stations ── */}
      <section className="kx-section fade-up">
        <div className="kx-section-head" style={{ marginBottom: 44 }}>
          <div className="kx-eyebrow">Dilkusha Hall</div>
          <h2>Three <span className="kx-accent">arenas</span>,<br />one hall</h2>
          <p>Dilkusha Hall is split into three fully-equipped competitive zones. Each runs its own bracket, prize pool and live stream.</p>
        </div>
        <div className="cards-3">
          {stations.map(s => (
            <div
              key={s.name}
              className="station"
              style={{ "--zone-color": s.zoneColor }}
            >
              <div className="tag">{s.tag}</div>
              <div className="count">{s.count}<span className="unit">{s.unit}</span></div>
              <h4>{s.name}</h4>
              <ul>
                {s.items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tournament Brackets ── */}
      <section className="kx-section subtle fade-up">
        <div className="kx-section-head" style={{ marginBottom: 44 }}>
          <div className="kx-eyebrow">Tournaments</div>
          <h2>Compete for<br /><span className="kx-accent">PKR 1.4M+</span></h2>
          <p>Six official tournament brackets across console, PC and VR. Registration opens 30 days before the event. All slots are first-come, first-served.</p>
        </div>
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1.2fr 80px", padding: "14px 22px", borderBottom: "1px solid var(--border)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--fg-4)", fontWeight: 700 }}>
            <span>Game</span>
            <span>Platform</span>
            <span>Format</span>
            <span>Prize Pool</span>
            <span>Slots</span>
          </div>
          {brackets.map((b, i) => (
            <div key={b.game} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1.2fr 80px",
              padding: "18px 22px", alignItems: "center",
              borderBottom: i < brackets.length - 1 ? "1px solid var(--border)" : "none",
              fontSize: 14,
              transition: "background .2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ color: "#fff", fontWeight: 600 }}>{b.game}</span>
              <span style={{
                display: "inline-block", fontSize: 11, padding: "4px 10px",
                borderRadius: 999, background: b.platform === "PS5" ? "rgba(49,107,255,0.12)" : b.platform === "VR" ? "rgba(191,0,255,0.12)" : "rgba(212,255,0,0.10)",
                border: `1px solid ${b.platform === "PS5" ? "rgba(49,107,255,0.32)" : b.platform === "VR" ? "rgba(191,0,255,0.32)" : "rgba(212,255,0,0.24)"}`,
                color: b.platform === "PS5" ? "var(--khi-blue-soft)" : b.platform === "VR" ? "#D48FFF" : "#D4FF00",
                fontWeight: 700, letterSpacing: "0.08em",
              }}>{b.platform}</span>
              <span style={{ color: "var(--fg-2)" }}>{b.format}</span>
              <span style={{ color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700 }}>{b.prizePool}</span>
              <span style={{ color: "var(--fg-3)" }}>{b.slots} teams</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Venue ── */}
      <section className="kx-section fade-up">
        <div className="kx-section-head" style={{ marginBottom: 44 }}>
          <div className="kx-eyebrow">Venue</div>
          <h2>Dilkusha Hall,<br /><span className="kx-accent">Karachi</span></h2>
        </div>
        <div className="cards-2">
          {[
            { label: "Capacity", value: "5,000+ concurrent gamers and spectators" },
            { label: "Location", value: "Dilkusha Hall, Karachi — central venue, easily accessible" },
            { label: "Streaming", value: "Full broadcast setup with multiple camera angles, live commentary in Urdu + English" },
            { label: "Food & Gaming Lounges", value: "Dedicated F&B zones, merchandise stalls and sponsor activations throughout" },
          ].map(item => (
            <div key={item.label} className="card">
              <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-4)", fontWeight: 700, marginBottom: 8 }}>{item.label}</div>
              <div style={{ color: "var(--fg-2)", lineHeight: 1.6 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="kx-section subtle fade-up" style={{ textAlign: "center" }}>
        <div className="kx-eyebrow" style={{ justifyContent: "center", display: "flex", marginBottom: 20, color: "#D4FF00" }}>Gaming Arena</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,4.5vw,56px)", fontWeight: 800, letterSpacing: "-0.035em", color: "#fff", margin: "0 auto 20px", maxWidth: 600, lineHeight: 1.06 }}>
          Show up.<br /><span className="kx-accent">Level up.</span>
        </h2>
        <p style={{ color: "var(--fg-3)", maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.7 }}>
          Compete, spectate or just soak in Pakistan's biggest gaming atmosphere. All ticket types get access to both the AI Expo and the Gaming Arena.
        </p>
        <button className="kx-btn-primary" style={{ background: "#D4FF00", color: "#040B1C", boxShadow: "0 6px 22px rgba(212,255,0,0.32)" }}
          onClick={() => setPage("register")}>
          Register Now →
        </button>
      </section>
    </div>
  );
}

window.GamingPage = GamingPage;
