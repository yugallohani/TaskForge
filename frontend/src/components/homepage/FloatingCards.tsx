import { CheckCircle2, Users2, Activity, Sparkles } from "lucide-react";

/**
 * FloatingCards
 * -------------
 * Mac-style glassmorphism mini widgets that softly drift around the
 * hero section to add depth and life. Hidden on small viewports to
 * keep mobile clean. Pointer-events disabled at the wrapper so they
 * never intercept clicks on real CTAs, but re-enabled on the inner
 * card so visionOS-style hover lift + teal glow still works.
 */
const FloatingCards = () => {
  const baseCard =
    "tf-glass tf-glass-hover pointer-events-auto rounded-xl px-4 py-3";

  return (
    <>
      {/* Top-left — Task Completed */}
      <div
        className="hidden lg:flex absolute top-24 left-[6%] z-0 pointer-events-none animate-tf-float-card"
        style={{ animationDelay: "0s" }}
      >
        <div className={baseCard}>
          <div className="flex items-center gap-3">
            <div className="tf-icon-illum w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-primary" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground">Task Completed</p>
              <p className="text-[10px] text-muted-foreground">Just now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top-right — Project Synced */}
      <div
        className="hidden lg:flex absolute top-32 right-[6%] z-0 pointer-events-none animate-tf-float-card"
        style={{ animationDelay: "1.5s" }}
      >
        <div className={baseCard}>
          <div className="flex items-center gap-3">
            <div className="tf-icon-illum w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground">Project Synced</p>
              <p className="text-[10px] text-muted-foreground">All changes saved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left — Team Updated */}
      <div
        className="hidden md:flex absolute bottom-24 left-[4%] z-0 pointer-events-none animate-tf-float-card"
        style={{ animationDelay: "3s" }}
      >
        <div className={baseCard}>
          <div className="flex items-center gap-3">
            <div className="tf-icon-illum w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
              <Users2 className="w-4 h-4 text-primary" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground">Team Updated</p>
              <p className="text-[10px] text-muted-foreground">+3 members joined</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-right — Tasks Done Today */}
      <div
        className="hidden md:flex absolute bottom-28 right-[5%] z-0 pointer-events-none animate-tf-float-card"
        style={{ animationDelay: "2s" }}
      >
        <div className={baseCard}>
          <div className="flex items-center gap-3">
            <div className="tf-icon-illum w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground">12 Tasks Done</p>
              <p className="text-[10px] text-muted-foreground">Today</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingCards;
