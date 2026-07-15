"use client";
import { useState, useEffect, useRef } from "react";
import { Timer, Play, Pause, RotateCcw, Activity } from "lucide-react";

const PRESETS = [5, 10, 15, 30, 60];

export function Pedometer() {
  const [duration, setDuration] = useState(15 * 60); // Default 15 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isActive, setIsActive] = useState(false);
  const [totalWalkedToday, setTotalWalkedToday] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load daily stats
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const raw = localStorage.getItem("sprint_walk_timer");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.date === today) {
          setTotalWalkedToday(parsed.totalWalked || 0);
        } else {
          localStorage.setItem("sprint_walk_timer", JSON.stringify({ date: today, totalWalked: 0 }));
        }
      } catch (e) {}
    } else {
      localStorage.setItem("sprint_walk_timer", JSON.stringify({ date: today, totalWalked: 0 }));
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Add to daily total
      const newTotal = totalWalkedToday + Math.round(duration / 60);
      setTotalWalkedToday(newTotal);
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("sprint_walk_timer", JSON.stringify({ date: today, totalWalked: newTotal }));
      
      // Reset for next walk
      setTimeout(() => {
        setTimeLeft(duration);
      }, 3000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, duration, totalWalkedToday]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  const setPreset = (mins: number) => {
    setIsActive(false);
    setDuration(mins * 60);
    setTimeLeft(mins * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPct = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" style={{ color: "var(--purple)" }} />
          <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Walking Timer</h3>
        </div>
        <div className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full" style={{ background: "var(--purple-subtle)", color: "var(--purple)" }}>
          {totalWalkedToday}m Today
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center animate-fade-in relative">
        {/* Circular Progress (Simplified to a clean arc with CSS) */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="64" cy="64" r="60"
              fill="none"
              stroke="var(--surface-3)"
              strokeWidth="6"
            />
            <circle
              cx="64" cy="64" r="60"
              fill="none"
              stroke="var(--purple)"
              strokeWidth="6"
              strokeDasharray="377"
              strokeDashoffset={377 - (377 * progressPct) / 100}
              className="transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col items-center z-10">
            <span className="text-3xl font-bold font-mono tabular-nums tracking-tighter" style={{ color: "var(--text-primary)" }}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>
              {isActive ? "Walking..." : "Ready"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full justify-center mb-6">
          <button
            onClick={resetTimer}
            className="btn-icon w-10 h-10 rounded-full"
            disabled={timeLeft === duration && !isActive}
            style={{ background: "var(--surface-3)" }}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleTimer}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
            style={{ background: isActive ? "var(--surface-3)" : "var(--purple)", color: isActive ? "var(--text-primary)" : "white" }}
          >
            {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
        </div>

        {/* Presets */}
        <div className="w-full">
          <p className="text-[10px] text-center mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Set Duration</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => setPreset(m)}
                className="text-xs font-semibold px-2.5 py-1 rounded-md transition-all"
                style={{
                  background: duration === m * 60 ? "var(--purple-subtle)" : "var(--surface-2)",
                  color: duration === m * 60 ? "var(--purple)" : "var(--text-muted)",
                  border: `1px solid ${duration === m * 60 ? "var(--purple)" : "var(--border)"}`,
                }}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
