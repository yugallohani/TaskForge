import { memo } from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive: boolean;
  isPast: boolean;
}

const FeatureCard = memo(
  ({ icon: Icon, title, description, isActive, isPast }: FeatureCardProps) => {
    return (
      <div
        className={`
          relative lg:ml-10 p-6 rounded-2xl border transition-all duration-500 ease-out
          ${
            isActive
              ? "border-primary/30 bg-[hsl(220_30%_8%/0.85)] scale-[1.02]"
              : isPast
              ? "border-[hsl(168_50%_40%/0.12)] bg-[hsl(220_30%_8%/0.6)] scale-[0.98] opacity-70"
              : "border-[hsl(168_50%_40%/0.06)] bg-[hsl(220_30%_8%/0.4)] opacity-50"
          }
          backdrop-blur-md
        `}
      >
        {/* Active glow — subtle, no heavy box-shadow */}
        {isActive && (
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/15 via-transparent to-[hsl(188_90%_55%/0.1)] pointer-events-none" />
        )}



        {/* Content */}
        <div className="relative z-10">
          <div
            className={`
              w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 ease-out
              ${
                isActive
                  ? "bg-primary/20 scale-110"
                  : "bg-primary/8"
              }
            `}
          >
            <Icon
              className={`w-5 h-5 transition-colors duration-500 ${
                isActive ? "text-primary" : "text-primary/50"
              }`}
            />
          </div>
          <h3
            className={`text-lg font-semibold mb-2 transition-colors duration-500 ${
              isActive ? "text-foreground" : "text-foreground/60"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm leading-relaxed transition-colors duration-500 ${
              isActive ? "text-muted-foreground" : "text-muted-foreground/50"
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";
export default FeatureCard;
