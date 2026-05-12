// EmailPreview.jsx — Approval email modal + send simulation

function EmailPreview({ submission, onClose, onSent }) {
  const { useState } = React;
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    window.updateSubmission(submission.id, { status: "approved", emailSentAt: Date.now() });
    setSending(false);
    setSent(true);
    setTimeout(() => {
      onSent();
      onClose();
    }, 1400);
  }

  const initials = submission.fullName
    .split(" ")
    .slice(0, 2)
    .map(w => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="head">
          <span className="ttl">Approval Email Preview</span>
          <button className="x" onClick={onClose}>✕</button>
        </div>

        {/* Email meta strip */}
        <div style={{ padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ color: "var(--fg-3)" }}>To: <strong style={{ color: "#fff" }}>{submission.fullName}</strong> &lt;{submission.email}&gt;</span>
            <span style={{ color: "var(--fg-3)" }}>Subject: <strong style={{ color: "#fff" }}>You've been approved — Khinext '26 AI Expo</strong></span>
          </div>
          <div style={{ fontSize: 11, color: "var(--fg-4)", letterSpacing: "0.1em" }}>PREVIEW</div>
        </div>

        {/* The email itself */}
        <div style={{ padding: "0 28px 28px" }}>
          <div className="email-frame">
            {/* Header */}
            <div className="top">
              <div className="lockup">
                <div className="lockup-mark">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 2.5L3 15.5M3 9.5L9.5 3.5M3 9.5L10.5 15.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6L15.5 9.5L12 13" stroke="#8FAFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="lockup-word">Khi<em>next</em></span>
              </div>
              <div className="top-eyebrow">AI Expo '26 · Application Update</div>
              <h1>You've been <em>approved</em>.</h1>
            </div>

            {/* Body */}
            <div className="body">
              <p>Hi <strong>{submission.fullName}</strong>,</p>
              <p>
                We're thrilled to let you know that your submission to the <strong>Khinext '26 AI Expo</strong> has been <strong>reviewed and approved</strong> by our curation team.
              </p>
              <p>
                Your project, <strong>"{submission.project}"</strong>, has been selected for a <strong>live demo booth</strong> at the event in Karachi. You are among the top 50 entries across all 7 innovation domains.
              </p>

              <div className="ticket">
                {[
                  { k: "Submission ID", v: submission.id },
                  { k: "Project",       v: submission.project },
                  { k: "Domain",        v: submission.category },
                  { k: "Status",        v: "✓ Approved" },
                  { k: "Event",         v: "Khinext '26, Karachi" },
                ].map(row => (
                  <div key={row.k} className="kv">
                    <span className="k">{row.k}</span>
                    <span className="v">{row.v}</span>
                  </div>
                ))}
              </div>

              <p>
                Our team will be in touch with next steps — including booth setup details, load-in times, and exhibitor guidelines — at least 30 days before the event. In the meantime, if you have any questions, reply to this email or reach out at <strong>expo@khinext.pk</strong>.
              </p>

              <div className="cta-row">
                <a className="cta-btn" href="#" onClick={e => e.preventDefault()}>
                  View Your Submission →
                </a>
              </div>

              <div className="signature">
                <p style={{ margin: 0, marginBottom: 4 }}>
                  With excitement,<br />
                  <strong>The Khinext '26 Team</strong>
                </p>
                <p style={{ margin: 0, fontSize: 12 }}>
                  Pakistan's first multi-domain AI Summit · Karachi, 2026
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="foot">
              <p style={{ margin: "0 0 6px" }}>
                © 2026 Khinext. Pakistan's first multi-domain AI Summit.<br />
                <a href="#">Unsubscribe</a> · <a href="#">Privacy Policy</a> · <a href="#">khinext.pk</a>
              </p>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div style={{ padding: "16px 28px 22px", display: "flex", gap: 12, justifyContent: "flex-end", borderTop: "1px solid var(--border)" }}>
          <button className="kx-btn-outline" onClick={onClose} disabled={sending || sent}>
            Cancel
          </button>
          <button
            className="kx-btn-primary"
            onClick={handleSend}
            disabled={sending || sent}
            style={{ minWidth: 140, justifyContent: "center" }}
          >
            {sent ? "✓ Sent!" : sending ? "Sending…" : "Send Approval Email →"}
          </button>
        </div>
      </div>
    </div>
  );
}

window.EmailPreview = EmailPreview;
