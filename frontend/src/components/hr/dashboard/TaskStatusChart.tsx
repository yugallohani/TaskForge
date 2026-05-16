import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Done", value: 124, color: "hsl(168, 76%, 42%)" },
  { name: "In Progress", value: 56, color: "hsl(188, 90%, 55%)" },
  { name: "Review", value: 32, color: "hsl(38, 92%, 50%)" },
  { name: "To Do", value: 36, color: "hsl(220, 18%, 40%)" },
];

const total = data.reduce((sum, d) => sum + d.value, 0);

export const TaskStatusChart = () => {
  return (
    <div className="tf-glass rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Task Status</h3>
        <p className="text-sm text-muted-foreground">Distribution overview</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-[200px] h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220, 18%, 13%)",
                  border: "1px solid hsl(220, 18%, 20%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                }}
                labelStyle={{ color: "hsl(210, 40%, 98%)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.name}</span>
            <span className="text-xs font-medium text-foreground ml-auto">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
