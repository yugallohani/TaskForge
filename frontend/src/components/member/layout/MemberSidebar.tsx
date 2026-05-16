import { NavLink, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Timer,
  Activity,
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

const mainNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/member/dashboard" },
  { icon: FolderKanban, label: "Projects", path: "/member/projects" },
  { icon: Timer, label: "Work Sessions", path: "/member/work-sessions" },
  { icon: Activity, label: "Activity", path: "/member/activity" },
];

export const MemberSidebar = () => {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const { toast } = useToast();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleComingSoon = (label: string) =>
    toast({
      title: "Coming Soon",
      description: `${label} will be available in a future update.`,
    });

  return (
    <SidebarUI
      collapsible="icon"
      className="border-r border-[hsl(168_50%_40%/0.06)] bg-[hsl(220_30%_5%/0.7)] backdrop-blur-xl"
    >
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
            My Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.label}
                  >
                    <NavLink
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                        isActive(item.path)
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
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => handleComingSoon("Settings")}
            >
              <Settings className="h-5 w-5" />
              {!isCollapsed && <span>Settings</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarUI>
  );
};
