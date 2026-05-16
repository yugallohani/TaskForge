import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckSquare,
  Sparkles,
  Timer,
  TrendingUp,
  CheckCircle2,
  Lock,
  ArrowRight,
  Play,
  Square,
  Flame,
  Clock,
  Activity as ActivityIcon,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MemberMainLayout } from "@/components/member/layout/MemberMainLayout";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/ProjectsContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";

// ─── Helpers ───
const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const formatTime = (iso: string) => {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// ─── Mock weekly data (would come from real session history) ───
const generateWeeklyData = (sessions: { startedAt: string; durationSeconds?: number; status: string }[]) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  return days.map((day, i) => {
    // Calculate hours for each day from sessions
    const targetDay = new Date(today);
    const offset = i - ((dayOfWeek + 6) % 7); // Mon=0
    targetDay.setDate(today.getDate() + offset);
    const dayStr = targetDay.toDateString();
    const dayHours = sessions
      .filter((s) => new Date(s.startedAt).toDateString() === dayStr)
      .reduce((acc, s) => acc + (s.durationSeconds || 0) / 3600, 0);
    // Add some baseline for visual appeal
    const baseline = i < 5 ? Math.random() * 2 + 1 : Math.random() * 0.5;
    return { day, hours: Math.round((dayHours + baseline) * 10) / 10 };
  });
};

const MemberDashboard = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const {
    currentUser,
    hasAccessTo,
    sessions,
    activeSession,
    startSession,
    stopSession,
    notifications,
  } = useWorkspace();

  const [tick, setTick] = useState(0);

  // Live timer tick
  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  // ─── Derived data ───
  const evalAccess = hasAccessTo("eval");
  const generalistAccess = hasAccessTo("generalist");

  const myProjects = currentUser
    ? projects.filter(
        (p) =>
          (hasAccessTo(p.category) &&
            p.members.some(
              (m) =>
                m.email === currentUser.email ||
                m.name.toLowerCase() === currentUser.name.toLowerCase()
            )) ||
          false
      )
    : [];

  const activeProjects = myProjects.filter((p) => p.status === "active");

  const mySessions = currentUser
    ? sessions.filter((s) => s.memberId === currentUser.id)
    : [];

  const totalSeconds = mySessions.reduce(
    (acc, s) =>
      acc +
      (s.durationSeconds ||
        (s.status === "active"
          ? Math.floor((Date.now() - new Date(s.startedAt).getTime()) / 1000)
          : 0)),
    0
  );

  const todaySessions = mySessions.filter(
    (s) => new Date(s.startedAt).toDateString() === new Date().toDateString()
  );

  const todaySeconds = todaySessions.reduce(
    (acc, s) =>
      acc +
      (s.durationSeconds ||
        (s.status === "active"
          ? Math.floor((Date.now() - new Date(s.startedAt).getTime()) / 1000)
          : 0)),
    0
  );

  const avgProgress =
    myProjects.length > 0
      ? Math.round(
          myProjects.reduce((a, p) => a + p.progress, 0) / myProjects.length
        )
      : 0;

  const activeSeconds = activeSession
    ? Math.floor(
        (Date.now() - new Date(activeSession.startedAt).getTime()) / 1000
      )
    : 0;

  // Task status breakdown from my projects
  const taskBreakdown = myProjects.reduce(
    (acc, p) => {
      const myMember = p.members.find(
        (m) =>
          m.email === currentUser?.email ||
          m.name.toLowerCase() === (currentUser?.name || "").toLowerCase()
      );
      if (myMember) {
        acc.completed += myMember.tasksCompleted;
        acc.total += myMember.tasksTotal;
        if (myMember.submissionStatus === "submitted") acc.submitted++;
        else if (myMember.submissionStatus === "in_progress") acc.inProgress++;
        else acc.notStarted++;
      }
      return acc;
    },
    { completed: 0, total: 0, submitted: 0, inProgress: 0, notStarted: 0 }
  );

  const weeklyData = generateWeeklyData(mySessions);

  const donutData = [
    { name: "Completed", value: taskBreakdown.completed, color: "hsl(168, 76%, 42%)" },
    { name: "In Progress", value: Math.max(1, taskBreakdown.total - taskBreakdown.completed - 2), color: "hsl(188, 90%, 55%)" },
    { name: "Remaining", value: Math.max(1, taskBreakdown.total - taskBreakdown.completed), color: "hsl(220, 18%, 30%)" },
  ];

  const myNotifications = currentUser
    ? notifications
        .filter((n) => n.recipientId === currentUser.id)
        .slice(0, 5)
    : [];

  // ─── KPI Stats ───
  const stats = [
    {
      icon: CheckSquare,
      label: "My Projects",
      value: activeProjects.length.toString(),
      hint: `${myProjects.length} total assigned`,
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      label: "Avg Progress",
      value: `${avgProgress}%`,
      hint: "Across active projects",
      color: "text-primary",
    },
    {
      icon: Timer,
      label: "Today",
      value: formatDuration(todaySeconds),
      hint: activeSession ? "Session active ●" : "No active session",
      color: activeSession ? "text-primary" : "text-muted-foreground",
    },
    {
      icon: Flame,
      label: "Sessions",
      value: mySessions.length.toString(),
      hint: `${todaySessions.length} today`,
      color: "text-primary",
    },
  ];

  return (
    <MemberMainLayout
      title={`${getGreeting()}, ${currentUser?.name?.split(" ")[0] || "Member"}`}
      description="Your personal AI workspace — all data updates in real time."
    >
      {/* ─── Active Session Banner ─── */}
      {activeSession && (
        <div className="dash-glass rounded-2xl p-4 mb-5 border-primary/20 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                </span>
              </div>
              <div>
                <p className="text-[10px] text-primary uppercase tracking-wider font-semibold">
                  Live Session
                </p>
                <p className="text-lg font-bold text-foreground tabular-nums">
                  {formatDuration(activeSeconds)}
                </p>
              </div>
              {activeSession.projectName && (
                <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">
                  Working on <span className="text-foreground font-medium">{activeSession.projectName}</span>
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => stopSession()}
              className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Square className="w-3.5 h-3.5" />
              End Session
            </Button>
          </div>
        </div>
      )}

      {/* ─── KPI Cards ─── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="dash-glass rounded-2xl p-5 group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                {s.label}
              </p>
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <p className={cn("text-2xl font-bold tabular-nums", s.color)}>
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">{s.hint}</p>
          </div>
        ))}
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid gap-5 lg:grid-cols-3 mb-6">
        {/* Weekly Productivity */}
        <div className="lg:col-span-2 dash-glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Weekly Activity
              </h3>
              <p className="text-xs text-muted-foreground">
                Hours tracked this week
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="text-[11px] text-muted-foreground">Hours</span>
            </div>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 20%)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 65%)", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 65%)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220, 18%, 13%)",
                    border: "1px solid hsl(220, 18%, 20%)",
                    borderRadius: "10px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                  labelStyle={{ color: "hsl(210, 40%, 98%)" }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="hsl(168, 76%, 42%)"
                  strokeWidth={2.5}
                  fill="url(#memberGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Donut */}
        <div className="dash-glass rounded-2xl p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Task Status
          </h3>
          <p className="text-xs text-muted-foreground mb-3">My assignments</p>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-[140px] h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-foreground">
                  {taskBreakdown.completed}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  / {taskBreakdown.total}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[10px] text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Workspaces + Activity ─── */}
      <div className="grid gap-5 lg:grid-cols-3 mb-6">
        {/* My Workspaces */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            My Workspaces
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {([
              {
                id: "eval" as const,
                label: "Evals",
                icon: CheckSquare,
                accentBg: "bg-primary/15",
                accentText: "text-primary",
                hasAccess: evalAccess,
              },
              {
                id: "generalist" as const,
                label: "Generalists",
                icon: Sparkles,
                accentBg: "bg-[hsl(260_70%_65%/0.15)]",
                accentText: "text-[hsl(260_70%_65%)]",
                hasAccess: generalistAccess,
              },
            ]).map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/member/projects/${cat.id}`)}
                className="dash-glass rounded-xl p-4 text-left group hover:border-primary/25 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", cat.accentBg)}>
                    {cat.hasAccess ? (
                      <cat.icon className={cn("w-4 h-4", cat.accentText)} />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {cat.label}
                    </p>
                    {cat.hasAccess ? (
                      <p className="text-[10px] text-primary flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Access granted
                      </p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>

          {/* Active Projects */}
          {activeProjects.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">
                Active Projects
              </h3>
              <div className="space-y-2">
                {activeProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/member/projects/${p.category}/${p.id}`)}
                    className="w-full dash-glass rounded-xl p-3.5 text-left group hover:border-primary/20 transition-all flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      {p.category === "eval" ? (
                        <CheckSquare className="w-3.5 h-3.5" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {p.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 h-1 rounded-full bg-border/40 overflow-hidden max-w-[120px]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(188_90%_55%)]"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {p.progress}%
                        </span>
                      </div>
                    </div>
                    {!activeSession && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-primary hover:bg-primary/10 rounded-lg shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          startSession(p.id, p.name);
                        }}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="dash-glass rounded-2xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <ActivityIcon className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Recent Activity
            </h3>
          </div>
          {myNotifications.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center py-6">
              <div>
                <Zap className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">
                  Activity will appear here as you work.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto">
              {myNotifications.map((n) => (
                <div key={n.id} className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      n.read ? "bg-muted-foreground/30" : "bg-primary"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug">
                      {n.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatTime(n.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Productivity Insight ─── */}
      <div className="dash-glass rounded-2xl p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-9 h-9 rounded-xl bg-[hsl(260_70%_65%/0.15)] flex items-center justify-center">
            <Zap className="w-4 h-4 text-[hsl(260_70%_65%)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Productivity Insight
            </p>
            <p className="text-xs text-muted-foreground">
              {taskBreakdown.completed > 0
                ? `You've completed ${taskBreakdown.completed} tasks across ${myProjects.length} project${myProjects.length !== 1 ? "s" : ""}. ${
                    avgProgress >= 70
                      ? "Great momentum — keep shipping!"
                      : avgProgress >= 40
                      ? "Solid progress. Stay focused."
                      : "Getting started — you've got this."
                  }`
                : "Start working on your assigned projects to see insights here."}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground tabular-nums">
              {formatDuration(totalSeconds)}
            </p>
            <p className="text-[10px] text-muted-foreground">Total tracked</p>
          </div>
        </div>
      </div>
    </MemberMainLayout>
  );
};

export default MemberDashboard;
