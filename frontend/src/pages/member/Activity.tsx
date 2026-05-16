import { Activity as ActivityIcon, Bell } from "lucide-react";
import { MemberMainLayout } from "@/components/member/layout/MemberMainLayout";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const MemberActivity = () => {
  const { currentUser, notifications, markAllRead } = useWorkspace();

  const myNotifications = currentUser
    ? notifications
        .filter((n) => n.recipientId === currentUser.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    : [];

  const unread = myNotifications.filter((n) => !n.read).length;

  return (
    <MemberMainLayout
      title="Activity"
      description="Your notifications and recent updates."
    >
      <div className="dash-glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[hsl(168_50%_40%/0.06)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ActivityIcon className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Activity Feed
            </h3>
            {unread > 0 && (
              <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-semibold">
                {unread} new
              </span>
            )}
          </div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {myNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-foreground font-medium">No activity yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              You'll see updates about access requests, task assignments, and
              reviews here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[hsl(168_50%_40%/0.04)]">
            {myNotifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "px-5 py-4 transition-colors",
                  !n.read && "bg-primary/[0.03]"
                )}
              >
                <div className="flex items-start gap-3">
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  )}
                  <div className={cn("flex-1 min-w-0", n.read && "pl-5")}>
                    <p className="text-sm font-medium text-foreground">
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {n.body}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      {formatTime(n.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MemberMainLayout>
  );
};

export default MemberActivity;
