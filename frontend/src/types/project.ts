/**
 * TaskForge — Project Workflow Types
 * ----------------------------------
 * Centralized type definitions for the AI workflow management system.
 * Designed to be shared between the Admin workspace and the future
 * Member dashboard so projects flow naturally from creation to assignment.
 */

export type ProjectCategory = "eval" | "generalist";

export type ProjectPriority = "low" | "medium" | "high";

export type ProjectStatus =
  | "draft"
  | "active"
  | "in_review"
  | "completed"
  | "archived";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type IssueStatus = "open" | "in_progress" | "resolved";

export type IssuePriority = "low" | "medium" | "high";

export type ActivityType =
  | "project_created"
  | "member_joined"
  | "member_removed"
  | "task_assigned"
  | "submission_uploaded"
  | "submission_approved"
  | "submission_rejected"
  | "issue_created"
  | "issue_resolved"
  | "admin_updated";

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar: string; // initials
  role: string;
  status: "active" | "idle";
  tasksCompleted: number;
  tasksTotal: number;
  submissionStatus: "submitted" | "in_progress" | "not_started";
  joinedAt: string;
}

export interface Submission {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  submittedAt: string; // ISO
  status: SubmissionStatus;
  itemsCount: number;
  notes?: string;
}

export interface IssueReply {
  id: string;
  author: string;
  authorAvatar: string;
  message: string;
  timestamp: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  reportedBy: string;
  reportedByAvatar: string;
  reportedAt: string;
  priority: IssuePriority;
  status: IssueStatus;
  replies: IssueReply[];
}

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  actor: string;
  actorAvatar: string;
  description: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  description: string;
  instructions: string;
  deadline: string; // ISO date
  priority: ProjectPriority;
  status: ProjectStatus;
  progress: number; // 0-100
  members: ProjectMember[];
  submissions: Submission[];
  issues: Issue[];
  activity: ActivityEntry[];
  createdAt: string;
  expectedSubmissions: number;
}

/** Input shape used by the Create Project modal */
export interface CreateProjectInput {
  name: string;
  category: ProjectCategory;
  description: string;
  instructions: string;
  deadline: string;
  priority: ProjectPriority;
  memberIds: string[];
}
