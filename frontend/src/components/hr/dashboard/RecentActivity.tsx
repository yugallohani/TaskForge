import {
  CheckCircle2,
  ArrowRight,
  FolderPlus,
  UserPlus,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "completed" | "moved" | "created" | "assigned" | "overdue";
  message: string;
  time: string;
  user: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "completed",
    message: 'completed "Image Eval #221"',
    time: "2 min ago",
    user: "Priya",
  },
  {
    id: "2",
    type: "moved",
    message: "moved task to Review",
    time: "8 min ago",
    user: "Rahul",
  },
  {
    id: "3",
    type: "created",
    message: 'created project "Safety QA"',
    time: "15 min ago",
    user: "Admin",
  },
  {
    id: "4",
    type: "assigned",
    message: "assigned 12 tasks to team",
    time: "32 min ago",
    user: "Admin",
  },
  {
    id: "5",
    type: "overdue",
    message: '"RLHF Batch #14" is overdue',
    time: "1 hour ago",
    user: "System",
  },
  {
    id: "6",
    type: "completed",
    message: 'completed "Prompt Audit #89"',
    time: "2 hours ago",
    user: "Amit",
  },
  {
    id: "7",
    type: "moved",
    message: "moved 3 tasks to Done",
    time: "3 hours ago",
    user: "Sneha",
  },
];

const getActivityIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "completed":
      return { icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" };
    case "moved":
      return { icon: ArrowRight, color: "text-[hsl(188_90%_55%)]", bg: "bg-[hsl(188_90%_55%/0.1)]" };
    case "created":
      return { icon: FolderPlus, color: "text-[hsl(260_70%_65%)]", bg: "bg-[hsl(260_70%_65%/0.1)]" };
    case "assigned":
      return { icon: UserPlus, color: "text-primary", bg: "bg-primary/10" };
    case "overdue":
      return { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" };
  }
};

export const RecentActivity = () => {
  return (
    <div className="dash-glass rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Recent Activity
        </h3>
        <button className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {activities.map((activity, index) => {
          const { icon: Icon, color, bg } = getActivityIcon(activity.type);
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 animate-fade-in"
              style={{ animationDelay: `${index * 60}ms` }}
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
                  <span className="font-medium">{activity.user}</span>{" "}
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
    </div>
  );
};
