import {
  Brain,
  TrendingDown,
  Zap,
  AlertTriangle,
  Clock,
  Flame,
  Trophy,
  Users2,
  BarChart3,
  Target,
} from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { cn } from "@/lib/utils";

// ─── Insights data ───
const insights = [
  {
    icon: TrendingDown,
    label: "Most Delayed Project",
    value: "Response Quality Analysis",
    detail: "12 days behind schedule",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: Zap,
    label: "Fastest Contributor",
    value: "Priya Patel",
    detail: "Avg 2.4 tasks/day this week",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: AlertTriangle,
    label: "Highest Backlog Growth",
    value: "RLHF Ranking Pipeline",
    detail: "+18 tasks in 7 days",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    icon: Clock,
    label: "Avg Task Completion",
    value: "1.8 days",
    detail: "↓ 0.3 days from last week",
    color: "text-[hsl(188_90%_55%)]",
    bg: "bg-[hsl(188_90%_55%/0.1)]",
  },
  {
    icon: Flame,
    label: "Peak Productivity",
    value: "10 AM – 1 PM",
    detail: "42% of tasks completed",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

// ─── Leaderboard data ───
const contributors = [
  { name: "Priya Patel", tasks: 48, accuracy: 96, avatar: "PP" },
  { name: "Rahul Sharma", tasks: 42, accuracy: 94, avatar: "RS" },
  { name: "Amit Kumar", tasks: 38, accuracy: 91, avatar: "AK" },
  { name: "Sneha Gupta", tasks: 35, accuracy: 93, avatar: "SG" },
  { name: "Vikram Singh", tasks: 32, accuracy: 89, avatar: "VS" },
  { name: "Anjali Reddy", tasks: 30, accuracy: 95, avatar: "AR" },
  { name: "Karan Mehta", tasks: 28, accuracy: 87, avatar: "KM" },
  { name: "Divya Joshi", tasks: 26, accuracy: 92, avatar: "DJ" },
];

const maxTasks = Math.max(...contributors.map((c) => c.tasks));

// ─── Performance metrics ───
const performanceMetrics = [
  { label: "Sprint Velocity", value: "87%", trend: "+5%", positive: true },
  { label: "Avg Response Time", value: "2.1h", trend: "-18min", positive: true },
  { label: "Burnout Risk", value: "Low", trend: "Stable", positive: true },
  { label: "Quality Score", value: "94%", trend: "+2%", positive: true },
  { label: "Overdue Rate", value: "6%", trend: "+1%", positive: false },
  { label: "Team Utilization", value: "78%", trend: "+4%", positive: true },
];

// ─── Weekly trends ───
const weeklyTrends = [
  { week: "W1", tasks: 42, hours: 156 },
  { week: "W2", tasks: 48, hours: 168 },
  { week: "W3", tasks: 55, hours: 172 },
  { week: "W4", tasks: 52, hours: 164 },
];

const AIInsightsPage = () => {
  return (
    <MainLayout
      title="AI Insights"
      description="Automated intelligence and team performance analytics."
    >
      {/* ─── Key Insights ─── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {insights.map((insight) => (
          <div
            key={insight.label}
            className="dash-glass rounded-2xl p-4 hover:border-primary/20 transition-all duration-300"
          >
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center mb-3",
                insight.bg
              )}
            >
              <insight.icon className={cn("w-4 h-4", insight.color)} />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              {insight.label}
            </p>
            <p className="text-sm font-semibold text-foreground leading-tight mb-0.5">
              {insight.value}
            </p>
            <p className="text-[11px] text-muted-foreground">{insight.detail}</p>
          </div>
        ))}
      </div>

      {/* ─── Performance Metrics + Leaderboard ─── */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Performance Grid */}
        <div className="lg:col-span-1 dash-glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Performance
              </h3>
              <p className="text-[11px] text-muted-foreground">
                This sprint
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {performanceMetrics.map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between py-2 border-b border-[hsl(168_50%_40%/0.04)] last:border-0"
              >
                <span className="text-xs text-muted-foreground">
                  {m.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {m.value}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      m.positive ? "text-primary" : "text-destructive"
                    )}
                  >
                    {m.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Leaderboard */}
        <div className="lg:col-span-2 dash-glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Team Leaderboard
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Top contributors this sprint
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {contributors.map((person, index) => (
              <div key={person.name} className="flex items-center gap-4">
                <span
                  className={cn(
                    "text-sm font-bold w-5 text-center",
                    index === 0
                      ? "text-primary"
                      : index === 1
                      ? "text-[hsl(188_90%_55%)]"
                      : index === 2
                      ? "text-warning"
                      : "text-muted-foreground"
                  )}
                >
                  {index + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {person.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground truncate">
                      {person.name}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{person.tasks} tasks</span>
                      <span className="text-primary font-medium">
                        {person.accuracy}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(188_90%_55%)] transition-all duration-700"
                      style={{
                        width: `${(person.tasks / maxTasks) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Weekly Trends + Recommendations ─── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Trends */}
        <div className="dash-glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-[hsl(188_90%_55%/0.1)] flex items-center justify-center">
              <Target className="w-4 h-4 text-[hsl(188_90%_55%)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Weekly Trends
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Last 4 weeks
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {weeklyTrends.map((w) => (
              <div
                key={w.week}
                className="flex items-center gap-4 py-2 border-b border-[hsl(168_50%_40%/0.04)] last:border-0"
              >
                <span className="text-xs font-semibold text-foreground w-8">
                  {w.week}
                </span>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-border/40 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(188_90%_55%)]"
                      style={{ width: `${(w.tasks / 60) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-foreground">
                    {w.tasks}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-1">
                    tasks
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-foreground">
                    {w.hours}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-1">
                    hrs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="dash-glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-[hsl(260_70%_65%/0.15)] flex items-center justify-center">
              <Brain className="w-4 h-4 text-[hsl(260_70%_65%)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                AI Recommendations
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Automated suggestions
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              {
                title: "Redistribute RLHF workload",
                body: "Backlog growing 3× faster than completion rate. Consider adding 2 more annotators.",
                priority: "high",
              },
              {
                title: "Schedule team sync",
                body: "3 members haven't submitted in 48+ hours. A quick check-in may help.",
                priority: "medium",
              },
              {
                title: "Promote Priya Patel",
                body: "Consistently top performer for 4 sprints. Consider Eval Lead role.",
                priority: "low",
              },
              {
                title: "Extend Safety Eval deadline",
                body: "Current pace suggests 3 more days needed. Deadline is in 2 days.",
                priority: "high",
              },
            ].map((rec) => (
              <div
                key={rec.title}
                className="p-3 rounded-xl bg-[hsl(220_30%_8%/0.5)] border border-[hsl(168_50%_40%/0.06)] hover:border-[hsl(168_50%_40%/0.15)] transition-all"
              >
                <div className="flex items-start gap-2 mb-1">
                  <span
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                      rec.priority === "high"
                        ? "bg-destructive/15 text-destructive"
                        : rec.priority === "medium"
                        ? "bg-warning/15 text-warning"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs font-semibold text-foreground mb-0.5">
                  {rec.title}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {rec.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AIInsightsPage;
