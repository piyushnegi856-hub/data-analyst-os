"use client";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";

export default function CalendarPage() {
  // Mock days for calendar grid
  const days = Array.from({ length: 35 }, (_, i) => {
    const date = i - 2; // Offset for previous month days
    return {
      date,
      isCurrentMonth: date > 0 && date <= 30,
      isToday: date === 12,
      events: date === 12 ? ["Day 8: SQL Deep Dive"] : date === 15 ? ["Interview: Zomato"] : []
    };
  });

  return (
    <div className="h-full flex flex-col pb-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight animate-fade-in" style={{ color: "var(--ds-text)" }}>Calendar</h1>
          <p className="text-sm mt-1" style={{ color: "var(--ds-text-muted)" }}>Map your 30-day sprint to real dates and schedule interviews.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border p-1" style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border)" }}>
            <button className="p-1 hover:bg-[var(--ds-surface-3)] rounded" style={{ color: "var(--ds-text-muted)" }}><ChevronLeft className="w-5 h-5" /></button>
            <span className="px-4 font-semibold text-sm" style={{ color: "var(--ds-text)" }}>October 2026</span>
            <button className="p-1 hover:bg-[var(--ds-surface-3)] rounded" style={{ color: "var(--ds-text-muted)" }}><ChevronRight className="w-5 h-5" /></button>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden glass-card rounded-xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b" style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border)" }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold uppercase tracking-wider border-r last:border-0" style={{ borderColor: "var(--ds-border)", color: "var(--ds-text-muted)" }}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5">
          {days.map((day, i) => (
            <div key={i} className={`border-r border-b p-2 hover:bg-[var(--ds-surface-2)] transition-colors cursor-pointer flex flex-col group`} style={{ borderColor: "var(--ds-border)" }}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${day.isToday ? 'bg-[#4f6ef7] text-white shadow-sm' : day.isCurrentMonth ? 'text-[var(--ds-text)]' : 'text-[var(--ds-text-dim)]'}`}>
                  {day.date > 0 && day.date <= 30 ? day.date : day.date <= 0 ? 30 + day.date : day.date - 30}
                </span>
              </div>
              <div className="flex-1 space-y-1 overflow-y-auto">
                {day.events.map((event, j) => (
                  <div key={j} className={`px-2 py-1 text-[11px] font-semibold rounded truncate ${event.includes('Interview') ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                    {event}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
