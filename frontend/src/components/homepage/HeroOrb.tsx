/**
 * HeroOrb
 * -------
 * A large, slowly rotating atmospheric energy core that sits behind
 * the hero section content. Pure CSS — no shaders, no canvas, no
 * hover interactions. Fully autonomous cinematic animation.
 *
 * Layers (back to front):
 *   1. Outer fog — very large, very blurred, barely visible
 *   2. Mid glow — the main body, soft rotation
 *   3. Inner core — brighter center, counter-rotating
 *   4. Edge bloom — subtle rim light
 *
 * All layers use transform animations (GPU-accelerated) and
 * respect prefers-reduced-motion.
 */
const HeroOrb = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ top: "-5%" }}
    >
      {/* Layer 1: Outer fog — ~900px, very diffused */}
      <div
        className="absolute rounded-full animate-orb-breathe"
        style={{
          width: "900px",
          height: "900px",
          background: `
            radial-gradient(
              circle at 45% 45%,
              hsl(168 60% 18% / 0.12) 0%,
              hsl(190 50% 12% / 0.08) 35%,
              transparent 70%
            )
          `,
          filter: "blur(80px)",
        }}
      />

      {/* Layer 2: Mid glow — main body, slow rotation */}
      <div
        className="absolute rounded-full animate-orb-rotate"
        style={{
          width: "700px",
          height: "700px",
          background: `
            radial-gradient(
              ellipse 60% 55% at 40% 40%,
              hsl(168 70% 30% / 0.18) 0%,
              hsl(188 60% 22% / 0.12) 30%,
              hsl(200 50% 15% / 0.06) 55%,
              transparent 75%
            )
          `,
          filter: "blur(50px)",
        }}
      />

      {/* Layer 3: Inner core — brighter, counter-rotating */}
      <div
        className="absolute rounded-full animate-orb-rotate-reverse"
        style={{
          width: "450px",
          height: "450px",
          background: `
            radial-gradient(
              circle at 55% 50%,
              hsl(168 76% 42% / 0.14) 0%,
              hsl(180 70% 35% / 0.10) 25%,
              hsl(195 60% 25% / 0.06) 50%,
              transparent 70%
            )
          `,
          filter: "blur(35px)",
        }}
      />

      {/* Layer 4: Edge bloom — subtle rim light */}
      <div
        className="absolute rounded-full animate-orb-pulse"
        style={{
          width: "550px",
          height: "550px",
          background: `
            conic-gradient(
              from 0deg,
              hsl(168 76% 45% / 0.06) 0deg,
              transparent 60deg,
              hsl(188 80% 50% / 0.05) 120deg,
              transparent 180deg,
              hsl(168 70% 40% / 0.04) 240deg,
              transparent 300deg,
              hsl(188 70% 45% / 0.05) 360deg
            )
          `,
          filter: "blur(40px)",
        }}
      />
    </div>
  );
};

export default HeroOrb;
