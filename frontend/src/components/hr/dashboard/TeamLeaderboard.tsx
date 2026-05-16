import { Trophy } from "lucide-react";

const contributors = [
  { name: "Priya Patel", tasks: 48, accuracy: 96, avatar: "PP" },
  { name: "Rahul Sharma", tasks: 42, accuracy: 94, avatar: "RS" },
  { name: "Amit Kumar", tasks: 38, accuracy: 91, avatar: "AK" },
  { name: "Sneha Gupta", tasks: 35, accuracy: 93, avatar: "SG" },
  { name: "Vikram Singh", tasks: 32, accuracy: 89, avatar: "VS" },
];

const maxTasks = Math.max(...contributors.map((c) => c.tasks));

export const TeamLeaderboard = () => {
  return (
    <div className="tf-glass rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Team Leaderboard
            </h3>
            <p className="text-sm text-muted-foreground">
              Top contributors this sprint
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {contributors.map((person, index) => (
          <div
            key={person.name}
            className="flex items-center gap-4 group"
          >
            {/* Rank */}
            <span
              className={`text-sm font-bold w-5 text-center ${
                index === 0
                  ? "text-primary"
                  : index === 1
                  ? "text-[hsl(188_90%_55%)]"
                  : "text-muted-foreground"
              }`}
            >
              {index + 1}
            </span>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {person.avatar}
            </div>

            {/* Info + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground truncate">
                  {person.name}
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{person.tasks} tasks</span>
                  <span className="text-primary font-medium">
                    {person.accuracy}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-border/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(188_90%_55%)] transition-all duration-700"
                  style={{ width: `${(person.tasks / maxTasks) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
