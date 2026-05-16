import { useState, useEffect } from "react";
import { Clock, UserPlus, LogIn, LogOut, Calendar, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { hrAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  type: string;
  message: string;
  time: string;
  timestamp: string;
  employee_name?: string;
  clock_time?: string;
  leave_type?: string;
  date_range?: string;
}

export const RecentActivity = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchActivities();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchActivities(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      const response = await hrAPI.getRecentActivity({ limit: 10 });
      setActivities(response.data.activities || []);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      if (!silent) {
        toast({
          title: "Error loading activities",
          description: "Failed to fetch recent activity. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchActivities();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "employee_created":
        return {
          icon: UserPlus,
          iconColor: "text-success",
          iconBg: "bg-success/10",
        };
      case "clock_in":
        return {
          icon: LogIn,
          iconColor: "text-primary",
          iconBg: "bg-primary/10",
        };
      case "clock_out":
        return {
          icon: LogOut,
          iconColor: "text-blue-500",
          iconBg: "bg-blue-500/10",
        };
      case "leave_request":
        return {
          icon: Calendar,
          iconColor: "text-warning",
          iconBg: "bg-warning/10",
        };
      default:
        return {
          icon: Clock,
          iconColor: "text-muted-foreground",
          iconBg: "bg-muted",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Loading activities...
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </Button>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const { icon: Icon, iconColor, iconBg } = getActivityIcon(activity.type);
            
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", iconBg)}>
                  <Icon className={cn("h-4 w-4", iconColor)} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
