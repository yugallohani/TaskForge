import {
  CheckCircle2,
  ArrowRight,
  FolderPlus,
  UserPlus,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Upload,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjects } from "@/contexts/ProjectsContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useMemo } from "react";

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  actor: string;
  time: string;
  timestamp: number;
}

const formatTime = (ts: number) => {
  const diffMin = Math.floor((Date.now() - ts) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
};

const getIcon = (type: string) => {
  switch (type) {
    case "submission":
      return { icon: Upload, color: "text-primary", bg: "bg-primary/10" };
    case "approved":
      return { icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" };
    case "access":
      return { icon: ShieldCheck, color: "text-[hsl(260_70%_65%)]", bg: "bg-[hsl(260_70%_65%/0.1)]" };
    case "issue":
      return { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" };
    case "project":
      return { icon: FolderPlus, color: "text-[hsl(188_90%_55%)]", bg: "bg-[hsl(188_90%_55%/0.1)]" };
    case "member":
      return { icon: UserPlus, color: "text-primary", bg: "bg-primary/10" };
    default:
      return { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" };
  }
};

export const RecentActivity = () => {
  const { projects } = useProjects();
  const { accessRequests, notifications } = useWorkspace();

  // Build activity feed from real data sources
  const activities = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];

    // From project activity logs
    projects.forEach((p) => {
      p.activity.forEach((a) => {
        let type = "project";
        if (a.type.includes("submission")) type = "submission";
        else if (a.type.includes("issue")) type = "issue";
        else if (a.type.includes("member")) type = "member";
        else if (a.type.includes("approved") || a.type.includes("rejected"))
          type = "approved";

        items.push({
          id: a.id,
          type,
          message: a.description,
          actor: a.actor,
          time: formatTime(new Date(a.timestamp).getTime()),
          timestamp: new Date(a.timestamp).getTime(),
        });
      });
    });

    // From access requests
    accessRequests.forEach((r) => {
      items.push({
        id: `req_${r.id}`,
        type: "access",
        message: `requested access to ${r.category === "eval" ? "Evals" : "Generalists"}`,
        actor: r.memberName,
        time: formatTime(new Date(r.requestedAt).getTime()),
        timestamp: new Date(r.requestedAt).getTime(),
      });
      if (r.status === "approved" && r.reviewedAt) {
        items.push({
          id: `appr_${r.id}`,
          type: "approved",
          message: `approved ${r.memberName} for ${r.category === "eval" ? "Evals" : "Generalists"}`,
          actor: "Admin",
          time: formatTime(new Date(r.reviewedAt).getTime()),
          timestamp: new Date(r.reviewedAt).getTime(),
        });
      }
    });

    // Sort by timestamp descending, take top 10
    return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  }, [projects, accessRequests]);

  return (
    <div className="dash-glass rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Recent Activity
        </h3>
        <span className="text-[10px] text-muted-foreground">
          Live
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center py-6">
          <div>
            <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              Activity will appear as the team works.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {activities.map((activity, index) => {
            const { icon: Icon, color, bg } = getIcon(activity.type);
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 animate-fade-in"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    bg
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">
                    <span className="font-medium">{activity.actor}</span>{" "}
                    <span className="text-muted-foreground">
                      {activity.message}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
