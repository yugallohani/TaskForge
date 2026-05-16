import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useProjects } from "@/contexts/ProjectsContext";
import { useMemo } from "react";

export const ProductivityChart = () => {
  const { sessions } = useWorkspace();
  const { projects } = useProjects();

  // Build weekly data from real sessions + project submissions
  const data = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun

    return days.map((day, i) => {
      const targetDay = new Date(today);
      const offset = i - ((dayOfWeek + 6) % 7); // Mon=0
      targetDay.setDate(today.getDate() + offset);
      const dayStr = targetDay.toDateString();

      // Hours from sessions
      const dayHours = sessions
        .filter((s) => new Date(s.startedAt).toDateString() === dayStr)
        .reduce((acc, s) => acc + (s.durationSeconds || 0) / 3600, 0);

      // Submissions on that day
      const daySubmissions = projects.reduce(
        (acc, p) =>
          acc +
          p.submissions.filter(
            (s) => new Date(s.submittedAt).toDateString() === dayStr
          ).length,
        0
      );

      return {
        day,
        tasks: Math.round(dayHours * 3), // approximate tasks from hours
        reviews: daySubmissions,
      };
    });
  }, [sessions, projects]);

  return (
    <div className="dash-glass rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Weekly Productivity
          </h3>
          <p className="text-sm text-muted-foreground">
            Tasks completed & reviews this week
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(188_90%_55%)]" />
            <span className="text-xs text-muted-foreground">Reviews</span>
          </div>
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="reviewGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(188, 90%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(188, 90%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 20%)" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 65%)", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 65%)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 13%)",
                border: "1px solid hsl(220, 18%, 20%)",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
              labelStyle={{ color: "hsl(210, 40%, 98%)" }}
            />
            <Area type="monotone" dataKey="tasks" stroke="hsl(168, 76%, 42%)" strokeWidth={2.5} fill="url(#taskGradient)" />
            <Area type="monotone" dataKey="reviews" stroke="hsl(188, 90%, 55%)" strokeWidth={2} fill="url(#reviewGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
