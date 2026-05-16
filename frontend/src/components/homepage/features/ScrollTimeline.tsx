import { useRef } from "react";
import {
  KanbanSquare,
  Activity,
  BarChart3,
  Users2,
  CalendarClock,
  Sparkles,
} from "lucide-react";
import { useActiveSection } from "./useActiveSection";
import TimelineRail from "./TimelineRail";
import FeatureCard from "./FeatureCard";
import FeatureImageStack from "./FeatureImageStack";

const features = [
  {
    icon: KanbanSquare,
    title: "Team Project Organization",
    description:
      "Group related work into projects and boards so every initiative has a clear home and your team always knows where to look.",
  },
  {
    icon: Activity,
    title: "Real-time Task Tracking",
    description:
      "See status changes the moment they happen. Drag, update, and reassign tasks while your teammates stay in sync automatically.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Visual dashboards turn raw activity into momentum. Track velocity, completion rates, and bottlenecks at a glance.",
  },
  {
    icon: Users2,
    title: "Smart Collaboration",
    description:
      "Assign owners, share context, and keep conversations next to the work. Less switching, more shipping.",
  },
  {
    icon: CalendarClock,
    title: "Deadline Management",
    description:
      "Due dates, priorities, and reminders keep critical work visible so nothing important slips through the cracks.",
  },
  {
    icon: Sparkles,
    title: "Team Productivity",
    description:
      "Lightweight workflows and a focused interface help your team move faster without adding process overhead.",
  },
];

const ScrollTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { activeIndex, fillProgress } = useActiveSection(cardRefs, containerRef);

  return (
    <section id="features" className="relative py-24">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase float-subtle">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Everything your team needs to
            <span className="text-gradient"> ship work</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A focused suite of tools built for clarity, momentum, and
            collaboration
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* LEFT SIDE — Timeline + Cards */}
          <div className="relative" ref={containerRef}>
            {/* Timeline Rail (desktop only) — constrained to card stack height */}
            <div className="hidden lg:block absolute inset-y-0 left-0">
              <TimelineRail
                fillProgress={fillProgress}
                activeIndex={activeIndex}
                itemCount={features.length}
              />
            </div>

            {/* Feature Cards */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    isActive={index === activeIndex}
                    isPast={index < activeIndex}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE — Sticky Image Stack (unchanged) */}
          <div className="hidden lg:block relative">
            <div className="sticky top-[15vh] h-[70vh]">
              <FeatureImageStack activeIndex={activeIndex} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollTimeline;
