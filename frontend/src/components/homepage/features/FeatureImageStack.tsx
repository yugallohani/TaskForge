import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FeatureImageStackProps {
  activeIndex: number;
}

// Accent color themes per feature
const accents = [
  { // Team Project Organization — Cyan
    hue: "168 76% 42%",
    glow: "hsl(168 76% 42% / 0.2)",
    border: "hsl(168 76% 42% / 0.25)",
    bg: "hsl(168 76% 42%",
    text: "hsl(168 76% 42%)",
  },
  { // Real-time Task Tracking — Emerald
    hue: "155 60% 50%",
    glow: "hsl(155 60% 50% / 0.2)",
    border: "hsl(155 60% 50% / 0.25)",
    bg: "hsl(155 60% 50%",
    text: "hsl(155 60% 50%)",
  },
  { // Progress Analytics — Purple
    hue: "260 70% 65%",
    glow: "hsl(260 70% 65% / 0.2)",
    border: "hsl(260 70% 65% / 0.25)",
    bg: "hsl(260 70% 65%",
    text: "hsl(260 70% 65%)",
  },
  { // Smart Collaboration — Blue
    hue: "210 80% 60%",
    glow: "hsl(210 80% 60% / 0.2)",
    border: "hsl(210 80% 60% / 0.25)",
    bg: "hsl(210 80% 60%",
    text: "hsl(210 80% 60%)",
  },
  { // Deadline Management — Amber
    hue: "35 90% 55%",
    glow: "hsl(35 90% 55% / 0.18)",
    border: "hsl(35 90% 55% / 0.22)",
    bg: "hsl(35 90% 55%",
    text: "hsl(35 90% 55%)",
  },
  { // Team Productivity — Pink/Magenta
    hue: "330 70% 60%",
    glow: "hsl(330 70% 60% / 0.18)",
    border: "hsl(330 70% 60% / 0.22)",
    bg: "hsl(330 70% 60%",
    text: "hsl(330 70% 60%)",
  },
];

// ─── Mockup panels with per-feature accent colors ───

const ProjectBoardPanel = () => {
  const a = accents[0];
  return (
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full" style={{ background: a.text }} />
        <div className="h-3 w-24 rounded bg-foreground/20" />
        <div className="ml-auto h-3 w-16 rounded" style={{ background: `${a.bg} / 0.3)` }} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["Backlog", "In Progress", "Done"].map((col) => (
          <div key={col} className="space-y-2">
            <div className="text-[9px] text-muted-foreground/60 uppercase tracking-wider font-medium">
              {col}
            </div>
            {[1, 2, 3].slice(0, col === "Done" ? 2 : 3).map((i) => (
              <div
                key={i}
                className="rounded-lg bg-[hsl(220_30%_12%/0.8)] p-2.5"
                style={{ borderColor: `${a.bg} / 0.1)`, borderWidth: "1px" }}
              >
                <div className="h-2 w-full rounded bg-foreground/10 mb-2" />
                <div className="h-2 w-2/3 rounded bg-foreground/5" />
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-4 h-4 rounded-full" style={{ background: `${a.bg} / 0.2)` }} />
                  <div className="h-1.5 w-10 rounded bg-muted-foreground/20" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const LiveActivityPanel = () => {
  const a = accents[1];
  return (
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: a.text }} />
        <div className="text-[10px] font-medium" style={{ color: a.text }}>Live Updates</div>
      </div>
      {[
        { name: "Priya P.", action: "moved task to Review", time: "2s ago" },
        { name: "Rahul S.", action: "completed evaluation", time: "15s ago" },
        { name: "Amit K.", action: "started work session", time: "1m ago" },
        { name: "Sneha G.", action: "raised an issue", time: "3m ago" },
        { name: "Vikram S.", action: "submitted results", time: "5m ago" },
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2 last:border-0"
          style={{ borderBottom: `1px solid ${a.bg} / 0.05)` }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0"
            style={{ background: `${a.bg} / 0.15)`, color: a.text }}
          >
            {item.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-foreground/80">
              <span className="font-medium">{item.name}</span>{" "}
              <span className="text-muted-foreground/60">{item.action}</span>
            </div>
          </div>
          <div className="text-[9px] text-muted-foreground/40 shrink-0">{item.time}</div>
        </div>
      ))}
    </div>
  );
};

const AnalyticsPanel = () => {
  const a = accents[2];
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] text-foreground/70 font-medium">Productivity</div>
        <div className="text-[9px] font-medium" style={{ color: a.text }}>+12% ↑</div>
      </div>
      <div className="flex items-end gap-1.5 h-24 mb-4">
        {[40, 55, 45, 70, 60, 85, 75, 90, 65, 80, 95, 88].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${h}%`,
              background: `linear-gradient(to top, ${a.bg} / 0.45), ${a.bg} / 0.15))`,
            }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: "Velocity", value: "94%" },
          { label: "Completion", value: "87%" },
          { label: "On-time", value: "91%" },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-2 rounded-lg bg-[hsl(220_30%_12%/0.6)]">
            <div className="text-xs font-bold text-foreground/80">{stat.value}</div>
            <div className="text-[8px] text-muted-foreground/50 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CollaborationPanel = () => {
  const a = accents[3];
  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex -space-x-2">
          {["PP", "RS", "AK", "SG"].map((avatar) => (
            <div
              key={avatar}
              className="w-6 h-6 rounded-full border-2 border-[hsl(220_30%_8%)] flex items-center justify-center text-[7px] font-bold"
              style={{ background: `${a.bg} / 0.2)`, color: a.text }}
            >
              {avatar}
            </div>
          ))}
        </div>
        <div className="text-[9px] text-muted-foreground/60">4 online</div>
      </div>
      <div className="space-y-2.5">
        {[
          { user: "PP", msg: "Updated the eval criteria for batch #45", time: "now" },
          { user: "RS", msg: "Can we review the RLHF results together?", time: "2m" },
          { user: "AK", msg: "Pushed the new scoring rubric", time: "5m" },
        ].map((msg, i) => (
          <div key={i} className="flex gap-2.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[7px] font-bold shrink-0 mt-0.5"
              style={{ background: `${a.bg} / 0.15)`, color: a.text }}
            >
              {msg.user}
            </div>
            <div
              className="flex-1 rounded-xl bg-[hsl(220_30%_12%/0.8)] p-2.5"
              style={{ border: `1px solid ${a.bg} / 0.08)` }}
            >
              <div className="text-[10px] text-foreground/70 leading-relaxed">{msg.msg}</div>
              <div className="text-[8px] text-muted-foreground/40 mt-1">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DeadlinesPanel = () => {
  const a = accents[4];
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] text-foreground/70 font-medium">This Week</div>
        <div className="text-[9px] text-muted-foreground/50">May 2026</div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-center text-[8px] text-muted-foreground/40 pb-1">{d}</div>
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="text-center text-[9px] py-1.5 rounded-md"
            style={
              i === 2
                ? { background: `${a.bg} / 0.2)`, color: a.text, fontWeight: 700 }
                : { color: i < 2 ? "hsl(220 18% 50% / 0.3)" : "hsl(210 40% 98% / 0.6)" }
            }
          >
            {12 + i}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[
          { title: "RLHF Batch #14 Review", due: "Today", color: a.text },
          { title: "Safety Eval Deadline", due: "Thu", color: "hsl(0 70% 60%)" },
          { title: "Sprint Retrospective", due: "Fri", color: `${a.bg} / 0.6)` },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 last:border-0"
            style={{ borderBottom: `1px solid ${a.bg} / 0.05)` }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
            <div className="flex-1 text-[10px] text-foreground/70">{item.title}</div>
            <div className="text-[9px] text-muted-foreground/50">{item.due}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MetricsPanel = () => {
  const a = accents[5];
  return (
    <div className="p-5">
      <div className="text-[10px] text-foreground/70 font-medium mb-4">Team Performance</div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Tasks/Day", value: "12.4", trend: "+18%" },
          { label: "Avg Session", value: "4.2h", trend: "+5%" },
          { label: "Quality", value: "96%", trend: "+2%" },
          { label: "Streak", value: "14d", trend: "Best" },
        ].map((m) => (
          <div
            key={m.label}
            className="p-3 rounded-xl bg-[hsl(220_30%_12%/0.6)]"
            style={{ border: `1px solid ${a.bg} / 0.08)` }}
          >
            <div className="text-[9px] text-muted-foreground/50 mb-1">{m.label}</div>
            <div className="text-sm font-bold text-foreground/80">{m.value}</div>
            <div className="text-[8px] mt-0.5" style={{ color: a.text }}>{m.trend}</div>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-0.5 h-10">
        {[30, 45, 35, 60, 50, 75, 65, 80, 70, 90, 85, 95, 88, 92].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${h}%`,
              background: `linear-gradient(to top, ${a.bg} / 0.35), ${a.bg} / 0.1))`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const panels = [
  { title: "Project Board", content: <ProjectBoardPanel /> },
  { title: "Live Activity", content: <LiveActivityPanel /> },
  { title: "Analytics", content: <AnalyticsPanel /> },
  { title: "Team View", content: <CollaborationPanel /> },
  { title: "Deadlines", content: <DeadlinesPanel /> },
  { title: "Metrics", content: <MetricsPanel /> },
];

const FeatureImageStack = memo(({ activeIndex }: FeatureImageStackProps) => {
  const accent = accents[activeIndex] || accents[0];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Dynamic ambient glow — crossfades with accent color */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse at 50% 40%, ${accent.bg} / 0.06), transparent 70%)`,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Secondary ambient orb */}
      <motion.div
        className="absolute top-1/3 left-1/3 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        animate={{
          background: `${accent.bg} / 0.04)`,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Image stack container */}
      <div className="relative w-[85%] max-w-[380px] aspect-[4/5]">
        <AnimatePresence mode="popLayout">
          {panels.map((panel, i) => {
            const isActive = i === activeIndex;
            const isPrev = i === activeIndex - 1;
            const isNext = i === activeIndex + 1;
            const isVisible = isActive || isPrev || isNext;

            if (!isVisible) return null;

            const panelAccent = accents[i];

            return (
              <motion.div
                key={i}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{
                  opacity: isActive ? 1 : 0.25,
                  scale: isActive ? 1 : isPrev ? 0.92 : 0.95,
                  y: isActive ? 0 : isPrev ? -20 : 20,
                  rotateX: isActive ? 0 : isPrev ? 3 : -2,
                }}
                exit={{ opacity: 0, scale: 0.85, y: -40 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  zIndex: isActive ? 10 : isPrev ? 5 : 1,
                  perspective: "1000px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="w-full h-full rounded-2xl overflow-hidden bg-[hsl(220_30%_7%/0.9)] backdrop-blur-xl transition-all duration-600"
                  style={{
                    border: `1px solid ${isActive ? panelAccent.border : "hsl(220 18% 20% / 0.15)"}`,
                    boxShadow: isActive
                      ? `0 0 60px -15px ${panelAccent.glow}`
                      : "none",
                  }}
                >
                  {/* Card header with accent-tinted border */}
                  <div
                    className="px-4 py-3 flex items-center gap-2"
                    style={{ borderBottom: `1px solid ${panelAccent.bg} / 0.08)` }}
                  >
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-400/60" />
                      <div className="w-2 h-2 rounded-full bg-amber-400/60" />
                      <div className="w-2 h-2 rounded-full bg-green-400/60" />
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-[9px] text-muted-foreground/50 font-medium">
                        {panel.title}
                      </div>
                    </div>
                    <div className="w-10" />
                  </div>

                  {/* Card content */}
                  {panel.content}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Floating decorative rings — accent colored */}
        <motion.div
          className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-30 animate-[spin_30s_linear_infinite]"
          animate={{ borderColor: `${accent.bg} / 0.12)` }}
          transition={{ duration: 0.8 }}
          style={{ border: "1px solid" }}
        />
        <motion.div
          className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full opacity-25 animate-[spin_25s_linear_infinite_reverse]"
          animate={{ borderColor: `${accent.bg} / 0.1)` }}
          transition={{ duration: 0.8 }}
          style={{ border: "1px solid" }}
        />
      </div>
    </div>
  );
});

FeatureImageStack.displayName = "FeatureImageStack";
export default FeatureImageStack;
