import {
  FolderKanban,
  CheckSquare,
  TrendingUp,
  AlertTriangle,
  Users2,
  Brain,
} from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { StatCard } from "@/components/hr/dashboard/StatCard";
import { ProductivityChart } from "@/components/hr/dashboard/ProductivityChart";
import { TaskStatusChart } from "@/components/hr/dashboard/TaskStatusChart";
import { ActiveProjects } from "@/components/hr/dashboard/ActiveProjects";
import { RecentActivity } from "@/components/hr/dashboard/RecentActivity";
import { useProjects } from "@/contexts/ProjectsContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";

const AdminDashboard = () => {
  const { projects } = useProjects();
  const { sessions, accessRequests } = useWorkspace();

  // ─── Dynamic KPIs ───
  const activeProjects = projects.filter((p) => p.status === "active");
  const totalTasks = projects.reduce(
    (acc, p) => acc + p.members.reduce((a, m) => a + m.tasksTotal, 0),
    0
  );
  const completedTasks = projects.reduce(
    (acc, p) => acc + p.members.reduce((a, m) => a + m.tasksCompleted, 0),
    0
  );
  const pendingSubmissions = projects.reduce(
    (acc, p) => acc + p.submissions.filter((s) => s.status === "pending").length,
    0
  );
  const productivityRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueTasks = projects.reduce(
    (acc, p) => {
      const now = Date.now();
      const deadline = new Date(p.deadline).getTime();
      if (deadline < now && p.progress < 100) {
        return acc + Math.max(0, p.members.reduce((a, m) => a + (m.tasksTotal - m.tasksCompleted), 0));
      }
      return acc;
    },
    0
  );
  const totalMembers = new Set(
    projects.flatMap((p) => p.members.map((m) => m.email))
  ).size;
  const activeSessions = sessions.filter((s) => s.status === "active").length;
  const openIssues = projects.reduce(
    (acc, p) => acc + p.issues.filter((i) => i.status !== "resolved").length,
    0
  );
  const totalSubmissions = projects.reduce(
    (acc, p) => acc + p.submissions.length,
    0
  );
  const approvedSubmissions = projects.reduce(
    (acc, p) => acc + p.submissions.filter((s) => s.status === "approved").length,
    0
  );
  const evalAccuracy =
    totalSubmissions > 0
      ? Math.round((approvedSubmissions / totalSubmissions) * 100)
      : 0;

  const stats = [
    {
      title: "Active Projects",
      value: activeProjects.length.toString(),
      subtitle: `${projects.length} total`,
      icon: FolderKanban,
      trend: { value: projects.length > 0 ? Math.round((activeProjects.length / projects.length) * 100) : 0, isPositive: true },
      accentColor: "168 76% 42%",
    },
    {
      title: "Total Tasks",
      value: totalTasks.toString(),
      subtitle: `${pendingSubmissions} pending review`,
      icon: CheckSquare,
      trend: { value: completedTasks, isPositive: true },
      accentColor: "188 90% 55%",
    },
    {
      title: "Productivity Rate",
      value: `${productivityRate}%`,
      subtitle: "Completion rate",
      icon: TrendingUp,
      trend: { value: productivityRate > 50 ? 5 : -3, isPositive: productivityRate > 50 },
      accentColor: "155 60% 50%",
    },
    {
      title: "Open Issues",
      value: openIssues.toString(),
      subtitle: overdueTasks > 0 ? `${overdueTasks} overdue tasks` : "All on track",
      icon: AlertTriangle,
      trend: { value: openIssues, isPositive: openIssues === 0 },
      accentColor: "35 90% 55%",
    },
    {
      title: "Team Members",
      value: totalMembers.toString(),
      subtitle: `${activeSessions} online now`,
      icon: Users2,
      trend: { value: activeSessions, isPositive: true },
      accentColor: "210 80% 60%",
    },
    {
      title: "Eval Accuracy",
      value: `${evalAccuracy}%`,
      subtitle: `${approvedSubmissions}/${totalSubmissions} approved`,
      icon: Brain,
      trend: { value: evalAccuracy > 80 ? 2 : -1, isPositive: evalAccuracy > 80 },
      accentColor: "260 70% 65%",
    },
  ];

  return (
    <MainLayout
      title="Dashboard"
      description="Welcome back! Here's your project overview."
    >
      {/* KPI Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            className="animate-fade-in"
            style={
              { animationDelay: `${index * 80}ms` } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <ProductivityChart />
        </div>
        <div>
          <TaskStatusChart />
        </div>
      </div>

      {/* Projects + Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActiveProjects />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
