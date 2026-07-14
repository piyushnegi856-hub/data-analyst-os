"use client";
import { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { loadAllDaysState, CURRICULUM, DayTopic } from "@/lib/curriculumStore";

const TOPIC_COLORS: Record<string, string> = {
  SQL: "#4f6ef7",
  Excel: "#22c55e",
  "Power BI": "#f59e0b",
  Python: "#a855f7",
  Statistics: "#06b6d4",
  Business: "#f43f5e",
};

const TOPICS: DayTopic[] = ["SQL", "Excel", "Power BI", "Python", "Stats"];

export function GameProgression() {
  const [data, setData] = useState([
    { subject: "SQL", A: 0, fullMark: 100 },
    { subject: "Excel", A: 0, fullMark: 100 },
    { subject: "Power BI", A: 0, fullMark: 100 },
    { subject: "Python", A: 0, fullMark: 100 },
    { subject: "Statistics", A: 0, fullMark: 100 },
    { subject: "Business", A: 0, fullMark: 100 },
  ]);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const compute = () => {
      const daysState = loadAllDaysState();

      // Map topic -> (done, total) tasks
      const topicProgress: Record<string, { done: number; total: number }> = {
        SQL: { done: 0, total: 0 },
        Excel: { done: 0, total: 0 },
        "Power BI": { done: 0, total: 0 },
        Python: { done: 0, total: 0 },
        Statistics: { done: 0, total: 0 },
        Business: { done: 0, total: 0 },
      };

      CURRICULUM.forEach((day) => {
        const topic =
          day.topic === "Stats"
            ? "Statistics"
            : day.topic === "Projects" || day.topic === "Career"
            ? "Business"
            : day.topic;
        const state = daysState[day.d];
        if (!state) return;

        topicProgress[topic].total += state.tasks.length;
        topicProgress[topic].done += state.tasks.filter(Boolean).length;
      });

      const newData = [
        {
          subject: "SQL",
          A: topicProgress["SQL"].total > 0
            ? Math.round((topicProgress["SQL"].done / topicProgress["SQL"].total) * 100)
            : 0,
          fullMark: 100,
        },
        {
          subject: "Excel",
          A: topicProgress["Excel"].total > 0
            ? Math.round((topicProgress["Excel"].done / topicProgress["Excel"].total) * 100)
            : 0,
          fullMark: 100,
        },
        {
          subject: "Power BI",
          A: topicProgress["Power BI"].total > 0
            ? Math.round((topicProgress["Power BI"].done / topicProgress["Power BI"].total) * 100)
            : 0,
          fullMark: 100,
        },
        {
          subject: "Python",
          A: topicProgress["Python"].total > 0
            ? Math.round((topicProgress["Python"].done / topicProgress["Python"].total) * 100)
            : 0,
          fullMark: 100,
        },
        {
          subject: "Statistics",
          A: topicProgress["Statistics"].total > 0
            ? Math.round((topicProgress["Statistics"].done / topicProgress["Statistics"].total) * 100)
            : 0,
          fullMark: 100,
        },
        {
          subject: "Business",
          A: topicProgress["Business"].total > 0
            ? Math.round((topicProgress["Business"].done / topicProgress["Business"].total) * 100)
            : 0,
          fullMark: 100,
        },
      ];

      const totalPct = newData.reduce((s, d) => s + d.A, 0) / newData.length;
      setLevel(totalPct < 20 ? 1 : totalPct < 40 ? 2 : totalPct < 60 ? 3 : totalPct < 80 ? 4 : 5);
      setData(newData);
    };

    compute();
    window.addEventListener("storage", compute);
    return () => window.removeEventListener("storage", compute);
  }, []);

  return (
    <div
      className="glass-card p-6 rounded-xl"
      style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border-strong)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold" style={{ color: "var(--ds-text)" }}>
            Skill Progression
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--ds-text-muted)" }}>
            Your XP distribution across core analyst skills.
          </p>
        </div>
        <div
          className="px-3 py-1 text-xs font-semibold rounded-full"
          style={{
            background: "var(--ds-primary-muted)",
            color: "var(--ds-primary)",
            border: "1px solid rgba(79,110,247,0.3)",
          }}
        >
          Level {level}
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.07)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Analyst Level"
              dataKey="A"
              stroke="#4f6ef7"
              fill="#4f6ef7"
              fillOpacity={0.25}
              strokeWidth={2}
              dot={{ fill: "#4f6ef7", r: 4, strokeWidth: 0 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-2 justify-center">
        {data.map((d) => (
          <div key={d.subject} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#4f6ef7" }} />
            <span className="text-xs" style={{ color: "var(--ds-text-muted)" }}>
              {d.subject}: <span style={{ color: "var(--ds-text)" }}>{d.A}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
