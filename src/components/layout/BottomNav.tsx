"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Briefcase, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Roadmap",   href: "/roadmap", icon: CheckSquare },
  { name: "Jobs",      href: "/jobs", icon: Briefcase },
  { name: "Calendar",  href: "/calendar", icon: Calendar },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between"
      style={{
        background: "rgba(9, 11, 14, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border-strong)",
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center gap-1 p-2 transition-all duration-200"
          >
            <div
              className={cn(
                "relative flex items-center justify-center w-10 h-8 rounded-full transition-all duration-300",
                isActive ? "bg-[var(--accent-subtle)]" : "bg-transparent"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                )} 
              />
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse-glow" />
              )}
            </div>
            <span 
              className={cn(
                "text-[10px] font-medium transition-colors duration-300",
                isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
              )}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
