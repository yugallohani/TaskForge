import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  CheckSquare,
  Sparkles,
  Users2,
  AlertCircle,
} from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/ProjectsContext";
import { ProjectCategory as CategoryType } from "@/types/project";
import { ProjectCard } from "@/components/hr/projects/ProjectCard";
import { CreateProjectDialog } from "@/components/hr/projects/CreateProjectDialog";
import { cn } from "@/lib/utils";

const categoryMeta: Record<
  CategoryType,
  {
    label: string;
    description: string;
    icon: typeof CheckSquare;
    accentBg: string;
    accentText: string;
  }
> = {
  eval: {
    label: "Evals",
    description: "Evaluation pipelines, quality reviews, and RLHF workflows",
    icon: CheckSquare,
    accentBg: "bg-primary/15",
    accentText: "text-primary",
  },
  generalist: {
    label: "Generalists",
    description: "Open-ended operations, research, and data workflows",
    icon: Sparkles,
    accentBg: "bg-[hsl(260_70%_65%/0.15)]",
    accentText: "text-[hsl(260_70%_65%)]",
  },
};

const ProjectCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { projects, deleteProject } = useProjects();
  const [createOpen, setCreateOpen] = useState(false);

  const cat = (category === "eval" || category === "generalist"
    ? category
    : null) as CategoryType | null;

  if (!cat) {
    return (
      <MainLayout title="Category not found">
        <div className="dash-glass rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">Invalid category.</p>
          <Button
            variant="hero"
            className="mt-4"
            onClick={() => navigate("/hr/projects")}
          >
            Back to Projects
          </Button>
        </div>
      </MainLayout>
    );
  }

  const meta = categoryMeta[cat];
  const Icon = meta.icon;
  const categoryProjects = projects.filter((p) => p.category === cat);
  const totalMembers = categoryProjects.reduce(
    (acc, p) => acc + p.members.length,
    0
  );
  const openIssues = categoryProjects.reduce(
    (acc, p) => acc + p.issues.filter((i) => i.status !== "resolved").length,
    0
  );

  return (
    <MainLayout title={meta.label} description={meta.description}>
      {/* Back */}
      <button
        onClick={() => navigate("/hr/projects")}
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Projects
      </button>

      {/* Header stats */}
      <div className="dash-glass rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                meta.accentBg
              )}
            >
              <Icon className={cn("w-5 h-5", meta.accentText)} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {meta.label} Workspace
              </h2>
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckSquare className="w-3 h-3" />
                  {categoryProjects.length} projects
                </span>
                <span className="flex items-center gap-1.5">
                  <Users2 className="w-3 h-3" />
                  {totalMembers} members
                </span>
                {openIssues > 0 && (
                  <span className="flex items-center gap-1.5 text-warning">
                    <AlertCircle className="w-3 h-3" />
                    {openIssues} open issues
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="hero"
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="rounded-xl"
          >
            <Plus className="w-4 h-4" />
            New {cat === "eval" ? "Eval" : "Generalist"} Project
          </Button>
        </div>
      </div>

      {/* Projects grid */}
      {categoryProjects.length === 0 ? (
        <div className="dash-glass rounded-2xl p-12 text-center">
          <Icon className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-foreground font-medium">No projects yet</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Create your first {cat === "eval" ? "evaluation" : "generalist"}{" "}
            project to get started.
          </p>
          <Button
            variant="hero"
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categoryProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() =>
                navigate(`/hr/projects/${cat}/${project.id}`)
              }
            />
          ))}
        </div>
      )}

      {/* Create dialog */}
      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultCategory={cat}
      />
    </MainLayout>
  );
};

export default ProjectCategoryPage;
