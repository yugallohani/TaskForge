import { useState, useEffect } from "react";
import {
  Search,
  Users2,
  Mail,
  Briefcase,
  Circle,
  Clock,
} from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { hrAPI, getErrorMessage } from "@/lib/api";
import { PageLoader } from "@/components/common";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  designation: string;
  status: "active" | "inactive";
  joinedAt?: string;
}

const Employees = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [designationFilter, setDesignationFilter] = useState<string>("all");
  const { sessions } = useWorkspace();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await hrAPI.getEmployees({ page: 1, page_size: 100 });
      const items = response?.data?.items || [];
      const transformed: TeamMember[] = items.map((emp: any) => ({
        id: emp.employee_id || emp.id,
        name: emp.name,
        email: emp.email,
        designation: emp.department || emp.position || "Member",
        status: emp.status === "active" ? "active" : "inactive",
        joinedAt: emp.hire_date || emp.created_at,
      }));
      setMembers(transformed);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      toast({
        title: "Could not load team members",
        description: getErrorMessage(error),
        variant: "destructive",
      });
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique designations for filter
  const designations = Array.from(
    new Set(members.map((m) => m.designation))
  ).sort();

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDesignation =
      designationFilter === "all" || m.designation === designationFilter;
    return matchesSearch && matchesDesignation;
  });

  // Check if a member has an active session
  const isOnline = (email: string) =>
    sessions.some(
      (s) =>
        s.status === "active" &&
        (s.memberName.toLowerCase().includes(email.split("@")[0]) ||
          email.includes(s.memberName.toLowerCase().split(" ")[0]))
    );

  if (isLoading) return <PageLoader />;

  const activeCount = members.filter((m) => m.status === "active").length;

  return (
    <MainLayout
      title="Team Members"
      description="Live workforce directory — all registered members appear here."
    >
      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-5 text-xs text-muted-foreground flex-wrap">
        <span>
          <span className="text-foreground font-semibold">{members.length}</span>{" "}
          total members
        </span>
        <span className="h-3 w-px bg-border/50" />
        <span>
          <span className="text-primary font-semibold">{activeCount}</span>{" "}
          active
        </span>
        <span className="h-3 w-px bg-border/50" />
        <span>
          <span className="text-foreground font-semibold">
            {designations.length}
          </span>{" "}
          designations
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, or designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-[hsl(220_30%_10%/0.5)] border-[hsl(168_50%_40%/0.12)] focus:border-primary"
          />
        </div>

        {/* Designation filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setDesignationFilter("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border",
              designationFilter === "all"
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-[hsl(168_50%_40%/0.08)] text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {designations.map((d) => (
            <button
              key={d}
              onClick={() => setDesignationFilter(d)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border",
                designationFilter === d
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-[hsl(168_50%_40%/0.08)] text-muted-foreground hover:text-foreground"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Members grid */}
      {filtered.length === 0 ? (
        <div className="dash-glass rounded-2xl p-12 text-center">
          <Users2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-foreground font-medium">No members found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {searchQuery
              ? "Try a different search term."
              : "Members will appear here as they sign up."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((member) => {
            const online = isOnline(member.email);
            const initials = member.name
              .split(" ")
              .map((s) => s[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={member.id}
                className="dash-glass rounded-2xl p-5 group hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
                      {initials}
                    </div>
                    {/* Online indicator */}
                    <div
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[hsl(220_30%_8%)]",
                        online
                          ? "bg-primary"
                          : member.status === "active"
                          ? "bg-muted-foreground/40"
                          : "bg-destructive/40"
                      )}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {member.name}
                      </p>
                      {online && (
                        <span className="text-[9px] font-semibold text-primary bg-primary/15 px-1.5 py-0.5 rounded-full">
                          ONLINE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{member.email}</span>
                    </p>
                  </div>
                </div>

                {/* Designation + meta */}
                <div className="mt-3 pt-3 border-t border-[hsl(168_50%_40%/0.06)] flex items-center justify-between">
                  <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Briefcase className="w-2.5 h-2.5" />
                    {member.designation}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1",
                      member.status === "active"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Circle className="w-2 h-2 fill-current" />
                    {member.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
};

export default Employees;
