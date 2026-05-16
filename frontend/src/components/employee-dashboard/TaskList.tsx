import { useState } from "react";
import { CheckCircle2, Circle, Clock, AlertCircle, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  completed: boolean;
  project: string;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete quarterly report",
    priority: "high",
    dueDate: "Today",
    completed: false,
    project: "Finance",
  },
  {
    id: "2",
    title: "Review pull request #234",
    priority: "medium",
    dueDate: "Tomorrow",
    completed: false,
    project: "Development",
  },
  {
    id: "3",
    title: "Update project documentation",
    priority: "low",
    dueDate: "Feb 10",
    completed: true,
    project: "Documentation",
  },
  {
    id: "4",
    title: "Prepare presentation slides",
    priority: "high",
    dueDate: "Feb 12",
    completed: false,
    project: "Marketing",
  },
  {
    id: "5",
    title: "Team performance review",
    priority: "medium",
    dueDate: "Feb 15",
    completed: false,
    project: "HR",
  },
];

const priorityConfig = {
  high: { color: "bg-destructive/20 text-destructive", icon: AlertCircle },
  medium: { color: "bg-warning/20 text-warning", icon: Clock },
  low: { color: "bg-muted text-muted-foreground", icon: Circle },
};

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <Card className="glass border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">My Tasks</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {completedCount} of {tasks.length} completed
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => {
          const PriorityIcon = priorityConfig[task.priority].icon;
          return (
            <div
              key={task.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-all",
                "hover:bg-muted/50 group",
                task.completed && "opacity-60"
              )}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-1 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium text-foreground",
                    task.completed && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", priorityConfig[task.priority].color)}
                  >
                    <PriorityIcon className="h-3 w-3 mr-1" />
                    {task.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {task.project}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {task.dueDate}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TaskList;
