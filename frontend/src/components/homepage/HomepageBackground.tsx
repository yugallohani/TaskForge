/**
 * HomepageBackground
 * ------------------
 * One continuous, fixed canvas that lives behind the entire homepage.
 * Cinematic aurora + soft radial glows + faint floating particles —
 * inspired by Linear, Vercel, and modern AI startup landing pages.
 *
 * Layers (back to front):
 *   1. Deep navy base wash with subtle top glow
 *   2. Cinematic vignette (top lift + bottom fade)
 *   3. Two drifting aurora meshes (counter-moving)
 *   4. Three floating ambient orbs in teal / cyan / emerald
 *   5. Very subtle drifting particle field
 *
 * Pointer-events disabled so the background never intercepts clicks.
 * All animation uses transform + opacity only and respects
 * prefers-reduced-motion.
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

      {/* Subtle drifting particles */}
      <div className="absolute inset-0 tf-particles" />
    </div>
  );
};

export default HomepageBackground;
