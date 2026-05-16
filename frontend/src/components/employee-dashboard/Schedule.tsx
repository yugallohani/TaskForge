import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { employeeAPI } from "@/lib/api";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
}

const Schedule = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodaysTasks();
  }, []);

  const fetchTodaysTasks = async () => {
    try {
      setIsLoading(true);
      const response = await employeeAPI.getTasks({ status: "pending,in_progress" });
      // Get tasks due today or overdue
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todaysTasks = response.data.tasks.filter((task: Task) => {
        const dueDate = new Date(task.due_date);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate <= today;
      }).slice(0, 5); // Show max 5 tasks
      
      setTasks(todaysTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return { color: "bg-destructive/20 text-destructive", icon: AlertCircle };
      case "medium":
        return { color: "bg-warning/20 text-warning", icon: Clock };
      default:
        return { color: "bg-primary/20 text-primary", icon: CheckCircle2 };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground text-xs">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-primary text-primary-foreground text-xs">In Progress</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate < today) {
      return "Overdue";
    } else if (taskDate.getTime() === today.getTime()) {
      return "Today";
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Card className="glass border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Tasks
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {currentDate}
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View All Tasks
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No pending tasks for today</p>
            <p className="text-xs mt-1">You're all caught up!</p>
          </div>
        ) : (
          tasks.map((task) => {
            const priorityConfig = getPriorityConfig(task.priority);
            const PriorityIcon = priorityConfig.icon;
            const isOverdue = new Date(task.due_date) < new Date();
            
            return (
              <div
                key={task.id}
                className={cn(
                  "flex gap-3 p-3 rounded-lg transition-all",
                  "hover:bg-muted/50 group",
                  isOverdue && "bg-destructive/5 ring-1 ring-destructive/30"
                )}
              >
                <div className="flex flex-col items-center min-w-[60px]">
                  <span className={cn(
                    "text-sm font-medium",
                    isOverdue ? "text-destructive" : "text-foreground"
                  )}>
                    {formatDate(task.due_date)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {task.priority}
                  </span>
                </div>
                
                <div className="w-px bg-border/50 relative">
                  <div
                    className={cn(
                      "absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full",
                      isOverdue ? "bg-destructive animate-pulse" : "bg-muted-foreground/50"
                    )}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground flex items-center gap-2">
                        {task.title}
                        {isOverdue && (
                          <Badge className="bg-destructive text-destructive-foreground text-xs">
                            Overdue
                          </Badge>
                        )}
                      </p>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs ml-2", priorityConfig.color)}
                    >
                      <PriorityIcon className="h-3 w-3 mr-1" />
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default Schedule;
