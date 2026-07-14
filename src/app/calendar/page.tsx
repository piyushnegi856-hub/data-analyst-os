"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  X,
  ExternalLink,
  Trash2,
} from "lucide-react";

interface CalEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: "sprint" | "interview" | "reminder";
  gcalLink?: string;
}

function getGoogleCalendarLink(title: string, dateStr: string) {
  // dateStr: YYYY-MM-DD
  const start = dateStr.replace(/-/g, "");
  // All-day event ends next day
  const endDate = new Date(dateStr);
  endDate.setDate(endDate.getDate() + 1);
  const end = endDate.toISOString().split("T")[0].replace(/-/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: "Added from DA Sprint OS",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

const EVENT_COLORS: Record<string, string> = {
  sprint: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  interview: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  reminder: "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(todayStr());
  const [newType, setNewType] = useState<CalEvent["type"]>("sprint");
  const [timezone, setTimezone] = useState("");

  // detect timezone
  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  // Load events from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("sprint_calendar_events");
    if (raw) {
      try {
        setEvents(JSON.parse(raw));
        return;
      } catch (e) {}
    }
    // Default seed events relative to today
    const seeds: CalEvent[] = [
      {
        id: "seed-1",
        title: "Day 8: SQL Deep Dive",
        date: todayStr(),
        type: "sprint",
      },
      {
        id: "seed-2",
        title: "Mock Interview Practice",
        date: (() => {
          const d = new Date();
          d.setDate(d.getDate() + 3);
          return d.toISOString().split("T")[0];
        })(),
        type: "interview",
      },
    ];
    setEvents(seeds);
    localStorage.setItem("sprint_calendar_events", JSON.stringify(seeds));
  }, []);

  const save = (evts: CalEvent[]) => {
    setEvents(evts);
    localStorage.setItem("sprint_calendar_events", JSON.stringify(evts));
  };

  const addEvent = () => {
    if (!newTitle.trim() || !newDate) return;
    const gcalLink = getGoogleCalendarLink(newTitle.trim(), newDate);
    const ev: CalEvent = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      date: newDate,
      type: newType,
      gcalLink,
    };
    save([...events, ev]);
    setNewTitle("");
    setNewDate(todayStr());
    setShowAdd(false);
  };

  const deleteEvent = (id: string) => {
    save(events.filter((e) => e.id !== id));
  };

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const todayISO = todayStr();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // pad to multiple of 7
  while (cells.length % 7 !== 0) cells.push(null);

  const getDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const eventsForDate = (dateStr: string) =>
    events.filter((e) => e.date === dateStr);

  return (
    <div className="h-full flex flex-col pb-12 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ds-text)" }}>
            Calendar
          </h1>
          <p className="text-sm mt-1 flex items-center gap-2" style={{ color: "var(--ds-text-muted)" }}>
            Map your sprint to real dates.
            {timezone && (
              <span
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                style={{ background: "var(--ds-surface-3)", color: "var(--ds-primary)" }}
              >
                🌍 {timezone}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Month Nav */}
          <div
            className="flex items-center rounded-lg border p-1"
            style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border)" }}
          >
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-[var(--ds-surface-3)] rounded transition-colors"
              style={{ color: "var(--ds-text-muted)" }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 font-semibold text-sm min-w-[140px] text-center" style={{ color: "var(--ds-text)" }}>
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-[var(--ds-surface-3)] rounded transition-colors"
              style={{ color: "var(--ds-text-muted)" }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border-strong)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg" style={{ color: "var(--ds-text)" }}>New Event</h3>
              <button onClick={() => setShowAdd(false)} style={{ color: "var(--ds-text-muted)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addEvent()}
                placeholder="Event title..."
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ds-primary)]"
                style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border-strong)", color: "var(--ds-text)" }}
                autoFocus
              />
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ds-primary)]"
                style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border-strong)", color: "var(--ds-text)", colorScheme: "dark" }}
              />
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as CalEvent["type"])}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ds-primary)]"
                style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border-strong)", color: "var(--ds-text)" }}
              >
                <option value="sprint">📚 Sprint Task</option>
                <option value="interview">🎯 Interview</option>
                <option value="reminder">⏰ Reminder</option>
              </select>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setShowAdd(false)} className="btn-ghost flex-1">Cancel</button>
                <button onClick={addEvent} className="btn-primary flex-1 justify-center">Add Event</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col overflow-hidden glass-card rounded-xl">
        {/* Days of week header */}
        <div
          className="grid grid-cols-7 border-b"
          style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border)" }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-semibold uppercase tracking-wider border-r last:border-0"
              style={{ borderColor: "var(--ds-border)", color: "var(--ds-text-muted)" }}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7" style={{ gridAutoRows: "1fr" }}>
          {cells.map((day, i) => {
            const dateStr = day ? getDateStr(day) : "";
            const dayEvents = day ? eventsForDate(dateStr) : [];
            const isToday = dateStr === todayISO;
            const isCurrentMonth = day !== null;

            return (
              <div
                key={i}
                className="border-r border-b p-2 hover:bg-[var(--ds-surface-2)] transition-colors cursor-default flex flex-col group"
                style={{
                  borderColor: "var(--ds-border)",
                  background: isToday ? "rgba(79,110,247,0.05)" : undefined,
                  minHeight: "80px",
                }}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                          isToday
                            ? "text-white shadow-sm"
                            : isCurrentMonth
                            ? ""
                            : ""
                        }`}
                        style={{
                          background: isToday ? "var(--ds-primary)" : undefined,
                          color: isToday ? "#fff" : isCurrentMonth ? "var(--ds-text)" : "var(--ds-text-dim)",
                        }}
                      >
                        {day}
                      </span>
                      {dayEvents.length === 0 && (
                        <button
                          onClick={() => {
                            setNewDate(dateStr);
                            setShowAdd(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center rounded"
                          style={{ color: "var(--ds-text-muted)" }}
                          title="Add event"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="flex-1 space-y-1 overflow-y-auto">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className={`px-1.5 py-0.5 text-[10px] font-semibold rounded truncate border flex items-center justify-between gap-1 ${
                            EVENT_COLORS[ev.type]
                          }`}
                        >
                          <span className="truncate">{ev.title}</span>
                          <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            {ev.gcalLink && (
                              <a
                                href={ev.gcalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Add to Google Calendar"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-3 h-3 hover:text-white" />
                              </a>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteEvent(ev.id);
                              }}
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3 hover:text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Legend */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        {[
          { label: "Sprint Task", color: "bg-blue-500" },
          { label: "Interview", color: "bg-purple-500" },
          { label: "Reminder", color: "bg-amber-500" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
            <span className="text-xs" style={{ color: "var(--ds-text-muted)" }}>{l.label}</span>
          </div>
        ))}
        <span className="ml-auto text-xs" style={{ color: "var(--ds-text-dim)" }}>
          Click any event row to add to Google Calendar
        </span>
      </div>
    </div>
  );
}
