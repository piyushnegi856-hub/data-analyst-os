"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

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
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Topbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="h-full px-8 py-7 max-w-[1440px] mx-auto animate-fade-in">
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
    </div>
  );
}
