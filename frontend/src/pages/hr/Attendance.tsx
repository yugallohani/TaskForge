import { useState, useEffect } from "react";
import { Timer, Clock, Play, Square, Users2, TrendingUp } from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const WorkSessions = () => {
  const { sessions } = useWorkspace();
  const [tick, setTick] = useState(0);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Tick every second for live timers
  useEffect(() => {
    const hasActive = sessions.some((s) => s.status === "active");
    if (!hasActive) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [sessions]);

  const activeSessions = sessions.filter((s) => s.status === "active");
  const completedSessions = sessions.filter((s) => s.status === "completed");

  const filtered =
    filter === "all"
      ? sessions
      : filter === "active"
      ? activeSessions
      : completedSessions;

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );

  const totalHours = sessions.reduce((acc, s) => {
    const dur =
      s.durationSeconds ||
      (s.status === "active"
        ? Math.floor((Date.now() - new Date(s.startedAt).getTime()) / 1000)
        : 0);
    return acc + dur;
  }, 0);

  const tabs: { id: typeof filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: sessions.length },
    { id: "active", label: "Active", count: activeSessions.length },
    { id: "completed", label: "Completed", count: completedSessions.length },
  ];

  return (
    <MainLayout
      title="Work Sessions"
      description="Track and manage team work sessions and productivity."
    >
      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4 mb-6">
        <div className="dash-glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-3.5 h-3.5 text-primary" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Active Now
            </p>
          </div>
          <p className="text-2xl font-bold text-primary tabular-nums">
            {activeSessions.length}
          </p>
        </div>
        <div className="dash-glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Total Sessions
            </p>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {sessions.length}
          </p>
        </div>
        <div className="dash-glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Total Hours
            </p>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {formatDuration(totalHours)}
          </p>
        </div>
        <div className="dash-glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users2 className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Unique Members
            </p>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {new Set(sessions.map((s) => s.memberId)).size}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[hsl(220_30%_10%/0.5)] border border-[hsl(168_50%_40%/0.08)] w-fit mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              filter === t.id
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            <span className="ml-1.5 text-[10px] opacity-70">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Sessions list */}
      {sorted.length === 0 ? (
        <div className="dash-glass rounded-2xl p-12 text-center">
          <Timer className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-foreground font-medium">No work sessions</p>
          <p className="text-xs text-muted-foreground mt-1">
            Sessions will appear here when members punch in or start tasks.
          </p>
        </div>
      ) : (
        <div className="dash-glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[hsl(168_50%_40%/0.06)] text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Status</span>
            <span>Member</span>
            <span>Project</span>
            <span>Started</span>
            <span>Duration</span>
            <span></span>
          </div>
          <div className="divide-y divide-[hsl(168_50%_40%/0.04)]">
            {sorted.map((session) => {
              const isActive = session.status === "active";
              const dur = isActive
                ? Math.floor(
                    (Date.now() - new Date(session.startedAt).getTime()) / 1000
                  )
                : session.durationSeconds || 0;

              return (
                <div
                  key={session.id}
                  className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 items-center hover:bg-[hsl(220_30%_10%/0.4)] transition-colors"
                >
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                      </span>
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
                    )}
                  </div>

                  {/* Member */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                      {session.memberAvatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {session.memberName}
                      </p>
                    </div>
                  </div>

                  {/* Project */}
                  <span className="text-xs text-muted-foreground truncate">
                    {session.projectName || "General session"}
                  </span>

                  {/* Started */}
                  <span className="text-xs text-muted-foreground">
                    {formatTime(session.startedAt)}
                  </span>

                  {/* Duration */}
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      isActive ? "text-primary" : "text-foreground"
                    )}
                  >
                    {formatDuration(dur)}
                  </span>

                  {/* Active indicator */}
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isActive ? "Live" : "Done"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default WorkSessions;
