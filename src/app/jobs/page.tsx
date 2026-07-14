"use client";
import { useState, useEffect } from "react";
import { Plus, MoreHorizontal } from "lucide-react";

export default function JobTrackerPage() {
  const columns = [
    { id: "wishlist", title: "Wishlist", color: "border-slate-500/30" },
    { id: "applied", title: "Applied", color: "border-blue-500/30" },
    { id: "interviewing", title: "Interviewing", color: "border-purple-500/30" },
    { id: "offers", title: "Offers", color: "border-emerald-500/30" }
  ];

  const [jobs, setJobs] = useState<Array<{ id: number, company: string, role: string, column: string, date: string }>>([]);

  const defaultJobs = [
    { id: 1, company: "Flipkart", role: "Data Analyst", column: "applied", date: "Applied Oct 12" },
    { id: 2, company: "Swiggy", role: "Product Analyst", column: "applied", date: "Applied Oct 11" },
    { id: 3, company: "Myntra", role: "Sr. Data Analyst", column: "applied", date: "Applied Oct 10" },
    { id: 4, company: "Zomato", role: "Business Analyst", column: "interviewing", date: "R1 on Oct 15" },
    { id: 5, company: "Amazon", role: "Data Analyst", column: "wishlist", date: "Need referral" },
    { id: 6, company: "Meesho", role: "Data Analyst", column: "wishlist", date: "Researching" },
  ];

  const loadJobs = () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("sprint_jobs");
      if (raw) {
        try {
          setJobs(JSON.parse(raw));
          return;
        } catch (e) {}
      }
      localStorage.setItem("sprint_jobs", JSON.stringify(defaultJobs));
      setJobs(defaultJobs);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const addMockJob = () => {
    const newJob = { 
      id: Date.now(), 
      company: "Google", 
      role: "Product Analyst", 
      column: "wishlist", 
      date: "Just now" 
    };
    const nextList = [...jobs, newJob];
    setJobs(nextList);
    localStorage.setItem("sprint_jobs", JSON.stringify(nextList));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="h-full flex flex-col pb-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white animate-fade-in">Job Tracker</h1>
          <p className="text-sm mt-1" style={{ color: "var(--ds-text-muted)" }}>Manage your applications and interview pipeline.</p>
        </div>
        <button onClick={addMockJob} className="btn-primary flex items-center gap-2 text-xs">
          <Plus className="w-4 h-4" /> Add Mock Application
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {columns.map(col => (
          <div key={col.id} className="flex-shrink-0 w-80 flex flex-col rounded-xl max-h-full glass-card overflow-hidden">
            <div className={`p-4 border-b-2 ${col.color}`} style={{ background: "var(--ds-surface-2)" }}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">{col.title}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--ds-surface-3)", color: "var(--ds-text-muted)" }}>
                  {jobs.filter(j => j.column === col.id).length}
                </span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {jobs.filter(j => j.column === col.id).map(job => (
                <div key={job.id} className="p-4 rounded-lg cursor-pointer transition-all group hover:border-[#4f6ef7]/30" style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-sm text-white">{job.company}</h4>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--ds-text-muted)" }}>
                      <MoreHorizontal className="w-4 h-4 hover:text-[var(--ds-text)]" />
                    </button>
                  </div>
                  <p className="text-sm mb-4" style={{ color: "var(--ds-text-muted)" }}>{job.role}</p>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t animate-fade-in" style={{ borderColor: "var(--ds-border)" }}>
                    <span className="text-xs font-medium" style={{ color: "var(--ds-text-dim)" }}>{job.date}</span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--ds-surface-3)", color: "var(--ds-text)" }}>
                      <span className="text-[10px] font-bold">{job.company.charAt(0)}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {jobs.filter(j => j.column === col.id).length === 0 && (
                <div className="h-24 border-2 border-dashed rounded-lg flex items-center justify-center" style={{ borderColor: "var(--ds-border-strong)" }}>
                  <span className="text-sm" style={{ color: "var(--ds-text-dim)" }}>No applications yet</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
