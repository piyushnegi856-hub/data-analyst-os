"use client";
import { useState, useEffect } from "react";
import { Footprints, Plus, Minus, Settings2, Target } from "lucide-react";

interface PedometerState {
  steps: number;
  goal: number;
  lastDate: string;
}

export function Pedometer() {
  const [state, setState] = useState<PedometerState>({ steps: 0, goal: 8000, lastDate: "" });
  const [showSettings, setShowSettings] = useState(false);
  const [stepInput, setStepInput] = useState(500);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const raw = localStorage.getItem("sprint_pedometer");
    if (raw) {
      try {
        const parsed: PedometerState = JSON.parse(raw);
        if (parsed.lastDate !== today) {
          // New day, reset steps but keep goal
          setState({ steps: 0, goal: parsed.goal || 8000, lastDate: today });
        } else {
          setState(parsed);
        }
      } catch (e) {}
    } else {
      setState((prev) => ({ ...prev, lastDate: today }));
    }
  }, []);

  const saveState = (next: PedometerState) => {
    setState(next);
    localStorage.setItem("sprint_pedometer", JSON.stringify(next));
  };

  const addSteps = (amount: number) => {
    saveState({ ...state, steps: Math.max(0, state.steps + amount) });
  };

  const pct = Math.min((state.steps / state.goal) * 100, 100);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Footprints className="w-4 h-4" style={{ color: "var(--purple)" }} />
          <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Daily Steps</h3>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn-icon w-6 h-6"
        >
          <Settings2 className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
        </button>
      </div>

      {showSettings ? (
        <div className="flex-1 animate-fade-in flex flex-col justify-center">
          <label className="text-xs font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Daily Goal</label>
          <input
            type="number"
            value={state.goal}
            onChange={(e) => saveState({ ...state, goal: Number(e.target.value) || 1000 })}
            className="input text-sm mb-3"
          />
          <button onClick={() => setShowSettings(false)} className="btn-primary text-xs py-1.5 justify-center">
            Save
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          <div className="flex items-end justify-between mb-2">
            <div>
              <span className="text-3xl font-bold font-mono tracking-tighter tabular-nums" style={{ color: "var(--text-primary)" }}>
                {state.steps.toLocaleString()}
              </span>
              <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>/ {state.goal.toLocaleString()}</span>
            </div>
            {pct >= 100 && <Target className="w-5 h-5 text-emerald-500 mb-1" />}
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full overflow-hidden mb-6" style={{ background: "var(--surface-3)" }}>
            <div 
              className="h-full transition-all duration-700 ease-out" 
              style={{ width: `${pct}%`, background: "var(--purple)" }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addSteps(-stepInput)}
              className="btn-ghost flex-shrink-0 w-8 h-8 flex items-center justify-center p-0"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 relative">
              <input
                type="number"
                value={stepInput}
                onChange={(e) => setStepInput(Number(e.target.value) || 0)}
                className="input text-xs w-full text-center py-1.5 font-mono"
              />
            </div>
            <button
              onClick={() => addSteps(stepInput)}
              className="btn-primary flex-shrink-0 w-8 h-8 flex items-center justify-center p-0"
              style={{ background: "var(--purple)", border: "none" }}
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
