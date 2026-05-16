import { useNavigate } from "react-router-dom";
import {
  CheckSquare,
  Sparkles,
  Timer,
  Activity,
  Lock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { MemberMainLayout } from "@/components/member/layout/MemberMainLayout";
import { useProjects } from "@/contexts/ProjectsContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

const MemberDashboard = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { currentUser, hasAccessTo, sessions, activeSession } = useWorkspace();

  const evalAccess = hasAccessTo("eval");
  const generalistAccess = hasAccessTo("generalist");

  // My assigned projects (member is in the project's members list)
  const myProjects = currentUser
    ? projects.filter((p) =>
        p.members.some(
          (m) =>
            m.email === currentUser.email ||
            m.name.toLowerCase() === currentUser.name.toLowerCase()
        )
      )
    : [];

  // My work session totals
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

  const stats = [
    {
      icon: CheckSquare,
      label: "My Projects",
      value: myProjects.length.toString(),
      hint: `${myProjects.filter((p) => p.status === "active").length} active`,
    },
    {
      icon: TrendingUp,
      label: "Avg Progress",
      value:
        myProjects.length > 0
          ? `${Math.round(
              myProjects.reduce((a, p) => a + p.progress, 0) /
                myProjects.length
            )}%`
          : "0%",
      hint: "Across my projects",
    },
    {
      icon: Timer,
      label: "Hours Worked",
      value: formatDuration(totalSeconds),
      hint: activeSession ? "Session active" : "Punch in to start",
    },
    {
      icon: CheckCircle2,
      label: "Sessions",
      value: mySessions.length.toString(),
      hint: "All time",
    },
  ];

  return (
    <MemberMainLayout
      title={`Welcome back, ${currentUser?.name?.split(" ")[0] || "Member"}`}
      description="Here's your workspace at a glance."
    >
      {/* Stats grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="dash-glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                {s.label}
              </p>
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1.5">{s.hint}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          My Workspaces
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(
            [
              {
                id: "eval" as const,
                label: "Evals",
                description: "Evaluation pipelines and quality reviews",
                icon: CheckSquare,
                accentBg: "bg-primary/15",
                accentText: "text-primary",
                hasAccess: evalAccess,
              },
              {
                id: "generalist" as const,
                label: "Generalists",
                description: "Open-ended ops, research, and data workflows",
                icon: Sparkles,
                accentBg: "bg-[hsl(260_70%_65%/0.15)]",
                accentText: "text-[hsl(260_70%_65%)]",
                hasAccess: generalistAccess,
              },
            ]
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/member/projects/${cat.id}`)}
              className="dash-glass rounded-2xl p-6 text-left group hover:border-primary/25 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center",
                      cat.accentBg
                    )}
                  >
                    <cat.icon className={cn("w-5 h-5", cat.accentText)} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {cat.label}
                    </h3>
                    {cat.hasAccess ? (
                      <p className="text-xs text-primary flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Access granted
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Locked — apply for access
                      </p>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-muted-foreground">{cat.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Active session */}
      {activeSession && (
        <div className="dash-glass rounded-2xl p-5 mb-6 border-primary/20">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Active Session
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {activeSession.projectName || "General work session"}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/member/work-sessions")}
              className="text-xs text-primary hover:text-primary/80"
            >
              Manage session →
            </button>
          </div>
        </div>
      )}

      {/* My projects */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          My Active Projects
        </h2>
        {myProjects.length === 0 ? (
          <div className="dash-glass rounded-2xl p-8 text-center">
            <Activity className="w-10 h-10 mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-sm text-foreground font-medium">
              No projects assigned yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Apply for category access from the Projects page.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {myProjects.map((p) => (
              <button
                key={p.id}
                onClick={() =>
                  navigate(`/member/projects/${p.category}/${p.id}`)
                }
                className="dash-glass rounded-xl p-4 text-left group hover:border-primary/25 transition-all"
              >
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  {p.category === "eval" ? "Evals" : "Generalists"}
                </p>
                <h4 className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {p.name}
                </h4>
                <div className="h-1 rounded-full bg-border/40 overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(188_90%_55%)]"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {p.progress}% complete
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </MemberMainLayout>
  );
};

export default MemberDashboard;
