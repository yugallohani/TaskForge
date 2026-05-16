import { Project, ActivityType } from "@/types/project";
import {
  CheckCircle2,
  XCircle,
  UserPlus,
  UserMinus,
  AlertCircle,
  FolderPlus,
  Upload,
  Settings2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const activityIcon: Record<
  ActivityType,
  { icon: typeof CheckCircle2; bg: string; color: string }
> = {
  project_created: {
    icon: FolderPlus,
    bg: "bg-[hsl(260_70%_65%/0.15)]",
    color: "text-[hsl(260_70%_65%)]",
  },
  member_joined: {
    icon: UserPlus,
    bg: "bg-primary/15",
    color: "text-primary",
  },
  member_removed: {
    icon: UserMinus,
    bg: "bg-muted",
    color: "text-muted-foreground",
  },
  task_assigned: {
    icon: ArrowRight,
    bg: "bg-[hsl(188_90%_55%/0.15)]",
    color: "text-[hsl(188_90%_55%)]",
  },
  submission_uploaded: {
    icon: Upload,
    bg: "bg-[hsl(188_90%_55%/0.15)]",
    color: "text-[hsl(188_90%_55%)]",
  },
  submission_approved: {
    icon: CheckCircle2,
    bg: "bg-primary/15",
    color: "text-primary",
  },
  submission_rejected: {
    icon: XCircle,
    bg: "bg-destructive/15",
    color: "text-destructive",
  },
  issue_created: {
    icon: AlertCircle,
    bg: "bg-warning/15",
    color: "text-warning",
  },
  issue_resolved: {
    icon: CheckCircle2,
    bg: "bg-primary/15",
    color: "text-primary",
  },
  admin_updated: {
    icon: Settings2,
    bg: "bg-muted",
    color: "text-muted-foreground",
  },
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const ActivityTab = ({ project }: { project: Project }) => {
  return (
    <div className="dash-glass rounded-2xl p-6">
      {project.activity.length === 0 ? (
        <div className="text-center py-8">
          <Settings2 className="w-10 h-10 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-foreground font-medium">No activity yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Activity will appear as members work on this project.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-[hsl(168_50%_40%/0.2)] via-[hsl(168_50%_40%/0.08)] to-transparent" />

          <div className="space-y-4">
            {project.activity.map((entry, i) => {
              const config = activityIcon[entry.type];
              const Icon = config.icon;
              return (
                <div key={entry.id} className="flex items-start gap-3 relative">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ring-[hsl(220_30%_8%)]",
                      config.bg
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm text-foreground leading-snug">
                      <span className="font-medium">{entry.actor}</span>{" "}
                      <span className="text-muted-foreground">
                        {entry.description}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {formatTime(entry.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
