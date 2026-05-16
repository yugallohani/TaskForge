// Application Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: {
    HR: "/login/hr",
    EMPLOYEE: "/login/employee",
  },
  HR: {
    DASHBOARD: "/hr/dashboard",
    PROJECTS: "/hr/projects",
    PROJECTS_CATEGORY: "/hr/projects/:category",
    PROJECT_DETAIL: "/hr/projects/:category/:projectId",
    TASKS: "/hr/tasks",
    EMPLOYEES: "/hr/employees",
    ATTENDANCE: "/hr/attendance",
    LEAVE_REQUESTS: "/hr/leave-requests",
    SETTINGS: "/hr/settings",
  },
  EMPLOYEE: {
    DASHBOARD: "/member/dashboard",
    PROJECTS: "/member/projects",
    WORK_SESSIONS: "/member/work-sessions",
    ACTIVITY: "/member/activity",
    // legacy
    ATTENDANCE: "/employee/attendance",
    TASKS: "/employee/tasks",
    DOCUMENTS: "/employee/documents",
  },
} as const;

// Demo Credentials (HR Admin Only)
export const DEMO_CREDENTIALS = {
  HR: {
    email: "admin@taskforge.com",
    password: "demo123",
  },
} as const;

// Application Config
export const APP_CONFIG = {
  name: "TaskForge",
  description: "Modern Team Task Management Platform",
  version: "1.0.0",
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  EMPLOYEES: "employees",
  ATTENDANCE: "attendance",
  TASKS: "tasks",
  DOCUMENTS: "documents",
  ANNOUNCEMENTS: "announcements",
} as const;
