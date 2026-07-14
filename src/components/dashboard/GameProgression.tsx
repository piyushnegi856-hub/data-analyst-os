"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const data = [
  { subject: "SQL", A: 120, fullMark: 150 },
  { subject: "Excel", A: 98, fullMark: 150 },
  { subject: "Power BI", A: 86, fullMark: 150 },
  { subject: "Python", A: 45, fullMark: 150 },
  { subject: "Statistics", A: 65, fullMark: 150 },
  { subject: "Business", A: 85, fullMark: 150 },
];

export function GameProgression() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Skill Progression</h2>
          <p className="text-sm text-slate-500">Your XP distribution across core analyst skills.</p>
        </div>
        <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
          Level 3
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
            <Radar
              name="Analyst Level"
              dataKey="A"
              stroke="#059669"
              fill="#10b981"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
