import { FolderKanban, Clock, Users2 } from "lucide-react";

const projects = [
  {
    name: "Text-to-Image Evaluation",
    progress: 78,
    members: 6,
    deadline: "May 28",
    tasks: 42,
    status: "On Track",
    statusColor: "bg-primary/20 text-primary",
  },
  {
    name: "RLHF Ranking Pipeline",
    progress: 54,
    members: 8,
    deadline: "Jun 5",
    tasks: 68,
    status: "In Progress",
    statusColor: "bg-[hsl(188_90%_55%/0.2)] text-[hsl(188_90%_55%)]",
  },
  {
    name: "Prompt Safety Audit",
    progress: 92,
    members: 4,
    deadline: "May 22",
    tasks: 24,
    status: "Almost Done",
    statusColor: "bg-primary/20 text-primary",
  },
  {
    name: "Response Quality Analysis",
    progress: 35,
    members: 5,
    deadline: "Jun 15",
    tasks: 56,
    status: "At Risk",
    statusColor: "bg-warning/20 text-warning",
  },
];

export const ActiveProjects = () => {
  return (
    <div className="tf-glass rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Active Projects
          </h3>
          <p className="text-sm text-muted-foreground">
            {projects.length} projects in progress
          </p>
        </div>
        <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
          View All →
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.name}
            className="group p-4 rounded-xl bg-[hsl(220_30%_12%/0.4)] border border-border/30 hover:border-primary/30 hover:bg-[hsl(220_30%_12%/0.6)] transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FolderKanban className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {project.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users2 className="w-3 h-3" />
                      {project.members}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {project.deadline}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {project.tasks} tasks
                    </span>
                  </div>
                </div>
              </div>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${project.statusColor}`}
              >
                {project.status}
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
          </div>
        ))}
      </div>
    </div>
  );
};
