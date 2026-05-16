import { useNavigate } from "react-router-dom";
import { FolderKanban, Clock, Users2, AlertCircle } from "lucide-react";
import { useProjects } from "@/contexts/ProjectsContext";
import { cn } from "@/lib/utils";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const ActiveProjects = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();

  const activeProjects = projects.filter((p) => p.status === "active");

  return (
    <div className="dash-glass rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Active Projects
          </h3>
          <p className="text-sm text-muted-foreground">
            {activeProjects.length} project{activeProjects.length !== 1 ? "s" : ""} in progress
          </p>
        </div>
        <button
          onClick={() => navigate("/hr/projects")}
          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          View All →
        </button>
      </div>

      {activeProjects.length === 0 ? (
        <div className="text-center py-8">
          <FolderKanban className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            No active projects. Create one from the Projects page.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeProjects.map((project) => {
            const submittedCount = project.members.filter(
              (m) => m.submissionStatus === "submitted"
            ).length;
            const openIssues = project.issues.filter(
              (i) => i.status !== "resolved"
            ).length;

            return (
              <button
                key={project.id}
                onClick={() =>
                  navigate(`/hr/projects/${project.category}/${project.id}`)
                }
                className="w-full text-left group p-4 rounded-xl bg-[hsl(220_30%_12%/0.4)] border border-border/30 hover:border-primary/30 hover:bg-[hsl(220_30%_12%/0.6)] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <FolderKanban className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {project.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users2 className="w-3 h-3" />
                          {project.members.length}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDate(project.deadline)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {submittedCount}/{project.expectedSubmissions} submitted
                        </span>
                        {openIssues > 0 && (
                          <span className="flex items-center gap-1 text-xs text-warning">
                            <AlertCircle className="w-3 h-3" />
                            {openIssues}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      project.category === "eval"
                        ? "bg-primary/20 text-primary"
                        : "bg-[hsl(260_70%_65%/0.2)] text-[hsl(260_70%_65%)]"
                    )}
                  >
                    {project.category === "eval" ? "Eval" : "Generalist"}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-border/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(188_90%_55%)] transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                    {project.progress}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
