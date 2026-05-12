// Khinext Stats — 4-up hairline-divided stat strip.

function Stat({ num, accent, label }) {
  return (
    <div className="kx-stat">
      <div className="kx-stat-num">{num}<span className="accent">{accent}</span></div>
      <div className="kx-stat-label">{label}</div>
    </div>
  );
}

function Stats() {
  return (
    <div className="kx-stats" data-screen-label="Stats">
      <Stat num="10"  accent="K+" label="Attendees" />
      <Stat num="100" accent="+"  label="Speakers & Experts" />
      <Stat num="50"  accent="+"  label="Industry Sessions" />
      <Stat num="8"   accent=""   label="Innovation Domains" />
    </div>
  );
}

Object.assign(window, { Stats });
