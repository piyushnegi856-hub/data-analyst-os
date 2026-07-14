"use client";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, CheckCircle2, X } from "lucide-react";
import { loadAllDaysState, saveAllDaysState, loadUserProfile } from "@/lib/curriculumStore";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export function PomodoroTimer() {
  const [mode, setMode] = useState<"work" | "break">("work");
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [showLogPrompt, setShowLogPrompt] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleComplete = () => {
    setIsRunning(false);
    if (mode === "work") {
      new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3").play().catch(() => {});
      setShowLogPrompt(true);
    } else {
      new Audio("https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3").play().catch(() => {});
      setMode("work");
      setTimeLeft(WORK_TIME);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "work" ? WORK_TIME : BREAK_TIME);
  };

  const logSession = () => {
    const state = loadAllDaysState();
    
    // Auto-add 0.42 hours (25 mins) to the current active sprint day
    // Find first day that isn't complete, or just day 1
    let targetDayId = Object.keys(state).find(
      (k) => !state[parseInt(k)]?.complete
    ) || "1";

    const dState = state[parseInt(targetDayId)];
    if (dState) {
      dState.hours = (dState.hours || 0) + 0.42;
      // Optionally append a note
      if (!dState.notes.includes("Pomodoro Focus Session")) {
        dState.notes = dState.notes 
          ? dState.notes + "\n- Pomodoro Focus Session" 
          : "- Pomodoro Focus Session";
      }
    }

    saveAllDaysState(state);
    window.dispatchEvent(new Event("storage"));
    setShowLogPrompt(false);
    setMode("break");
    setTimeLeft(BREAK_TIME);
  };

  const skipLog = () => {
    setShowLogPrompt(false);
    setMode("break");
    setTimeLeft(BREAK_TIME);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const pct = mode === "work"
    ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: mode === "work" ? "var(--accent)" : "var(--success)" }} />
          <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Focus Timer</h3>
        </div>
        <div className="flex gap-1 bg-black/20 rounded-md p-0.5">
          <button
            onClick={() => { setMode("work"); setTimeLeft(WORK_TIME); setIsRunning(false); }}
            className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${mode === "work" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
          >
            Work
          </button>
          <button
            onClick={() => { setMode("break"); setTimeLeft(BREAK_TIME); setIsRunning(false); }}
            className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${mode === "break" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
          >
            Break
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 py-4">
        <div className="text-4xl font-bold font-mono tracking-tighter tabular-nums mb-4" style={{ color: "var(--text-primary)" }}>
          {formatTime(timeLeft)}
        </div>
        
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-6" style={{ background: "var(--surface-3)" }}>
          <div 
            className="h-full transition-all duration-1000 ease-linear" 
            style={{ width: `${pct}%`, background: mode === "work" ? "var(--accent)" : "var(--success)" }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTimer}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ background: isRunning ? "var(--surface-3)" : "var(--accent)", color: "white" }}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>
          <button
            onClick={resetTimer}
            className="btn-icon w-10 h-10 rounded-full"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showLogPrompt && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm rounded-xl animate-fade-in">
          <div className="bg-[#111318] border border-[#2a2d36] rounded-xl p-4 text-center shadow-2xl max-w-sm w-full">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <h4 className="font-bold mb-1">Session Complete!</h4>
            <p className="text-xs text-white/60 mb-4">You just focused for 25 minutes. Log this time to your sprint?</p>
            <div className="flex gap-2">
              <button onClick={skipLog} className="btn-ghost flex-1 text-xs">Skip</button>
              <button onClick={logSession} className="btn-primary flex-1 text-xs justify-center bg-emerald-600 hover:bg-emerald-500 border-none">Log 25 mins</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
