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
  LogIn,
  Play,
  Square,
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
    case "login":
      return { icon: LogIn, color: "text-[hsl(210_80%_60%)]", bg: "bg-[hsl(210_80%_60%/0.1)]" };
    case "session_start":
      return { icon: Play, color: "text-[hsl(155_60%_50%)]", bg: "bg-[hsl(155_60%_50%/0.1)]" };
    case "session_end":
      return { icon: Square, color: "text-muted-foreground", bg: "bg-muted/50" };
    default:
      return { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" };
  }
};

export const RecentActivity = () => {
  const { projects } = useProjects();
  const { accessRequests, sessions } = useWorkspace();

  // Build comprehensive activity feed from ALL data sources
  const activities = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];

    // 1. From project activity logs (tasks, submissions, issues, members)
    projects.forEach((p) => {
      p.activity.forEach((a) => {
        let type = "project";
        if (a.type.includes("submission") || a.type.includes("upload")) type = "submission";
        else if (a.type.includes("issue")) type = "issue";
        else if (a.type.includes("member") || a.type.includes("join")) type = "member";
        else if (a.type.includes("approved") || a.type.includes("rejected") || a.type.includes("review"))
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

    // 2. From access requests (requested + approved/rejected)
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
      if (r.status === "rejected" && r.reviewedAt) {
        items.push({
          id: `rej_${r.id}`,
          type: "issue",
          message: `rejected ${r.memberName}'s access to ${r.category === "eval" ? "Evals" : "Generalists"}`,
          actor: "Admin",
          time: formatTime(new Date(r.reviewedAt).getTime()),
          timestamp: new Date(r.reviewedAt).getTime(),
        });
      }
    });

    // 3. From work sessions (started + completed)
    sessions.slice(0, 20).forEach((s) => {
      items.push({
        id: `sess_start_${s.id}`,
        type: "session_start",
        message: s.projectName
          ? `started working on "${s.projectName}"`
          : "started a work session",
        actor: s.memberName,
        time: formatTime(new Date(s.startedAt).getTime()),
        timestamp: new Date(s.startedAt).getTime(),
      });
      if (s.status === "completed" && s.endedAt) {
        items.push({
          id: `sess_end_${s.id}`,
          type: "session_end",
          message: s.projectName
            ? `ended session on "${s.projectName}"`
            : "ended work session",
          actor: s.memberName,
          time: formatTime(new Date(s.endedAt).getTime()),
          timestamp: new Date(s.endedAt).getTime(),
        });
      }
    });

    // Sort by timestamp descending, take top 12
    return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 12);
  }, [projects, accessRequests, sessions]);

  return (
    <div className="dash-glass rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Recent Activity
        </h3>
        <span className="flex items-center gap-1.5 text-[10px] text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
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
