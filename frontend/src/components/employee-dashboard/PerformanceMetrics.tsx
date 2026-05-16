import { TrendingUp, Target, Award, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Metric {
  id: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  icon: React.ElementType;
  color: string;
}

interface PerformanceMetricsProps {
  data?: any;
}

const PerformanceMetrics = ({ data }: PerformanceMetricsProps) => {
  const performanceData = data?.performance_metrics || {};
  
  const metrics: Metric[] = [
    {
      id: "1",
      label: "Tasks Completed",
      value: performanceData.tasks_completed || 0,
      target: 30,
      unit: "tasks",
      trend: "up",
      trendValue: "+12%",
      icon: Target,
      color: "text-primary",
    },
    {
      id: "2",
      label: "Productivity Score",
      value: performanceData.productivity_score || 0,
      target: 100,
      unit: "%",
      trend: "up",
      trendValue: "+5%",
      icon: Zap,
      color: "text-success",
    },
    {
      id: "3",
      label: "Goals Achieved",
      value: performanceData.goals_achieved || 0,
      target: 5,
      unit: "goals",
      trend: "neutral",
      trendValue: "On track",
      icon: Award,
      color: "text-warning",
    },
  ];
  return (
    <Card className="glass border-border/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const percentage = Math.round((metric.value / metric.target) * 100);
            const Icon = metric.icon;
            
            return (
              <div
                key={metric.id}
                className="p-4 rounded-xl bg-secondary/50 border border-border/30 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("p-2 rounded-lg bg-background/50", metric.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      metric.trend === "up"
                        ? "bg-success/20 text-success"
                        : metric.trend === "down"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {metric.trendValue}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {metric.target} {metric.unit}
                  </span>
                </div>
                
                <Progress value={percentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {percentage}% of target
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
