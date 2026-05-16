import { Bell, LogOut, User, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MemberHeaderProps {
  title: string;
  description?: string;
}

const formatTime = (iso: string) => {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
};

export const MemberHeader = ({ title, description }: MemberHeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { toast } = useToast();
  const {
    currentUser,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllRead,
  } = useWorkspace();

  const myNotifications = currentUser
    ? notifications.filter((n) => n.recipientId === currentUser.id).slice(0, 8)
    : [];

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-6 bg-[hsl(220_30%_6%/0.6)] backdrop-blur-2xl">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 dash-glass border-[hsl(168_50%_40%/0.15)]">
            <div className="flex items-center justify-between px-3 py-2">
              <DropdownMenuLabel className="p-0 text-sm">
                Notifications
              </DropdownMenuLabel>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] text-primary hover:text-primary/80"
                >
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            {myNotifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                <Bell className="h-7 w-7 mx-auto mb-1.5 opacity-40" />
                No notifications yet
              </div>
            ) : (
              <div className="max-h-[360px] overflow-y-auto">
                {myNotifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 hover:bg-[hsl(220_30%_10%/0.5)] transition-colors border-b border-[hsl(168_50%_40%/0.04)] last:border-b-0",
                      !n.read && "bg-primary/[0.03]"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      )}
                      <div className={cn("flex-1 min-w-0", n.read && "pl-3.5")}>
                        <p className="text-xs font-medium text-foreground">
                          {n.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                          {n.body}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {formatTime(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">
                {currentUser?.avatar || <User className="h-4 w-4" />}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 dash-glass border-[hsl(168_50%_40%/0.15)]">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {currentUser?.name || user?.name || "Member"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentUser?.email || user?.email}
                </p>
                <p className="text-xs text-primary font-normal">Member</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => toast({ title: "Coming Soon", description: "Profile page" })}
              className="cursor-pointer"
            >
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
