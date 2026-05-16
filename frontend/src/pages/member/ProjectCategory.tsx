import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckSquare,
  Sparkles,
  Lock,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react";
import { MemberMainLayout } from "@/components/member/layout/MemberMainLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProjects } from "@/contexts/ProjectsContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { ProjectCategory } from "@/types/project";
import { ProjectCard } from "@/components/hr/projects/ProjectCard";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const meta: Record<
  ProjectCategory,
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

const MemberProjectCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { hasAccessTo, pendingForCategory, requestAccess, myAccessForCategory } =
    useWorkspace();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const cat = (category === "eval" || category === "generalist"
    ? category
    : null) as ProjectCategory | null;

  if (!cat) {
    return (
      <MemberMainLayout title="Workspace not found">
        <div className="dash-glass rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">Invalid workspace.</p>
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

  const m = meta[cat];
  const Icon = m.icon;
  const access = hasAccessTo(cat);
  const pending = pendingForCategory(cat);
  const myRequest = myAccessForCategory(cat);
  const catProjects = projects.filter((p) => p.category === cat);

  const handleApply = () => {
    setSubmitting(true);
    const result = requestAccess(cat, message.trim() || "Requesting access");
    setSubmitting(false);
    if (result) {
      toast({
        title: "Access request sent",
        description:
          "An admin will review your request shortly. You'll get a notification.",
      });
      setMessage("");
    }
  };

  return (
    <MemberMainLayout title={m.label} description={m.description}>
      <button
        onClick={() => navigate("/member/projects")}
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Projects
      </button>

      {/* Header */}
      <div className="dash-glass rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              access ? m.accentBg : "bg-muted/30"
            )}
          >
            {access ? (
              <Icon className={cn("w-6 h-6", m.accentText)} />
            ) : (
              <Lock className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {m.label} Workspace
            </h2>
            {access ? (
              <p className="text-xs text-primary flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                Access granted ·{" "}
                {myRequest?.reviewedAt
                  ? `approved ${new Date(myRequest.reviewedAt).toLocaleDateString()}`
                  : "ready"}
              </p>
            ) : pending ? (
              <p className="text-xs text-warning flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                Request submitted · awaiting admin review
              </p>
            ) : myRequest?.status === "rejected" ? (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                Previously denied
                {myRequest.reviewerNote && ` · ${myRequest.reviewerNote}`}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Lock className="w-3 h-3" />
                Access restricted
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {access ? (
        // Show project list
        catProjects.length === 0 ? (
          <div className="dash-glass rounded-2xl p-12 text-center">
            <Icon className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-foreground font-medium">
              No projects in this workspace yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              The admin will add projects here. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {catProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() =>
                  navigate(`/member/projects/${cat}/${project.id}`)
                }
              />
            ))}
          </div>
        )
      ) : pending ? (
        // Pending state
        <div className="dash-glass rounded-2xl p-10 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-warning/15 flex items-center justify-center">
            <Clock className="w-6 h-6 text-warning" />
          </div>
          <p className="text-foreground font-semibold">
            Your access request is pending
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            An admin will review your request and you'll receive a notification.
            You can continue working on other workspaces in the meantime.
          </p>
        </div>
      ) : (
        // Apply form
        <div className="dash-glass rounded-2xl p-8 max-w-2xl">
          <h3 className="text-base font-semibold text-foreground mb-1">
            Apply for {m.label} access
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            Tell the admin why you'd like to join this workspace. They'll
            review your request and grant access if approved.
          </p>

          <div className="space-y-4 mb-5">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Message (optional)
              </Label>
              <Textarea
                placeholder="e.g. I have prior experience with image evaluation tasks and would like to contribute to this workspace."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="bg-[hsl(220_30%_10%/0.5)] border-[hsl(168_50%_40%/0.12)] focus:border-primary resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-[11px] text-muted-foreground">
              {catProjects.length} project{catProjects.length !== 1 ? "s" : ""}{" "}
              in this workspace
            </p>
            <Button
              variant="hero"
              onClick={handleApply}
              disabled={submitting}
              className="rounded-xl"
            >
              <Send className="w-4 h-4" />
              Submit Request
            </Button>
          </div>
        </div>
      )}
    </MemberMainLayout>
  );
};

export default MemberProjectCategoryPage;
