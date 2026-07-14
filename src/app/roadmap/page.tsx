"use client";
import { useState } from "react";
import { CheckCircle2, Circle, Clock, FileText, Upload, ChevronRight, PlayCircle, CheckSquare } from "lucide-react";

export default function RoadmapPage() {
  const [selectedDay, setSelectedDay] = useState(1);

  // Mock data for dual pane
  const curriculum = [
    {
      week: 1,
      title: "Foundations",
      days: [
        { id: 1, title: "Excel Basics I", complete: true },
        { id: 2, title: "Excel Basics II", complete: true },
        { id: 3, title: "Statistics Fundamentals", complete: true },
        { id: 4, title: "SQL Basics I", complete: false },
        { id: 5, title: "SQL Basics II", complete: false },
        { id: 6, title: "SQL Subqueries", complete: false },
        { id: 7, title: "Checkpoint", complete: false },
      ]
    },
    {
      week: 2,
      title: "SQL Deep Dive",
      days: [
        { id: 8, title: "Window Functions I", complete: false },
      ]
    }
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left Pane: List */}
      <div className="w-1/3 flex flex-col overflow-hidden glass-card rounded-xl">
        <div className="p-4 border-b" style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border)" }}>
          <h2 className="font-semibold" style={{ color: "var(--ds-text)" }}>Curriculum</h2>
          <p className="text-xs mt-1" style={{ color: "var(--ds-text-muted)" }}>Select a day to view tasks.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {curriculum.map((w) => (
            <div key={w.week}>
              <div className="text-xs font-bold uppercase tracking-wider mb-2 pl-2" style={{ color: "var(--ds-text-dim)" }}>
                Week {w.week} — {w.title}
              </div>
              <div className="space-y-1">
                {w.days.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDay(d.id)}
                    className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors border ${selectedDay === d.id ? 'bg-[var(--ds-surface-3)] border-[#4f6ef7]/30 text-white' : 'border-transparent text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-2)]'}`}
                  >
                    <div className="flex items-center gap-3">
                      {d.complete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4" style={{ color: "var(--ds-border-strong)" }} />
                      )}
                      <span className="font-medium truncate">Day {d.id}: {d.title}</span>
                    </div>
                    {selectedDay === d.id && <ChevronRight className="w-4 h-4 text-[#4f6ef7]" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane: Details */}
      <div className="flex-1 flex flex-col overflow-hidden relative glass-card rounded-xl">
        <div className="p-6 border-b" style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border)" }}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 text-[#4f6ef7]">
            Week 1 <ChevronRight className="w-3 h-3" /> Day {selectedDay}
          </div>
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold" style={{ color: "var(--ds-text)" }}>SQL Basics I</h1>
            <button className="btn-primary">
              Mark Day Complete
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Tasks */}
          <section>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ds-text)" }}>
              <CheckSquare className="w-4 h-4" style={{ color: "var(--ds-text-muted)" }} /> Tasks
            </h3>
            <div className="space-y-2">
              {[
                "SELECT / WHERE statements",
                "GROUP BY / HAVING",
                "10-15 practice queries on Mode"
              ].map((task, i) => (
                <label key={i} className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-[var(--ds-surface-2)]" style={{ borderColor: "var(--ds-border)" }}>
                  <input type="checkbox" className="mt-1 accent-[#4f6ef7] w-4 h-4" />
                  <span className="text-sm font-medium" style={{ color: "var(--ds-text-muted)" }}>{task}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ds-text)" }}>
              <PlayCircle className="w-4 h-4" style={{ color: "var(--ds-text-muted)" }} /> Learning Resources
            </h3>
            <div className="flex flex-wrap gap-2">
              <a href="#" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:bg-[var(--ds-surface-3)]" style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border)", color: "var(--ds-text-muted)" }}>
                <span className="text-rose-500 font-bold">▶</span> Mode SQL Tutorial
              </a>
            </div>
          </section>

          {/* Log Work & Evidence */}
          <section className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ds-text)" }}>
                <Clock className="w-4 h-4" style={{ color: "var(--ds-text-muted)" }} /> Log Time
              </h3>
              <input type="number" placeholder="Hours spent..." className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2" style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)", color: "var(--ds-text)" }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ds-text)" }}>
                <Upload className="w-4 h-4" style={{ color: "var(--ds-text-muted)" }} /> Evidence
              </h3>
              <button className="w-full h-[42px] border border-dashed rounded-lg text-sm flex items-center justify-center gap-2 transition-colors hover:bg-[var(--ds-surface-2)]" style={{ borderColor: "var(--ds-border-strong)", color: "var(--ds-text-dim)" }}>
                <Upload className="w-4 h-4" /> Upload Screenshot
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ds-text)" }}>
              <FileText className="w-4 h-4" style={{ color: "var(--ds-text-muted)" }} /> Notes
            </h3>
            <textarea 
              placeholder="What did you learn today? What was confusing?"
              className="w-full min-h-[120px] p-3 rounded-lg text-sm focus:outline-none focus:ring-2 resize-y"
              style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)", color: "var(--ds-text)" }}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
