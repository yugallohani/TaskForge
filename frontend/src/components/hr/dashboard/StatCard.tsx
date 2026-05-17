import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  style?: CSSProperties;
  accentColor?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  style,
  accentColor,
}: StatCardProps) => {
  const accent = accentColor || "168 76% 42%";

  return (
    <div
      className={cn(
        "relative rounded-2xl p-5 group overflow-hidden transition-all duration-500 ease-out cursor-default",
        "border border-[hsl(168_50%_40%/0.08)]",
        "bg-[hsl(220_30%_7%/0.6)] backdrop-blur-md",
        "hover:translate-y-[-3px]",
        "hover:border-[hsl(var(--stat-accent)/0.3)]",
        "hover:shadow-[0_12px_40px_-10px_var(--stat-glow)]",
        className
      )}
      style={{
        ...style,
        "--stat-accent": accent,
        "--stat-glow": `hsl(${accent} / 0.2)`,
      } as CSSProperties}
    >
      {/* Full-card gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% -20%, hsl(${accent} / 0.1), transparent 60%),
            radial-gradient(ellipse 80% 100% at 80% 110%, hsl(${accent} / 0.04), transparent 50%)
          `,
        }}
      />

      {/* Gradient border glow on hover */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, hsl(${accent} / 0.15), transparent 40%, transparent 60%, hsl(${accent} / 0.08))`,
        }}
      />

      {/* Inner card background (sits on top of border glow) */}
      <div className="absolute inset-px rounded-[15px] bg-[hsl(220_30%_7%/0.85)] group-hover:bg-[hsl(220_30%_7%/0.9)] transition-colors duration-500 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_16px_-4px_var(--stat-glow)]"
            style={{
              background: `hsl(${accent} / 0.1)`,
            }}
          >
            <Icon
              className="h-4 w-4 transition-all duration-500"
              style={{ color: `hsl(${accent})` }}
            />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {trend && (
            <span
              className={cn(
                "text-xs font-semibold px-1.5 py-0.5 rounded-full",
                trend.isPositive
                  ? "text-primary bg-primary/10"
                  : "text-destructive bg-destructive/10"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
