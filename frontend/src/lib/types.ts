// Employee Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  status: "active" | "inactive";
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: "present" | "absent";
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  category: string;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: "low" | "medium" | "high";
}

// User Types
export type UserRole = "hr" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
