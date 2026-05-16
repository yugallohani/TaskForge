import { useNavigate } from "react-router-dom";
import {
  CheckSquare,
  Sparkles,
  Lock,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { MemberMainLayout } from "@/components/member/layout/MemberMainLayout";
import { useProjects } from "@/contexts/ProjectsContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { ProjectCategory } from "@/types/project";
import { cn } from "@/lib/utils";

const MemberProjects = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { hasAccessTo, pendingForCategory } = useWorkspace();

  const categories: {
    id: ProjectCategory;
    label: string;
    description: string;
    icon: typeof CheckSquare;
    accentBg: string;
    accentText: string;
  }[] = [
    {
      id: "eval",
      label: "Evals",
      description:
        "Evaluation pipelines, quality reviews, and RLHF comparison workflows.",
      icon: CheckSquare,
      accentBg: "bg-primary/15",
      accentText: "text-primary",
    },
    {
      id: "generalist",
      label: "Generalists",
      description:
        "Open-ended operations, research, and data validation workflows.",
      icon: Sparkles,
      accentBg: "bg-[hsl(260_70%_65%/0.15)]",
      accentText: "text-[hsl(260_70%_65%)]",
    },
  ];

  return (
    <MemberMainLayout
      title="Projects"
      description="Workspaces require access. Apply to start contributing."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((cat) => {
          const access = hasAccessTo(cat.id);
          const pending = pendingForCategory(cat.id);
          const catProjects = projects.filter((p) => p.category === cat.id);

          return (
            <div
              key={cat.id}
              className={cn(
                "dash-glass rounded-2xl p-8 group transition-all duration-300",
                access && "hover:border-primary/25 cursor-pointer"
              )}
              onClick={() => {
                if (access) navigate(`/member/projects/${cat.id}`);
              }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300",
                      access ? cat.accentBg : "bg-muted/30",
                      access && "group-hover:scale-110"
                    )}
                  >
                    {access ? (
                      <cat.icon className={cn("w-6 h-6", cat.accentText)} />
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h2
                      className={cn(
                        "text-2xl font-bold",
                        access ? "text-foreground group-hover:text-primary transition-colors" : "text-muted-foreground"
                      )}
                    >
                      {cat.label}
                    </h2>
                    {access ? (
                      <p className="text-xs text-primary flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Access granted · {catProjects.length} projects
                      </p>
                    ) : pending ? (
                      <p className="text-xs text-warning flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        Request pending review
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Lock className="w-3 h-3" />
                        Access restricted
                      </p>
                    )}
                  </div>
                </div>
                {access && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                )}
              </div>

              <p
                className={cn(
                  "text-sm leading-relaxed mb-5",
                  access ? "text-muted-foreground" : "text-muted-foreground/70 italic"
                )}
              >
                {cat.description}
              </p>

              {/* Locked preview */}
              {!access && (
                <div className="space-y-2 mb-5 select-none">
                  {catProjects.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="rounded-lg bg-[hsl(220_30%_8%/0.5)] border border-[hsl(168_50%_40%/0.06)] p-3 flex items-center gap-3 opacity-50 blur-[1px]"
                    >
                      <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {p.members.length} members
                        </p>
                      </div>
                    </div>
                  ))}
                  {catProjects.length === 0 && (
                    <div className="rounded-lg bg-[hsl(220_30%_8%/0.5)] border border-dashed border-[hsl(168_50%_40%/0.1)] p-4 text-center">
                      <p className="text-xs text-muted-foreground">
                        No projects yet in this category
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action */}
              {access ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/member/projects/${cat.id}`);
                  }}
                  className={cn(
                    "w-full rounded-xl py-2.5 text-sm font-semibold transition-all",
                    "bg-primary/15 text-primary hover:bg-primary/25"
                  )}
                >
                  Open Workspace
                </button>
              ) : pending ? (
                <button
                  disabled
                  className="w-full rounded-xl py-2.5 text-sm font-semibold bg-warning/15 text-warning cursor-not-allowed"
                >
                  Awaiting admin review…
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/member/projects/${cat.id}`);
                  }}
                  className="w-full rounded-xl py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Apply for Access
                </button>
              )}
            </div>
          );
        })}
      </div>
    </MemberMainLayout>
  );
};

export default MemberProjects;
