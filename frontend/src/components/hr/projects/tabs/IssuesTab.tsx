import { useState } from "react";
import { Project, Issue, IssuePriority, IssueStatus } from "@/types/project";
import { useProjects } from "@/contexts/ProjectsContext";
import {
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const priorityConfig: Record<
  IssuePriority,
  { label: string; className: string }
> = {
  high: { label: "High", className: "bg-destructive/15 text-destructive" },
  medium: { label: "Medium", className: "bg-warning/15 text-warning" },
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
};

const statusConfig: Record<
  IssueStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  open: {
    label: "Open",
    icon: AlertCircle,
    className: "bg-destructive/15 text-destructive",
  },
  in_progress: {
    label: "In Progress",
    icon: Clock,
    className: "bg-[hsl(188_90%_55%/0.15)] text-[hsl(188_90%_55%)]",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    className: "bg-primary/15 text-primary",
  },
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
};

const IssueRow = ({
  issue,
  projectId,
}: {
  issue: Issue;
  projectId: string;
}) => {
  const { resolveIssue, addIssueReply } = useProjects();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [reply, setReply] = useState("");
  const status = statusConfig[issue.status];
  const StatusIcon = status.icon;
  const priority = priorityConfig[issue.priority];

  const handleSendReply = () => {
    if (!reply.trim()) return;
    addIssueReply(projectId, issue.id, reply);
    setReply("");
    toast({ title: "Reply sent" });
  };

  const handleResolve = () => {
    resolveIssue(projectId, issue.id);
    toast({ title: "Issue resolved" });
  };

  return (
    <div className="dash-glass rounded-xl overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-[hsl(220_30%_10%/0.4)] transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
          {issue.reportedByAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-sm font-semibold text-foreground">
              {issue.title}
            </p>
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                priority.className
              )}
            >
              {priority.label}
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full inline-flex items-center gap-1",
                status.className
              )}
            >
              <StatusIcon className="w-2.5 h-2.5" />
              {status.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {issue.description}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            {issue.reportedBy} · {formatTime(issue.reportedAt)}
            {issue.replies.length > 0 && (
              <span className="ml-2">· {issue.replies.length} replies</span>
            )}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform shrink-0 mt-1",
            expanded && "rotate-180"
          )}
        />
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-[hsl(168_50%_40%/0.06)] p-4 bg-[hsl(220_30%_8%/0.4)]">
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {issue.description}
          </p>

          {/* Replies */}
          {issue.replies.length > 0 && (
            <div className="space-y-3 mb-4">
              {issue.replies.map((r) => (
                <div key={r.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                    {r.authorAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="dash-glass rounded-lg p-3">
                      <p className="text-xs font-medium text-foreground mb-0.5">
                        {r.author}{" "}
                        <span className="text-muted-foreground font-normal">
                          · {formatTime(r.timestamp)}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {r.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply input */}
          {issue.status !== "resolved" && (
            <div className="flex items-center gap-2 mb-3">
              <Input
                placeholder="Reply to this issue..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply();
                  }
                }}
                className="bg-[hsl(220_30%_10%/0.5)] border-[hsl(168_50%_40%/0.12)] focus:border-primary"
              />
              <Button
                size="sm"
                variant="hero"
                onClick={handleSendReply}
                disabled={!reply.trim()}
                className="rounded-lg shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {/* Resolve action */}
          {issue.status !== "resolved" && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleResolve}
              className="rounded-lg"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark as Resolved
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const IssuesTab = ({ project }: { project: Project }) => {
  const { reportIssue } = useProjects();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    priority: IssuePriority;
  }>({
    title: "",
    description: "",
    priority: "medium",
  });

  const open = project.issues.filter((i) => i.status !== "resolved");
  const resolved = project.issues.filter((i) => i.status === "resolved");

  const handleCreate = () => {
    if (!form.title.trim()) {
      toast({
        title: "Title required",
        variant: "destructive",
      });
      return;
    }
    reportIssue(project.id, form);
    toast({ title: "Issue reported" });
    setForm({ title: "", description: "", priority: "medium" });
    setCreateOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground font-semibold">
            Project issues
          </p>
          <p className="text-xs text-muted-foreground">
            {open.length} open · {resolved.length} resolved
          </p>
        </div>
        <Button
          variant="hero"
          size="sm"
          onClick={() => setCreateOpen(true)}
          className="rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Report Issue
        </Button>
      </div>

      {/* Open issues */}
      {open.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] text-muted-foreground uppercase tracking-wider px-1">
            Open ({open.length})
          </h4>
          {open.map((issue) => (
            <IssueRow key={issue.id} issue={issue} projectId={project.id} />
          ))}
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-[11px] text-muted-foreground uppercase tracking-wider px-1">
            Resolved ({resolved.length})
          </h4>
          {resolved.map((issue) => (
            <IssueRow key={issue.id} issue={issue} projectId={project.id} />
          ))}
        </div>
      )}

      {project.issues.length === 0 && (
        <div className="dash-glass rounded-2xl p-8 text-center">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-primary/40" />
          <p className="text-sm text-foreground font-medium">No issues</p>
          <p className="text-xs text-muted-foreground mt-1">
            Members can report issues from their workspace.
          </p>
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="dash-glass max-w-md border-[hsl(168_50%_40%/0.15)]">
          <DialogHeader>
            <DialogTitle>Report an issue</DialogTitle>
            <DialogDescription>
              Issues are visible to admins and can be commented on.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="What's the problem?"
                className="bg-[hsl(220_30%_10%/0.5)] border-[hsl(168_50%_40%/0.12)] focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Provide more details, steps to reproduce, etc."
                rows={3}
                className="bg-[hsl(220_30%_10%/0.5)] border-[hsl(168_50%_40%/0.12)] focus:border-primary resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <div className="flex gap-1.5">
                {(["low", "medium", "high"] as IssuePriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, priority: p }))}
                    className={cn(
                      "flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border capitalize",
                      form.priority === p
                        ? "border-primary/40 bg-primary/15 text-primary"
                        : "border-[hsl(168_50%_40%/0.08)] text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleCreate}>
              Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
