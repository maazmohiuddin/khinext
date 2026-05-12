// Khinext Sponsorship Tiers — 5 cards.

const TIERS = [
  {
    name: "Platinum", price: "8M", featured: false,
    feats: ["Speakers Lounge Branding", "Logo on Event Tickets",
            "Digital Screens Across Karachi", "Booth in Main Hall",
            "Full Venue Branding"],
  },
  {
    name: "Gold", price: "6M", featured: true,
    feats: ["Logo on Event Tickets", "Digital Screens Across Karachi",
            "Booth in Main Hall", "Pre-event Press Pieces",
            "Logo on Conference Collateral"],
  },
  {
    name: "Silver", price: "4M", featured: false,
    feats: ["Pre-event Press Pieces", "Logo on Conference Collateral",
            "Ad Placement in Booklets", "Logo on Conference Website",
            "Social Media Mentions"],
  },
  {
    name: "Bronze", price: "2M", featured: false,
    feats: ["Ad Placement in Booklets", "Distribution of Branded Collateral",
            "Logo on Conference Website", "Social Media Mentions",
            "Full Venue Branding"],
  },
  {
    name: "Chrome", price: "1M", featured: false,
    feats: ["Distribution of Branded Collateral", "Logo on Conference Website",
            "Social Media Mentions", "Full Venue Branding",
            "Networking Hub Booth"],
  },
];

function Tier({ tier }) {
  return (
    <div className={"kx-tier" + (tier.featured ? " featured" : "")}>
      <div className="kx-tier-name">{tier.name}</div>
      <div className="kx-tier-price">{tier.price}</div>
      <div className="kx-tier-currency">Pakistani Rupees</div>
      <div className="kx-tier-div"></div>
      {tier.feats.map((f) => (
        <div key={f} className="kx-tier-feat">
          <span className="kx-tier-check">✓</span>{f}
        </div>
      ))}
    </div>
  );
}

function Tiers() {
  return (
    <section className="kx-section" id="sponsors" data-screen-label="Tiers">
      <div className="kx-section-head">
        <div className="kx-eyebrow">Sponsorship Tiers</div>
        <h2>Choose your <span className="kx-accent">Tier</span></h2>
        <p>Five partnership levels designed to match your goals and investment — from city-wide digital presence to flagship branding at every touchpoint.</p>
      </div>
      <div className="kx-tiers">
        {TIERS.map((t) => <Tier key={t.name} tier={t} />)}
      </div>
    </section>
  );
}

Object.assign(window, { Tiers, Tier, TIERS });
