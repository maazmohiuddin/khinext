// RegisterPage.jsx — Event registration form

function RegisterPage({ setPage }) {
  const { useState, useEffect } = React;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    org: "",
    track: "AI Expo + Gaming",
    how: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(null);

  const roles = [
    "Student / Developer",
    "Founder / Entrepreneur",
    "Investor / VC",
    "Corporate / Enterprise",
    "Researcher / Academic",
    "Government / Policy",
    "Media / Press",
    "Other",
  ];

  const tracks = [
    "AI Expo Only",
    "Gaming Arena Only",
    "AI Expo + Gaming",
    "VIP / Sponsor",
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function submit(e) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.role) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    const entry = window.addRegistration({ ...form });
    setRegistered(entry);
    setSubmitting(false);
  }

  if (registered) {
    return (
      <div className="kx-page">
        <div className="kx-pagehero">
          <div className="grid-bg" />
          <div className="kx-eyebrow">Khinext '26</div>
          <h1>Register for the <span className="kx-accent">Event</span></h1>
        </div>
        <section className="kx-section">
          <div className="success">
            <div className="check">✓</div>
            <h2>You're <span className="kx-accent">Registered</span></h2>
            <p>
              Welcome aboard, <strong style={{ color: "#fff" }}>{registered.fullName}</strong>! Your registration for Khinext '26 is confirmed.
              A confirmation email has been sent to <strong style={{ color: "#fff" }}>{registered.email}</strong> with your details.
            </p>
            <p style={{ fontSize: 13, color: "var(--fg-4)" }}>Your registration ID</p>
            <div className="id-chip">{registered.id}</div>

            <div style={{ margin: "22px 0", background: "rgba(49,107,255,0.06)", border: "1px solid var(--border-blue)", borderRadius: 14, padding: "20px 22px", textAlign: "left" }}>
              {[
                { k: "Name",  v: registered.fullName },
                { k: "Email", v: registered.email },
                { k: "Track", v: registered.track },
                { k: "Role",  v: registered.role },
              ].map(row => (
                <div key={row.k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px dashed var(--border)", fontSize: 13 }}>
                  <span style={{ color: "var(--fg-3)" }}>{row.k}</span>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{row.v}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 8, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="kx-btn-primary" onClick={() => setPage("submit")}>
                Also Submit an AI Project →
              </button>
              <button className="kx-btn-outline" onClick={() => setPage("home")}>
                Back to Home
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="kx-page">
      {/* ── Page hero ── */}
      <div className="kx-pagehero">
        <div className="grid-bg" />
        <div className="kx-eyebrow">Khinext '26</div>
        <h1>Register for the <span className="kx-accent">Event</span></h1>
        <p className="lead">
          Secure your place at Pakistan's first multi-domain AI Summit. Select your track, tell us who you are, and we'll handle the rest.
        </p>
      </div>

      {/* ── Ticket types ── */}
      <section className="kx-section tight fade-up" style={{ paddingBottom: 0 }}>
        <div className="cards-2" style={{ maxWidth: 900, margin: "0 auto" }}>
          {[
            {
              name: "General Admission",
              price: "Free",
              color: "var(--khi-blue)",
              perks: ["AI Expo access — all 7 zones", "Gaming Arena spectator access", "Keynote & panel sessions", "Networking lounges"],
            },
            {
              name: "VIP / Sponsor Pass",
              price: "By invitation",
              color: "#FFB800",
              perks: ["All General Admission perks", "Investor Arena access", "VIP networking dinner", "Priority seating, exclusive lounge"],
            },
          ].map(t => (
            <div key={t.name} className="card" style={{ padding: "26px 24px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: t.color, fontWeight: 700, marginBottom: 8 }}>{t.name}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", marginBottom: 16 }}>{t.price}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                {t.perks.map(p => (
                  <li key={p} style={{ fontSize: 13, color: "var(--fg-2)", paddingLeft: 18, position: "relative", lineHeight: 1.5 }}>
                    <span style={{ position: "absolute", left: 0, color: t.color }}>✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Form ── */}
      <section className="kx-section">
        <div className="kx-section-head center" style={{ marginBottom: 44 }}>
          <div className="kx-eyebrow">Registration Form</div>
          <h2>Secure your <span className="kx-accent">spot</span></h2>
        </div>
        <form className="form" onSubmit={submit}>
          <div className="row">
            <div className="field">
              <label>Full Name *</label>
              <input
                type="text" placeholder="Ahmed Raza"
                value={form.fullName}
                onChange={e => set("fullName", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Email Address *</label>
              <input
                type="email" placeholder="you@example.com"
                value={form.email}
                onChange={e => set("email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Phone (optional)</label>
              <input
                type="tel" placeholder="+92 300 0000000"
                value={form.phone}
                onChange={e => set("phone", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Organisation (optional)</label>
              <input
                type="text" placeholder="Company / University"
                value={form.org}
                onChange={e => set("org", e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>I am a *</label>
            <div className="chip-radio">
              {roles.map(r => (
                <label key={r} className={form.role === r ? "on" : ""}>
                  <input
                    type="radio" name="role" value={r}
                    onChange={() => set("role", r)}
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Track</label>
            <div className="chip-radio">
              {tracks.map(t => (
                <label key={t} className={form.track === t ? "on" : ""}>
                  <input
                    type="radio" name="track" value={t}
                    onChange={() => set("track", t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label>How did you hear about Khinext?</label>
            <input
              type="text" placeholder="Social media, a friend, news article…"
              value={form.how}
              onChange={e => set("how", e.target.value)}
            />
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 22 }}>
            <button
              type="submit"
              className="kx-btn-primary"
              disabled={submitting || !form.fullName || !form.email || !form.role}
              style={{ width: "100%", justifyContent: "center", padding: "16px 28px", fontSize: 15 }}
            >
              {submitting ? "Registering…" : "Register for Khinext '26 →"}
            </button>
            <p style={{ textAlign: "center", fontSize: 12, color: "var(--fg-4)", marginTop: 14 }}>
              Free to attend. Your information is used only for event logistics. Unsubscribe any time.
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}

window.RegisterPage = RegisterPage;
