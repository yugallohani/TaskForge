import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import ParticleCanvas from "@/components/homepage/ParticleCanvas";

const SIDEBAR_COOKIE_NAME = "sidebar:state";

const getCookieValue = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

export const HRLayout = () => {
  const [defaultOpen] = useState(() => {
    const savedState = getCookieValue(SIDEBAR_COOKIE_NAME);
    return savedState === null ? true : savedState === "true";
  });

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="min-h-screen flex w-full relative overflow-x-hidden overflow-y-auto">
        {/* ─── Immersive dark background ─── */}
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
        >
          {/* Layer 1: Very dark base — near-black with deep emerald undertone */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 50% 0%, hsl(168 50% 8% / 0.5) 0%, transparent 55%),
                radial-gradient(ellipse 60% 50% at 80% 80%, hsl(190 40% 6% / 0.4) 0%, transparent 50%),
                linear-gradient(180deg, #020617 0%, #030712 40%, #041018 70%, #020617 100%)
              `,
            }}
          />

          {/* Layer 2: Soft vignette — darkens edges for cinematic depth */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, hsl(220 30% 3% / 0.7) 100%)
              `,
            }}
          />

          {/* Layer 3: Very subtle aurora — deeply muted, fog-like */}
          <div className="absolute inset-0 tf-aurora opacity-[0.15]" />
          <div className="absolute inset-0 tf-aurora-2 opacity-[0.10]" />

          {/* Layer 4: Ambient orbs — barely visible, atmospheric */}
          <div className="tf-orb tf-orb-a opacity-[0.12]" />
          <div className="tf-orb tf-orb-b opacity-[0.10]" />
          <div className="tf-orb tf-orb-c opacity-[0.08]" />

          {/* Layer 5: Particle network — very subtle */}
          <div className="absolute inset-0 opacity-[0.35]">
            <ParticleCanvas />
          </div>

          {/* Layer 6: Soft top glow — gives the header area a faint lift */}
          <div
            className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 100% at 50% 0%, hsl(168 60% 20% / 0.06) 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* ─── Dashboard UI ─── */}
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-0">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};
