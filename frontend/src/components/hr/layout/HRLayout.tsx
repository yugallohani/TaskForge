import { ReactNode, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";

const SIDEBAR_COOKIE_NAME = "sidebar:state";

// Helper function to read cookie
const getCookieValue = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

export const HRLayout = () => {
  const [defaultOpen, setDefaultOpen] = useState(() => {
    // Read sidebar state from cookie immediately
    const savedState = getCookieValue(SIDEBAR_COOKIE_NAME);
    return savedState === null ? true : savedState === "true";
  });

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
        
        {/* Background gradient effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute -bottom-[20%] -left-[20%] h-[60%] w-[40%] rounded-full bg-primary/3 blur-[100px]" />
        </div>
      </div>
    </SidebarProvider>
  );
};
