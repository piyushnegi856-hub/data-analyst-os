"use client";
import { useState, useEffect } from "react";
import {
  Plus, X, Trash2, ExternalLink, ChevronDown, Building2,
  Briefcase, Clock, Search, AlertCircle, CheckCircle2
} from "lucide-react";

interface Job {
  id: number;
  company: string;
  role: string;
  column: string;
  date: string;
  salary?: string;
  link?: string;
}

const COLUMNS = [
  { id: "wishlist",     label: "Wishlist",      color: "var(--text-muted)",  bg: "var(--surface-3)", accent: "#6b7280" },
  { id: "applied",      label: "Applied",        color: "var(--accent)",      bg: "var(--accent-subtle)", accent: "#5b6cf9" },
  { id: "interviewing", label: "Interviewing",   color: "var(--purple)",      bg: "var(--purple-subtle)", accent: "#a855f7" },
  { id: "offers",       label: "Offers",         color: "var(--success)",     bg: "var(--success-subtle)", accent: "#10b981" },
];

const DEFAULT_JOBS: Job[] = [
  { id: 1, company: "Flipkart",  role: "Data Analyst",         column: "applied",      date: "Oct 12",  salary: "12-18L" },
  { id: 2, company: "Swiggy",    role: "Product Analyst",      column: "applied",      date: "Oct 11",  salary: "10-15L" },
  { id: 3, company: "Myntra",    role: "Sr. Data Analyst",     column: "applied",      date: "Oct 10" },
  { id: 4, company: "Zomato",    role: "Business Analyst",     column: "interviewing", date: "R1: Oct 15" },
  { id: 5, company: "Amazon",    role: "Data Analyst",         column: "wishlist",     date: "Need referral" },
  { id: 6, company: "Meesho",    role: "Data Analyst",         column: "wishlist",     date: "Researching" },
];

export default function JobTrackerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [form, setForm] = useState({ company: "", role: "", column: "wishlist", salary: "", link: "" });

  useEffect(() => {
    const raw = localStorage.getItem("sprint_jobs");
    if (raw) { try { setJobs(JSON.parse(raw)); return; } catch (e) {} }
    setJobs(DEFAULT_JOBS);
    localStorage.setItem("sprint_jobs", JSON.stringify(DEFAULT_JOBS));
  }, []);

  const persist = (next: Job[]) => {
    setJobs(next);
    localStorage.setItem("sprint_jobs", JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
  };

  const addJob = () => {
    if (!form.company.trim() || !form.role.trim()) return;
    const newJob: Job = {
      id: Date.now(),
      company: form.company.trim(),
      role: form.role.trim(),
      column: form.column,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      salary: form.salary || undefined,
      link: form.link || undefined,
    };
    persist([...jobs, newJob]);
    setForm({ company: "", role: "", column: "wishlist", salary: "", link: "" });
    setShowAdd(false);
  };

  const deleteJob = (id: number) => persist(jobs.filter((j) => j.id !== id));

  const moveJob = (id: number, colId: string) => {
    persist(jobs.map((j) => j.id === id ? { ...j, column: colId } : j));
  };

  const filtered = searchQ
    ? jobs.filter((j) => j.company.toLowerCase().includes(searchQ.toLowerCase()) || j.role.toLowerCase().includes(searchQ.toLowerCase()))
    : jobs;

  const totalApplied = jobs.filter((j) => ["applied", "interviewing", "offers"].includes(j.column)).length;

  return (
    <div className="h-full flex flex-col pb-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Job Tracker</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {totalApplied} applications in pipeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Filter jobs..."
              className="input text-xs pl-8 py-2 w-44"
            />
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 text-xs">
            <Plus className="w-4 h-4" /> Add Application
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in"
            style={{ background: "var(--surface-1)", border: "1px solid var(--border-strong)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>Add Application</h3>
              <button onClick={() => setShowAdd(false)} className="btn-icon"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {[
                { key: "company", label: "Company Name", placeholder: "e.g. Google, Amazon…", icon: Building2 },
                { key: "role",    label: "Role",          placeholder: "e.g. Data Analyst",   icon: Briefcase },
                { key: "salary",  label: "CTC Range",     placeholder: "e.g. 12-18 LPA",      icon: Clock },
                { key: "link",    label: "Job Link",      placeholder: "https://…",           icon: ExternalLink },
              ].map(({ key, label, placeholder, icon: Icon }) => (
                <div key={key}>
                  <label className="section-label block mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                    <input
                      type={key === "link" ? "url" : "text"}
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && addJob()}
                      placeholder={placeholder}
                      className="input text-sm pl-9"
                    />
                  </div>
                </div>
              ))}
              <div>
                <label className="section-label block mb-1.5">Stage</label>
                <select
                  value={form.column}
                  onChange={(e) => setForm({ ...form, column: e.target.value })}
                  className="input text-sm"
                  style={{ colorScheme: "dark" }}
                >
                  {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAdd(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={addJob} className="btn-primary flex-1 justify-center">Add Application</button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {COLUMNS.map((col) => {
          const colJobs = filtered.filter((j) => j.column === col.id);
          return (
            <div
              key={col.id}
              className="flex-shrink-0 flex flex-col rounded-xl overflow-hidden snap-start"
              style={{
                width: "280px",
                minWidth: "280px",
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Column header */}
              <div
                className="px-4 py-3 flex-shrink-0 flex items-center justify-between"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: col.accent }} />
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{col.label}</h3>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: col.bg, color: col.color }}
                >
                  {colJobs.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colJobs.map((job) => (
                  <div
                    key={job.id}
                    className="kanban-card p-4 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: `${col.accent}30`, color: col.accent }}
                      >
                        {job.company.charAt(0)}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {job.link && (
                          <a href={job.link} target="_blank" rel="noopener noreferrer" className="btn-icon w-6 h-6">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button onClick={() => deleteJob(job.id)} className="btn-icon w-6 h-6">
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-sm mb-0.5" style={{ color: "var(--text-primary)" }}>{job.company}</h4>
                    <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{job.role}</p>

                    <div className="flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" , paddingTop: "10px" }}>
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{job.date}</span>
                      {job.salary && (
                        <span className="badge" style={{ background: col.bg, color: col.color, border: "none", fontSize: "9px" }}>
                          {job.salary}
                        </span>
                      )}
                    </div>

                    {/* Move controls */}
                    <select
                      value={job.column}
                      onChange={(e) => moveJob(job.id, e.target.value)}
                      className="mt-2 w-full text-[10px] px-2 py-1 rounded-md focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: "var(--surface-3)",
                        border: "1px solid var(--border)",
                        color: "var(--text-muted)",
                        colorScheme: "dark",
                      }}
                    >
                      {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                ))}

                {/* Empty state */}
                {colJobs.length === 0 && (
                  <div
                    className="h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2"
                    style={{ borderColor: "var(--border-strong)" }}
                  >
                    <AlertCircle className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>No jobs here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
