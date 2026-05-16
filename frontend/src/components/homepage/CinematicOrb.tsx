/**
 * CinematicOrb
 * ------------
 * A large, slowly rotating atmospheric energy core that sits behind
 * the hero section. Pure CSS — no WebGL, no shaders, no hover
 * interactions. Multiple layered radial gradients rotate at different
 * speeds to create depth and turbulence.
 *
 * Fully autonomous: rotates, pulses, and breathes on its own.
 * No mouse/hover reactivity.
 */
const CinematicOrb = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ width: "820px", height: "820px" }}
    >
      {/* Outer atmospheric haze */}
      <div
        className="absolute inset-0 rounded-full animate-[tf-orb-spin_60s_linear_infinite]"
        style={{
          background: `
            radial-gradient(ellipse 55% 50% at 40% 45%, hsl(168 60% 25% / 0.18), transparent 70%),
            radial-gradient(ellipse 45% 55% at 65% 55%, hsl(188 70% 30% / 0.12), transparent 65%)
          `,
          filter: "blur(60px)",
        }}
      />

      {/* Mid layer — rotating aurora ring */}
      <div
        className="absolute inset-[10%] rounded-full animate-[tf-orb-spin-rev_45s_linear_infinite]"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 35% 40%, hsl(168 76% 30% / 0.22), transparent 60%),
            radial-gradient(ellipse 50% 60% at 70% 60%, hsl(190 80% 28% / 0.16), transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 50%, hsl(200 60% 15% / 0.20), transparent 50%)
          `,
          filter: "blur(40px)",
        }}
      />

      {/* Inner core — brighter, tighter */}
      <div
        className="absolute inset-[25%] rounded-full animate-[tf-orb-spin_35s_linear_infinite] animate-[tf-orb-breathe_8s_ease-in-out_infinite]"
        style={{
          background: `
            radial-gradient(ellipse 70% 70% at 50% 50%, hsl(168 76% 35% / 0.28), transparent 55%),
            radial-gradient(ellipse 50% 50% at 45% 55%, hsl(180 70% 25% / 0.22), transparent 50%)
          `,
          filter: "blur(30px)",
          animation: "tf-orb-spin 35s linear infinite, tf-orb-breathe 8s ease-in-out infinite",
        }}
      />

      {/* Glowing edge highlight */}
      <div
        className="absolute inset-[30%] rounded-full"
        style={{
          background: `
            radial-gradient(ellipse 80% 80% at 50% 50%, transparent 45%, hsl(168 76% 45% / 0.10) 65%, transparent 80%)
          `,
          filter: "blur(20px)",
          animation: "tf-orb-spin-rev 50s linear infinite",
        }}
      />

      {/* Center soft glow */}
      <div
        className="absolute inset-[35%] rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, hsl(168 76% 40% / 0.15), transparent 60%)`,
          filter: "blur(25px)",
          animation: "tf-orb-breathe 6s ease-in-out infinite",
        }}
      />
    </div>
  );
};

export default CinematicOrb;
