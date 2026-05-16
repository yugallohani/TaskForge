import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AccessRequest,
  AccessRequestStatus,
  AppNotification,
  NotificationKind,
  ProjectCategory,
  WorkSession,
} from "@/types/project";
import { useSyncedState } from "@/lib/syncedState";

const ACCESS_KEY = "taskforge:access:v1";
const SESSIONS_KEY = "taskforge:sessions:v1";
const NOTIFICATIONS_KEY = "taskforge:notifications:v1";

interface CurrentUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: "admin" | "member";
}

interface WorkspaceContextValue {
  currentUser: CurrentUser | null;
  // Access requests
  accessRequests: AccessRequest[];
  requestAccess: (
    category: ProjectCategory,
    message: string
  ) => AccessRequest | null;
  reviewRequest: (
    requestId: string,
    status: "approved" | "rejected",
    note?: string
  ) => void;
  hasAccessTo: (category: ProjectCategory, memberId?: string) => boolean;
  pendingForCategory: (category: ProjectCategory, memberId?: string) => boolean;
  myAccessForCategory: (category: ProjectCategory) => AccessRequest | undefined;
  // Work sessions
  sessions: WorkSession[];
  activeSession: WorkSession | null;
  startSession: (projectId?: string, projectName?: string) => void;
  stopSession: () => void;
  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  pushNotification: (
    n: Omit<AppNotification, "id" | "createdAt" | "read">
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(
  undefined
);

const newId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const nowIso = () => new Date().toISOString();

/**
 * Resolve the current user from localStorage. Falls back to null.
 * The role is determined from the backend response: "HR Administrator"
 * → admin, anything else → member.
 */
const getCurrentUser = (): CurrentUser | null => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (!u?.email) return null;
    const isAdmin = u.role === "HR Administrator";
    const initials = (u.name || u.email)
      .split(" ")
      .map((s: string) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return {
      id: u.id || u.email,
      email: u.email,
      name: u.name || u.email,
      avatar: initials,
      role: isAdmin ? "admin" : "member",
    };
  } catch {
    return null;
  }
};

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [accessRequests, setAccessRequests] = useSyncedState<AccessRequest[]>(
    ACCESS_KEY,
    []
  );
  const [sessions, setSessions] = useSyncedState<WorkSession[]>(
    SESSIONS_KEY,
    []
  );
  const [notifications, setNotifications] = useSyncedState<AppNotification[]>(
    NOTIFICATIONS_KEY,
    []
  );

  // Current user — re-read on every render so role detection updates after login
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(
    getCurrentUser
  );

  // Refresh user when storage changes (cross-tab login/logout)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "user") setCurrentUser(getCurrentUser());
    };
    window.addEventListener("storage", handler);
    // Also poll on mount in case another effect set the user
    const interval = setInterval(() => {
      const next = getCurrentUser();
      setCurrentUser((prev) => {
        if (prev?.email === next?.email && prev?.role === next?.role) return prev;
        return next;
      });
    }, 1500);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);

  // ─── Access requests ─────────────────────────────────────────
  const requestAccess = useCallback(
    (category: ProjectCategory, message: string): AccessRequest | null => {
      if (!currentUser) return null;
      // Block duplicate pending request for same category by same user
      const existing = accessRequests.find(
        (r) =>
          r.memberId === currentUser.id &&
          r.category === category &&
          r.status === "pending"
      );
      if (existing) return existing;

      const request: AccessRequest = {
        id: newId("req"),
        memberId: currentUser.id,
        memberName: currentUser.name,
        memberAvatar: currentUser.avatar,
        memberEmail: currentUser.email,
        category,
        message,
        status: "pending",
        requestedAt: nowIso(),
      };
      setAccessRequests((prev) => [request, ...prev]);

      // Notify admin
      pushNotificationInternal({
        recipientId: "admin",
        kind: "access_requested",
        title: "New access request",
        body: `${currentUser.name} requested access to ${
          category === "eval" ? "Evals" : "Generalists"
        }`,
        link: "/hr/access-requests",
      });
      return request;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessRequests, currentUser]
  );

  const reviewRequest = useCallback(
    (
      requestId: string,
      status: "approved" | "rejected",
      note?: string
    ) => {
      const req = accessRequests.find((r) => r.id === requestId);
      if (!req) return;
      setAccessRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status, reviewedAt: nowIso(), reviewerNote: note }
            : r
        )
      );
      // Notify member
      pushNotificationInternal({
        recipientId: req.memberId,
        kind: status === "approved" ? "access_approved" : "access_rejected",
        title: status === "approved" ? "Access approved" : "Access denied",
        body: `Your request for ${
          req.category === "eval" ? "Evals" : "Generalists"
        } was ${status}.${note ? ` Note: ${note}` : ""}`,
        link: status === "approved" ? `/member/projects/${req.category}` : undefined,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessRequests]
  );

  const hasAccessTo = useCallback(
    (category: ProjectCategory, memberId?: string) => {
      const id = memberId || currentUser?.id;
      if (!id) return false;
      // Admins always have access
      if (currentUser?.role === "admin" && !memberId) return true;
      return accessRequests.some(
        (r) =>
          r.memberId === id &&
          r.category === category &&
          r.status === "approved"
      );
    },
    [accessRequests, currentUser]
  );

  const pendingForCategory = useCallback(
    (category: ProjectCategory, memberId?: string) => {
      const id = memberId || currentUser?.id;
      if (!id) return false;
      return accessRequests.some(
        (r) =>
          r.memberId === id &&
          r.category === category &&
          r.status === "pending"
      );
    },
    [accessRequests, currentUser]
  );

  const myAccessForCategory = useCallback(
    (category: ProjectCategory) => {
      if (!currentUser) return undefined;
      return accessRequests.find(
        (r) => r.memberId === currentUser.id && r.category === category
      );
    },
    [accessRequests, currentUser]
  );

  // ─── Work sessions ──────────────────────────────────────────
  const activeSession = useMemo(() => {
    if (!currentUser) return null;
    return (
      sessions.find(
        (s) => s.memberId === currentUser.id && s.status === "active"
      ) || null
    );
  }, [sessions, currentUser]);

  const startSession = useCallback(
    (projectId?: string, projectName?: string) => {
      if (!currentUser) return;
      // Stop any other active session first
      setSessions((prev) => {
        const stopped = prev.map((s) =>
          s.memberId === currentUser.id && s.status === "active"
            ? {
                ...s,
                endedAt: nowIso(),
                durationSeconds: Math.max(
                  1,
                  Math.floor(
                    (Date.now() - new Date(s.startedAt).getTime()) / 1000
                  )
                ),
                status: "completed" as const,
              }
            : s
        );
        const next: WorkSession = {
          id: newId("sess"),
          memberId: currentUser.id,
          memberName: currentUser.name,
          memberAvatar: currentUser.avatar,
          projectId,
          projectName,
          startedAt: nowIso(),
          status: "active",
        };
        return [next, ...stopped];
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const stopSession = useCallback(() => {
    if (!currentUser) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.memberId === currentUser.id && s.status === "active"
          ? {
              ...s,
              endedAt: nowIso(),
              durationSeconds: Math.max(
                1,
                Math.floor(
                  (Date.now() - new Date(s.startedAt).getTime()) / 1000
                )
              ),
              status: "completed" as const,
            }
          : s
      )
    );
  }, [currentUser, setSessions]);

  // ─── Notifications ──────────────────────────────────────────
  const notificationsRef = useRef(notifications);
  notificationsRef.current = notifications;

  const pushNotificationInternal = (
    n: Omit<AppNotification, "id" | "createdAt" | "read">
  ) => {
    const note: AppNotification = {
      ...n,
      id: newId("ntf"),
      createdAt: nowIso(),
      read: false,
    };
    setNotifications((prev) => [note, ...prev].slice(0, 50));
  };

  const pushNotification = useCallback(pushNotificationInternal, [
    setNotifications,
  ]);

  const markNotificationRead = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    },
    [setNotifications]
  );

  const markAllRead = useCallback(() => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) =>
        n.recipientId === currentUser.id ||
        (currentUser.role === "admin" && n.recipientId === "admin")
          ? { ...n, read: true }
          : n
      )
    );
  }, [currentUser, setNotifications]);

  const unreadCount = useMemo(() => {
    if (!currentUser) return 0;
    return notifications.filter(
      (n) =>
        !n.read &&
        (n.recipientId === currentUser.id ||
          (currentUser.role === "admin" && n.recipientId === "admin"))
    ).length;
  }, [notifications, currentUser]);

  const value: WorkspaceContextValue = {
    currentUser,
    accessRequests,
    requestAccess,
    reviewRequest,
    hasAccessTo,
    pendingForCategory,
    myAccessForCategory,
    sessions,
    activeSession,
    startSession,
    stopSession,
    notifications,
    unreadCount,
    pushNotification,
    markNotificationRead,
    markAllRead,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
};
