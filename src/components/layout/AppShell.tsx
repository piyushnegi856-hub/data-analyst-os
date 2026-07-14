"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/onboarding";

  if (isOnboarding) {
    return (
      <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--ds-bg)] text-[var(--ds-text)] font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-transparent relative z-10">
          <div className="h-full p-8 max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
        
        {/* Decorative background glow behind main content */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] opacity-[0.03] pointer-events-none z-0" 
          style={{ background: "radial-gradient(ellipse at top, var(--ds-primary) 0%, transparent 70%)" }} 
        />
      </div>
    </div>
  );
}
