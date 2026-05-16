import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlertCircle,
  Clock,
  User2,
  GripVertical,
} from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { cn } from "@/lib/utils";

// ─── Types ───
interface Task {
  id: string;
  title: string;
  type: string;
  priority: "low" | "medium" | "high" | "critical";
  assignee: string;
  avatar: string;
  dueDate: string;
}

type ColumnId = "backlog" | "assigned" | "in_progress" | "review" | "done";

interface Column {
  id: ColumnId;
  title: string;
  color: string;
  dotColor: string;
}

// ─── Data ───
const columns: Column[] = [
  { id: "backlog", title: "Backlog", color: "text-muted-foreground", dotColor: "bg-muted-foreground" },
  { id: "assigned", title: "Assigned", color: "text-[hsl(260_70%_65%)]", dotColor: "bg-[hsl(260_70%_65%)]" },
  { id: "in_progress", title: "In Progress", color: "text-[hsl(188_90%_55%)]", dotColor: "bg-[hsl(188_90%_55%)]" },
  { id: "review", title: "Review", color: "text-warning", dotColor: "bg-warning" },
  { id: "done", title: "Done", color: "text-primary", dotColor: "bg-primary" },
];

const initialTasks: Record<ColumnId, Task[]> = {
  backlog: [
    { id: "t1", title: "Vision Benchmark #45", type: "Evaluation", priority: "medium", assignee: "Amit K.", avatar: "AK", dueDate: "Jun 2" },
    { id: "t2", title: "Synthetic Data Batch #12", type: "Generation", priority: "low", assignee: "Sneha G.", avatar: "SG", dueDate: "Jun 8" },
  ],
  assigned: [
    { id: "t3", title: "RLHF Comparison Audit", type: "Audit", priority: "high", assignee: "Priya P.", avatar: "PP", dueDate: "May 28" },
    { id: "t4", title: "Prompt Safety Review #67", type: "Safety", priority: "critical", assignee: "Rahul S.", avatar: "RS", dueDate: "May 24" },
  ],
  in_progress: [
    { id: "t5", title: "Image Eval #221", type: "Evaluation", priority: "high", assignee: "Priya P.", avatar: "PP", dueDate: "May 26" },
    { id: "t6", title: "Response Quality #89", type: "QA", priority: "medium", assignee: "Vikram S.", avatar: "VS", dueDate: "May 30" },
    { id: "t7", title: "Generalist QA Sprint 4", type: "QA", priority: "medium", assignee: "Amit K.", avatar: "AK", dueDate: "Jun 1" },
  ],
  review: [
    { id: "t8", title: "RLHF Batch #14", type: "Ranking", priority: "high", assignee: "Rahul S.", avatar: "RS", dueDate: "May 22" },
    { id: "t9", title: "Text-to-Image Set #8", type: "Evaluation", priority: "medium", assignee: "Sneha G.", avatar: "SG", dueDate: "May 25" },
  ],
  done: [
    { id: "t10", title: "Prompt Audit #89", type: "Safety", priority: "low", assignee: "Priya P.", avatar: "PP", dueDate: "May 20" },
    { id: "t11", title: "Data Validation #33", type: "Validation", priority: "medium", assignee: "Amit K.", avatar: "AK", dueDate: "May 18" },
  ],
};

// ─── Priority badge ───
const priorityConfig = {
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
  medium: { label: "Med", className: "bg-primary/15 text-primary" },
  high: { label: "High", className: "bg-warning/15 text-warning" },
  critical: { label: "Crit", className: "bg-destructive/15 text-destructive" },
};

// ─── Task Card ───
const TaskCard = ({ task, isDragging }: { task: Task; isDragging?: boolean }) => {
  const priority = priorityConfig[task.priority];
  return (
    <div
      className={cn(
        "dash-glass rounded-xl p-3.5 cursor-grab active:cursor-grabbing transition-all duration-200",
        isDragging && "opacity-90 shadow-[0_0_30px_-5px_hsl(168_60%_40%/0.4)] scale-[1.02] rotate-1"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {task.type}
        </span>
        <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded", priority.className)}>
          {priority.label}
        </span>
      </div>
      <p className="text-sm font-medium text-foreground mb-3 leading-snug">
        {task.title}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[9px] font-bold text-primary">
            {task.avatar}
          </div>
          <span className="text-xs text-muted-foreground">{task.assignee}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {task.dueDate}
        </div>
      </div>
    </div>
  );
};

// ─── Sortable Task ───
const SortableTask = ({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  );
};

// ─── Kanban Column ───
const KanbanColumn = ({ column, tasks }: { column: Column; tasks: Task[] }) => {
  return (
    <div className="flex flex-col min-w-[240px] w-[240px] shrink-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={cn("w-2 h-2 rounded-full", column.dotColor)} />
        <span className={cn("text-sm font-semibold", column.color)}>
          {column.title}
        </span>
        <span className="text-xs text-muted-foreground ml-auto bg-muted/50 px-1.5 py-0.5 rounded">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex-1 space-y-2.5 min-h-[200px] p-1">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

// ─── Main Page ───
const Tasks = () => {
  const [tasksByColumn, setTasksByColumn] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const findColumn = (taskId: string): ColumnId | null => {
    for (const [colId, tasks] of Object.entries(tasksByColumn)) {
      if (tasks.find((t) => t.id === taskId)) return colId as ColumnId;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const col = findColumn(active.id as string);
    if (col) {
      const task = tasksByColumn[col].find((t) => t.id === active.id);
      if (task) setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeCol = findColumn(active.id as string);
    const overCol = findColumn(over.id as string) || (over.id as ColumnId);

    if (!activeCol || !overCol || activeCol === overCol) return;

    setTasksByColumn((prev) => {
      const activeItems = [...prev[activeCol]];
      const overItems = [...prev[overCol]];
      const activeIndex = activeItems.findIndex((t) => t.id === active.id);
      const [movedTask] = activeItems.splice(activeIndex, 1);
      overItems.push(movedTask);

      return { ...prev, [activeCol]: activeItems, [overCol]: overItems };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeCol = findColumn(active.id as string);
    const overCol = findColumn(over.id as string);

    if (activeCol && overCol && activeCol === overCol) {
      const items = [...tasksByColumn[activeCol]];
      const oldIndex = items.findIndex((t) => t.id === active.id);
      const newIndex = items.findIndex((t) => t.id === over.id);
      if (oldIndex !== newIndex) {
        setTasksByColumn((prev) => ({
          ...prev,
          [activeCol]: arrayMove(items, oldIndex, newIndex),
        }));
      }
    }
  };

  return (
    <MainLayout title="Tasks" description="Drag and drop to manage your task pipeline.">
      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 min-w-0">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={tasksByColumn[col.id]}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </MainLayout>
  );
};

export default Tasks;
