import { useEffect, useRef } from "react";

/**
 * ParticleCanvas
 * --------------
 * Lightweight animated particle network rendered to a fixed-position
 * canvas. Particles drift slowly and connect with low-opacity lines
 * when close to each other — adapted from the reference snippet but
 * tuned to TaskForge's teal/cyan palette and with adaptive density
 * so mobile devices stay buttery smooth.
 *
 * Performance notes:
 *   • Uses requestAnimationFrame, single canvas, no libraries.
 *   • devicePixelRatio capped at 2 to avoid wasted GPU on retina.
 *   • Particle count derives from viewport area with a hard ceiling.
 *   • Honors prefers-reduced-motion (renders one static frame only).
 *   • Pause when the tab is hidden (no rAF burn).
 */
const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];
    let rafId = 0;
    let running = true;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    class Particle {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      size = 1;
      opacity = 0.3;
      hue = 168; // teal
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.4 + 0.6;
        this.opacity = Math.random() * 0.5 + 0.25;
        // Mostly teal, occasionally a hint of cyan for variety
        this.hue = Math.random() < 0.25 ? 188 : 168;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        // Soft wrap around the viewport edges
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 76%, 60%, ${this.opacity})`;
        ctx.fill();
      }
    }

    const buildParticles = () => {
      // Adaptive density: ~one particle per ~22-28k px²
      const area = width * height;
      const density = width < 768 ? 30000 : 24000;
      const count = Math.min(70, Math.max(28, Math.floor(area / density)));
      particles = Array.from({ length: count }, () => new Particle());
    };

    const drawConnections = () => {
      const maxDist = width < 768 ? 110 : 140;
      const maxDistSq = maxDist * maxDist;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = 0.18 * (1 - dist / maxDist);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(168, 76%, 55%, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);
      drawConnections();
      for (const p of particles) {
        p.update();
        p.draw();
      }
    };

    const tick = () => {
      if (!running) return;
      renderFrame();
      rafId = requestAnimationFrame(tick);
    };

    const handleResize = () => {
      resize();
      buildParticles();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!reducedMotion) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    resize();
    buildParticles();

    if (reducedMotion) {
      // Render one static frame and stop
      renderFrame();
    } else {
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    />
  );
};

export default ParticleCanvas;
