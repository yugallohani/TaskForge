import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  Users2,
  CheckCircle2,
  AlertCircle,
  CheckSquare,
  Sparkles,
  Trash2,
} from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects } from "@/contexts/ProjectsContext";
import { cn } from "@/lib/utils";
import { OverviewTab } from "@/components/hr/projects/tabs/OverviewTab";
import { MembersTab } from "@/components/hr/projects/tabs/MembersTab";
import { SubmissionsTab } from "@/components/hr/projects/tabs/SubmissionsTab";
import { IssuesTab } from "@/components/hr/projects/tabs/IssuesTab";
import { ActivityTab } from "@/components/hr/projects/tabs/ActivityTab";
import { useToast } from "@/hooks/use-toast";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const ProjectDetail = () => {
  const { projectId, category } = useParams<{ projectId: string; category: string }>();
  const navigate = useNavigate();
  const { getProject, deleteProject } = useProjects();
  const { toast } = useToast();
  const [tab, setTab] = useState("overview");

  const project = projectId ? getProject(projectId) : undefined;

  if (!project) {
    return (
      <MainLayout title="Project not found">
        <div className="dash-glass rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">
            This project doesn't exist or has been deleted.
          </p>
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

  const submittedCount = project.members.filter(
    (m) => m.submissionStatus === "submitted"
  ).length;
  const openIssues = project.issues.filter((i) => i.status !== "resolved").length;

  const Icon = project.category === "eval" ? CheckSquare : Sparkles;
  const catLabel = project.category === "eval" ? "Eval Project" : "Generalist Project";
  const catColors =
    project.category === "eval"
      ? "bg-primary/15 text-primary"
      : "bg-[hsl(260_70%_65%/0.15)] text-[hsl(260_70%_65%)]";

  const handleDelete = () => {
    if (window.confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      deleteProject(project.id);
      toast({ title: "Project deleted" });
      navigate(`/hr/projects/${category || project.category}`);
    }
  };

  return (
    <MainLayout title={project.name} description={catLabel}>
      {/* Back button */}
      <button
        onClick={() => navigate(`/hr/projects/${category || project.category}`)}
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to {project.category === "eval" ? "Evals" : "Generalists"}
      </button>

      {/* Header card */}
      <div className="dash-glass rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                catColors
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-foreground">
                  {project.name}
                </h1>
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    catColors
                  )}
                >
                  {catLabel}
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[hsl(168_50%_40%/0.06)]">
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
              Members
            </p>
            <p className="text-sm font-semibold text-foreground">
              {project.members.length} assigned
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              Submissions
            </p>
            <p className="text-sm font-semibold text-foreground">
              {submittedCount}/{project.expectedSubmissions} completed
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3" />
              Open Issues
            </p>
            <p
              className={cn(
                "text-sm font-semibold",
                openIssues > 0 ? "text-warning" : "text-foreground"
              )}
            >
              {openIssues}
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

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-[hsl(220_30%_10%/0.5)] border border-[hsl(168_50%_40%/0.08)] rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg">
            Overview
          </TabsTrigger>
          <TabsTrigger value="members" className="rounded-lg">
            Members
            <span className="ml-1.5 text-[10px] opacity-70">
              {project.members.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="submissions" className="rounded-lg">
            Submissions
            <span className="ml-1.5 text-[10px] opacity-70">
              {project.submissions.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="issues" className="rounded-lg">
            Issues
            {openIssues > 0 && (
              <span className="ml-1.5 text-[10px] bg-warning/20 text-warning px-1.5 py-0.5 rounded-full">
                {openIssues}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-lg">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab project={project} />
        </TabsContent>
        <TabsContent value="members" className="mt-6">
          <MembersTab project={project} />
        </TabsContent>
        <TabsContent value="submissions" className="mt-6">
          <SubmissionsTab project={project} />
        </TabsContent>
        <TabsContent value="issues" className="mt-6">
          <IssuesTab project={project} />
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <ActivityTab project={project} />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default ProjectDetail;
