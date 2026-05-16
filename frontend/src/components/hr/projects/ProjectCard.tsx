import {
  CalendarClock,
  Users2,
  CheckCircle2,
  AlertCircle,
  GripVertical,
} from "lucide-react";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

const priorityConfig: Record<
  Project["priority"],
  { label: string; className: string }
> = {
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", className: "bg-primary/15 text-primary" },
  high: { label: "High", className: "bg-warning/15 text-warning" },
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  dragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
}

export const ProjectCard = ({
  project,
  onClick,
  dragging,
  dragHandleProps,
}: ProjectCardProps) => {
  const submittedCount = project.members.filter(
    (m) => m.submissionStatus === "submitted"
  ).length;
  const openIssues = project.issues.filter((i) => i.status !== "resolved").length;
  const priority = priorityConfig[project.priority];

  return (
    <div
      onClick={onClick}
      className={cn(
        "dash-glass rounded-xl p-4 cursor-pointer group transition-all duration-300",
        "hover:border-primary/25 hover:translate-y-[-2px]",
        dragging && "opacity-90 shadow-[0_0_36px_-6px_hsl(168_60%_40%/0.4)] scale-[1.02] rotate-1"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button
            {...dragHandleProps}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-grab active:cursor-grabbing"
            aria-label="Drag handle"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {project.name}
            </h4>
            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
              {project.description}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full",
            priority.className
          )}
        >
          {priority.label}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-3 mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Progress
          </span>
          <span className="text-[11px] font-semibold text-foreground">
            {project.progress}%
          </span>
        </div>
        <div className="h-1 rounded-full bg-border/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(188_90%_55%)] transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Users2 className="w-3 h-3" />
            {project.members.length}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {submittedCount}/{project.expectedSubmissions}
          </span>
          {openIssues > 0 && (
            <span className="flex items-center gap-1 text-warning">
              <AlertCircle className="w-3 h-3" />
              {openIssues}
            </span>
          )}
        </div>
        <span className="flex items-center gap-1">
          <CalendarClock className="w-3 h-3" />
          {formatDate(project.deadline)}
        </span>
      </div>

      {/* Member avatars */}
      {project.members.length > 0 && (
        <div className="flex items-center mt-3 pt-3 border-t border-[hsl(168_50%_40%/0.06)]">
          <div className="flex -space-x-1.5">
            {project.members.slice(0, 5).map((m) => (
              <div
                key={m.id}
                title={m.name}
                className="w-6 h-6 rounded-full bg-primary/15 border border-[hsl(220_30%_8%)] flex items-center justify-center text-[9px] font-bold text-primary"
              >
                {m.avatar}
              </div>
            ))}
            {project.members.length > 5 && (
              <div className="w-6 h-6 rounded-full bg-muted border border-[hsl(220_30%_8%)] flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                +{project.members.length - 5}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
