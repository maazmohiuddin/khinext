// Khinext Footer — lockup left, copyline center, social links right.

function Footer() {
  return (
    <footer className="kx-footer" data-screen-label="Footer">
      <div className="kx-footer-logo">
        <img src="../../assets/logo.png" alt="Khinext" />
      </div>
      <div className="kx-footer-copy">
        © 2026 Khinext Summit · PC Hotel Karachi<br/>
        AI in Everything: Future Starts Here
      </div>
      <div className="kx-footer-links">
        <a href="#">Twitter</a>
        <a href="#">LinkedIn</a>
        <a href="#">Instagram</a>
        <a href="#">Contact</a>
      </div>
    </footer>
  );
}

Object.assign(window, { Footer });
