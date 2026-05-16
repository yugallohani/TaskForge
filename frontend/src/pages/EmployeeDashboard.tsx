import { SidebarProvider } from "@/components/ui/sidebar";
import EmployeeSidebar from "@/components/employee-dashboard/EmployeeSidebar";
import DashboardHeader from "@/components/employee-dashboard/DashboardHeader";
import PerformanceMetrics from "@/components/employee-dashboard/PerformanceMetrics";
import Announcements from "@/components/employee-dashboard/Announcements";
import Schedule from "@/components/employee-dashboard/Schedule";
import QuickActions from "@/components/employee-dashboard/QuickActions";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ROUTES } from "@/lib/constants";
import { employeeAPI, getErrorMessage } from "@/lib/api";
import { PageLoader } from "@/components/common";
import { useToast } from "@/hooks/use-toast";

const EmployeeDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Redirect to login if no user
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN.EMPLOYEE);
    }
  }, [user, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await employeeAPI.getDashboard();
      setDashboardData(response.data);
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

  const handleClockIn = () => {
    // Navigate to attendance page where clock in/out is handled
    navigate(ROUTES.EMPLOYEE.ATTENDANCE);
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <PageLoader />;
  }

  const currentUser = {
    name: user.name,
    role: user.role,
    avatar: user.avatar || "",
    department: user.department || "General",
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <EmployeeSidebar />
        
        <main className="flex-1 flex flex-col">
          <DashboardHeader user={currentUser} />
          
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Section */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Welcome back, {currentUser.name.split(" ")[0]}! 👋
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Here's what's happening with your work today.
                  </p>
                </div>
                <QuickActions onClockIn={handleClockIn} />
              </div>

              {/* Performance Metrics */}
              <PerformanceMetrics data={dashboardData} />

              {/* Schedule */}
              <Schedule />

              {/* Announcements */}
              <Announcements />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EmployeeDashboard;
