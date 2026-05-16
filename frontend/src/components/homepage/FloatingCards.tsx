import { CheckCircle2, Users2, Activity, Sparkles } from "lucide-react";

/**
 * FloatingCards
 * -------------
 * Mac-style glassmorphism mini widgets that softly drift around the
 * hero section to add depth and life. Hidden on small viewports to
 * keep mobile clean. Pointer-events disabled so they never intercept
 * clicks on real CTAs.
 */
const FloatingCards = () => {
  return (
    <>
      {/* Top-left — Task Completed */}
      <div
        className="hidden lg:flex absolute top-24 left-[6%] z-0 pointer-events-none animate-tf-float-card"
        style={{ animationDelay: "0s" }}
      >
        <div className="glass rounded-xl px-4 py-3 shadow-2xl shadow-black/40 border border-primary/15 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-[hsl(175_84%_38%)] flex items-center justify-center shadow-lg shadow-primary/30">
              <CheckCircle2 className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
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
        <div className="glass rounded-xl px-4 py-3 shadow-2xl shadow-black/40 border border-primary/15 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(188_90%_50%)] to-[hsl(168_76%_42%)] flex items-center justify-center shadow-lg shadow-primary/30">
              <Activity className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
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
        <div className="glass rounded-xl px-4 py-3 shadow-2xl shadow-black/40 border border-primary/15 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(160_70%_40%)] to-[hsl(168_76%_45%)] flex items-center justify-center shadow-lg shadow-primary/30">
              <Users2 className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
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
        <div className="glass rounded-xl px-4 py-3 shadow-2xl shadow-black/40 border border-primary/15 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-[hsl(188_90%_50%)] flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
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
