import { Project, ProjectMember } from "@/types/project";

/** Available team pool — used for member assignment */
export const availableTeam: ProjectMember[] = [
  {
    id: "u1",
    name: "Priya Patel",
    email: "priya.patel@taskforge.com",
    avatar: "PP",
    role: "Senior Annotator",
    status: "active",
    tasksCompleted: 0,
    tasksTotal: 0,
    submissionStatus: "not_started",
    joinedAt: new Date().toISOString(),
  },
  {
    id: "u2",
    name: "Rahul Sharma",
    email: "rahul.sharma@taskforge.com",
    avatar: "RS",
    role: "Eval Lead",
    status: "active",
    tasksCompleted: 0,
    tasksTotal: 0,
    submissionStatus: "not_started",
    joinedAt: new Date().toISOString(),
  },
  {
    id: "u3",
    name: "Amit Kumar",
    email: "amit.kumar@taskforge.com",
    avatar: "AK",
    role: "Annotator",
    status: "active",
    tasksCompleted: 0,
    tasksTotal: 0,
    submissionStatus: "not_started",
    joinedAt: new Date().toISOString(),
  },
  {
    id: "u4",
    name: "Sneha Gupta",
    email: "sneha.gupta@taskforge.com",
    avatar: "SG",
    role: "QA Specialist",
    status: "active",
    tasksCompleted: 0,
    tasksTotal: 0,
    submissionStatus: "not_started",
    joinedAt: new Date().toISOString(),
  },
  {
    id: "u5",
    name: "Vikram Singh",
    email: "vikram.singh@taskforge.com",
    avatar: "VS",
    role: "Annotator",
    status: "idle",
    tasksCompleted: 0,
    tasksTotal: 0,
    submissionStatus: "not_started",
    joinedAt: new Date().toISOString(),
  },
  {
    id: "u6",
    name: "Anjali Reddy",
    email: "anjali.reddy@taskforge.com",
    avatar: "AR",
    role: "Researcher",
    status: "active",
    tasksCompleted: 0,
    tasksTotal: 0,
    submissionStatus: "not_started",
    joinedAt: new Date().toISOString(),
  },
  {
    id: "u7",
    name: "Karan Mehta",
    email: "karan.mehta@taskforge.com",
    avatar: "KM",
    role: "Annotator",
    status: "active",
    tasksCompleted: 0,
    tasksTotal: 0,
    submissionStatus: "not_started",
    joinedAt: new Date().toISOString(),
  },
  {
    id: "u8",
    name: "Divya Joshi",
    email: "divya.joshi@taskforge.com",
    avatar: "DJ",
    role: "Senior Reviewer",
    status: "active",
    tasksCompleted: 0,
    tasksTotal: 0,
    submissionStatus: "not_started",
    joinedAt: new Date().toISOString(),
  },
];

/** Helper to build a member with task progress */
const m = (
  id: string,
  done: number,
  total: number,
  sub: ProjectMember["submissionStatus"]
): ProjectMember => {
  const base = availableTeam.find((u) => u.id === id)!;
  return {
    ...base,
    tasksCompleted: done,
    tasksTotal: total,
    submissionStatus: sub,
  };
};

const isoOffset = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

/**
 * Initial projects — one per category to keep it simple.
 * Admin can create more from the UI.
 */
export const seedProjects: Project[] = [
  // ─── EVALS ───
  {
    id: "proj_t2i",
    name: "Text-to-Image Compare",
    category: "eval",
    description:
      "Side-by-side evaluation of two generative image models against the same prompts. Annotators select the better output across helpfulness, accuracy, and aesthetics.",
    instructions:
      "Review prompt + 2 image outputs. Select the preferred image and provide a one-line justification. Flag NSFW content immediately.",
    deadline: isoOffset(7),
    priority: "high",
    status: "active",
    progress: 72,
    members: [
      m("u1", 4, 5, "submitted"),
      m("u2", 5, 5, "submitted"),
      m("u3", 2, 5, "in_progress"),
      m("u4", 4, 5, "submitted"),
      m("u5", 1, 4, "in_progress"),
    ],
    submissions: [
      {
        id: "sub_1",
        memberId: "u1",
        memberName: "Priya Patel",
        memberAvatar: "PP",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: "approved",
        itemsCount: 5,
        notes: "Clean submission, all rationales present.",
      },
      {
        id: "sub_2",
        memberId: "u2",
        memberName: "Rahul Sharma",
        memberAvatar: "RS",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        status: "approved",
        itemsCount: 5,
      },
      {
        id: "sub_3",
        memberId: "u4",
        memberName: "Sneha Gupta",
        memberAvatar: "SG",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        status: "pending",
        itemsCount: 5,
      },
      {
        id: "sub_4",
        memberId: "u5",
        memberName: "Vikram Singh",
        memberAvatar: "VS",
        submittedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: "pending",
        itemsCount: 4,
      },
    ],
    issues: [
      {
        id: "iss_1",
        title: "Some image pairs are duplicated",
        description:
          "I noticed prompts #14 and #19 contain the same image pair. Please verify the dataset.",
        reportedBy: "Amit Kumar",
        reportedByAvatar: "AK",
        reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        priority: "medium",
        status: "open",
        replies: [],
      },
      {
        id: "iss_2",
        title: "NSFW flag option not visible on mobile",
        description: "The flag button is hidden on smaller viewports.",
        reportedBy: "Sneha Gupta",
        reportedByAvatar: "SG",
        reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        priority: "high",
        status: "in_progress",
        replies: [
          {
            id: "rep_1",
            author: "Admin",
            authorAvatar: "AD",
            message:
              "Thanks for flagging — engineering is rolling out a fix today.",
            timestamp: new Date(
              Date.now() - 1000 * 60 * 60 * 22
            ).toISOString(),
          },
        ],
      },
    ],
    activity: [
      {
        id: "act_1",
        type: "submission_uploaded",
        actor: "Priya Patel",
        actorAvatar: "PP",
        description: "uploaded a submission (5 items)",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: "act_2",
        type: "submission_approved",
        actor: "Admin",
        actorAvatar: "AD",
        description: "approved Priya Patel's submission",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "act_3",
        type: "issue_created",
        actor: "Amit Kumar",
        actorAvatar: "AK",
        description: 'reported issue "Some image pairs are duplicated"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
      {
        id: "act_4",
        type: "member_joined",
        actor: "Vikram Singh",
        actorAvatar: "VS",
        description: "joined the project",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      },
    ],
    createdAt: isoOffset(-14),
    expectedSubmissions: 5,
  },

  // ─── GENERALISTS ───
  {
    id: "proj_mask_milo",
    name: "Mask Milo",
    category: "generalist",
    description:
      "Multi-domain annotation and labeling pipeline for the Milo dataset. Covers text classification, entity masking, and PII redaction tasks.",
    instructions:
      "Follow the labeling guide for each task type. Apply entity masks accurately. Flag ambiguous cases in the comments field.",
    deadline: isoOffset(10),
    priority: "medium",
    status: "active",
    progress: 48,
    members: [
      m("u3", 3, 5, "in_progress"),
      m("u5", 4, 5, "submitted"),
      m("u7", 2, 4, "in_progress"),
      m("u4", 4, 5, "submitted"),
    ],
    submissions: [
      {
        id: "sub_mm_1",
        memberId: "u5",
        memberName: "Vikram Singh",
        memberAvatar: "VS",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        status: "approved",
        itemsCount: 5,
      },
      {
        id: "sub_mm_2",
        memberId: "u4",
        memberName: "Sneha Gupta",
        memberAvatar: "SG",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        status: "pending",
        itemsCount: 5,
      },
    ],
    issues: [
      {
        id: "iss_mm_1",
        title: "Need clarification on PII categories",
        description:
          "The guide mentions 'sensitive PII' but doesn't list which categories qualify. Can we get an updated doc?",
        reportedBy: "Karan Mehta",
        reportedByAvatar: "KM",
        reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        priority: "medium",
        status: "open",
        replies: [],
      },
    ],
    activity: [
      {
        id: "act_mm_1",
        type: "submission_uploaded",
        actor: "Sneha Gupta",
        actorAvatar: "SG",
        description: "uploaded a submission (20 items)",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: "act_mm_2",
        type: "submission_approved",
        actor: "Admin",
        actorAvatar: "AD",
        description: "approved Vikram Singh's submission",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        id: "act_mm_3",
        type: "project_created",
        actor: "Admin",
        actorAvatar: "AD",
        description: 'created project "Mask Milo"',
        timestamp: isoOffset(-8),
      },
    ],
    createdAt: isoOffset(-8),
    expectedSubmissions: 4,
  },
];
