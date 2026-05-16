import { useEffect, useState } from "react";
import { Play, Square, Timer, Clock, CheckCircle2 } from "lucide-react";
import { MemberMainLayout } from "@/components/member/layout/MemberMainLayout";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
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

const MemberWorkSessions = () => {
  const { currentUser, sessions, activeSession, startSession, stopSession } =
    useWorkspace();
  const { toast } = useToast();
  const [tick, setTick] = useState(0);

  // Re-render every second when there's an active session
  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const mySessions = currentUser
    ? sessions
        .filter((s) => s.memberId === currentUser.id)
        .sort(
          (a, b) =>
            new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        )
    : [];

  const totalSeconds = mySessions.reduce((acc, s) => {
    if (s.status === "completed") return acc + (s.durationSeconds || 0);
    return (
      acc +
      Math.floor((Date.now() - new Date(s.startedAt).getTime()) / 1000)
    );
  }, 0);

  const todaySeconds = mySessions
    .filter((s) => {
      const d = new Date(s.startedAt);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    })
    .reduce((acc, s) => {
      if (s.status === "completed") return acc + (s.durationSeconds || 0);
      return (
        acc +
        Math.floor((Date.now() - new Date(s.startedAt).getTime()) / 1000)
      );
    }, 0);

  const activeSeconds = activeSession
    ? Math.floor(
        (Date.now() - new Date(activeSession.startedAt).getTime()) / 1000
      )
    : 0;

  const handlePunchIn = () => {
    startSession();
    toast({
      title: "Punched in",
      description: "Your work session is now active.",
    });
  };

  const handlePunchOut = () => {
    stopSession();
    toast({
      title: "Punched out",
      description: "Session has been logged.",
    });
  };

  return (
    <MemberMainLayout
      title="Work Sessions"
      description="Track your active work and review session history."
    >
      {/* Active session card */}
      <div className="dash-glass rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center",
                activeSession ? "bg-primary/15" : "bg-muted/30"
              )}
            >
              {activeSession ? (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </span>
              ) : (
                <Timer className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {activeSession ? "Currently Working" : "No Active Session"}
              </p>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {activeSession
                  ? formatDuration(activeSeconds)
                  : "00h 00m 00s"}
              </p>
              {activeSession?.projectName && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Working on {activeSession.projectName}
                </p>
              )}
            </div>
          </div>

          {activeSession ? (
            <Button
              variant="outline"
              size="lg"
              onClick={handlePunchOut}
              className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <Square className="w-4 h-4" />
              Punch Out
            </Button>
          ) : (
            <Button
              variant="hero"
              size="lg"
              onClick={handlePunchIn}
              className="rounded-xl"
            >
              <Play className="w-4 h-4" />
              Punch In
            </Button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
        <div className="dash-glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Today
            </p>
          </div>
          <p className="text-xl font-bold text-foreground tabular-nums">
            {formatDuration(todaySeconds)}
          </p>
        </div>
        <div className="dash-glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="w-3.5 h-3.5 text-primary" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              All Time
            </p>
          </div>
          <p className="text-xl font-bold text-foreground tabular-nums">
            {formatDuration(totalSeconds)}
          </p>
        </div>
        <div className="dash-glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Sessions
            </p>
          </div>
          <p className="text-xl font-bold text-foreground tabular-nums">
            {mySessions.length}
          </p>
        </div>
      </div>

      {/* History */}
      <div className="dash-glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[hsl(168_50%_40%/0.06)]">
          <h3 className="text-sm font-semibold text-foreground">
            Session History
          </h3>
        </div>
        {mySessions.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No sessions yet. Punch in to start tracking time.
          </div>
        ) : (
          <div className="divide-y divide-[hsl(168_50%_40%/0.04)]">
            {mySessions.map((s) => {
              const isActive = s.status === "active";
              const dur = isActive
                ? Math.floor(
                    (Date.now() - new Date(s.startedAt).getTime()) / 1000
                  )
                : s.durationSeconds || 0;
              return (
                <div
                  key={s.id}
                  className="grid grid-cols-[auto_1fr_auto] gap-4 items-center px-5 py-3"
                >
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                      </span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                    )}
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-wider",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {isActive ? "Active" : "Completed"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {s.projectName || "General work session"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Started {formatTime(s.startedAt)}
                      {s.endedAt && ` · Ended ${formatTime(s.endedAt)}`}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    {formatDuration(dur)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MemberMainLayout>
  );
};

export default MemberWorkSessions;
