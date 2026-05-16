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
 * Initial projects — only the two operational pipelines:
 *   • Evals
 *   • Generalists
 *
 * These are realistic AI workflow examples. The admin can add more
 * projects to either column from the Create Project dialog.
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
      m("u1", 18, 25, "submitted"),
      m("u2", 22, 25, "submitted"),
      m("u3", 12, 25, "in_progress"),
      m("u4", 20, 25, "submitted"),
      m("u5", 8, 25, "in_progress"),
      m("u6", 25, 25, "submitted"),
      m("u7", 15, 25, "in_progress"),
      m("u8", 24, 25, "submitted"),
    ],
    submissions: [
      {
        id: "sub_1",
        memberId: "u1",
        memberName: "Priya Patel",
        memberAvatar: "PP",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: "approved",
        itemsCount: 25,
        notes: "Clean submission, all rationales present.",
      },
      {
        id: "sub_2",
        memberId: "u2",
        memberName: "Rahul Sharma",
        memberAvatar: "RS",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        status: "approved",
        itemsCount: 25,
      },
      {
        id: "sub_3",
        memberId: "u4",
        memberName: "Sneha Gupta",
        memberAvatar: "SG",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        status: "pending",
        itemsCount: 25,
      },
      {
        id: "sub_4",
        memberId: "u6",
        memberName: "Anjali Reddy",
        memberAvatar: "AR",
        submittedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: "pending",
        itemsCount: 25,
      },
      {
        id: "sub_5",
        memberId: "u8",
        memberName: "Divya Joshi",
        memberAvatar: "DJ",
        submittedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        status: "approved",
        itemsCount: 24,
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
        actor: "Anjali Reddy",
        actorAvatar: "AR",
        description: "uploaded a submission (25 items)",
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
        actor: "Divya Joshi",
        actorAvatar: "DJ",
        description: "joined the project",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      },
    ],
    createdAt: isoOffset(-14),
    expectedSubmissions: 8,
  },
  {
    id: "proj_safety",
    name: "Safety Evaluation",
    category: "eval",
    description:
      "Classify model responses for safety violations across harm categories: hate, self-harm, violence, sexual content, and PII leakage.",
    instructions:
      "Read prompt + response carefully. Pick the most severe applicable category. If safe, mark as 'no violation'.",
    deadline: isoOffset(4),
    priority: "high",
    status: "active",
    progress: 58,
    members: [
      m("u2", 14, 30, "in_progress"),
      m("u4", 18, 30, "submitted"),
      m("u6", 12, 30, "in_progress"),
      m("u8", 22, 30, "submitted"),
    ],
    submissions: [
      {
        id: "sub_safety_1",
        memberId: "u4",
        memberName: "Sneha Gupta",
        memberAvatar: "SG",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        status: "approved",
        itemsCount: 30,
      },
      {
        id: "sub_safety_2",
        memberId: "u8",
        memberName: "Divya Joshi",
        memberAvatar: "DJ",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        status: "pending",
        itemsCount: 30,
      },
    ],
    issues: [],
    activity: [
      {
        id: "act_s1",
        type: "submission_uploaded",
        actor: "Divya Joshi",
        actorAvatar: "DJ",
        description: "uploaded a submission (30 items)",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
    ],
    createdAt: isoOffset(-10),
    expectedSubmissions: 4,
  },
  {
    id: "proj_image_rank",
    name: "Image Ranking",
    category: "eval",
    description:
      "Rank 4 candidate image generations from best to worst given a prompt. Used for RLHF training signal.",
    instructions:
      "Drag images into preference order. Highest-quality on top. Provide a brief rationale per ranking.",
    deadline: isoOffset(10),
    priority: "medium",
    status: "active",
    progress: 35,
    members: [
      m("u1", 6, 20, "in_progress"),
      m("u3", 4, 20, "in_progress"),
      m("u7", 10, 20, "in_progress"),
    ],
    submissions: [],
    issues: [],
    activity: [
      {
        id: "act_ir1",
        type: "project_created",
        actor: "Admin",
        actorAvatar: "AD",
        description: 'created project "Image Ranking"',
        timestamp: isoOffset(-3),
      },
    ],
    createdAt: isoOffset(-3),
    expectedSubmissions: 3,
  },
  {
    id: "proj_pr_score",
    name: "Prompt-Response Scoring",
    category: "eval",
    description:
      "Score model responses on a 1-5 Likert scale across 4 axes: helpfulness, accuracy, tone, and instruction-following.",
    instructions:
      "Use the rubric provided. Document edge cases in the comment field.",
    deadline: isoOffset(14),
    priority: "medium",
    status: "active",
    progress: 12,
    members: [
      m("u2", 2, 40, "in_progress"),
      m("u6", 3, 40, "in_progress"),
    ],
    submissions: [],
    issues: [],
    activity: [
      {
        id: "act_pr1",
        type: "project_created",
        actor: "Admin",
        actorAvatar: "AD",
        description: 'created project "Prompt-Response Scoring"',
        timestamp: isoOffset(-1),
      },
    ],
    createdAt: isoOffset(-1),
    expectedSubmissions: 2,
  },
  {
    id: "proj_rlhf",
    name: "RLHF Review",
    category: "eval",
    description:
      "Review and validate human preference rankings collected for reinforcement learning from human feedback.",
    instructions:
      "Audit ranked pairs for consistency. Flag suspicious patterns.",
    deadline: isoOffset(5),
    priority: "high",
    status: "active",
    progress: 88,
    members: [
      m("u2", 28, 32, "submitted"),
      m("u4", 30, 32, "submitted"),
      m("u8", 32, 32, "submitted"),
    ],
    submissions: [
      {
        id: "sub_rlhf_1",
        memberId: "u8",
        memberName: "Divya Joshi",
        memberAvatar: "DJ",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        status: "approved",
        itemsCount: 32,
      },
    ],
    issues: [],
    activity: [],
    createdAt: isoOffset(-9),
    expectedSubmissions: 3,
  },

  // ─── GENERALISTS ───
  {
    id: "proj_gen_qa",
    name: "General QA",
    category: "generalist",
    description:
      "Open-domain question answering quality review. Verify factuality and completeness of responses.",
    instructions:
      "For each Q&A pair, mark correctness, completeness, and clarity. Cite sources where relevant.",
    deadline: isoOffset(8),
    priority: "medium",
    status: "active",
    progress: 64,
    members: [
      m("u3", 16, 25, "in_progress"),
      m("u5", 20, 25, "submitted"),
      m("u7", 14, 25, "in_progress"),
    ],
    submissions: [
      {
        id: "sub_gqa_1",
        memberId: "u5",
        memberName: "Vikram Singh",
        memberAvatar: "VS",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
        status: "approved",
        itemsCount: 25,
      },
    ],
    issues: [
      {
        id: "iss_gqa_1",
        title: "Need more examples for ambiguous questions",
        description:
          "Some questions have multiple valid interpretations. Could we get a guidance doc?",
        reportedBy: "Karan Mehta",
        reportedByAvatar: "KM",
        reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        priority: "low",
        status: "open",
        replies: [],
      },
    ],
    activity: [],
    createdAt: isoOffset(-12),
    expectedSubmissions: 3,
  },
  {
    id: "proj_research",
    name: "Research Tasks",
    category: "generalist",
    description:
      "Curated research and information-gathering assignments for the AI knowledge base.",
    instructions:
      "Each task includes a topic and source list. Summarize findings in 200 words. Cite sources.",
    deadline: isoOffset(12),
    priority: "low",
    status: "active",
    progress: 42,
    members: [m("u6", 8, 20, "in_progress"), m("u3", 5, 20, "in_progress")],
    submissions: [],
    issues: [],
    activity: [],
    createdAt: isoOffset(-7),
    expectedSubmissions: 2,
  },
  {
    id: "proj_data_val",
    name: "Data Validation",
    category: "generalist",
    description:
      "QA pass on incoming training data shards. Flag corrupt rows and label inconsistencies.",
    instructions:
      "Run the validation checklist on each shard. Submit a per-shard report.",
    deadline: isoOffset(3),
    priority: "high",
    status: "active",
    progress: 78,
    members: [
      m("u4", 14, 18, "submitted"),
      m("u8", 16, 18, "submitted"),
    ],
    submissions: [
      {
        id: "sub_dv_1",
        memberId: "u4",
        memberName: "Sneha Gupta",
        memberAvatar: "SG",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        status: "pending",
        itemsCount: 18,
      },
    ],
    issues: [],
    activity: [],
    createdAt: isoOffset(-6),
    expectedSubmissions: 2,
  },
  {
    id: "proj_content",
    name: "Content Review",
    category: "generalist",
    description:
      "Review user-submitted content for the help center. Edit for clarity, accuracy, and tone.",
    instructions:
      "Apply the style guide. Track edits with comments. Send to peer review when done.",
    deadline: isoOffset(15),
    priority: "low",
    status: "active",
    progress: 22,
    members: [m("u1", 4, 18, "in_progress")],
    submissions: [],
    issues: [],
    activity: [],
    createdAt: isoOffset(-2),
    expectedSubmissions: 1,
  },
  {
    id: "proj_misc",
    name: "Misc Operations",
    category: "generalist",
    description:
      "Catch-all for ad-hoc operational tasks: tagging, formatting, data cleanup, etc.",
    instructions: "Refer to the per-task instructions in the workspace.",
    deadline: isoOffset(20),
    priority: "low",
    status: "active",
    progress: 50,
    members: [
      m("u3", 5, 10, "in_progress"),
      m("u5", 5, 10, "in_progress"),
      m("u7", 5, 10, "in_progress"),
    ],
    submissions: [],
    issues: [],
    activity: [],
    createdAt: isoOffset(-5),
    expectedSubmissions: 3,
  },
];
