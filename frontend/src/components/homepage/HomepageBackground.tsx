import ParticleCanvas from "./ParticleCanvas";

/**
 * HomepageBackground
 * ------------------
 * One continuous, fixed canvas that lives behind the entire homepage.
 *
 * Layers (back to front):
 *   1. Deep navy base wash
 *   2. Cinematic vignette
 *   3. Drifting aurora meshes (counter-moving)
 *   4. Floating ambient orbs (teal / cyan / emerald)
 *   5. Animated particle network (canvas, requestAnimationFrame)
 *
 * Pointer-events disabled so the background never intercepts clicks.
 * All animation uses transform + opacity (CSS) or a single canvas
 * (JS) and respects prefers-reduced-motion.
 */
const HomepageBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Deep navy base — atmospheric foundation */}
      <div className="absolute inset-0 tf-base" />

      {/* Cinematic vignette */}
      <div className="absolute inset-0 tf-vignette" />

      {/* Drifting aurora layers */}
      <div className="absolute inset-0 tf-aurora" />
      <div className="absolute inset-0 tf-aurora-2" />

      {/* Floating ambient orbs */}
      <div className="tf-orb tf-orb-a" />
      <div className="tf-orb tf-orb-b" />
      <div className="tf-orb tf-orb-c" />

      {/* Animated particle network */}
      <ParticleCanvas />
    </div>
  );
};

export default HomepageBackground;
