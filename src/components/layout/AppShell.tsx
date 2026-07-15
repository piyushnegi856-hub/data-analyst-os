"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/onboarding";

  if (isOnboarding) {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Sidebar (Desktop only) */}
      <div className="hidden md:flex flex-shrink-0 z-50 h-full">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden relative w-full">
        {/* Mobile Header (No hamburger, just search/profile) */}
        <div className="md:hidden flex items-center h-[52px] px-4 z-30 flex-shrink-0" style={{
          background: "rgba(9,11,14,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}>
          <Topbar isMobile={true} />
        </div>

        {/* Desktop Topbar */}
        <div className="hidden md:block z-30">
          <Topbar isMobile={false} />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative z-10 pb-20 md:pb-0">
          <div className="h-full px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8 max-w-[1440px] mx-auto animate-fade-in">
            {children}
          </div>
        </main>

        {/* Ambient background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
          <div
            className="orb orb-blue"
            style={{ width: "400px", height: "400px", top: "-120px", right: "-80px" }}
          />
          <div
            className="orb orb-purple"
            style={{ width: "320px", height: "320px", bottom: "40px", left: "-60px", animationDelay: "-2.5s" }}
          />
          <div
            className="orb orb-cyan"
            style={{ width: "240px", height: "240px", top: "45%", right: "20%", animationDelay: "-5s" }}
          />
        </div>

        {/* Top gradient glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px z-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, var(--accent-border), transparent)" }}
        />
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
