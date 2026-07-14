"use client";
import { useState, useEffect } from "react";
import {
  CheckCircle2, Circle, Clock, FileText, Upload, ChevronRight,
  PlayCircle, CheckSquare, BookOpen, Filter, Plus, X, Star,
  RotateCcw, ExternalLink, Trophy
} from "lucide-react";
import {
  CURRICULUM, loadAllDaysState, saveAllDaysState, SavedDayState, DayTopic
} from "@/lib/curriculumStore";

const TOPIC_META: Record<string, { color: string; bg: string }> = {
  Excel:    { color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  SQL:      { color: "#5b6cf9", bg: "rgba(91,108,249,0.1)" },
  Python:   { color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
  "Power BI": { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  Stats:    { color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
  Projects: { color: "#f97316", bg: "rgba(249,115,22,0.1)" },
  Career:   { color: "#ec4899", bg: "rgba(236,72,153,0.1)" },
};

export default function RoadmapPage() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [daysState, setDaysState] = useState<Record<number, SavedDayState>>({});
  const [evidenceSaved, setEvidenceSaved] = useState(false);
  const [filterTopic, setFilterTopic] = useState<string>("All");
  const [newTaskText, setNewTaskText] = useState("");
  const [undoStack, setUndoStack] = useState<Record<number, SavedDayState>[]>([]);

  useEffect(() => {
    setDaysState(loadAllDaysState());
  }, []);

  const pushUndo = (state: Record<number, SavedDayState>) =>
    setUndoStack((s) => [...s.slice(-9), JSON.parse(JSON.stringify(state))]);

  const handleToggleTask = (dayNum: number, taskIndex: number) => {
    pushUndo(daysState);
    const nextState = { ...daysState };
    const day = nextState[dayNum];
    if (!day) return;
    day.tasks[taskIndex] = !day.tasks[taskIndex];
    day.complete = day.tasks.every((t) => t) && day.customTasks.every((t) => t.done);
    setDaysState(nextState);
    saveAllDaysState(nextState);
    window.dispatchEvent(new Event("storage"));
  };

  const handleToggleCustomTask = (dayNum: number, idx: number) => {
    pushUndo(daysState);
    const nextState = { ...daysState };
    const day = nextState[dayNum];
    if (!day) return;
    day.customTasks[idx].done = !day.customTasks[idx].done;
    day.complete = day.tasks.every((t) => t) && day.customTasks.every((t) => t.done);
    setDaysState(nextState);
    saveAllDaysState(nextState);
    window.dispatchEvent(new Event("storage"));
  };

  const handleAddCustomTask = (dayNum: number) => {
    if (!newTaskText.trim()) return;
    pushUndo(daysState);
    const nextState = { ...daysState };
    const day = nextState[dayNum];
    if (!day) return;
    day.customTasks.push({ text: newTaskText.trim(), done: false });
    setDaysState(nextState);
    saveAllDaysState(nextState);
    setNewTaskText("");
  };

  const handleRemoveCustomTask = (dayNum: number, idx: number) => {
    pushUndo(daysState);
    const nextState = { ...daysState };
    const day = nextState[dayNum];
    if (!day) return;
    day.customTasks.splice(idx, 1);
    setDaysState(nextState);
    saveAllDaysState(nextState);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    setDaysState(prev);
    saveAllDaysState(prev);
    window.dispatchEvent(new Event("storage"));
  };

  const handleUpdateNotes = (dayNum: number, notes: string) => {
    const nextState = { ...daysState };
    const day = nextState[dayNum];
    if (day) { day.notes = notes; setDaysState(nextState); saveAllDaysState(nextState); }
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

  const handleMarkComplete = () => {
    pushUndo(daysState);
    const nextState = { ...daysState };
    const day = nextState[selectedDay];
    if (day) {
      day.tasks = day.tasks.map(() => true);
      day.complete = true;
      setDaysState(nextState);
      saveAllDaysState(nextState);
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleResetDay = () => {
    pushUndo(daysState);
    const nextState = { ...daysState };
    const dayData = CURRICULUM.find((d) => d.d === selectedDay);
    if (dayData) {
      nextState[selectedDay] = {
        tasks: dayData.tasks.map(() => false),
        customTasks: [],
        hours: 0,
        notes: "",
        complete: false,
      };
      setDaysState(nextState);
      saveAllDaysState(nextState);
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleMockUpload = () => {
    setEvidenceSaved(true);
    const dayData = CURRICULUM.find((d) => d.d === selectedDay);
    const rawEvidence = localStorage.getItem("sprint_evidence_vault") || "[]";
    try {
      const vault = JSON.parse(rawEvidence);
      vault.unshift({ id: Date.now(), type: "image", name: `${dayData?.t.replace(/\s+/g, "_")}_evidence.png`, tag: `Day ${selectedDay}`, date: "Just now" });
      localStorage.setItem("sprint_evidence_vault", JSON.stringify(vault));
    } catch (e) {}
    setTimeout(() => setEvidenceSaved(false), 2000);
  };

  const topics = ["All", "Excel", "SQL", "Python", "Power BI", "Stats", "Projects", "Career"];
  const filteredDays = filterTopic === "All" ? CURRICULUM : CURRICULUM.filter((d) => d.topic === filterTopic);

  useEffect(() => {
    if (filteredDays.length > 0 && !filteredDays.some((d) => d.d === selectedDay)) {
      setSelectedDay(filteredDays[0].d);
    }
  }, [filterTopic]);

  const currentDayData = CURRICULUM.find((d) => d.d === selectedDay);
  const currentDayState = daysState[selectedDay] || { tasks: [], customTasks: [], hours: 0, notes: "", complete: false };
  const meta = TOPIC_META[currentDayData?.topic || "SQL"] || TOPIC_META["SQL"];

  // Progress for this day
  const totalTasks = (currentDayState.tasks?.length || 0) + (currentDayState.customTasks?.length || 0);
  const doneTasks = (currentDayState.tasks?.filter(Boolean).length || 0) + (currentDayState.customTasks?.filter((t) => t.done).length || 0);
  const dayPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-5 animate-slide-up">
      {/* LEFT: Curriculum List */}
      <div
        className="w-72 flex-shrink-0 flex flex-col overflow-hidden rounded-xl"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div className="p-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>30-Day Curriculum</h2>
            <BookOpen className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          {/* Topic chips */}
          <div className="flex flex-wrap gap-1.5">
            {topics.map((topic) => {
              const tm = TOPIC_META[topic];
              const active = filterTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => setFilterTopic(topic)}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all"
                  style={{
                    background: active ? (tm?.bg || "var(--accent-subtle)") : "var(--surface-3)",
                    color: active ? (tm?.color || "var(--accent)") : "var(--text-muted)",
                    border: `1px solid ${active ? (tm?.color || "var(--accent)") + "40" : "var(--border)"}`,
                  }}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filteredDays.map((d) => {
            const state = daysState[d.d];
            const isComplete = state?.complete;
            const tasksDone = state?.tasks.filter(Boolean).length || 0;
            const tasksTotal = d.tasks.length;
            const isActive = selectedDay === d.d;
            const tm = TOPIC_META[d.topic] || TOPIC_META["SQL"];
            return (
              <button
                key={d.d}
                onClick={() => setSelectedDay(d.d)}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group"
                style={{
                  background: isActive ? "var(--accent-subtle)" : "transparent",
                  border: `1px solid ${isActive ? "var(--accent-border)" : "transparent"}`,
                }}
              >
                {/* Complete indicator */}
                <div className="flex-shrink-0">
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4" style={{ color: "var(--success)" }} />
                  ) : (
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold"
                      style={{ borderColor: isActive ? "var(--accent)" : "var(--border-strong)", color: isActive ? "var(--accent)" : "var(--text-muted)" }}
                    >
                      {d.d}
                    </div>
                  )}
                </div>
                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: isActive ? "var(--accent)" : "var(--text-secondary)" }}>
                    {d.t}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px]" style={{ color: tm.color }}>{d.topic}</span>
                    {tasksTotal > 0 && (
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{tasksDone}/{tasksTotal}</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" style={{ color: "var(--accent)" }} />
              </button>
            );
          })}
          {filteredDays.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon"><Filter className="w-5 h-5" style={{ color: "var(--text-muted)" }} /></div>
              <p className="text-xs">No days for this track.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Day Detail */}
      {currentDayData ? (
        <div
          className="flex-1 flex flex-col overflow-hidden rounded-xl"
          style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
        >
          {/* Day Header */}
          <div className="flex-shrink-0 p-5" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    {currentDayData.topic}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Day {selectedDay} of 30</span>
                  {currentDayState.complete && (
                    <span className="badge badge-success">
                      <Trophy className="w-2.5 h-2.5" /> Completed
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{currentDayData.t}</h1>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {undoStack.length > 0 && (
                  <button onClick={handleUndo} className="btn-ghost py-1.5 px-2.5 text-xs flex items-center gap-1.5">
                    <RotateCcw className="w-3 h-3" /> Undo
                  </button>
                )}
                <button onClick={handleResetDay} className="btn-ghost py-1.5 px-2.5 text-xs flex items-center gap-1.5">
                  <X className="w-3 h-3" /> Reset
                </button>
                <button
                  onClick={handleMarkComplete}
                  disabled={currentDayState.complete}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {currentDayState.complete ? "Done ✓" : "Mark Complete"}
                </button>
              </div>
            </div>

            {/* Day Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Day progress</span>
                <span className="text-xs font-bold" style={{ color: meta.color }}>{dayPct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${dayPct}%`, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}bb)` }} />
              </div>
            </div>
          </div>

          {/* Day Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Predefined Tasks */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <CheckSquare className="w-4 h-4" style={{ color: meta.color }} />
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Tasks</h3>
                <span className="badge" style={{ background: meta.bg, color: meta.color, border: "none" }}>
                  {currentDayState.tasks?.filter(Boolean).length || 0}/{currentDayData.tasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {currentDayData.tasks.map((task, i) => {
                  const checked = currentDayState.tasks?.[i] || false;
                  return (
                    <label
                      key={i}
                      className="flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-150 group"
                      style={{
                        background: checked ? `${meta.color}08` : "var(--surface-2)",
                        border: `1px solid ${checked ? meta.color + "20" : "var(--border)"}`,
                      }}
                    >
                      <div
                        className="check-box mt-0.5"
                        style={{
                          background: checked ? meta.color : "transparent",
                          borderColor: checked ? meta.color : "var(--border-strong)",
                        }}
                        onClick={() => handleToggleTask(selectedDay, i)}
                      >
                        {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </div>
                      <span
                        className="text-sm font-medium leading-relaxed"
                        style={{
                          color: checked ? "var(--text-muted)" : "var(--text-primary)",
                          textDecoration: checked ? "line-through" : "none",
                        }}
                      >
                        {task}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Custom tasks */}
              {currentDayState.customTasks?.map((ct, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-xl mt-2 group"
                  style={{
                    background: ct.done ? `${meta.color}08` : "var(--surface-2)",
                    border: `1px solid ${ct.done ? meta.color + "20" : "var(--border)"}`,
                  }}
                >
                  <div
                    className="check-box mt-0.5 cursor-pointer"
                    style={{
                      background: ct.done ? meta.color : "transparent",
                      borderColor: ct.done ? meta.color : "var(--border-strong)",
                    }}
                    onClick={() => handleToggleCustomTask(selectedDay, i)}
                  >
                    {ct.done && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <span
                    className="flex-1 text-sm font-medium"
                    style={{ color: ct.done ? "var(--text-muted)" : "var(--text-primary)", textDecoration: ct.done ? "line-through" : "none" }}
                  >
                    {ct.text}
                  </span>
                  <button onClick={() => handleRemoveCustomTask(selectedDay, i)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              ))}

              {/* Add custom task */}
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCustomTask(selectedDay)}
                  placeholder="Add custom task..."
                  className="input flex-1 text-xs py-2"
                />
                <button onClick={() => handleAddCustomTask(selectedDay)} className="btn-ghost py-2 px-3 text-xs">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            {/* Resources */}
            {currentDayData.res?.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <PlayCircle className="w-4 h-4" style={{ color: meta.color }} />
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Learning Resources</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentDayData.res.map(([name, url], i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:-translate-y-0.5"
                      style={{
                        background: meta.bg,
                        color: meta.color,
                        border: `1px solid ${meta.color}25`,
                      }}
                    >
                      <ExternalLink className="w-3 h-3" /> {name}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Study time + evidence */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" style={{ color: meta.color }} />
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Study Time</h3>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={currentDayState.hours || ""}
                    onChange={(e) => handleUpdateHours(selectedDay, e.target.value)}
                    placeholder="0.0"
                    className="input text-sm py-2.5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--text-muted)" }}>hours</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-4 h-4" style={{ color: meta.color }} />
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Evidence Screenshot</h3>
                </div>
                <button
                  onClick={handleMockUpload}
                  className="w-full h-[42px] border-2 border-dashed rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-150"
                  style={{
                    borderColor: evidenceSaved ? "var(--success)" : "var(--border-strong)",
                    color: evidenceSaved ? "var(--success)" : "var(--text-muted)",
                    background: evidenceSaved ? "var(--success-subtle)" : "transparent",
                  }}
                >
                  <Upload className="w-3.5 h-3.5" />
                  {evidenceSaved ? "Saved to Vault ✓" : "Upload Screenshot"}
                </button>
              </div>
            </section>

            {/* Notes */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" style={{ color: meta.color }} />
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Study Notes</h3>
              </div>
              <textarea
                value={currentDayState.notes || ""}
                onChange={(e) => handleUpdateNotes(selectedDay, e.target.value)}
                placeholder="What did you learn? Key formulas, concepts, or syntax you practiced..."
                className="input text-sm resize-y min-h-[100px] py-3 leading-relaxed"
              />
            </section>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center rounded-xl" style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}>
          <div className="empty-state">
            <div className="empty-state-icon">
              <CheckSquare className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Select a day to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
