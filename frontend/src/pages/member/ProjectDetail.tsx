import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  Users2,
  Play,
  Square,
  Lock,
  CheckCircle2,
  Target,
  FileText,
  Activity as ActivityIcon,
} from "lucide-react";
import { MemberMainLayout } from "@/components/member/layout/MemberMainLayout";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/ProjectsContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { ProjectCategory } from "@/types/project";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const MemberProjectDetail = () => {
  const { category, projectId } = useParams<{
    category: string;
    projectId: string;
  }>();
  const navigate = useNavigate();
  const { getProject } = useProjects();
  const { hasAccessTo, activeSession, startSession, stopSession, currentUser } =
    useWorkspace();
  const { toast } = useToast();

  const cat = (category === "eval" || category === "generalist"
    ? category
    : null) as ProjectCategory | null;
  const project = projectId ? getProject(projectId) : undefined;

  if (!cat || !project) {
    return (
      <MemberMainLayout title="Project not found">
        <div className="dash-glass rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">This project doesn't exist.</p>
          <Button
            variant="hero"
            className="mt-4"
            onClick={() => navigate("/member/projects")}
          >
            Back
          </Button>
        </div>
      </MemberMainLayout>
    );
  }

  if (!hasAccessTo(cat)) {
    return (
      <MemberMainLayout title="Access required">
        <div className="dash-glass rounded-2xl p-8 text-center">
          <Lock className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-foreground font-medium">
            You need access to this workspace
          </p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Apply for access in the {cat === "eval" ? "Evals" : "Generalists"}{" "}
            category.
          </p>
          <Button
            variant="hero"
            onClick={() => navigate(`/member/projects/${cat}`)}
          >
            Apply for Access
          </Button>
        </div>
      </MemberMainLayout>
    );
  }

  const isMyProject = currentUser
    ? project.members.some(
        (m) =>
          m.email === currentUser.email ||
          m.name.toLowerCase() === currentUser.name.toLowerCase()
      )
    : false;

  const isWorkingOnThis =
    activeSession?.projectId === project.id && activeSession?.status === "active";

  const handleStartTask = () => {
    if (isWorkingOnThis) {
      stopSession();
      toast({
        title: "Session ended",
        description: `Stopped working on ${project.name}.`,
      });
    } else {
      startSession(project.id, project.name);
      toast({
        title: "Session started",
        description: `Now tracking time on ${project.name}.`,
      });
    }
  };

  return (
    <MemberMainLayout
      title={project.name}
      description={cat === "eval" ? "Eval Project" : "Generalist Project"}
    >
      <button
        onClick={() => navigate(`/member/projects/${cat}`)}
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to {cat === "eval" ? "Evals" : "Generalists"}
      </button>

      {/* Header */}
      <div className="dash-glass rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground mb-1">
              {project.name}
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </div>

          <Button
            variant={isWorkingOnThis ? "outline" : "hero"}
            size="sm"
            onClick={handleStartTask}
            className={cn(
              "rounded-xl",
              isWorkingOnThis && "border-destructive/40 text-destructive hover:bg-destructive/10"
            )}
          >
            {isWorkingOnThis ? (
              <>
                <Square className="w-4 h-4" />
                Stop Session
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Task
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[hsl(168_50%_40%/0.06)]">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CalendarClock className="w-3 h-3" />
              Deadline
            </p>
            <p className="text-sm font-semibold text-foreground">
              {formatDate(project.deadline)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Users2 className="w-3 h-3" />
              Team Size
            </p>
            <p className="text-sm font-semibold text-foreground">
              {project.members.length} members
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              Status
            </p>
            <p
              className={cn(
                "text-sm font-semibold",
                isMyProject ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isMyProject ? "Assigned to you" : "Not assigned"}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
              Project Progress
            </span>
            <span className="text-sm font-bold text-foreground">
              {project.progress}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-border/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(188_90%_55%)] transition-all duration-700"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Description + Instructions */}
      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <div className="dash-glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">About</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        </div>
        <div className="dash-glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Instructions
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {project.instructions || "No instructions provided yet."}
          </p>
        </div>
      </div>

      {/* My recent activity */}
      <div className="dash-glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <ActivityIcon className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Project Activity
          </h3>
        </div>
        {project.activity.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No activity yet
          </p>
        ) : (
          <div className="space-y-3">
            {project.activity.slice(0, 6).map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 text-sm border-b border-[hsl(168_50%_40%/0.04)] last:border-0 pb-3 last:pb-0"
              >
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                  {entry.actorAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground leading-snug">
                    <span className="font-medium">{entry.actor}</span>{" "}
                    <span className="text-muted-foreground">
                      {entry.description}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MemberMainLayout>
  );
};

export default MemberProjectDetail;
