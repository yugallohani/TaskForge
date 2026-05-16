import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary, PageLoader } from "@/components/common";
import { UserProvider } from "@/contexts/UserContext";
import { ProjectsProvider } from "@/contexts/ProjectsContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { HRLayout } from "@/components/hr/layout/HRLayout";
import { MemberLayout } from "@/components/member/layout/MemberLayout";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));

// HR Dashboard Pages
const HRDashboard = lazy(() => import("./pages/hr/Dashboard"));
const HRProjects = lazy(() => import("./pages/hr/Projects"));
const HRProjectCategory = lazy(() => import("./pages/hr/ProjectCategory"));
const HRProjectDetail = lazy(() => import("./pages/hr/ProjectDetail"));
const HRTasks = lazy(() => import("./pages/hr/Tasks"));
const HREmployees = lazy(() => import("./pages/hr/Employees"));
const HRAttendance = lazy(() => import("./pages/hr/Attendance"));
const HRLeaveRequests = lazy(() => import("./pages/hr/LeaveRequests"));
const HRSettings = lazy(() => import("./pages/hr/Settings"));
const HRAccessRequests = lazy(() => import("./pages/hr/AccessRequests"));

// Member Dashboard Pages
const MemberDashboard = lazy(() => import("./pages/member/Dashboard"));
const MemberProjects = lazy(() => import("./pages/member/Projects"));
const MemberProjectCategory = lazy(() => import("./pages/member/ProjectCategory"));
const MemberProjectDetail = lazy(() => import("./pages/member/ProjectDetail"));
const MemberWorkSessions = lazy(() => import("./pages/member/WorkSessions"));
const MemberActivity = lazy(() => import("./pages/member/Activity"));

// Legacy Employee Dashboard Pages (kept for back-compat)
const EmployeeDashboard = lazy(() => import("./pages/EmployeeDashboard"));
const EmployeeAttendance = lazy(() => import("./pages/employee/Attendance"));
const EmployeeTasks = lazy(() => import("./pages/employee/Tasks"));
const EmployeeDocuments = lazy(() => import("./pages/employee/Documents"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ProjectsProvider>
          <WorkspaceProvider>
            <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Homepage */}
                <Route path="/" element={<Index />} />
                <Route path="/login/:role" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* HR Dashboard Routes */}
                <Route path="/hr" element={<HRLayout />}>
                  <Route path="dashboard" element={<HRDashboard />} />
                  <Route path="projects" element={<HRProjects />} />
                  <Route path="projects/:category" element={<HRProjectCategory />} />
                  <Route path="projects/:category/:projectId" element={<HRProjectDetail />} />
                  <Route path="tasks" element={<HRTasks />} />
                  <Route path="employees" element={<HREmployees />} />
                  <Route path="attendance" element={<HRAttendance />} />
                  <Route path="access-requests" element={<HRAccessRequests />} />
                  <Route path="leave-requests" element={<HRLeaveRequests />} />
                  <Route path="settings" element={<HRSettings />} />
                </Route>

                {/* Member Dashboard Routes (new) */}
                <Route path="/member" element={<MemberLayout />}>
                  <Route path="dashboard" element={<MemberDashboard />} />
                  <Route path="projects" element={<MemberProjects />} />
                  <Route path="projects/:category" element={<MemberProjectCategory />} />
                  <Route path="projects/:category/:projectId" element={<MemberProjectDetail />} />
                  <Route path="work-sessions" element={<MemberWorkSessions />} />
                  <Route path="activity" element={<MemberActivity />} />
                </Route>

                {/* Legacy Employee routes (kept) */}
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/employee/attendance" element={<EmployeeAttendance />} />
                <Route path="/employee/tasks" element={<EmployeeTasks />} />
                <Route path="/employee/documents" element={<EmployeeDocuments />} />

                {/* 404 Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
          </WorkspaceProvider>
        </ProjectsProvider>
      </UserProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
