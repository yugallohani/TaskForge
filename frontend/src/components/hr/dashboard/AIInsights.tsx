import {
  Brain,
  TrendingDown,
  Zap,
  AlertTriangle,
  Clock,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export const AIInsights = () => {
  return (
    <div className="dash-glass rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[hsl(260_70%_65%/0.15)] flex items-center justify-center">
          <Brain className="w-4 h-4 text-[hsl(260_70%_65%)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
          <p className="text-xs text-muted-foreground">
            Automated analysis of team performance
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {insights.map((insight) => (
          <div
            key={insight.label}
            className="p-3.5 rounded-xl bg-[hsl(220_30%_8%/0.5)] border border-[hsl(168_50%_40%/0.06)] hover:border-[hsl(168_50%_40%/0.15)] transition-all duration-300"
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2.5", insight.bg)}>
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
    </div>
  );
};
