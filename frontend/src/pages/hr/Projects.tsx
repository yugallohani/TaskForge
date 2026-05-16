import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Plus,
  CheckSquare,
  Sparkles,
  Calendar,
  Users2,
  AlertCircle,
} from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/ProjectsContext";
import { Project, ProjectCategory } from "@/types/project";
import { cn } from "@/lib/utils";
import { CreateProjectDialog } from "@/components/hr/projects/CreateProjectDialog";
import { ProjectCard } from "@/components/hr/projects/ProjectCard";

const COLUMNS: {
  id: ProjectCategory;
  label: string;
  icon: typeof CheckSquare;
  description: string;
}[] = [
  {
    id: "eval",
    label: "Evals",
    icon: CheckSquare,
    description: "Evaluation pipelines and quality reviews",
  },
  {
    id: "generalist",
    label: "Generalists",
    icon: Sparkles,
    description: "Open-ended ops & research workflows",
  },
];

const SortableProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ProjectCard
        project={project}
        onClick={onClick}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

const KanbanColumn = ({
  category,
  label,
  icon: Icon,
  description,
  projects,
  onCardClick,
  onCreate,
}: {
  category: ProjectCategory;
  label: string;
  icon: typeof CheckSquare;
  description: string;
  projects: Project[];
  onCardClick: (id: string) => void;
  onCreate: (cat: ProjectCategory) => void;
}) => {
  return (
    <div className="flex flex-col flex-1 min-w-[320px]">
      {/* Column header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center",
              category === "eval"
                ? "bg-primary/15 text-primary"
                : "bg-[hsl(260_70%_65%/0.15)] text-[hsl(260_70%_65%)]"
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              {label}
              <span className="text-xs text-muted-foreground font-normal bg-[hsl(220_30%_10%/0.6)] px-1.5 py-0.5 rounded">
                {projects.length}
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">{description}</p>
          </div>
        </div>
        <button
          onClick={() => onCreate(category)}
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary/10"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3 min-h-[200px] p-1 -m-1 rounded-xl">
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project) => (
            <SortableProjectCard
              key={project.id}
              project={project}
              onClick={() => onCardClick(project.id)}
            />
          ))}
        </SortableContext>

        {projects.length === 0 && (
          <div className="rounded-xl border border-dashed border-[hsl(168_50%_40%/0.15)] p-8 text-center">
            <p className="text-xs text-muted-foreground">
              No projects yet. Click <span className="text-primary">New</span>{" "}
              to add one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Projects = () => {
  const navigate = useNavigate();
  const { projects, moveProjectCategory, reorderProjects } = useProjects();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createCategory, setCreateCategory] = useState<ProjectCategory>("eval");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const evalProjects = projects.filter((p) => p.category === "eval");
  const generalistProjects = projects.filter((p) => p.category === "generalist");

  const findCategory = (id: string): ProjectCategory | null =>
    projects.find((p) => p.id === id)?.category ?? null;

  const handleDragStart = (event: DragStartEvent) => {
    const project = projects.find((p) => p.id === event.active.id);
    if (project) setActiveProject(project);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeCat = findCategory(active.id as string);
    const overCat =
      findCategory(over.id as string) ?? (over.id as ProjectCategory);

    if (!activeCat || !overCat || activeCat === overCat) return;
    moveProjectCategory(active.id as string, overCat);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProject(null);
    if (!over) return;

    const activeCat = findCategory(active.id as string);
    const overCat = findCategory(over.id as string);
    if (!activeCat || !overCat || activeCat !== overCat) return;

    const list =
      activeCat === "eval" ? evalProjects : generalistProjects;
    const oldIndex = list.findIndex((p) => p.id === active.id);
    const newIndex = list.findIndex((p) => p.id === over.id);
    if (oldIndex !== newIndex && oldIndex >= 0 && newIndex >= 0) {
      reorderProjects(activeCat, arrayMove(list, oldIndex, newIndex));
    }
  };

  const handleCreate = (cat: ProjectCategory) => {
    setCreateCategory(cat);
    setCreateOpen(true);
  };

  return (
    <MainLayout
      title="Projects"
      description="Drag-and-drop AI workflow management."
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground">
            <span className="text-foreground font-semibold">
              {projects.length}
            </span>{" "}
            total projects
          </div>
          <span className="h-3 w-px bg-border/50" />
          <div className="text-xs text-muted-foreground">
            <span className="text-foreground font-semibold">
              {projects.reduce((acc, p) => acc + p.members.length, 0)}
            </span>{" "}
            assignments
          </div>
          <span className="h-3 w-px bg-border/50" />
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" />
            <span className="text-foreground font-semibold">
              {projects.reduce(
                (acc, p) => acc + p.issues.filter((i) => i.status !== "resolved").length,
                0
              )}
            </span>{" "}
            open issues
          </div>
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

      {/* Kanban */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2">
          <KanbanColumn
            category="eval"
            label="Evals"
            icon={CheckSquare}
            description="Evaluation pipelines and quality reviews"
            projects={evalProjects}
            onCardClick={(id) => navigate(`/hr/projects/${id}`)}
            onCreate={handleCreate}
          />
          <KanbanColumn
            category="generalist"
            label="Generalists"
            icon={Sparkles}
            description="Open-ended ops & research workflows"
            projects={generalistProjects}
            onCardClick={(id) => navigate(`/hr/projects/${id}`)}
            onCreate={handleCreate}
          />
        </div>

        <DragOverlay>
          {activeProject ? (
            <ProjectCard project={activeProject} dragging />
          ) : null}
        </DragOverlay>
      </DndContext>

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
