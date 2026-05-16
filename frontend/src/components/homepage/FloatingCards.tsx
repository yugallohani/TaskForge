import { motion } from "framer-motion";

/**
 * FloatingCards — Cinematic holographic dashboard panels floating in 3D space.
 * Asymmetrical, layered, with depth and parallax.
 * Inspired by Apple Vision Pro, Linear, Arc Browser, futuristic HUD interfaces.
 */

// ─── Analytics Widget (Top Left) — Cyan ───
const AnalyticsWidget = () => (
  <motion.div
    className="hidden lg:block absolute top-24 left-[3%] z-[2] pointer-events-none"
    initial={{ opacity: 0, y: 30, rotateX: 10 }}
    animate={{
      opacity: 0.95,
      y: [0, -12, 0],
      x: [0, 5, 0],
      rotateZ: [-12, -11, -12],
      rotateX: [4, 2, 4],
      rotateY: [6, 4, 6],
    }}
    transition={{
      opacity: { duration: 1.2, delay: 0.2 },
      y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
      x: { duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
      rotateZ: { duration: 12, repeat: Infinity, ease: "easeInOut" },
      rotateX: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 },
      rotateY: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
    }}
    style={{
      transformStyle: "preserve-3d",
      perspective: "1000px",
      translateY: "-20px",
    }}
  >
    {/* Ambient glow */}
    <div className="absolute -inset-6 bg-[hsl(168_76%_42%/0.04)] rounded-3xl blur-2xl" />

    <div className="relative w-52 rounded-2xl border border-[hsl(168_76%_42%/0.12)] bg-[hsl(220_30%_6%/0.75)] backdrop-blur-xl p-4 shadow-[0_12px_50px_-15px_hsl(168_76%_42%/0.15)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(168_76%_42%)]" />
          <span className="text-[9px] font-medium text-[hsl(168_76%_42%/0.8)] uppercase tracking-wider">
            Analytics
          </span>
        </div>
        <span className="text-[9px] text-[hsl(168_76%_42%/0.4)]">Live</span>
      </div>

      <div className="flex items-end gap-[3px] h-12 mb-3">
        {[35, 50, 40, 65, 55, 80, 70, 90, 75, 85, 95, 88].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${h}%`,
              background: `linear-gradient(to top, hsl(168 76% 42% / 0.5), hsl(168 76% 42% / 0.12))`,
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-foreground/90">94%</div>
          <div className="text-[8px] text-muted-foreground/50">Velocity</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-[hsl(168_76%_42%)] font-medium">+12%</div>
          <div className="text-[8px] text-muted-foreground/40">vs last week</div>
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Kanban Preview (Top Right) — Purple ───
const KanbanPreview = () => (
  <motion.div
    className="hidden lg:block absolute top-16 right-[4%] z-[3] pointer-events-none"
    initial={{ opacity: 0, y: 25, rotateX: -5 }}
    animate={{
      opacity: 1,
      y: [0, -14, 0],
      x: [0, -6, 0],
      rotateZ: [9, 10.5, 9],
      rotateX: [-3, -5, -3],
      rotateY: [-5, -3, -5],
    }}
    transition={{
      opacity: { duration: 1.2, delay: 0.5 },
      y: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
      x: { duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
      rotateZ: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
      rotateX: { duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
      rotateY: { duration: 15, repeat: Infinity, ease: "easeInOut" },
    }}
    style={{
      transformStyle: "preserve-3d",
      perspective: "900px",
      translateX: "15px",
    }}
  >
    {/* Ambient glow */}
    <div className="absolute -inset-5 bg-[hsl(260_70%_65%/0.035)] rounded-3xl blur-2xl" />

    <div className="relative w-56 rounded-2xl border border-[hsl(260_70%_65%/0.12)] bg-[hsl(220_30%_6%/0.78)] backdrop-blur-xl p-4 shadow-[0_12px_50px_-15px_hsl(260_70%_65%/0.12)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(260_70%_65%)]" />
          <span className="text-[9px] font-medium text-[hsl(260_70%_65%/0.8)] uppercase tracking-wider">
            Board
          </span>
        </div>
        <span className="text-[9px] text-[hsl(260_70%_65%/0.4)]">3 cols</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Todo", count: 3 },
          { label: "Active", count: 2 },
          { label: "Done", count: 4 },
        ].map((col) => (
          <div key={col.label} className="space-y-1.5">
            <div className="text-[7px] text-muted-foreground/50 uppercase tracking-wider">
              {col.label}
            </div>
            {Array.from({ length: Math.min(col.count, 3) }).map((_, i) => (
              <div
                key={i}
                className="h-4 rounded-md border border-[hsl(260_70%_65%/0.08)] bg-[hsl(260_70%_65%/0.04)]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// ─── Timeline Widget (Bottom Left) — Blue ───
const TimelineWidget = () => (
  <motion.div
    className="hidden md:block absolute bottom-40 left-[2%] z-[1] pointer-events-none"
    initial={{ opacity: 0, y: 20, rotateX: 5 }}
    animate={{
      opacity: 0.85,
      y: [0, -8, 0],
      x: [0, 7, 0],
      rotateZ: [-8, -6.5, -8],
      rotateX: [3, 5, 3],
      rotateY: [3, 1, 3],
    }}
    transition={{
      opacity: { duration: 1.2, delay: 0.8 },
      y: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
      x: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
      rotateZ: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 },
      rotateX: { duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 },
      rotateY: { duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
    }}
    style={{
      transformStyle: "preserve-3d",
      perspective: "850px",
      translateY: "10px",
      filter: "blur(0.3px)",
    }}
  >
    {/* Ambient glow */}
    <div className="absolute -inset-4 bg-[hsl(210_80%_60%/0.03)] rounded-3xl blur-xl" />

    <div className="relative w-48 rounded-2xl border border-[hsl(210_80%_60%/0.1)] bg-[hsl(220_30%_6%/0.72)] backdrop-blur-xl p-4 shadow-[0_12px_50px_-15px_hsl(210_80%_60%/0.08)]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[hsl(210_80%_60%)]" />
        <span className="text-[9px] font-medium text-[hsl(210_80%_60%/0.8)] uppercase tracking-wider">
          Sprint
        </span>
      </div>

      <div className="space-y-2.5">
        {[
          { label: "Eval Pipeline", progress: 85 },
          { label: "RLHF Batch", progress: 60 },
          { label: "Safety Audit", progress: 35 },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[8px] text-foreground/60">{item.label}</span>
              <span className="text-[8px] text-[hsl(210_80%_60%/0.6)]">
                {item.progress}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-[hsl(210_80%_60%/0.06)] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${item.progress}%`,
                  background: `linear-gradient(to right, hsl(210 80% 60% / 0.5), hsl(210 80% 60% / 0.2))`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// ─── Team Activity Widget (Bottom Right) — Emerald ───
const TeamActivityWidget = () => (
  <motion.div
    className="hidden md:block absolute bottom-28 right-[3%] z-[2] pointer-events-none"
    initial={{ opacity: 0, y: 25, rotateX: -3 }}
    animate={{
      opacity: 0.92,
      y: [0, -10, 0],
      x: [0, -5, 0],
      rotateZ: [13, 11, 13],
      rotateX: [-2, -4, -2],
      rotateY: [4, 6, 4],
    }}
    transition={{
      opacity: { duration: 1.2, delay: 1.1 },
      y: { duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 },
      x: { duration: 11.5, repeat: Infinity, ease: "easeInOut", delay: 1.8 },
      rotateZ: { duration: 13, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
      rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
      rotateY: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
    }}
    style={{
      transformStyle: "preserve-3d",
      perspective: "950px",
      translateX: "-10px",
    }}
  >
    {/* Ambient glow */}
    <div className="absolute -inset-4 bg-[hsl(155_60%_50%/0.03)] rounded-3xl blur-xl" />

    <div className="relative w-52 rounded-2xl border border-[hsl(155_60%_50%/0.1)] bg-[hsl(220_30%_6%/0.75)] backdrop-blur-xl p-4 shadow-[0_12px_50px_-15px_hsl(155_60%_50%/0.1)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(155_60%_50%)]" />
          <span className="text-[9px] font-medium text-[hsl(155_60%_50%/0.8)] uppercase tracking-wider">
            Team
          </span>
        </div>
        <div className="flex -space-x-1.5">
          {["PP", "RS", "AK", "SG"].map((a) => (
            <div
              key={a}
              className="w-4 h-4 rounded-full bg-[hsl(155_60%_50%/0.12)] border border-[hsl(220_30%_6%)] flex items-center justify-center text-[6px] font-bold text-[hsl(155_60%_50%/0.7)]"
            >
              {a}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {[
          { name: "Priya", action: "completed eval", time: "2m" },
          { name: "Rahul", action: "started session", time: "5m" },
          { name: "Amit", action: "pushed results", time: "8m" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[hsl(155_60%_50%/0.08)] flex items-center justify-center text-[6px] font-bold text-[hsl(155_60%_50%/0.6)]">
              {item.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[8px] text-foreground/60">{item.name}</span>
              <span className="text-[8px] text-muted-foreground/40"> {item.action}</span>
            </div>
            <span className="text-[7px] text-muted-foreground/30">{item.time}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-[hsl(155_60%_50%/0.06)] flex items-center justify-between">
        <span className="text-[8px] text-muted-foreground/40">Online now</span>
        <span className="text-[9px] font-medium text-[hsl(155_60%_50%/0.7)]">4</span>
      </div>
    </div>
  </motion.div>
);

const FloatingCards = () => {
  return (
    <>
      <AnalyticsWidget />
      <KanbanPreview />
      <TimelineWidget />
      <TeamActivityWidget />
    </>
  );
};

export default FloatingCards;
