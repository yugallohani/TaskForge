import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useProjects } from "@/contexts/ProjectsContext";
import {
  CreateProjectInput,
  ProjectCategory,
  ProjectPriority,
} from "@/types/project";
import { cn } from "@/lib/utils";
import { CheckSquare, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: ProjectCategory;
}

const defaultDeadline = () => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split("T")[0];
};

const initialState = (cat: ProjectCategory): CreateProjectInput => ({
  name: "",
  category: cat,
  description: "",
  instructions: "",
  deadline: defaultDeadline(),
  priority: "medium",
  memberIds: [],
});

export const CreateProjectDialog = ({
  open,
  onOpenChange,
  defaultCategory = "eval",
}: CreateProjectDialogProps) => {
  const { createProject, team } = useProjects();
  const { toast } = useToast();
  const [form, setForm] = useState<CreateProjectInput>(initialState(defaultCategory));

  useEffect(() => {
    if (open) {
      setForm(initialState(defaultCategory));
    }
  }, [open, defaultCategory]);

  const toggleMember = (id: string) => {
    setForm((f) => ({
      ...f,
      memberIds: f.memberIds.includes(id)
        ? f.memberIds.filter((x) => x !== id)
        : [...f.memberIds, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({
        title: "Project name required",
        description: "Give your project a clear, descriptive name.",
        variant: "destructive",
      });
      return;
    }
    createProject({
      ...form,
      deadline: new Date(form.deadline).toISOString(),
    });
    toast({
      title: "Project created",
      description: `"${form.name}" added to ${
        form.category === "eval" ? "Evals" : "Generalists"
      }.`,
    });
    onOpenChange(false);
  };

  const priorities: { id: ProjectPriority; label: string }[] = [
    { id: "low", label: "Low" },
    { id: "medium", label: "Medium" },
    { id: "high", label: "High" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dash-glass max-w-2xl border-[hsl(168_50%_40%/0.15)] p-0">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle>Create new project</DialogTitle>
            <DialogDescription>
              Add a project to one of the operational pipelines. Assigned members
              will see it in their workspace.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-5">
          {/* Category */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">
              Category
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {(["eval", "generalist"] as ProjectCategory[]).map((c) => {
                const Icon = c === "eval" ? CheckSquare : Sparkles;
                const active = form.category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: c }))}
                    className={cn(
                      "rounded-xl p-3 text-left flex items-center gap-3 transition-all border",
                      active
                        ? c === "eval"
                          ? "border-primary/40 bg-primary/10"
                          : "border-[hsl(260_70%_65%/0.4)] bg-[hsl(260_70%_65%/0.1)]"
                        : "border-[hsl(168_50%_40%/0.08)] hover:border-[hsl(168_50%_40%/0.2)]"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        c === "eval"
                          ? "bg-primary/15 text-primary"
                          : "bg-[hsl(260_70%_65%/0.15)] text-[hsl(260_70%_65%)]"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {c === "eval" ? "Evals" : "Generalists"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {c === "eval"
                          ? "Quality + safety reviews"
                          : "Open-ended ops & research"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="proj-name" className="text-xs text-muted-foreground">
              Project name
            </Label>
            <Input
              id="proj-name"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="e.g. Image Caption Quality"
              className="bg-[hsl(220_30%_10%/0.5)] border-[hsl(168_50%_40%/0.12)] focus:border-primary"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="proj-desc" className="text-xs text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="proj-desc"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="A short summary visible on the project card."
              rows={2}
              className="bg-[hsl(220_30%_10%/0.5)] border-[hsl(168_50%_40%/0.12)] focus:border-primary resize-none"
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="proj-inst" className="text-xs text-muted-foreground">
              Instructions for members
            </Label>
            <Textarea
              id="proj-inst"
              value={form.instructions}
              onChange={(e) =>
                setForm((f) => ({ ...f, instructions: e.target.value }))
              }
              placeholder="What should members do, step by step?"
              rows={3}
              className="bg-[hsl(220_30%_10%/0.5)] border-[hsl(168_50%_40%/0.12)] focus:border-primary resize-none"
            />
          </div>

          {/* Deadline + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="proj-deadline"
                className="text-xs text-muted-foreground"
              >
                Deadline
              </Label>
              <Input
                id="proj-deadline"
                type="date"
                value={form.deadline.split("T")[0]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, deadline: e.target.value }))
                }
                className="bg-[hsl(220_30%_10%/0.5)] border-[hsl(168_50%_40%/0.12)] focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <div className="flex gap-1.5">
                {priorities.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, priority: p.id }))
                    }
                    className={cn(
                      "flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all border",
                      form.priority === p.id
                        ? "border-primary/40 bg-primary/15 text-primary"
                        : "border-[hsl(168_50%_40%/0.08)] text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Assign team members
              <span className="ml-2 text-foreground font-medium">
                {form.memberIds.length} selected
              </span>
            </Label>
            <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
              {team.map((member) => {
                const checked = form.memberIds.includes(member.id);
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
                      onCheckedChange={() => toggleMember(member.id)}
                    />
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {member.role}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              Create Project
            </Button>
          </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
