"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { setCookie } from "@/lib/cookies";

export default function OnboardingPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [name, setName] = useState("");
  const [focus, setFocus] = useState("SQL");

  const startSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsPending(true);
    
    // Set cookies
    setCookie("sprint_started", "true");
    setCookie("user_name", name.trim());
    setCookie("sprint_focus", focus);
    setCookie("sprint_start_date", new Date().toISOString());
    
    setTimeout(() => {
      router.push("/");
      // Force reload to let Layout pick up the cookies
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--ds-bg)" }}>
      <div className="max-w-md w-full glass-card p-8 rounded-2xl flex flex-col items-center">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-6"
          style={{ 
            background: "linear-gradient(135deg, #4f6ef7 0%, #7c3aed 100%)",
            boxShadow: "0 0 30px rgba(79,110,247,0.4)" 
          }}
        >
          <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
             <path d="M4 13V8M9 13V4M14 13V10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: "var(--ds-text)" }}>Welcome to DA Sprint OS</h1>
        <p className="text-sm mb-6 text-center" style={{ color: "var(--ds-text-muted)" }}>
          Your 30-day accelerated path. Customise your name and focus below to begin.
        </p>

        <form onSubmit={startSprint} className="w-full space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ds-text-muted)" }}>
              Your Name
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name" 
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)", color: "var(--ds-text)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ds-text-muted)" }}>
              Starting Focus / Track
            </label>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)", color: "var(--ds-text)" }}
            >
              <option value="SQL">SQL Foundations (Recommended)</option>
              <option value="Python">Python & Pandas</option>
              <option value="Excel">Advanced Excel</option>
              <option value="Tableau">Data Visualisation (Tableau)</option>
              <option value="Stats">Statistics & A/B Testing</option>
            </select>
          </div>

          <LoadingButton 
            isPending={isPending} 
            type="submit"
            optimisticLabel="Preparing workspace..."
            className="w-full justify-center py-3 text-base mt-2"
          >
            Start 30-Day Sprint
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}
