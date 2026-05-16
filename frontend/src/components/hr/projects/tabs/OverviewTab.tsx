import { Project } from "@/types/project";
import {
  FileText,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const OverviewTab = ({ project }: { project: Project }) => {
  const totalTasks = project.members.reduce((sum, m) => sum + m.tasksTotal, 0);
  const completedTasks = project.members.reduce(
    (sum, m) => sum + m.tasksCompleted,
    0
  );
  const inProgressMembers = project.members.filter(
    (m) => m.submissionStatus === "in_progress"
  ).length;
  const submittedMembers = project.members.filter(
    (m) => m.submissionStatus === "submitted"
  ).length;
  const notStarted = project.members.filter(
    (m) => m.submissionStatus === "not_started"
  ).length;

  const metrics = [
    {
      icon: TrendingUp,
      label: "Tasks Completed",
      value: `${completedTasks} / ${totalTasks}`,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: CheckCircle2,
      label: "Submitted",
      value: `${submittedMembers} members`,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Clock,
      label: "In Progress",
      value: `${inProgressMembers} members`,
      color: "text-[hsl(188_90%_55%)]",
      bg: "bg-[hsl(188_90%_55%/0.1)]",
    },
    {
      icon: AlertCircle,
      label: "Not Started",
      value: `${notStarted} members`,
      color: "text-muted-foreground",
      bg: "bg-muted/30",
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left: Description + Instructions */}
      <div className="lg:col-span-2 space-y-6">
        <div className="dash-glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Description
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="dash-glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Instructions
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {project.instructions || "No instructions provided yet."}
          </p>
        </div>
      </div>

      {/* Right: Metrics */}
      <div className="space-y-3">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">
          Live Metrics
        </h3>
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="dash-glass rounded-xl p-4 flex items-center gap-3"
          >
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center",
                metric.bg
              )}
            >
              <metric.icon className={cn("w-4 h-4", metric.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {metric.label}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {metric.value}
              </p>
            </div>
          </div>
        ))}

        <div className="dash-glass rounded-xl p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
            Created
          </p>
          <p className="text-sm font-semibold text-foreground">
            {formatDate(project.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};
