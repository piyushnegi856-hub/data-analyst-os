"use client";
import { useState, useEffect } from "react";
import { Briefcase, BookOpen, Users, Link as LinkIcon, Trash2, RotateCcw } from "lucide-react";
import { LoadingButton } from "@/components/ui/LoadingButton";

interface WorkEntry {
  id: number;
  category: string;
  text: string;
  date: string;
  color: string;
}

const CAT_COLORS: Record<string, string> = {
  Application: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Learning: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Networking: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  LinkedIn: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  Other: "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

const DEFAULT_LOGS: WorkEntry[] = [
  { id: 1, category: "Application", text: "Applied to 3 Data Analyst roles on LinkedIn (Flipkart, Myntra, Swiggy)", date: "Today at 10:30 AM", color: CAT_COLORS["Application"] },
  { id: 2, category: "Learning", text: "Completed Kaggle Pandas micro-course", date: "Yesterday at 4:15 PM", color: CAT_COLORS["Learning"] },
  { id: 3, category: "Networking", text: "Sent cold messages to 5 Sr. Data Analysts asking for coffee chats", date: "Yesterday at 2:00 PM", color: CAT_COLORS["Networking"] },
  { id: 4, category: "LinkedIn", text: "Posted about my latest SQL project analyzing Superstore sales", date: "Oct 12 at 9:00 AM", color: CAT_COLORS["LinkedIn"] },
];

function formatNow() {
  return new Date().toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function WorkLogPage() {
  const [logs, setLogs] = useState<WorkEntry[]>([]);
  const [inputText, setInputText] = useState("");
  const [category, setCategory] = useState("Learning");
  const [isPending, setIsPending] = useState(false);
  const [undoStack, setUndoStack] = useState<WorkEntry[][]>([]);
  const [toast, setToast] = useState("");

  const persist = (next: WorkEntry[]) => {
    setLogs(next);
    localStorage.setItem("sprint_work_logs", JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    const raw = localStorage.getItem("sprint_work_logs");
    if (raw) {
      try { setLogs(JSON.parse(raw)); return; } catch (e) {}
    }
    persist(DEFAULT_LOGS);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleAdd = () => {
    if (!inputText.trim()) return;
    setIsPending(true);
    setTimeout(() => {
      const newEntry: WorkEntry = {
        id: Date.now(),
        category,
        text: inputText.trim(),
        date: formatNow(),
        color: CAT_COLORS[category] || CAT_COLORS["Other"],
      };
      setUndoStack((s) => [...s, logs]);
      persist([newEntry, ...logs]);
      setInputText("");
      setIsPending(false);
      showToast("✅ Entry added!");
    }, 500);
  };

  const handleDelete = (id: number) => {
    setUndoStack((s) => [...s, logs]);
    persist(logs.filter((l) => l.id !== id));
    showToast("🗑 Entry removed. Undo?");
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    persist(prev);
    showToast("↩ Undone!");
  };

  const getIcon = (cat: string) => {
    switch (cat) {
      case "Application": return Briefcase;
      case "Learning": return BookOpen;
      case "Networking": return Users;
      default: return LinkIcon;
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-slide-up">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg animate-fade-in"
          style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border-strong)", color: "var(--ds-text)" }}
        >
          {toast}
        </div>
      )}

      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Work Log</h1>
          <p className="text-sm mt-1" style={{ color: "var(--ds-text-muted)" }}>
            Track your daily actions: learning, applications, and networking.
          </p>
        </div>
        {undoStack.length > 0 && (
          <button
            onClick={handleUndo}
            className="btn-ghost flex items-center gap-2 text-xs py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Undo
          </button>
        )}
      </div>

      <div className="rounded-xl overflow-hidden glass-card">
        {/* Quick Add Row */}
        <div
          className="p-4 border-b flex gap-3 flex-wrap"
          style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border)" }}
        >
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ds-primary)]"
            style={{ background: "var(--ds-surface-3)", border: "1px solid var(--ds-border-strong)", color: "var(--ds-text)" }}
          >
            <option value="Application">💼 Application</option>
            <option value="Learning">📚 Learning</option>
            <option value="Networking">🤝 Networking</option>
            <option value="LinkedIn">✍️ LinkedIn</option>
            <option value="Other">📝 Other</option>
          </select>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="What did you do today?"
            className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ds-primary)]"
            style={{ background: "var(--ds-surface-3)", border: "1px solid var(--ds-border-strong)", color: "var(--ds-text)" }}
          />
          <LoadingButton isPending={isPending} onClick={handleAdd}>
            Add
          </LoadingButton>
        </div>

        {/* Stats Bar */}
        <div
          className="flex items-center gap-6 px-5 py-3 border-b text-xs"
          style={{ borderColor: "var(--ds-border)", background: "var(--ds-surface)", color: "var(--ds-text-muted)" }}
        >
          <span>{logs.length} entries</span>
          <span style={{ color: "var(--ds-border-strong)" }}>|</span>
          <span>{logs.filter((l) => l.category === "Application").length} applications</span>
          <span style={{ color: "var(--ds-border-strong)" }}>|</span>
          <span>{logs.filter((l) => l.category === "Learning").length} learning sessions</span>
        </div>

        {/* Feed */}
        <div className="divide-y" style={{ borderColor: "var(--ds-border)" }}>
          {logs.length === 0 && (
            <div className="p-10 text-center" style={{ color: "var(--ds-text-muted)" }}>
              No entries yet. Add your first activity above!
            </div>
          )}
          {logs.map((log) => {
            const Icon = getIcon(log.category);
            return (
              <div
                key={log.id}
                className="p-5 flex gap-4 transition-colors group hover:bg-[var(--ds-surface-2)] animate-fade-in"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${log.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-medium" style={{ color: "var(--ds-text)" }}>{log.text}</p>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1 rounded hover:bg-red-500/10"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: "var(--ds-text-muted)" }}
                    >
                      {log.category}
                    </span>
                    <span className="text-xs" style={{ color: "var(--ds-text-dim)" }}>
                      • {log.date}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
