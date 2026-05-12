// Khinext Nav — fixed glass nav with K-mark lockup + pill CTA
// The K mark is rebuilt in SVG to color it on the fly; the master
// raster lives at assets/logo-mark.png if you need it elsewhere.

function KhinextMark() {
  return (
    <span className="kx-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6"
           strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4v16M6 12l9-8M6 12l9 8M14 6h4v4" />
      </svg>
    </span>
  );
}

function KhinextWord() {
  return (
    <span className="kx-word">Khi<em>next</em></span>
  );
}

function Nav() {
  return (
    <nav className="kx-nav" data-screen-label="Nav">
      <a className="kx-lockup" href="#hero">
        <KhinextMark />
        <KhinextWord />
      </a>
      <ul className="kx-nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#domains">Domains</a></li>
        <li><a href="#expect">What to Expect</a></li>
        <li><a href="#sponsors">Sponsorship</a></li>
        <li><a href="#venue">Venue</a></li>
        <li><a href="#contact" className="kx-nav-cta">Partner With Us</a></li>
      </ul>
    </nav>
  );
}

Object.assign(window, { Nav, KhinextMark, KhinextWord });
