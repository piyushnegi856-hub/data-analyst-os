"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Menu, X } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/onboarding";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isOnboarding) {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar with mobile transform */}
      <div 
        className={`fixed md:relative z-50 h-full transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar onClose={() => setMobileMenuOpen(false)} />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden relative w-full">
        {/* Mobile Header with Hamburger */}
        <div className="md:hidden flex items-center h-[52px] px-4 z-30 flex-shrink-0" style={{
          background: "rgba(9,11,14,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-md text-white/70 hover:bg-white/10 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Topbar isMobile={true} />
        </div>

        {/* Desktop Topbar */}
        <div className="hidden md:block z-30">
          <Topbar isMobile={false} />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="h-full px-4 md:px-8 py-4 md:py-7 max-w-[1440px] mx-auto animate-fade-in">
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
