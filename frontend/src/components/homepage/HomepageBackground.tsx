import ParticleCanvas from "./ParticleCanvas";

/**
 * HomepageBackground
 * ------------------
 * Matches the darker, more cinematic tone of the Login page and
 * Dashboard. Uses the same layer system but with reduced glow
 * intensity so the homepage feels unified with the rest of the
 * platform — deep charcoal base with subtle teal energy beneath.
 */
const HomepageBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Layer 1: Very dark base — near-black with deep emerald undertone */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, hsl(168 50% 8% / 0.4) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 80% 80%, hsl(190 40% 6% / 0.3) 0%, transparent 50%),
            linear-gradient(180deg, #020617 0%, #030712 40%, #041018 70%, #020617 100%)
          `,
        }}
      />

      {/* Layer 2: Cinematic vignette — darkens edges */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, hsl(220 30% 3% / 0.65) 100%)
          `,
        }}
      />

      {/* Layer 3: Aurora — deeply muted, fog-like */}
      <div className="absolute inset-0 tf-aurora opacity-[0.18]" />
      <div className="absolute inset-0 tf-aurora-2 opacity-[0.12]" />

      {/* Layer 4: Ambient orbs — barely visible, atmospheric */}
      <div className="tf-orb tf-orb-a opacity-[0.14]" />
      <div className="tf-orb tf-orb-b opacity-[0.12]" />
      <div className="tf-orb tf-orb-c opacity-[0.10]" />

      {/* Layer 5: Particle network — slightly more visible */}
      <div className="absolute inset-0 opacity-[0.55]">
        <ParticleCanvas />
      </div>

      {/* Layer 6: Soft top glow — faint hero lift */}
      <div
        className="absolute top-0 left-0 right-0 h-[50vh] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 0%, hsl(168 60% 20% / 0.05) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};

export default HomepageBackground;
