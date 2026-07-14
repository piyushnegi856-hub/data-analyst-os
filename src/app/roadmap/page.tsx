"use client";
import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  Upload, 
  ChevronRight, 
  PlayCircle, 
  CheckSquare,
  BookOpen,
  Filter
} from "lucide-react";
import { 
  CURRICULUM, 
  loadAllDaysState, 
  saveAllDaysState, 
  SavedDayState,
  DayTopic
} from "@/lib/curriculumStore";

export default function RoadmapPage() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [daysState, setDaysState] = useState<Record<number, SavedDayState>>({});
  const [evidenceSaved, setEvidenceSaved] = useState(false);
  const [filterTopic, setFilterTopic] = useState<string>("All");

  useEffect(() => {
    setDaysState(loadAllDaysState());
  }, []);

  const handleToggleTask = (dayNum: number, taskIndex: number) => {
    const nextState = { ...daysState };
    const day = nextState[dayNum];
    if (day) {
      day.tasks[taskIndex] = !day.tasks[taskIndex];
      
      // Auto complete day if all tasks are complete
      const allPredefinedDone = day.tasks.every(t => t);
      const allCustomDone = day.customTasks.every(t => t.done);
      day.complete = allPredefinedDone && allCustomDone;

      setDaysState(nextState);
      saveAllDaysState(nextState);
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleUpdateNotes = (dayNum: number, notes: string) => {
    const nextState = { ...daysState };
    const day = nextState[dayNum];
    if (day) {
      day.notes = notes;
      setDaysState(nextState);
      saveAllDaysState(nextState);
    }
  };

  const handleUpdateHours = (dayNum: number, hours: string) => {
    const nextState = { ...daysState };
    const day = nextState[dayNum];
    if (day) {
      day.hours = Number(hours) || 0;
      setDaysState(nextState);
      saveAllDaysState(nextState);
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleMockUpload = () => {
    setEvidenceSaved(true);
    if (typeof window !== "undefined") {
      const dayData = CURRICULUM.find(d => d.d === selectedDay);
      const rawEvidence = localStorage.getItem("sprint_evidence_vault") || "[]";
      try {
        const vault = JSON.parse(rawEvidence);
        const newFile = {
          id: Date.now(),
          type: "image",
          name: `${dayData?.t.replace(/\s+/g, "_")}_evidence.png`,
          tag: `Day ${selectedDay}`,
          date: "Just now"
        };
        localStorage.setItem("sprint_evidence_vault", JSON.stringify([newFile, ...vault]));
      } catch (e) {}
    }
    setTimeout(() => {
      setEvidenceSaved(false);
    }, 1500);
  };

  const topics: Array<string> = ["All", "Excel", "SQL", "Python", "Power BI", "Stats", "Projects", "Career"];

  // Filter curriculum based on selection
  const filteredDays = filterTopic === "All" 
    ? CURRICULUM 
    : CURRICULUM.filter(d => d.topic === filterTopic);

  // If selected day is not in filtered list, jump to the first day of that filter
  useEffect(() => {
    if (filteredDays.length > 0 && !filteredDays.some(d => d.d === selectedDay)) {
      setSelectedDay(filteredDays[0].d);
    }
  }, [filterTopic, filteredDays, selectedDay]);

  const currentDayData = CURRICULUM.find(d => d.d === selectedDay);
  const currentDayState = daysState[selectedDay] || {
    tasks: [],
    customTasks: [],
    hours: 0,
    notes: "",
    complete: false
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left Pane: Curriculum List with Topic Filters */}
      <div className="w-1/3 flex flex-col overflow-hidden glass-card rounded-xl">
        <div className="p-4 border-b space-y-3" style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border)" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Curriculum</h2>
            <BookOpen className="w-4 h-4 text-[#4f6ef7]" />
          </div>
          
          {/* Topic filter bar */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--ds-text-muted)" }} />
            <select 
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="flex-1 px-2 py-1.5 rounded text-xs focus:outline-none focus:ring-1"
              style={{ background: "var(--ds-surface-3)", border: "1px solid var(--ds-border-strong)", color: "var(--ds-text)" }}
            >
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic} Track</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div className="space-y-1">
            {filteredDays.map(d => {
              const isDayComplete = daysState[d.d]?.complete;
              return (
                <button
                  key={d.d}
                  onClick={() => setSelectedDay(d.d)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors border ${selectedDay === d.d ? 'bg-[var(--ds-surface-3)] border-[#4f6ef7]/30 text-white' : 'border-transparent text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-2)]'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isDayComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--ds-border-strong)" }} />
                    )}
                    <span className="font-medium truncate">Day {d.d}: {d.t}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${selectedDay === d.d ? 'text-[#4f6ef7]' : 'text-transparent'}`} />
                </button>
              );
            })}
            {filteredDays.length === 0 && (
              <p className="text-xs text-center p-4" style={{ color: "var(--ds-text-muted)" }}>No days found for this track.</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Pane: Day Details */}
      {currentDayData ? (
        <div className="flex-1 flex flex-col overflow-hidden relative glass-card rounded-xl">
          <div className="p-6 border-b" style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border)" }}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 text-[#4f6ef7]">
              Track: {currentDayData.topic} <ChevronRight className="w-3 h-3" /> Day {selectedDay}
            </div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-white leading-tight">{currentDayData.t}</h1>
              <button 
                onClick={() => {
                  const nextState = { ...daysState };
                  const day = nextState[selectedDay];
                  if (day) {
                    day.tasks = day.tasks.map(() => true);
                    day.complete = true;
                    setDaysState(nextState);
                    saveAllDaysState(nextState);
                    window.dispatchEvent(new Event("storage"));
                  }
                }}
                className={`btn-primary flex-shrink-0 text-xs px-3 py-2 ${currentDayState.complete ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentDayState.complete}
              >
                {currentDayState.complete ? "Completed ✓" : "Mark Day Complete"}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Predefined Tasks */}
            <section>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ds-text)" }}>
                <CheckSquare className="w-4 h-4 text-[#4f6ef7]" /> Tasks
              </h3>
              <div className="space-y-2">
                {currentDayData.tasks.map((task, i) => {
                  const isChecked = currentDayState.tasks[i] || false;
                  return (
                    <label key={i} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isChecked ? 'bg-emerald-500/5 border-emerald-500/10' : 'hover:bg-[var(--ds-surface-2)] border-[var(--ds-border)]'}`}>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => handleToggleTask(selectedDay, i)}
                        className="mt-1 accent-[#4f6ef7] w-4 h-4 rounded" 
                      />
                      <span className="text-sm font-medium" style={{ color: isChecked ? "var(--ds-text)" : "var(--ds-text-muted)" }}>{task}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Learning Resources */}
            {currentDayData.res && currentDayData.res.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ds-text)" }}>
                  <PlayCircle className="w-4 h-4 text-[#4f6ef7]" /> Learning Resources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentDayData.res.map(([name, url], i) => (
                    <a 
                      key={i}
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:bg-[var(--ds-surface-3)]" 
                      style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border)", color: "var(--ds-text-muted)" }}
                    >
                      <span className="text-rose-500 font-bold">▶</span> {name}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Log Work & Evidence */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ds-text)" }}>
                  <Clock className="w-4 h-4 text-[#4f6ef7]" /> Study Time (Hours)
                </h3>
                <input 
                  type="number" 
                  min="0"
                  step="0.5"
                  value={currentDayState.hours || ""}
                  onChange={(e) => handleUpdateHours(selectedDay, e.target.value)}
                  placeholder="Hours spent studying..." 
                  className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2" 
                  style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)", color: "var(--ds-text)" }} 
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ds-text)" }}>
                  <Upload className="w-4 h-4 text-[#4f6ef7]" /> Evidence screenshot
                </h3>
                <button 
                  onClick={handleMockUpload}
                  className="w-full h-[42px] border border-dashed rounded-lg text-sm flex items-center justify-center gap-2 transition-colors hover:bg-[var(--ds-surface-2)]" 
                  style={{ borderColor: "var(--ds-border-strong)", color: "var(--ds-text-dim)" }}
                >
                  <Upload className="w-4 h-4" /> {evidenceSaved ? "Saved to Vault!" : "Upload Mock Screenshot"}
                </button>
              </div>
            </section>

            {/* Notes */}
            <section>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ds-text)" }}>
                <FileText className="w-4 h-4 text-[#4f6ef7]" /> Study Notes
              </h3>
              <textarea 
                value={currentDayState.notes || ""}
                onChange={(e) => handleUpdateNotes(selectedDay, e.target.value)}
                placeholder="What did you learn today? What formulas or syntax did you practice?"
                className="w-full min-h-[120px] p-3 rounded-lg text-sm focus:outline-none focus:ring-2 resize-y"
                style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)", color: "var(--ds-text)" }}
              />
            </section>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center glass-card rounded-xl">
          <p className="text-sm" style={{ color: "var(--ds-text-muted)" }}>Select a day to view details.</p>
        </div>
      )}
    </div>
  );
}
