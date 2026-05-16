import { useState } from "react";
import {
  FolderKanban,
  Clock,
  Users2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  members: number;
  deadline: string;
  totalTasks: number;
  completedTasks: number;
  status: "active" | "completed" | "at_risk";
  priority: "low" | "medium" | "high";
}

const projects: Project[] = [
  {
    id: "p1",
    name: "Text-to-Image Evaluation",
    description: "Evaluate generated images against prompts for quality, accuracy, and safety compliance.",
    progress: 78,
    members: 6,
    deadline: "May 28, 2026",
    totalTasks: 42,
    completedTasks: 33,
    status: "active",
    priority: "high",
  },
  {
    id: "p2",
    name: "RLHF Ranking Pipeline",
    description: "Human preference ranking for reinforcement learning from human feedback training data.",
    progress: 54,
    members: 8,
    deadline: "Jun 5, 2026",
    totalTasks: 68,
    completedTasks: 37,
    status: "active",
    priority: "high",
  },
  {
    id: "p3",
    name: "Prompt Safety Audit",
    description: "Systematic audit of prompt-response pairs for safety, bias, and harmful content detection.",
    progress: 92,
    members: 4,
    deadline: "May 22, 2026",
    totalTasks: 24,
    completedTasks: 22,
    status: "active",
    priority: "medium",
  },
  {
    id: "p4",
    name: "Response Quality Analysis",
    description: "Multi-dimensional quality scoring of AI responses across helpfulness, accuracy, and tone.",
    progress: 35,
    members: 5,
    deadline: "Jun 15, 2026",
    totalTasks: 56,
    completedTasks: 20,
    status: "at_risk",
    priority: "high",
  },
  {
    id: "p5",
    name: "Generalist QA Benchmark",
    description: "Comprehensive benchmark suite for evaluating general knowledge and reasoning capabilities.",
    progress: 100,
    members: 7,
    deadline: "May 15, 2026",
    totalTasks: 38,
    completedTasks: 38,
    status: "completed",
    priority: "medium",
  },
  {
    id: "p6",
    name: "Synthetic Data Validation",
    description: "Quality assurance pipeline for synthetically generated training data across multiple domains.",
    progress: 62,
    members: 4,
    deadline: "Jun 10, 2026",
    totalTasks: 45,
    completedTasks: 28,
    status: "active",
    priority: "medium",
  },
  {
    id: "p7",
    name: "Vision Benchmarking Suite",
    description: "End-to-end evaluation framework for multimodal vision-language model outputs.",
    progress: 18,
    members: 6,
    deadline: "Jul 1, 2026",
    totalTasks: 52,
    completedTasks: 9,
    status: "active",
    priority: "low",
  },
  {
    id: "p8",
    name: "Multilingual Eval Framework",
    description: "Cross-language evaluation pipeline supporting 12 languages with cultural context awareness.",
    progress: 45,
    members: 9,
    deadline: "Jun 20, 2026",
    totalTasks: 72,
    completedTasks: 32,
    status: "active",
    priority: "high",
  },
];

const statusConfig = {
  active: { label: "Active", className: "bg-primary/15 text-primary" },
  completed: { label: "Completed", className: "bg-[hsl(168_76%_42%/0.15)] text-primary" },
  at_risk: { label: "At Risk", className: "bg-warning/15 text-warning" },
};

type FilterTab = "all" | "active" | "completed" | "high_priority";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return p.status === "active";
    if (activeFilter === "completed") return p.status === "completed";
    if (activeFilter === "high_priority") return p.priority === "high";
    return true;
  });

  const filters: { id: FilterTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: projects.length },
    { id: "active", label: "Active", count: projects.filter((p) => p.status === "active").length },
    { id: "completed", label: "Completed", count: projects.filter((p) => p.status === "completed").length },
    { id: "high_priority", label: "High Priority", count: projects.filter((p) => p.priority === "high").length },
  ];

  return (
    <MainLayout title="Projects" description="Manage and track all team projects.">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[hsl(220_30%_10%/0.5)] border border-[hsl(168_50%_40%/0.08)]">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeFilter === f.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
              <span className="ml-1.5 text-[10px] opacity-70">{f.count}</span>
            </button>
          ))}
        </div>

        <Button variant="hero" size="sm" className="rounded-xl">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => {
          const status = statusConfig[project.status];
          return (
            <div
              key={project.id}
              className="dash-glass rounded-2xl p-5 group hover:border-primary/20 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FolderKanban className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                      {project.name}
                    </h3>
                  </div>
                </div>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", status.className)}>
                  {status.label}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-medium text-foreground">{project.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-border/50 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      project.status === "at_risk"
                        ? "bg-gradient-to-r from-warning to-warning/70"
                        : "bg-gradient-to-r from-primary to-[hsl(188_90%_55%)]"
                    )}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users2 className="w-3 h-3" /> {project.members}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {project.completedTasks}/{project.totalTasks}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {project.deadline.split(",")[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default Projects;
