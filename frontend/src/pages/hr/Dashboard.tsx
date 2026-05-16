import { useState, useEffect } from "react";
import { Users, CalendarCheck, UserCheck, TrendingUp } from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { StatCard } from "@/components/hr/dashboard/StatCard";
import { AttendanceChart } from "@/components/hr/dashboard/AttendanceChart";
import { RecentActivity } from "@/components/hr/dashboard/RecentActivity";
import { hrAPI, getErrorMessage } from "@/lib/api";
import { PageLoader } from "@/components/common";
import { useToast } from "@/hooks/use-toast";

const HRDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: "Total Employees",
      value: "0",
      subtitle: "Across all departments",
      icon: Users,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "Present Today",
      value: "0",
      subtitle: "0% attendance rate",
      icon: UserCheck,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "On Leave",
      value: "0",
      subtitle: "Approved leaves",
      icon: CalendarCheck,
    },
    {
      title: "Avg. Attendance",
      value: "0%",
      subtitle: "This month",
      icon: TrendingUp,
      trend: { value: 0, isPositive: true },
    },
  ]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await hrAPI.getDashboardStats();
      const data = response.data;

      // Update stats with real data
      setStats([
        {
          title: "Total Employees",
          value: data.total_employees?.toString() || "0",
          subtitle: "Across all departments",
          icon: Users,
          trend: { value: 12, isPositive: true },
        },
        {
          title: "Present Today",
          value: ((data.today_attendance?.present || 0) + (data.today_attendance?.late || 0)).toString(),
          subtitle: `${data.today_attendance?.attendance_rate || 0}% attendance rate`,
          icon: UserCheck,
          trend: { value: 5, isPositive: true },
        },
        {
          title: "On Leave",
          value: data.approved_leaves_today?.toString() || "0",
          subtitle: "Approved leaves",
          icon: CalendarCheck,
        },
        {
          title: "Avg. Attendance",
          value: data.monthly_attendance_avg ? `${Math.round(data.monthly_attendance_avg)}%` : "0%",
          subtitle: "Today",
          icon: TrendingUp,
          trend: { value: 3, isPositive: true },
        },
      ]);
    } catch (error) {
      toast({
        title: "Error loading dashboard",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <MainLayout 
      title="Dashboard" 
      description="Welcome back! Here's your HR overview."
    >
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </MainLayout>
  );
};

export default HRDashboard;
