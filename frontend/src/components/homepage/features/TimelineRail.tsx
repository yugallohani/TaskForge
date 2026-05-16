import { memo } from "react";
import { motion } from "framer-motion";

interface TimelineRailProps {
  fillProgress: number;
  activeIndex: number;
  itemCount: number;
}

/**
 * Minimalist vertical progress rail.
 * No dots, no nodes — just a thin line with a progressive glow fill.
 * Inspired by Linear/Stripe/Apple product pages.
 */
const TimelineRail = memo(({ fillProgress }: TimelineRailProps) => {
  return (
    <div className="absolute left-5 top-0 bottom-0 flex items-stretch pointer-events-none">
      <div className="relative w-[1.5px] h-full">
        {/* Inactive background line — very subtle */}
        <div className="absolute inset-0 rounded-full bg-[hsl(168_76%_42%/0.06)]" />

        {/* Active fill — GPU-accelerated via scaleY from top */}
        <motion.div
          className="absolute top-0 left-0 w-full origin-top rounded-full"
          style={{ height: "100%" }}
          animate={{ scaleY: fillProgress }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                "linear-gradient(to bottom, hsl(168 76% 42% / 0.8), hsl(168 76% 42% / 0.4), hsl(168 76% 42% / 0.08))",
            }}
          />
        </motion.div>

        {/* Subtle glow at the fill tip — moves with progress */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-[3px] h-6 rounded-full"
          animate={{
            top: `calc(${fillProgress * 100}% - 12px)`,
            opacity: fillProgress > 0.02 ? 0.7 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(168 76% 42% / 0.9), transparent 70%)",
            boxShadow: "0 0 6px 1px hsl(168 76% 42% / 0.3)",
          }}
        />
      </div>
    </div>
  );
});

TimelineRail.displayName = "TimelineRail";
export default TimelineRail;
