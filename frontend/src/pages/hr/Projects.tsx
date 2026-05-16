import { useNavigate } from "react-router-dom";
import {
  CheckSquare,
  Sparkles,
  Users2,
  FolderKanban,
  AlertCircle,
  ArrowRight,
  Plus,
} from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/ProjectsContext";
import { ProjectCategory } from "@/types/project";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CreateProjectDialog } from "@/components/hr/projects/CreateProjectDialog";

const Projects = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [createOpen, setCreateOpen] = useState(false);
  const [createCategory, setCreateCategory] = useState<ProjectCategory>("eval");

  const evalProjects = projects.filter((p) => p.category === "eval");
  const generalistProjects = projects.filter((p) => p.category === "generalist");

  const categories: {
    id: ProjectCategory;
    label: string;
    description: string;
    icon: typeof CheckSquare;
    projects: typeof evalProjects;
    accentBg: string;
    accentText: string;
    borderHover: string;
  }[] = [
    {
      id: "eval",
      label: "Evals",
      description:
        "Evaluation pipelines, quality reviews, safety audits, and RLHF comparison workflows.",
      icon: CheckSquare,
      projects: evalProjects,
      accentBg: "bg-primary/15",
      accentText: "text-primary",
      borderHover: "hover:border-primary/30",
    },
    {
      id: "generalist",
      label: "Generalists",
      description:
        "Open-ended operations, research tasks, data validation, content review, and misc workflows.",
      icon: Sparkles,
      projects: generalistProjects,
      accentBg: "bg-[hsl(260_70%_65%/0.15)]",
      accentText: "text-[hsl(260_70%_65%)]",
      borderHover: "hover:border-[hsl(260_70%_65%/0.3)]",
    },
  ];

  const handleCreate = (cat: ProjectCategory) => {
    setCreateCategory(cat);
    setCreateOpen(true);
  };

  return (
    <MainLayout
      title="Projects"
      description="AI workflow management — select a category to view projects."
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            <span className="text-foreground font-semibold">
              {projects.length}
            </span>{" "}
            total projects
          </span>
          <span className="h-3 w-px bg-border/50" />
          <span>
            <span className="text-foreground font-semibold">
              {projects.reduce((acc, p) => acc + p.members.length, 0)}
            </span>{" "}
            assignments
          </span>
        </div>
        <Button
          variant="hero"
          size="sm"
          onClick={() => handleCreate("eval")}
          className="rounded-xl"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Category Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((cat) => {
          const activeProjects = cat.projects.filter(
            (p) => p.status === "active"
          ).length;
          const totalMembers = cat.projects.reduce(
            (acc, p) => acc + p.members.length,
            0
          );
          const openIssues = cat.projects.reduce(
            (acc, p) =>
              acc + p.issues.filter((i) => i.status !== "resolved").length,
            0
          );
          const pendingSubmissions = cat.projects.reduce(
            (acc, p) =>
              acc + p.submissions.filter((s) => s.status === "pending").length,
            0
          );
          const avgProgress =
            cat.projects.length > 0
              ? Math.round(
                  cat.projects.reduce((acc, p) => acc + p.progress, 0) /
                    cat.projects.length
                )
              : 0;

          return (
            <button
              key={cat.id}
              onClick={() => navigate(`/hr/projects/${cat.id}`)}
              className={cn(
                "dash-glass rounded-2xl p-8 text-left group transition-all duration-300 cursor-pointer",
                cat.borderHover
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                      cat.accentBg
                    )}
                  >
                    <cat.icon className={cn("w-6 h-6", cat.accentText)} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {cat.label}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {activeProjects} active project
                      {activeProjects !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {cat.description}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[hsl(220_30%_8%/0.5)] border border-[hsl(168_50%_40%/0.06)] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users2 className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Members
                    </span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {totalMembers}
                  </p>
                </div>
                <div className="rounded-xl bg-[hsl(220_30%_8%/0.5)] border border-[hsl(168_50%_40%/0.06)] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FolderKanban className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Avg Progress
                    </span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {avgProgress}%
                  </p>
                </div>
                <div className="rounded-xl bg-[hsl(220_30%_8%/0.5)] border border-[hsl(168_50%_40%/0.06)] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Open Issues
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-lg font-bold",
                      openIssues > 0 ? "text-warning" : "text-foreground"
                    )}
                  >
                    {openIssues}
                  </p>
                </div>
                <div className="rounded-xl bg-[hsl(220_30%_8%/0.5)] border border-[hsl(168_50%_40%/0.06)] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckSquare className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Pending
                    </span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {pendingSubmissions}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Overall Completion
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {avgProgress}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      cat.id === "eval"
                        ? "bg-gradient-to-r from-primary to-[hsl(188_90%_55%)]"
                        : "bg-gradient-to-r from-[hsl(260_70%_65%)] to-[hsl(280_70%_60%)]"
                    )}
                    style={{ width: `${avgProgress}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Create dialog */}
      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultCategory={createCategory}
      />
    </MainLayout>
  );
};

export default Projects;
