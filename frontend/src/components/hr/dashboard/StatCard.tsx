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
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  style,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "tf-glass tf-glass-hover rounded-2xl p-5 group",
        className
      )}
      style={style}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <div className="tf-icon-illum flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110">
            <Icon className="h-4 w-4" />
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
