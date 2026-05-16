import { useState } from "react";
import { Project } from "@/types/project";
import { useProjects } from "@/contexts/ProjectsContext";
import { Plus, UserMinus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const submissionLabels: Record<
  string,
  { label: string; className: string }
> = {
  submitted: { label: "Submitted", className: "bg-primary/15 text-primary" },
  in_progress: {
    label: "In Progress",
    className: "bg-[hsl(188_90%_55%/0.15)] text-[hsl(188_90%_55%)]",
  },
  not_started: {
    label: "Not Started",
    className: "bg-muted text-muted-foreground",
  },
};

export const MembersTab = ({ project }: { project: Project }) => {
  const { team, addMember, removeMember } = useProjects();
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const availableToAdd = team.filter(
    (t) => !project.members.some((m) => m.id === t.id)
  );

  const handleAdd = () => {
    selected.forEach((id) => addMember(project.id, id));
    toast({
      title: `${selected.length} member${selected.length === 1 ? "" : "s"} added`,
    });
    setSelected([]);
    setAddOpen(false);
  };

  const handleRemove = (memberId: string, memberName: string) => {
    if (window.confirm(`Remove ${memberName} from this project?`)) {
      removeMember(project.id, memberId);
      toast({ title: `${memberName} removed` });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground font-semibold">
            Assigned members
          </p>
          <p className="text-xs text-muted-foreground">
            {project.members.length} active assignments
          </p>
        </div>
        <Button
          variant="hero"
          size="sm"
          onClick={() => setAddOpen(true)}
          disabled={availableToAdd.length === 0}
          className="rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {/* Member list */}
      <div className="dash-glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[hsl(168_50%_40%/0.06)] text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>Member</span>
          <span>Role</span>
          <span>Tasks</span>
          <span>Submission</span>
          <span></span>
        </div>
        {project.members.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No members assigned yet.
          </div>
        ) : (
          project.members.map((member) => {
            const sub = submissionLabels[member.submissionStatus];
            const completion =
              member.tasksTotal > 0
                ? Math.round((member.tasksCompleted / member.tasksTotal) * 100)
                : 0;
            return (
              <div
                key={member.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 items-center border-b border-[hsl(168_50%_40%/0.04)] last:border-b-0 hover:bg-[hsl(220_30%_10%/0.4)] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {member.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {member.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                      <Mail className="w-2.5 h-2.5" />
                      {member.email}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {member.role}
                </span>
                <div className="text-xs">
                  <span className="text-foreground font-medium">
                    {member.tasksCompleted}
                  </span>
                  <span className="text-muted-foreground">
                    /{member.tasksTotal}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-2">
                    {completion}%
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit",
                    sub.className
                  )}
                >
                  {sub.label}
                </span>
                <button
                  onClick={() => handleRemove(member.id, member.name)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  title="Remove member"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Members Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="dash-glass border-[hsl(168_50%_40%/0.15)] !top-[5vh] !translate-y-0 max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add members</DialogTitle>
            <DialogDescription>
              Select team members to assign to this project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {availableToAdd.map((member) => {
              const checked = selected.includes(member.id);
              return (
                <label
                  key={member.id}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all border",
                    checked
                      ? "border-primary/30 bg-primary/10"
                      : "border-[hsl(168_50%_40%/0.06)] hover:border-[hsl(168_50%_40%/0.15)]"
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() =>
                      setSelected((s) =>
                        checked
                          ? s.filter((x) => x !== member.id)
                          : [...s, member.id]
                      )
                    }
                  />
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {member.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {member.role}
                    </p>
                  </div>
                </label>
              );
            })}
            {availableToAdd.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">
                Everyone is already assigned.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={handleAdd}
              disabled={selected.length === 0}
            >
              Add {selected.length > 0 && `(${selected.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
