import { useState, useEffect } from "react";
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
import { TeamLeaderboard } from "@/components/hr/dashboard/TeamLeaderboard";
import { AIInsights } from "@/components/hr/dashboard/AIInsights";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Active Projects",
      value: "8",
      subtitle: "+2 this week",
      icon: FolderKanban,
      trend: { value: 25, isPositive: true },
    },
    {
      title: "Total Tasks",
      value: "248",
      subtitle: "32 pending review",
      icon: CheckSquare,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Productivity Rate",
      value: "87%",
      subtitle: "Completion rate",
      icon: TrendingUp,
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Overdue Tasks",
      value: "14",
      subtitle: "Needs attention",
      icon: AlertTriangle,
      trend: { value: 3, isPositive: false },
    },
    {
      title: "Active Contributors",
      value: "23",
      subtitle: "Online now",
      icon: Users2,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "AI Eval Accuracy",
      value: "92%",
      subtitle: "Agreement score",
      icon: Brain,
      trend: { value: 2, isPositive: true },
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
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <ActiveProjects />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Team Leaderboard + AI Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TeamLeaderboard />
        <AIInsights />
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
