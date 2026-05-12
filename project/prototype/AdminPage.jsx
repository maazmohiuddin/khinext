// AdminPage.jsx — Admin panel: submissions + registrations, approval flow

const ADMIN_PASSWORD = "admin2026";

function AdminPage() {
  const { useState, useEffect } = React;

  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [tab, setTab] = useState("submissions");
  const [filter, setFilter] = useState("all");
  const [emailTarget, setEmailTarget] = useState(null);
  const [toast, setToast] = useState(null);

  // re-render when store changes
  window.useStore(window.SUBS_KEY);
  window.useStore(window.REGS_KEY);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.seedDemoData();
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }

  function login(e) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("Incorrect password. Try: admin2026");
    }
  }

  function approve(sub) {
    setEmailTarget(sub);
  }

  function reject(id) {
    window.updateSubmission(id, { status: "rejected" });
    showToast("Submission rejected.");
  }

  function onEmailSent() {
    showToast("Approval email sent! ✓");
  }

  // ── Login gate ──
  if (!authed) {
    return (
      <div className="kx-page">
        <div className="kx-pagehero">
          <div className="grid-bg" />
          <div className="kx-eyebrow">Admin</div>
          <h1>Admin <span className="kx-accent">Panel</span></h1>
          <p className="lead">Manage submissions, review registrations and send approval emails to accepted AI Expo entries.</p>
        </div>
        <section className="kx-section">
          <form className="admin-gate" onSubmit={login}>
            <h2>Sign In</h2>
            <p>Enter the admin password to access the dashboard.</p>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Admin password"
                value={pw}
                onChange={e => { setPw(e.target.value); setPwError(""); }}
                autoFocus
              />
              {pwError && <div style={{ marginTop: 6, fontSize: 12, color: "#FF6B8E" }}>{pwError}</div>}
            </div>
            <button type="submit" className="kx-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Sign In →
            </button>
            <div className="hint">Hint: admin2026</div>
          </form>
        </section>
      </div>
    );
  }

  const submissions = window.getSubmissions();
  const registrations = window.getRegistrations();

  const filteredSubs = filter === "all"
    ? submissions
    : submissions.filter(s => s.status === filter);

  const statusCounts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === "pending").length,
    approved: submissions.filter(s => s.status === "approved").length,
    rejected: submissions.filter(s => s.status === "rejected").length,
  };

  // ── Dashboard ──
  return (
    <div className="kx-page">
      <div className="kx-pagehero" style={{ paddingBottom: 40 }}>
        <div className="grid-bg" />
        <div className="kx-eyebrow">Admin Dashboard</div>
        <h1>Khinext <span className="kx-accent">'26</span> Admin</h1>
        <p className="lead">Review AI Expo submissions, manage registrations, and send approval emails.</p>
      </div>

      <section className="kx-section tight" style={{ paddingTop: 44 }}>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Total Submissions", val: submissions.length, color: "var(--khi-blue)" },
            { label: "Pending Review",    val: statusCounts.pending,  color: "#FFD06B" },
            { label: "Approved",          val: statusCounts.approved, color: "#51FFD5" },
            { label: "Registrations",     val: registrations.length,  color: "var(--fg-2)" },
          ].map(c => (
            <div key={c.label} className="card" style={{ padding: "18px 20px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: c.color, letterSpacing: "-0.03em", lineHeight: 1 }}>{c.val}</div>
              <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 8, letterSpacing: "0.04em" }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="admin-header">
          <div className="admin-tabs">
            <button className={tab === "submissions" ? "active" : ""} onClick={() => setTab("submissions")}>
              AI Expo Submissions ({submissions.length})
            </button>
            <button className={tab === "registrations" ? "active" : ""} onClick={() => setTab("registrations")}>
              Registrations ({registrations.length})
            </button>
          </div>
          {tab === "submissions" && (
            <div style={{ display: "flex", gap: 8 }}>
              {["all","pending","approved","rejected"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "8px 16px", borderRadius: 999,
                    background: filter === f ? "rgba(49,107,255,0.14)" : "transparent",
                    border: filter === f ? "1px solid var(--border-blue-strong)" : "1px solid var(--border)",
                    color: filter === f ? "var(--khi-blue-soft)" : "var(--fg-3)",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                    letterSpacing: "0.06em", textTransform: "capitalize",
                    transition: "all .2s",
                  }}
                >
                  {f} {f !== "all" && `(${statusCounts[f]})`}
                </button>
              ))}
              <button
                onClick={() => { if (window.confirm("Clear all submissions?")) { window.clearSubmissions(); } }}
                className="kx-btn-danger"
                style={{ fontSize: 11, padding: "8px 14px" }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* ── Submissions table ── */}
        {tab === "submissions" && (
          filteredSubs.length === 0 ? (
            <div className="admin-empty">
              No submissions {filter !== "all" ? `with status "${filter}"` : "yet"}.
            </div>
          ) : (
            <div className="admin-table">
              <div className="admin-row head">
                <span>ID</span>
                <span>Applicant</span>
                <span>Project</span>
                <span>Status</span>
                <span style={{ textAlign: "right" }}>Actions</span>
              </div>
              {filteredSubs.map(sub => (
                <div className="admin-row" key={sub.id}>
                  <span className="id">{sub.id}</span>
                  <div className="who">
                    <span className="nm">{sub.fullName}</span>
                    <span className="em">{sub.email}</span>
                  </div>
                  <div className="body">
                    <div className="pj">{sub.project}</div>
                    <div className="cat">{sub.category}</div>
                  </div>
                  <div>
                    <span className={"status " + sub.status}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                      {sub.status}
                    </span>
                  </div>
                  <div className="actions">
                    {sub.status === "pending" && (
                      <>
                        <button
                          className="kx-btn-primary"
                          style={{ padding: "8px 16px", fontSize: 12 }}
                          onClick={() => approve(sub)}
                        >
                          Approve
                        </button>
                        <button
                          className="kx-btn-danger"
                          onClick={() => reject(sub.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {sub.status === "approved" && (
                      <button
                        className="kx-btn-outline"
                        style={{ padding: "8px 16px", fontSize: 12 }}
                        onClick={() => setEmailTarget(sub)}
                      >
                        Resend Email
                      </button>
                    )}
                    {sub.status === "rejected" && (
                      <button
                        className="kx-btn-outline"
                        style={{ padding: "8px 16px", fontSize: 12 }}
                        onClick={() => { window.updateSubmission(sub.id, { status: "pending" }); showToast("Moved back to pending."); }}
                      >
                        Undo
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── Registrations table ── */}
        {tab === "registrations" && (
          registrations.length === 0 ? (
            <div className="admin-empty">No registrations yet.</div>
          ) : (
            <div className="admin-table">
              <div className="admin-row head" style={{ gridTemplateColumns: "90px 1.4fr 1.6fr 130px 160px" }}>
                <span>ID</span>
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Track</span>
              </div>
              {registrations.map(reg => (
                <div className="admin-row" key={reg.id} style={{ gridTemplateColumns: "90px 1.4fr 1.6fr 130px 160px" }}>
                  <span className="id">{reg.id}</span>
                  <span style={{ color: "#fff", fontWeight: 500 }}>{reg.fullName}</span>
                  <span style={{ color: "var(--fg-3)", fontSize: 13 }}>{reg.email}</span>
                  <span style={{ color: "var(--fg-2)", fontSize: 13 }}>{reg.role}</span>
                  <span>
                    <span className="status approved">
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                      confirmed
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )
        )}

        {/* Clear registrations */}
        {tab === "registrations" && registrations.length > 0 && (
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
            <button
              className="kx-btn-danger"
              onClick={() => { if (window.confirm("Clear all registrations?")) window.clearRegistrations(); }}
            >
              Clear All Registrations
            </button>
          </div>
        )}
      </section>

      {/* Email preview modal */}
      {emailTarget && (
        <EmailPreview
          submission={emailTarget}
          onClose={() => setEmailTarget(null)}
          onSent={onEmailSent}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="toast">
          <span className="dot" />
          {toast}
        </div>
      )}
    </div>
  );
}

window.AdminPage = AdminPage;
