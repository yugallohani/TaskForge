import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActivityEntry,
  CreateProjectInput,
  Issue,
  IssuePriority,
  IssueReply,
  Project,
  ProjectMember,
  Submission,
  SubmissionStatus,
} from "@/types/project";
import { seedProjects, availableTeam } from "@/data/seedProjects";

const STORAGE_KEY = "taskforge:projects:v1";

interface ProjectsContextValue {
  projects: Project[];
  team: ProjectMember[];
  getProject: (id: string) => Project | undefined;
  createProject: (input: CreateProjectInput) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  moveProjectCategory: (id: string, category: Project["category"]) => void;
  reorderProjects: (
    category: Project["category"],
    nextOrder: Project[]
  ) => void;
  addMember: (projectId: string, memberId: string) => void;
  removeMember: (projectId: string, memberId: string) => void;
  reportIssue: (
    projectId: string,
    issue: { title: string; description: string; priority: IssuePriority }
  ) => void;
  resolveIssue: (projectId: string, issueId: string) => void;
  addIssueReply: (projectId: string, issueId: string, reply: string) => void;
  reviewSubmission: (
    projectId: string,
    submissionId: string,
    status: SubmissionStatus
  ) => void;
}

const ProjectsContext = createContext<ProjectsContextValue | undefined>(
  undefined
);

const newId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

const nowIso = () => new Date().toISOString();

const pushActivity = (
  project: Project,
  entry: Omit<ActivityEntry, "id" | "timestamp">
): Project => ({
  ...project,
  activity: [
    {
      ...entry,
      id: newId("act"),
      timestamp: nowIso(),
    },
    ...project.activity,
  ],
});

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      /* ignore */
    }
    return seedProjects;
  });

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      /* ignore */
    }
  }, [projects]);

  // Cross-tab sync — listen for changes from other tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setProjects(JSON.parse(e.newValue));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  );

  const createProject = useCallback(
    (input: CreateProjectInput) => {
      const members = availableTeam
        .filter((m) => input.memberIds.includes(m.id))
        .map((m) => ({
          ...m,
          tasksCompleted: 0,
          tasksTotal: 0,
          submissionStatus: "not_started" as const,
          status: "active" as const,
          joinedAt: nowIso(),
        }));

      const project: Project = {
        id: newId("proj"),
        name: input.name,
        category: input.category,
        description: input.description,
        instructions: input.instructions,
        deadline: input.deadline,
        priority: input.priority,
        status: "active",
        progress: 0,
        members,
        submissions: [],
        issues: [],
        activity: [
          {
            id: newId("act"),
            type: "project_created",
            actor: "Admin",
            actorAvatar: "AD",
            description: `created project "${input.name}"`,
            timestamp: nowIso(),
          },
        ],
        createdAt: nowIso(),
        expectedSubmissions: members.length,
      };
      setProjects((prev) => [project, ...prev]);
      return project;
    },
    []
  );

  const updateProject = useCallback(
    (id: string, patch: Partial<Project>) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
      );
    },
    []
  );

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const moveProjectCategory = useCallback(
    (id: string, category: Project["category"]) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id
            ? pushActivity(
                { ...p, category },
                {
                  type: "admin_updated",
                  actor: "Admin",
                  actorAvatar: "AD",
                  description: `moved project to ${
                    category === "eval" ? "Evals" : "Generalists"
                  }`,
                }
              )
            : p
        )
      );
    },
    []
  );

  const reorderProjects = useCallback(
    (category: Project["category"], nextOrder: Project[]) => {
      setProjects((prev) => {
        const others = prev.filter((p) => p.category !== category);
        return [...others, ...nextOrder];
      });
    },
    []
  );

  const addMember = useCallback((projectId: string, memberId: string) => {
    const member = availableTeam.find((m) => m.id === memberId);
    if (!member) return;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        if (p.members.some((m) => m.id === memberId)) return p;
        return pushActivity(
          {
            ...p,
            members: [
              ...p.members,
              {
                ...member,
                tasksCompleted: 0,
                tasksTotal: 0,
                submissionStatus: "not_started",
                status: "active",
                joinedAt: nowIso(),
              },
            ],
            expectedSubmissions: p.expectedSubmissions + 1,
          },
          {
            type: "member_joined",
            actor: member.name,
            actorAvatar: member.avatar,
            description: `joined the project`,
          }
        );
      })
    );
  }, []);

  const removeMember = useCallback(
    (projectId: string, memberId: string) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          const member = p.members.find((m) => m.id === memberId);
          if (!member) return p;
          return pushActivity(
            {
              ...p,
              members: p.members.filter((m) => m.id !== memberId),
              expectedSubmissions: Math.max(0, p.expectedSubmissions - 1),
            },
            {
              type: "member_removed",
              actor: "Admin",
              actorAvatar: "AD",
              description: `removed ${member.name} from the project`,
            }
          );
        })
      );
    },
    []
  );

  const reportIssue = useCallback(
    (
      projectId: string,
      input: { title: string; description: string; priority: IssuePriority }
    ) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          const issue: Issue = {
            id: newId("iss"),
            title: input.title,
            description: input.description,
            reportedBy: "Admin",
            reportedByAvatar: "AD",
            reportedAt: nowIso(),
            priority: input.priority,
            status: "open",
            replies: [],
          };
          return pushActivity(
            { ...p, issues: [issue, ...p.issues] },
            {
              type: "issue_created",
              actor: "Admin",
              actorAvatar: "AD",
              description: `reported issue "${input.title}"`,
            }
          );
        })
      );
    },
    []
  );

  const resolveIssue = useCallback(
    (projectId: string, issueId: string) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          const issue = p.issues.find((i) => i.id === issueId);
          if (!issue) return p;
          return pushActivity(
            {
              ...p,
              issues: p.issues.map((i) =>
                i.id === issueId ? { ...i, status: "resolved" } : i
              ),
            },
            {
              type: "issue_resolved",
              actor: "Admin",
              actorAvatar: "AD",
              description: `resolved issue "${issue.title}"`,
            }
          );
        })
      );
    },
    []
  );

  const addIssueReply = useCallback(
    (projectId: string, issueId: string, message: string) => {
      const reply: IssueReply = {
        id: newId("rep"),
        author: "Admin",
        authorAvatar: "AD",
        message,
        timestamp: nowIso(),
      };
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          return {
            ...p,
            issues: p.issues.map((i) =>
              i.id === issueId
                ? { ...i, replies: [...i.replies, reply] }
                : i
            ),
          };
        })
      );
    },
    []
  );

  const reviewSubmission = useCallback(
    (projectId: string, submissionId: string, status: SubmissionStatus) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          const submission = p.submissions.find(
            (s) => s.id === submissionId
          );
          if (!submission) return p;
          return pushActivity(
            {
              ...p,
              submissions: p.submissions.map((s) =>
                s.id === submissionId ? { ...s, status } : s
              ),
            },
            {
              type:
                status === "approved"
                  ? "submission_approved"
                  : "submission_rejected",
              actor: "Admin",
              actorAvatar: "AD",
              description: `${status} ${submission.memberName}'s submission`,
            }
          );
        })
      );
    },
    []
  );

  const value = useMemo<ProjectsContextValue>(
    () => ({
      projects,
      team: availableTeam,
      getProject,
      createProject,
      updateProject,
      deleteProject,
      moveProjectCategory,
      reorderProjects,
      addMember,
      removeMember,
      reportIssue,
      resolveIssue,
      addIssueReply,
      reviewSubmission,
    }),
    [
      projects,
      getProject,
      createProject,
      updateProject,
      deleteProject,
      moveProjectCategory,
      reorderProjects,
      addMember,
      removeMember,
      reportIssue,
      resolveIssue,
      addIssueReply,
      reviewSubmission,
    ]
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectsProvider");
  return ctx;
};
