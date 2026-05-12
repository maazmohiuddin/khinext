// Khinext Hero — chrome-hands brand image + mesh/grid glow,
// pill badge, italic-accent headline, date strip.

function Hero() {
  return (
    <section className="kx-hero" id="hero" data-screen-label="Hero">
      <div className="kx-hero-bg"  aria-hidden="true" />
      <div className="kx-hero-mesh" aria-hidden="true" />
      <div className="kx-hero-grid" aria-hidden="true" />
      <div className="kx-hero-glow" aria-hidden="true" />

      <div className="kx-hero-badge">
        <span className="dot" />
        Pakistan's Largest AI &amp; Innovation Summit
      </div>

      <h1>
        AI in <span className="kx-accent">Everything</span>.<br/>
        Future starts <span className="year">'26</span>.
      </h1>

      <p className="kx-hero-tagline">Innovate &middot; Inspire &middot; Impact</p>

      <p className="kx-hero-sub">
        Where global tech leaders, founders, creators, and communities
        converge. One day. One city. One movement.
      </p>

      <div className="kx-hero-actions">
        <button className="kx-btn-primary">Become a Sponsor →</button>
        <button className="kx-btn-outline">Explore the Summit</button>
      </div>

      <div className="kx-date-bar">
        <div className="kx-date-item">
          <span className="kx-date-label">Date</span>
          <span className="kx-date-value">June 7, 2026</span>
        </div>
        <span className="kx-date-sep">·</span>
        <div className="kx-date-item">
          <span className="kx-date-label">Venue</span>
          <span className="kx-date-value">PC Hotel Karachi</span>
        </div>
        <span className="kx-date-sep">·</span>
        <div className="kx-date-item">
          <span className="kx-date-label">Attendees</span>
          <span className="kx-date-value">10,000+</span>
        </div>
        <span className="kx-date-sep">·</span>
        <div className="kx-date-item">
          <span className="kx-date-label">Domains</span>
          <span className="kx-date-value">8 Innovation Zones</span>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero });
