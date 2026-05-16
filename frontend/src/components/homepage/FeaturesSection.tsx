import {
  KanbanSquare,
  Activity,
  BarChart3,
  Users2,
  CalendarClock,
  Sparkles,
} from "lucide-react";

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

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Everything your team needs to
            <span className="text-gradient"> ship work</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A focused suite of tools built for clarity, momentum, and collaboration
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group glass glass-hover rounded-2xl p-6 hover:glow-primary transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
