// HomePage.jsx — Khinext '26 landing page

function HomePage({ setPage }) {
  const { useEffect } = React;

  useEffect(() => {
    const els = document.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="kx-page">
      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-mesh" />
        <div className="home-hero-grid" />
        <div className="home-hero-glow" />

        <div className="badge" style={{ position: "relative", zIndex: 1 }}>
          <span className="dot" />
          Karachi · 2026 · AI Expo + Gaming
        </div>

        <h1>
          Pakistan's first<br />
          <span className="kx-accent">AI Summit</span><br />
          is here.
        </h1>
        <p className="tagline">AI IN EVERYTHING · FUTURE STARTS HERE</p>
        <p className="sub">
          10,000+ attendees. 100+ speakers. 8 innovation zones.<br />
          Two days that will define South Asia's tech decade.
        </p>
        <div className="actions">
          <button className="kx-btn-primary" onClick={() => setPage("register")}>
            Register Now →
          </button>
          <button className="kx-btn-outline" onClick={() => setPage("submit")}>
            Submit AI Project
          </button>
        </div>
        <div className="date-bar">
          <div className="date-item">
            <span className="date-label">Event</span>
            <span className="date-value">KHINEXT '26</span>
          </div>
          <span className="date-sep">·</span>
          <div className="date-item">
            <span className="date-label">Location</span>
            <span className="date-value">Karachi, Pakistan</span>
          </div>
          <span className="date-sep">·</span>
          <div className="date-item">
            <span className="date-label">Scale</span>
            <span className="date-value">10K+ Attendees</span>
          </div>
          <span className="date-sep">·</span>
          <div className="date-item">
            <span className="date-label">Duration</span>
            <span className="date-value">2 Days</span>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="stats-strip fade-up">
        {[
          { num: "10K", acc: "+", lbl: "Attendees" },
          { num: "100", acc: "+", lbl: "Speakers" },
          { num: "8",   acc: "",  lbl: "Innovation Zones" },
          { num: "50",  acc: "+", lbl: "Sessions" },
        ].map(s => (
          <div className="stat" key={s.lbl}>
            <div className="num">{s.num}<span className="acc">{s.acc}</span></div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Two pillars ── */}
      <section className="kx-section fade-up">
        <div className="kx-section-head" style={{ marginBottom: 44 }}>
          <div className="kx-eyebrow">Experience Tracks</div>
          <h2>Two flagship <span className="kx-accent">experiences</span></h2>
          <p>Khinext '26 runs two parallel world-class tracks under one roof — a cutting-edge AI exposition and Pakistan's largest gaming arena.</p>
        </div>
        <div className="pillars">
          {/* AI Expo pillar */}
          <div className="pillar" onClick={() => setPage("ai-expo")} style={{ cursor: "pointer" }}>
            <div className="num">01 · AI EXPO '26</div>
            <h3>Artificial<br />Intelligence<br /><span className="kx-accent">Expo</span></h3>
            <p>Pakistan's most significant AI showcase. Startups, researchers and multinationals present breakthroughs across 7 innovation domains — from Health to Fintech to Smart Cities.</p>
            <div className="meta">
              <div><span className="k">Projects</span><span className="v">50+</span></div>
              <div><span className="k">Speakers</span><span className="v">60+</span></div>
              <div><span className="k">Domains</span><span className="v">7</span></div>
            </div>
            <div className="more">Explore AI Expo</div>
          </div>

          {/* Gaming Arena pillar */}
          <div className="pillar" onClick={() => setPage("gaming")} style={{ cursor: "pointer", background: "rgba(255,255,255,0.03)" }}>
            <div className="num" style={{ color: "#D4FF00" }}>02 · GAMING ARENA</div>
            <h3>Gaming<br />Arena <span className="kx-accent">Dilkusha</span></h3>
            <p>Pakistan's largest live gaming event. PS5 tournaments, high-performance PC battle stations, and VR experiences at Dilkusha Hall — brought to life by the country's biggest gaming community.</p>
            <div className="meta">
              <div><span className="k">PS5 Stations</span><span className="v">30+</span></div>
              <div><span className="k">PC Rigs</span><span className="v">50+</span></div>
              <div><span className="k">VR Pods</span><span className="v">10</span></div>
            </div>
            <div className="more" style={{ color: "#D4FF00" }}>Explore Gaming Arena</div>
          </div>
        </div>
      </section>

      {/* ── What to Expect ── */}
      <section className="kx-section subtle fade-up">
        <div className="kx-section-head center" style={{ marginBottom: 48 }}>
          <div className="kx-eyebrow">At Khinext '26</div>
          <h2>What to <span className="kx-accent">expect</span></h2>
        </div>
        <div className="cards-3">
          {[
            { title: "AI Project Showcase", body: "50+ AI projects live-demoing across 7 innovation domains. Vote for your favourite, talk directly to builders." },
            { title: "Keynotes & Panels", body: "100+ speakers including AI researchers, founders, government leaders and global innovators — across 50+ sessions." },
            { title: "Hackathon", body: "48-hour build sprint with real problems from industry partners. PKR 10M+ in prizes. Open to all skill levels." },
            { title: "Gaming Tournaments", body: "Bracket-style PS5 and PC tournaments with live streaming, pro commentary and massive prize pools." },
            { title: "Investor Arena", body: "Curated demo slots in front of 40+ active investors. Warm intros facilitated by the Khinext team." },
            { title: "Networking Lounges", body: "Domain-specific lounges across all 8 zones. AI-matched meeting system pairs attendees before the event." },
          ].map(c => (
            <div className="card" key={c.title}>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.01em" }}>{c.title}</h4>
              <p style={{ margin: 0, fontSize: 14, color: "var(--fg-3)", lineHeight: 1.6 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Innovation Zones ── */}
      <section className="kx-section fade-up">
        <div className="kx-section-head" style={{ marginBottom: 44 }}>
          <div className="kx-eyebrow">Innovation Zones</div>
          <h2>7 domains,<br />one <span className="kx-accent">stage</span></h2>
        </div>
        <div className="cards-3" style={{ gap: 14 }}>
          {[
            { color: "#51FFD5", label: "Health & Pharma" },
            { color: "#00EAEE", label: "Smart Cities" },
            { color: "#BF00FF", label: "Creative AI" },
            { color: "#FFB800", label: "Fintech Future" },
            { color: "#D4FF00", label: "DevZone" },
            { color: "#FF0F4B", label: "Lifestyle Innovation" },
            { color: "#E2E2E2", label: "Investor Arena" },
          ].map(z => (
            <div
              key={z.label}
              className="card"
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", cursor: "pointer" }}
              onClick={() => setPage("ai-expo")}
            >
              <div style={{ width: 10, height: 10, borderRadius: 3, background: z.color, boxShadow: `0 0 10px ${z.color}66`, flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: "var(--fg-2)", fontWeight: 500 }}>{z.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sponsorship tiers ── */}
      <section className="kx-section subtle fade-up">
        <div className="kx-section-head center" style={{ marginBottom: 48 }}>
          <div className="kx-eyebrow">Sponsorship</div>
          <h2>Choose your <span className="kx-accent">tier</span></h2>
          <p>Join Pakistan's most prestigious tech summit as a partner. Limited slots per tier. Early partners get dedicated zone naming rights.</p>
        </div>
        <div className="cards-3">
          <div className="tier">
            <div className="nm platinum">Platinum</div>
            <p style={{ fontSize: 13, color: "var(--fg-3)", margin: "8px 0 0", lineHeight: 1.5 }}>Premium visibility across all event surfaces and digital channels.</p>
            <ul className="feats">
              <li>Stage banner + podium branding</li>
              <li>30-min keynote slot</li>
              <li>Logo on all print + digital</li>
              <li>10 delegate passes</li>
            </ul>
          </div>
          <div className="tier featured">
            <div className="nm title">Title Sponsor</div>
            <p style={{ fontSize: 13, color: "var(--fg-3)", margin: "8px 0 0", lineHeight: 1.5 }}>The summit bears your name. Total brand ownership across the event.</p>
            <ul className="feats">
              <li>Event naming rights</li>
              <li>Exclusive opening ceremony</li>
              <li>Zone naming + activation</li>
              <li>Priority media coverage</li>
              <li>25 delegate passes</li>
            </ul>
          </div>
          <div className="tier">
            <div className="nm gold">Gold</div>
            <p style={{ fontSize: 13, color: "var(--fg-3)", margin: "8px 0 0", lineHeight: 1.5 }}>Strong presence in select zones and sessions.</p>
            <ul className="feats">
              <li>Zone banner + branding</li>
              <li>Panel session speaking slot</li>
              <li>Logo on website + app</li>
              <li>5 delegate passes</li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 36 }}>
          <button className="kx-btn-primary" onClick={() => setPage("register")}>
            Become a Partner →
          </button>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="kx-section fade-up" style={{ textAlign: "center" }}>
        <div className="kx-eyebrow" style={{ justifyContent: "center", display: "flex", marginBottom: 20 }}>The Stage Is Set</div>
        <h2 style={{ maxWidth: 700, margin: "0 auto 20px", color: "#fff", fontFamily: "var(--font-display)", fontSize: "clamp(40px,5vw,64px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.04 }}>
          Be part of<br /><span className="kx-accent">history</span>
        </h2>
        <p style={{ color: "var(--fg-3)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7 }}>
          Khinext '26 is Pakistan's flagship AI summit — two days in Karachi that will set the direction for South Asia's next decade of technology.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="kx-btn-primary" onClick={() => setPage("register")}>Register for Khinext '26</button>
          <button className="kx-btn-outline" onClick={() => setPage("submit")}>Submit Your AI Project</button>
        </div>
      </section>
    </div>
  );
}

window.HomePage = HomePage;
