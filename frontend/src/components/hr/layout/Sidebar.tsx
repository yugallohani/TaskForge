import { NavLink, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users2,
  Timer,
  Brain,
  ShieldCheck,
  Settings,
  ChevronLeft,
} from "lucide-react";
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import Logo from "@/components/homepage/Logo";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/contexts/WorkspaceContext";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: ROUTES.HR.DASHBOARD, group: "workspace" },
  { icon: FolderKanban, label: "Projects", path: ROUTES.HR.PROJECTS, group: "workspace" },
  { icon: CheckSquare, label: "Tasks", path: ROUTES.HR.TASKS, group: "workspace" },
  { icon: ShieldCheck, label: "Access Requests", path: "/hr/access-requests", group: "management" },
  { icon: Users2, label: "Team Members", path: ROUTES.HR.EMPLOYEES, group: "management" },
  { icon: Timer, label: "Work Sessions", path: ROUTES.HR.ATTENDANCE, group: "management" },
  { icon: Brain, label: "AI Insights", path: "/hr/ai-insights", group: "intelligence" },
];

export const Sidebar = () => {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const { toast } = useToast();
  const { accessRequests } = useWorkspace();
  const isCollapsed = state === "collapsed";
  const pendingRequests = accessRequests.filter(
    (r) => r.status === "pending"
  ).length;

  const isActive = (path: string, label: string) => {
    if (label === "Dashboard") return location.pathname === ROUTES.HR.DASHBOARD;
    if (label === "Projects") return location.pathname.startsWith(ROUTES.HR.PROJECTS);
    if (label === "Tasks") return location.pathname === ROUTES.HR.TASKS;
    if (label === "Access Requests") return location.pathname === "/hr/access-requests";
    if (label === "Team Members") return location.pathname === ROUTES.HR.EMPLOYEES;
    if (label === "Work Sessions") return location.pathname === ROUTES.HR.ATTENDANCE;
    if (label === "AI Insights") return location.pathname === "/hr/ai-insights";
    return location.pathname === path;
  };

  const handleComingSoon = (label: string) => {
    toast({
      title: "Coming Soon",
      description: `${label} will be available in a future update.`,
    });
  };

  return (
    <SidebarUI collapsible="icon" className="border-r border-[hsl(168_50%_40%/0.06)] bg-[hsl(220_30%_5%/0.7)] backdrop-blur-xl">
      <SidebarHeader className="p-4 border-b border-[hsl(168_50%_40%/0.06)]">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link
              to={ROUTES.HOME}
              className="transition-opacity hover:opacity-80"
              title="Go to Homepage"
            >
              <Logo size="sm" />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel
            className={cn(
              "text-xs text-muted-foreground",
              isCollapsed && "sr-only"
            )}
          >
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.filter((i) => i.group === "workspace").map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path, item.label)}
                    tooltip={item.label}
                  >
                    <NavLink
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                        isActive(item.path, item.label)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && (
                        <>
                          <span>{item.label}</span>
                          {item.label === "Access Requests" && pendingRequests > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                              {pendingRequests}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel
            className={cn(
              "text-xs text-muted-foreground",
              isCollapsed && "sr-only"
            )}
          >
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.filter((i) => i.group === "management").map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path, item.label)}
                    tooltip={item.label}
                  >
                    <NavLink
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                        isActive(item.path, item.label)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && (
                        <>
                          <span>{item.label}</span>
                          {item.label === "Access Requests" && pendingRequests > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                              {pendingRequests}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel
            className={cn(
              "text-xs text-muted-foreground",
              isCollapsed && "sr-only"
            )}
          >
            Intelligence
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.filter((i) => i.group === "intelligence").map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path, item.label)}
                    tooltip={item.label}
                  >
                    <NavLink
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                        isActive(item.path, item.label)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4 border-t border-[hsl(168_50%_40%/0.06)]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <button
                onClick={() => handleComingSoon("Settings")}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
              >
                <Settings className="h-5 w-5" />
                {!isCollapsed && <span>Settings</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarUI>
  );
};
