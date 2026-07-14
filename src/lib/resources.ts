// ─── Curated Resource Library ───
// Sourced from the DA Sprint Playbook. Week indicates when it's recommended.

export type Topic =
  | "SQL" | "Python" | "Excel" | "Tableau" | "Power BI"
  | "Stats" | "Portfolio" | "Interview" | "general" | "advanced";
export type ResourceType = "YouTube" | "Course" | "Article" | "Practice" | "Channel";

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
  // ─────────────────────────────────────────────
  //  FEATURED CHANNELS (seeded from user request)
  // ─────────────────────────────────────────────
  {
    id: "ch-alex",
    title: "Alex The Analyst Bootcamp",
    url: "https://www.youtube.com/playlist?list=PLUaB-1hjhk8FE_XZ87vPPSfHqb6OcM0cF",
    // Playlist thumbnail via known video in playlist
    youtubeId: "9ADrxlmOEJk",
    topic: "general",
    type: "Channel",
    week: 1,
    description: "The #1 free Data Analyst bootcamp playlist — SQL, Excel, Python, Power BI, Tableau, and portfolio projects end-to-end.",
    channel: "Alex The Analyst",
  },
  {
    id: "ch-codebasics",
    title: "Codebasics – Data Science & Analytics",
    url: "https://www.youtube.com/@codebasics",
    youtubeId: "r2om1QiuMkk",
    topic: "general",
    type: "Channel",
    week: 1,
    description: "Hindi + English tutorials on Python, SQL, Power BI, and ML. Best for Indian learners with real business case studies.",
    channel: "Codebasics",
  },
  {
    id: "ch-techtfq",
    title: "techTFQ – Advanced SQL",
    url: "https://www.youtube.com/@techTFQ",
    youtubeId: "H6OTMoXjNiM",
    topic: "SQL",
    type: "Channel",
    week: 2,
    description: "Deep-dive SQL tutorials: window functions, CTEs, complex interview problems, and query optimization. Interview gold.",
    channel: "techTFQ",
  },
  {
    id: "ch-guyinacube",
    title: "Guy in a Cube – Power BI Mastery",
    url: "https://www.youtube.com/@GuyInACube",
    youtubeId: "AGrl-H87pRU",
    topic: "Power BI",
    type: "Channel",
    week: 3,
    description: "The go-to Power BI channel. DAX formulas, report design, Power Query, and enterprise BI patterns from Microsoft MVPs.",
    channel: "Guy in a Cube",
  },
  {
    id: "ch-chandoo",
    title: "Chandoo – Excel & Power BI",
    url: "https://www.youtube.com/@chandoo",
    youtubeId: "opJgMj1IUrc",
    topic: "Excel",
    type: "Channel",
    week: 2,
    description: "Master Excel and Power BI through practical tutorials. Pivot tables, dashboards, VLOOKUP to XLOOKUP, and Power Query.",
    channel: "Chandoo",
  },
  {
    id: "ch-statquest",
    title: "StatQuest with Josh Starmer",
    url: "https://www.youtube.com/@statquest",
    youtubeId: "qBigTkBLU6g",
    topic: "Stats",
    type: "Channel",
    week: 3,
    description: "Statistics and ML concepts made crystal clear. p-values, A/B testing, regression, distributions — explained visually.",
    channel: "StatQuest",
  },
  {
    id: "ch-lukebarousse",
    title: "Luke Barousse – DA Career & Portfolio",
    url: "https://www.youtube.com/@LukeBarousse",
    youtubeId: "pnRuBqVKQdc",
    topic: "Portfolio",
    type: "Channel",
    week: 4,
    description: "Data analyst job hunting, salary data, SQL projects, and career advice from someone who made the transition himself.",
    channel: "Luke Barousse",
  },
  {
    id: "ch-krishnaik",
    title: "Krish Naik – ML & Advanced Analytics",
    url: "https://www.youtube.com/@krishnaik06",
    youtubeId: "r-uOLxNrNk8",
    topic: "advanced",
    type: "Channel",
    week: 4,
    description: "Advanced Python, ML pipelines, NLP, and data science projects. Best for analysts ready to move into data science.",
    channel: "Krish Naik",
  },

  // ─────────────────────────────────────────────
  //  WEEK 1: SQL FOUNDATIONS
  // ─────────────────────────────────────────────
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
  {
    id: "sql-5",
    title: "DataLemur SQL Interview Questions",
    url: "https://datalemur.com/questions",
    topic: "SQL", type: "Practice", week: 4,
    description: "Real SQL questions from Meta, Google, Amazon. Harder than LeetCode.",
  },
  {
    id: "cheat-1",
    title: "SQL Basics Cheat Sheet",
    url: "https://learnsql.com/blog/sql-basics-cheat-sheet/",
    topic: "SQL", type: "Article", week: 1,
    description: "A comprehensive printable cheat sheet containing all basic SQL functions and join syntax.",
  },
  // ─────────────────────────────────────────────
  //  WEEK 2: EXCEL & PYTHON
  // ─────────────────────────────────────────────
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
  {
    id: "cheat-2",
    title: "Pandas Cheat Sheet (Official)",
    url: "https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf",
    topic: "Python", type: "Article", week: 2,
    description: "Official cheat sheet for data wrangling, cleaning, reshaping, and plotting in Pandas.",
  },
  // ─────────────────────────────────────────────
  //  WEEK 3: VISUALISATION
  // ─────────────────────────────────────────────
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
  // ─────────────────────────────────────────────
  //  WEEK 3: STATISTICS
  // ─────────────────────────────────────────────
  {
    id: "stats-1",
    title: "Statistics for Data Science – StatQuest",
    url: "https://www.youtube.com/watch?v=qBigTkBLU6g",
    youtubeId: "qBigTkBLU6g",
    topic: "Stats", type: "YouTube", week: 3,
    description: "p-values, confidence intervals, A/B testing — explained like a human.",
    channel: "StatQuest",
  },
  // ─────────────────────────────────────────────
  //  WEEK 4: PORTFOLIO & INTERVIEW
  // ─────────────────────────────────────────────
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
    id: "yt-new-1",
    title: "SQL Data Exploration Project",
    url: "https://youtu.be/MOzEvNYvbik?si=DrTOc2vZttDZvmOb",
    youtubeId: "MOzEvNYvbik",
    topic: "Portfolio", type: "YouTube", week: 1,
    description: "End-to-end SQL data exploration project for your portfolio.",
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
    title: "Storytelling with Data",
    url: "https://www.youtube.com/watch?v=8EMW7io4rSI",
    youtubeId: "8EMW7io4rSI",
    topic: "Interview", type: "YouTube", week: 4,
    description: "How to present data findings to non-technical stakeholders.",
    channel: "Cole Nussbaumer Knaflic",
  },
  {
    id: "data-1",
    title: "UCI Machine Learning Repository",
    url: "https://archive.ics.uci.edu/datasets",
    topic: "Portfolio", type: "Practice", week: 3,
    description: "Hundreds of public datasets for cleaning, modeling, and business intelligence projects.",
  },
  {
    id: "ai-1",
    title: "SQL Query Optimizer GPT",
    url: "https://chatgpt.com",
    topic: "Interview", type: "Practice", week: 4,
    description: "Prompt blueprint for using ChatGPT/Claude as a personal SQL query optimization coach.",
  },
];

export function getResourcesByWeek(week: number): Resource[] {
  return RESOURCES.filter((r) => r.week === week);
}

export function getResourcesByTopic(topic: Topic | "All"): Resource[] {
  if (topic === "All") return RESOURCES;
  // Normalize: match case-insensitively
  return RESOURCES.filter(
    (r) => r.topic.toLowerCase() === topic.toLowerCase()
  );
}
