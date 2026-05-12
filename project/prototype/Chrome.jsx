// Chrome.jsx — Nav, Footer, and the K-mark logo SVG

function KxMark({ size = 36 }) {
  return (
    <div className="kx-mark" style={{ width: size, height: size, borderRadius: size * 0.28 }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 18 18" fill="none">
        <path d="M3 2.5L3 15.5M3 9.5L9.5 3.5M3 9.5L10.5 15.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6L15.5 9.5L12 13" stroke="#8FAFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function Nav({ page, setPage }) {
  const links = [
    { label: "Home",        key: "home" },
    { label: "AI Expo",     key: "ai-expo" },
    { label: "Gaming Arena",key: "gaming" },
    { label: "Submit",      key: "submit" },
    { label: "Register",    key: "register" },
    { label: "Admin",       key: "admin" },
  ];

  return (
    <nav className="kx-nav">
      <a
        className="kx-lockup"
        href="#"
        onClick={e => { e.preventDefault(); setPage("home"); }}
        style={{ textDecoration: "none" }}
      >
        <KxMark size={36} />
        <span className="kx-word">Khi<em>next</em></span>
      </a>
      <ul className="kx-nav-links">
        {links.slice(0, 4).map(l => (
          <li key={l.key}>
            <a
              href="#"
              className={page === l.key ? "active" : ""}
              onClick={e => { e.preventDefault(); setPage(l.key); }}
            >
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#"
            className={"kx-nav-cta" + (page === "register" ? " active" : "")}
            onClick={e => { e.preventDefault(); setPage("register"); }}
          >
            Register Now
          </a>
        </li>
      </ul>
    </nav>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="kx-footer">
      <div className="kx-footer-logo">
        <img src="../assets/logo.png" alt="Khinext" style={{ height: 28 }} />
      </div>
      <div className="kx-footer-copy">
        <em>KHINEXT '26</em> — Pakistan's first multi-domain AI Summit.<br />
        Karachi · 2026 · <span style={{ color: "var(--fg-4)" }}>INNOVATE · INSPIRE · IMPACT</span>
      </div>
      <div className="kx-footer-links">
        <a href="#" onClick={e => { e.preventDefault(); setPage("ai-expo"); }}>AI Expo</a>
        <a href="#" onClick={e => { e.preventDefault(); setPage("gaming"); }}>Gaming</a>
        <a href="#" onClick={e => { e.preventDefault(); setPage("submit"); }}>Submit</a>
        <a href="#" onClick={e => { e.preventDefault(); setPage("register"); }}>Register</a>
      </div>
    </footer>
  );
}

window.KxMark = KxMark;
window.Nav = Nav;
window.Footer = Footer;
