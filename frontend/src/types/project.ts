/**
 * TaskForge — Project Workflow Types
 * ----------------------------------
 * Centralized type definitions for the AI workflow management system.
 * Designed to be shared between the Admin workspace and the Member
 * dashboard so projects flow naturally from creation to assignment.
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

export type AccessRequestStatus = "pending" | "approved" | "rejected";

export type WorkSessionStatus = "active" | "completed";

export type NotificationKind =
  | "access_approved"
  | "access_rejected"
  | "access_requested"
  | "task_assigned"
  | "submission_received"
  | "submission_reviewed"
  | "issue_reported";

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
  | "admin_updated"
  | "session_started"
  | "session_ended";

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

/** Member's access state to a category */
export type AccessRequestStatus = "pending" | "approved" | "rejected";

export interface AccessRequest {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  memberEmail: string;
  category: ProjectCategory;
  message: string;
  status: AccessRequestStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewerNote?: string;
}

/** Live work session tracking */
export interface WorkSession {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  projectId?: string;
  projectName?: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
  status: "active" | "completed";
}

/** Notification surfaced in the bell dropdown */
export type NotificationKind =
  | "access_requested"
  | "access_approved"
  | "access_rejected"
  | "task_submitted"
  | "submission_reviewed"
  | "issue_reported"
  | "issue_resolved"
  | "project_created";

export interface AppNotification {
  id: string;
  recipientId: string; // user id or "admin" for all admins
  kind: NotificationKind;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
}


/**
 * Member access control — tracks which categories a member is approved
 * to work on. Default: empty array (locked from everything).
 */
export interface MemberAccess {
  memberId: string;
  memberEmail: string;
  approvedCategories: ProjectCategory[];
}

/**
 * Access request — created by a member, reviewed by an admin.
 * On approval, the member's MemberAccess.approvedCategories is updated.
 */
export interface AccessRequest {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberAvatar: string;
  category: ProjectCategory;
  message: string;
  status: AccessRequestStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
}

/**
 * Work session — created when a member starts a task. The session
 * stays "active" until they end it. Used for live productivity stats.
 */
export interface WorkSession {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  projectId: string;
  projectName: string;
  taskTitle: string;
  status: WorkSessionStatus;
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
  notes?: string;
}

/**
 * Notification — created when something relevant to a user happens.
 * recipientEmail "*" = broadcast to all admins.
 */
export interface AppNotification {
  id: string;
  recipientEmail: string;
  kind: NotificationKind;
  title: string;
  body: string;
  read: boolean;
  link?: string;
  createdAt: string;
}
