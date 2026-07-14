// ─── Shared data types & mock aggregation layer ───
// Same interface as future Supabase queries — swap body only in Phase 2.

export const SPRINT_START_DATE = new Date("2026-10-05"); // Set per user in Phase 2

export type HeatmapEntry = { date: string; hours: number }; // date = 'YYYY-MM-DD'

export interface SprintStats {
  progressPct: number;    // computed from completed tasks / total tasks
  streak: number;         // consecutive days with hours > 0
  hoursLogged: number;
  logCount: number;
  heatmap: Record<string, number>; // { 'YYYY-MM-DD': hours }
  currentWeek: number;    // 1-indexed sprint week derived from start date + today
}

// Mock day-level data (Phase 2: fetched from Supabase sprint_days table)
const MOCK_DAYS: Array<{ date: string; hoursLogged: number; tasksComplete: number; tasksTotal: number }> = [
  { date: "2026-10-05", hoursLogged: 3.5, tasksComplete: 3, tasksTotal: 3 },
  { date: "2026-10-06", hoursLogged: 2.0, tasksComplete: 2, tasksTotal: 3 },
  { date: "2026-10-07", hoursLogged: 4.5, tasksComplete: 3, tasksTotal: 3 },
  { date: "2026-10-08", hoursLogged: 1.5, tasksComplete: 1, tasksTotal: 3 },
  { date: "2026-10-09", hoursLogged: 0,   tasksComplete: 0, tasksTotal: 3 }, // skipped
  { date: "2026-10-10", hoursLogged: 3.0, tasksComplete: 3, tasksTotal: 3 },
  { date: "2026-10-11", hoursLogged: 2.5, tasksComplete: 2, tasksTotal: 3 },
  { date: "2026-10-12", hoursLogged: 1.5, tasksComplete: 1, tasksTotal: 4 }, // today (Day 8)
];

const TOTAL_TASKS = 30 * 3; // 3 tasks per day × 30 days

export async function getSprintStats(): Promise<SprintStats> {
  // Heatmap: keyed by real calendar date string
  const heatmap: Record<string, number> = {};
  MOCK_DAYS.forEach((d) => {
    heatmap[d.date] = d.hoursLogged;
  });

  // Hours logged: sum
  const hoursLogged = MOCK_DAYS.reduce((acc, d) => acc + d.hoursLogged, 0);

  // Completed tasks: sum
  const completedTasks = MOCK_DAYS.reduce((acc, d) => acc + d.tasksComplete, 0);
  const progressPct = Math.round((completedTasks / TOTAL_TASKS) * 100);

  // Streak: count backwards from today for consecutive days with hours > 0
  let streak = 0;
  for (let i = MOCK_DAYS.length - 1; i >= 0; i--) {
    if (MOCK_DAYS[i].hoursLogged > 0) streak++;
    else break;
  }

  // Log count = number of days touched
  const logCount = MOCK_DAYS.filter((d) => d.hoursLogged > 0).length;

  // Current week derived from sprint start + today
  const today = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceStart = Math.floor((today.getTime() - SPRINT_START_DATE.getTime()) / msPerDay);
  const currentWeek = Math.min(Math.max(Math.ceil((daysSinceStart + 1) / 7), 1), 5);

  return { progressPct, streak, hoursLogged, logCount, heatmap, currentWeek };
}
