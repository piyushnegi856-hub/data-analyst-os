// ─── Curated Resource Library ───
// Sourced from the DA Sprint Playbook. Week indicates when it's recommended.

export type Topic = "SQL" | "Python" | "Excel" | "Tableau" | "Stats" | "Portfolio" | "Interview";
export type ResourceType = "YouTube" | "Course" | "Article" | "Practice";

export interface Resource {
  id: string;
  title: string;
  url: string;
  topic: Topic;
  type: ResourceType;
  week: number;
  description: string;
  youtubeId?: string;
  channel?: string;
}

export const RESOURCES: Resource[] = [
  // ── Week 1: SQL Foundations ──
  {
    id: "sql-1",
    title: "SQL Tutorial for Data Analysis",
    url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    youtubeId: "HXV3zeQKqGY",
    topic: "SQL", type: "YouTube", week: 1,
    description: "Complete 4-hour SQL bootcamp — SELECT through advanced JOINs.",
    channel: "freeCodeCamp",
  },
  {
    id: "sql-2",
    title: "Mode Analytics SQL Tutorial",
    url: "https://mode.com/sql-tutorial/",
    topic: "SQL", type: "Course", week: 1,
    description: "Browser-based SQL editor with real datasets. Best for hands-on practice.",
  },
  {
    id: "sql-3",
    title: "Window Functions Explained",
    url: "https://www.youtube.com/watch?v=H6OTMoXjNiM",
    youtubeId: "H6OTMoXjNiM",
    topic: "SQL", type: "YouTube", week: 2,
    description: "RANK, ROW_NUMBER, LAG, LEAD — all the window functions you'll see in interviews.",
    channel: "techTFQ",
  },
  {
    id: "sql-4",
    title: "LeetCode SQL Practice",
    url: "https://leetcode.com/problemset/database/",
    topic: "SQL", type: "Practice", week: 2,
    description: "50+ SQL problems used in real interviews at FAANG and startups.",
  },
  // ── Week 2: Excel & Python ──
  {
    id: "excel-1",
    title: "Excel for Data Analysis – Full Course",
    url: "https://www.youtube.com/watch?v=opJgMj1IUrc",
    youtubeId: "opJgMj1IUrc",
    topic: "Excel", type: "YouTube", week: 2,
    description: "Pivot tables, VLOOKUP, Power Query — the Excel stack analysts actually use.",
    channel: "Leila Gharani",
  },
  {
    id: "python-1",
    title: "Kaggle Pandas Micro-course",
    url: "https://www.kaggle.com/learn/pandas",
    topic: "Python", type: "Course", week: 2,
    description: "Free, interactive. Covers DataFrame operations, groupby, merge in 4 hours.",
  },
  {
    id: "python-2",
    title: "Python for Data Analysis (Wes McKinney)",
    url: "https://www.youtube.com/watch?v=r-uOLxNrNk8",
    youtubeId: "r-uOLxNrNk8",
    topic: "Python", type: "YouTube", week: 3,
    description: "Core Pandas from the creator himself — the reference.",
    channel: "Data School",
  },
  // ── Week 3: Visualisation ──
  {
    id: "tableau-1",
    title: "Tableau Tutorial for Beginners",
    url: "https://www.youtube.com/watch?v=jEgVto5QME8",
    youtubeId: "jEgVto5QME8",
    topic: "Tableau", type: "YouTube", week: 3,
    description: "Build your first dashboard in Tableau Public — free tool, hire-worthy output.",
    channel: "Andy Kriebel",
  },
  {
    id: "tableau-2",
    title: "Makeover Monday",
    url: "https://www.makeovermonday.co.uk/",
    topic: "Tableau", type: "Practice", week: 3,
    description: "Weekly data visualisation challenge. Best portfolio-builder in the field.",
  },
  // ── Week 3: Statistics ──
  {
    id: "stats-1",
    title: "Statistics for Data Science – StatQuest",
    url: "https://www.youtube.com/watch?v=qBigTkBLU6g",
    youtubeId: "qBigTkBLU6g",
    topic: "Stats", type: "YouTube", week: 3,
    description: "p-values, confidence intervals, A/B testing — explained like a human.",
    channel: "StatQuest",
  },
  // ── Week 4: Portfolio & Interview ──
  {
    id: "portfolio-1",
    title: "How to Build a DA Portfolio (2024)",
    url: "https://www.youtube.com/watch?v=9ADrxlmOEJk",
    youtubeId: "9ADrxlmOEJk",
    topic: "Portfolio", type: "YouTube", week: 4,
    description: "Exact projects that get interviews: end-to-end SQL + Tableau.",
    channel: "Alex The Analyst",
  },
  {
    id: "interview-1",
    title: "Top 30 DA Interview Questions",
    url: "https://www.youtube.com/watch?v=pnRuBqVKQdc",
    youtubeId: "pnRuBqVKQdc",
    topic: "Interview", type: "YouTube", week: 4,
    description: "Behavioural + technical DA interview questions with model answers.",
    channel: "Luke Barousse",
  },
  {
    id: "interview-2",
    title: "Storytelling with Data (Cole Nussbaumer)",
    url: "https://www.youtube.com/watch?v=8EMW7io4rSI",
    youtubeId: "8EMW7io4rSI",
    topic: "Interview", type: "YouTube", week: 4,
    description: "How to present data findings to non-technical stakeholders.",
    channel: "Cole Nussbaumer Knaflic",
  },
  {
    id: "sql-5",
    title: "DataLemur SQL Interview Questions",
    url: "https://datalemur.com/questions",
    topic: "SQL", type: "Practice", week: 4,
    description: "Real SQL questions from Meta, Google, Amazon. Harder than LeetCode.",
  },
  {
    id: "yt-new-1",
    title: "Data Analyst Portfolio Project | SQL Data Exploration",
    url: "https://youtu.be/MOzEvNYvbik?si=DrTOc2vZttDZvmOb",
    youtubeId: "MOzEvNYvbik",
    topic: "Portfolio", type: "YouTube", week: 1,
    description: "End to end SQL data exploration project for your portfolio.",
    channel: "Alex The Analyst",
  }
];

export function getResourcesByWeek(week: number): Resource[] {
  return RESOURCES.filter((r) => r.week === week);
}

export function getResourcesByTopic(topic: Topic | "All"): Resource[] {
  if (topic === "All") return RESOURCES;
  return RESOURCES.filter((r) => r.topic === topic);
}
