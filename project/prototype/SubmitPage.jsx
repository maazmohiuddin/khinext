// SubmitPage.jsx — AI Expo project submission form

function SubmitPage({ setPage }) {
  const { useState, useEffect, useRef } = React;

  const categories = [
    "Health & Pharma",
    "Smart Cities",
    "Creative AI",
    "Fintech Future",
    "DevZone",
    "Lifestyle Innovation",
    "Investor Arena",
  ];

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    project: "",
    category: "",
    description: "",
    teamSize: "1",
  });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [drag, setDrag] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleFile(f) {
    if (!f) return;
    setFileError("");
    try {
      const data = await window.fileToDataURL(f);
      setFile(data);
    } catch (e) {
      setFileError(e.message);
      setFile(null);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.project || !form.category) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    const entry = window.addSubmission({ ...form, file });
    setSubmitted(entry);
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="kx-page">
        <div className="kx-pagehero">
          <div className="grid-bg" />
          <div className="kx-eyebrow">AI Expo Submissions</div>
          <h1>Submit Your <span className="kx-accent">Project</span></h1>
        </div>
        <section className="kx-section">
          <div className="success">
            <div className="check">✓</div>
            <h2>Application <span className="kx-accent">Received</span></h2>
            <p>
              Thank you, <strong style={{ color: "#fff" }}>{submitted.fullName}</strong>! Your AI project has been submitted for Khinext '26 AI Expo review.
              The team will review your submission and notify you via email within 7–10 working days.
            </p>
            <p style={{ fontSize: 13, color: "var(--fg-4)" }}>Your submission ID</p>
            <div className="id-chip">{submitted.id}</div>
            <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="kx-btn-primary" onClick={() => { setSubmitted(null); setForm({ fullName:"",email:"",project:"",category:"",description:"",teamSize:"1" }); setFile(null); }}>
                Submit Another Project
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
        <div className="kx-eyebrow">AI Expo Submissions</div>
        <h1>Submit Your <span className="kx-accent">Project</span></h1>
        <p className="lead">
          Open to individuals, student teams and companies. The top 50 selected entries get a live demo booth at the event. Applications close 45 days before Khinext '26.
        </p>
      </div>

      {/* ── Info strip ── */}
      <div className="stats-strip" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {[
          { num: "50",   acc: "",  lbl: "Booth Slots Available" },
          { num: "7",    acc: "",  lbl: "Innovation Domains" },
          { num: "Free", acc: "",  lbl: "to Apply" },
        ].map(s => (
          <div className="stat" key={s.lbl}>
            <div className="num">{s.num}<span className="acc">{s.acc}</span></div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Form ── */}
      <section className="kx-section">
        <div className="kx-section-head center" style={{ marginBottom: 44 }}>
          <div className="kx-eyebrow">Application Form</div>
          <h2>Tell us about your <span className="kx-accent">AI</span></h2>
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

          <div className="field">
            <label>Project Name *</label>
            <input
              type="text" placeholder="MediScan AI — radiology triage"
              value={form.project}
              onChange={e => set("project", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Innovation Domain *</label>
            <div className="chip-radio">
              {categories.map(cat => (
                <label key={cat} className={form.category === cat ? "on" : ""}>
                  <input
                    type="radio" name="category" value={cat}
                    onChange={() => set("category", cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Project Description *</label>
            <textarea
              placeholder="Describe your AI project in 2–4 sentences. What problem does it solve? What is the technology? What is the impact?"
              value={form.description}
              onChange={e => set("description", e.target.value)}
            />
          </div>

          <div className="row">
            <div className="field">
              <label>Team Size</label>
              <select value={form.teamSize} onChange={e => set("teamSize", e.target.value)}
                style={{ color: "#fff", background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", fontFamily: "var(--font-body)", fontSize: 15 }}>
                {["1", "2", "3", "4", "5", "6+"].map(n => <option key={n} value={n}>{n} {n === "1" ? "person (solo)" : "people"}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Supporting File (optional)</label>
              <div
                className={"dropzone" + (drag ? " drag" : "")}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
              >
                <div className="big">{file ? "File attached" : "Drop file or click to browse"}</div>
                <div className="small">PDF, PPT, ZIP — max 2.5 MB</div>
                {file && (
                  <div className="picked">
                    <span>📎</span>
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setFile(null); }}
                      style={{ background: "none", border: "none", color: "var(--fg-3)", cursor: "pointer", fontSize: 12, padding: 0 }}
                    >✕</button>
                  </div>
                )}
                {fileError && <div style={{ marginTop: 8, fontSize: 12, color: "#FF6B8E" }}>{fileError}</div>}
                <input
                  type="file" ref={fileInputRef}
                  accept=".pdf,.ppt,.pptx,.zip,.doc,.docx"
                  onChange={e => handleFile(e.target.files[0])}
                />
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 22 }}>
            <button
              type="submit"
              className="kx-btn-primary"
              disabled={submitting || !form.fullName || !form.email || !form.project || !form.category}
              style={{ width: "100%", justifyContent: "center", padding: "16px 28px", fontSize: 15 }}
            >
              {submitting ? "Submitting…" : "Submit AI Project →"}
            </button>
            <p style={{ textAlign: "center", fontSize: 12, color: "var(--fg-4)", marginTop: 14 }}>
              By submitting you agree to Khinext's submission guidelines. Applications are reviewed within 7–10 working days.
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}

window.SubmitPage = SubmitPage;
