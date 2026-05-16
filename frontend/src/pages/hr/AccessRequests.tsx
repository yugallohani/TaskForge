import { useState } from "react";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  CheckSquare,
  Sparkles,
} from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { AccessRequestStatus } from "@/types/project";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formatTime = (iso: string) => {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
};

const statusConfig: Record<
  AccessRequestStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  pending: {
    label: "Pending",
    className: "bg-warning/15 text-warning",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    className: "bg-primary/15 text-primary",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/15 text-destructive",
    icon: XCircle,
  },
};

const AccessRequests = () => {
  const { accessRequests, reviewRequest } = useWorkspace();
  const { toast } = useToast();
  const [filter, setFilter] = useState<AccessRequestStatus | "all">("pending");

  const filtered =
    filter === "all"
      ? accessRequests
      : accessRequests.filter((r) => r.status === filter);

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
  );

  const counts = {
    all: accessRequests.length,
    pending: accessRequests.filter((r) => r.status === "pending").length,
    approved: accessRequests.filter((r) => r.status === "approved").length,
    rejected: accessRequests.filter((r) => r.status === "rejected").length,
  };

  const handleApprove = (id: string, name: string) => {
    reviewRequest(id, "approved");
    toast({
      title: "Access approved",
      description: `${name} can now access the workspace.`,
    });
  };

  const handleReject = (id: string, name: string) => {
    reviewRequest(id, "rejected");
    toast({
      title: "Access rejected",
      description: `${name}'s request was denied.`,
    });
  };

  const tabs: { id: AccessRequestStatus | "all"; label: string }[] = [
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "all", label: "All" },
  ];

  return (
    <MainLayout
      title="Access Requests"
      description="Review and approve member workspace access."
    >
      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[hsl(220_30%_10%/0.5)] border border-[hsl(168_50%_40%/0.08)] w-fit mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              filter === t.id
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            <span className="ml-1.5 text-[10px] opacity-70">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {sorted.length === 0 ? (
        <div className="dash-glass rounded-2xl p-12 text-center">
          <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-foreground font-medium">No requests</p>
          <p className="text-xs text-muted-foreground mt-1">
            {filter === "pending"
              ? "All caught up — no pending requests."
              : "Nothing here yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((req) => {
            const status = statusConfig[req.status];
            const StatusIcon = status.icon;
            const CategoryIcon =
              req.category === "eval" ? CheckSquare : Sparkles;
            return (
              <div key={req.id} className="dash-glass rounded-2xl p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {req.memberAvatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold text-foreground">
                        {req.memberName}
                      </p>
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1",
                          status.className
                        )}
                      >
                        <StatusIcon className="w-2.5 h-2.5" />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {req.memberEmail}
                    </p>

                    <div className="flex items-center gap-2 mt-3 mb-2">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center",
                          req.category === "eval"
                            ? "bg-primary/15 text-primary"
                            : "bg-[hsl(260_70%_65%/0.15)] text-[hsl(260_70%_65%)]"
                        )}
                      >
                        <CategoryIcon className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-foreground">
                        Requesting access to{" "}
                        <span className="font-semibold">
                          {req.category === "eval" ? "Evals" : "Generalists"}
                        </span>
                      </p>
                    </div>

                    {req.message && (
                      <div className="mt-3 p-3 rounded-lg bg-[hsl(220_30%_8%/0.5)] border border-[hsl(168_50%_40%/0.06)]">
                        <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                          "{req.message}"
                        </p>
                      </div>
                    )}

                    <p className="text-[11px] text-muted-foreground mt-2">
                      Requested {formatTime(req.requestedAt)}
                      {req.reviewedAt &&
                        ` · Reviewed ${formatTime(req.reviewedAt)}`}
                    </p>
                  </div>

                  {req.status === "pending" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(req.id, req.memberName)}
                        className="rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </Button>
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => handleApprove(req.id, req.memberName)}
                        className="rounded-lg"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
};

export default AccessRequests;
