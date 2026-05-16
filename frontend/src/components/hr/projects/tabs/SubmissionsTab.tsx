import { Project, SubmissionStatus } from "@/types/project";
import { useProjects } from "@/contexts/ProjectsContext";
import { Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const statusConfig: Record<
  SubmissionStatus,
  { label: string; className: string }
> = {
  approved: {
    label: "Approved",
    className: "bg-primary/15 text-primary",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/15 text-destructive",
  },
  pending: {
    label: "Pending Review",
    className: "bg-warning/15 text-warning",
  },
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const now = Date.now();
  const diffMin = Math.floor((now - d.getTime()) / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
};

export const SubmissionsTab = ({ project }: { project: Project }) => {
  const { reviewSubmission } = useProjects();
  const { toast } = useToast();

  const stats = {
    total: project.submissions.length,
    pending: project.submissions.filter((s) => s.status === "pending").length,
    approved: project.submissions.filter((s) => s.status === "approved").length,
    rejected: project.submissions.filter((s) => s.status === "rejected").length,
  };

  const handleReview = (
    submissionId: string,
    status: SubmissionStatus,
    memberName: string
  ) => {
    reviewSubmission(project.id, submissionId, status);
    toast({
      title: `Submission ${status}`,
      description: `${memberName}'s submission has been ${status}.`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          {
            label: "Approved",
            value: stats.approved,
            color: "text-primary",
          },
          {
            label: "Pending",
            value: stats.pending,
            color: "text-warning",
          },
          {
            label: "Rejected",
            value: stats.rejected,
            color: "text-destructive",
          },
        ].map((s) => (
          <div key={s.label} className="dash-glass rounded-xl p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {s.label}
            </p>
            <p className={cn("text-2xl font-bold mt-1", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="dash-glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[hsl(168_50%_40%/0.06)] text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>Member</span>
          <span>Items</span>
          <span>Submitted</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {project.submissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No submissions yet. Members will appear here as they submit work.
          </div>
        ) : (
          project.submissions.map((sub) => {
            const status = statusConfig[sub.status];
            return (
              <div
                key={sub.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 items-center border-b border-[hsl(168_50%_40%/0.04)] last:border-b-0 hover:bg-[hsl(220_30%_10%/0.4)] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary">
                    {sub.memberAvatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {sub.memberName}
                    </p>
                    {sub.notes && (
                      <p className="text-[11px] text-muted-foreground truncate">
                        {sub.notes}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {sub.itemsCount} items
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(sub.submittedAt)}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit",
                    status.className
                  )}
                >
                  {status.label}
                </span>
                <div className="flex items-center gap-1">
                  {sub.status === "pending" ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-primary hover:bg-primary/10"
                        onClick={() =>
                          handleReview(sub.id, "approved", sub.memberName)
                        }
                      >
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          handleReview(sub.id, "rejected", sub.memberName)
                        }
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  ) : (
                    <span className="text-[10px] text-muted-foreground italic">
                      Reviewed
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
