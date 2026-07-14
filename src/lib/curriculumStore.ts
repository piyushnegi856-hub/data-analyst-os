// ─── Client-side Curriculum & Progress Store (LocalStorage backed) ───

export interface DayTask {
  text: string;
  done: boolean;
}

export type DayTopic = "Excel" | "SQL" | "Python" | "Power BI" | "Stats" | "Projects" | "Career";

export interface DayData {
  d: number; // Day number (1-30)
  t: string; // Title
  tasks: string[]; // Predefined tasks
  res: Array<[string, string]>; // Resources [name, url]
  topic: DayTopic;
}

export const CURRICULUM: DayData[] = [
  // Week 1
  { d: 1, t: "Excel Basics I", topic: "Excel", tasks: ["Pivot tables", "VLOOKUP / XLOOKUP", "Practice on a Kaggle dataset"], res: [["Kaggle Datasets", "https://www.kaggle.com/datasets"]] },
  { d: 2, t: "Excel Basics II", topic: "Excel", tasks: ["IF / nested IF", "COUNTIFS / SUMIFS", "Data cleaning: TRIM, TEXT, duplicates"], res: [] },
  { d: 3, t: "Statistics Fundamentals", topic: "Stats", tasks: ["Mean / median / mode / std dev", "Distributions", "Correlation vs causation"], res: [["Khan Academy Stats", "https://www.khanacademy.org/math/statistics-probability"]] },
  { d: 4, t: "SQL Basics I", topic: "SQL", tasks: ["SELECT / WHERE", "GROUP BY / HAVING", "10-15 practice queries"], res: [["Mode SQL Tutorial", "https://mode.com/sql-tutorial/"]] },
  { d: 5, t: "SQL Basics II — JOINs", topic: "SQL", tasks: ["INNER / LEFT / RIGHT JOIN", "Practice on SQLZoo"], res: [["SQLZoo", "https://sqlzoo.net/"]] },
  { d: 6, t: "SQL — Subqueries & CASE", topic: "SQL", tasks: ["Subqueries", "CASE WHEN", "StrataScratch practice set"], res: [["StrataScratch", "https://www.stratascratch.com/"]] },
  { d: 7, t: "Week 1 Checkpoint", topic: "Stats", tasks: ["Review Excel notes", "Review SQL notes", "Self-test: explain a JOIN out loud"], res: [] },
  // Week 2
  { d: 8, t: "Window Functions I", topic: "SQL", tasks: ["RANK / ROW_NUMBER", "5 practice problems"], res: [["LeetCode SQL 50", "https://leetcode.com/studyplan/top-sql-50/"]] },
  { d: 9, t: "Window Functions II + CTEs", topic: "SQL", tasks: ["LAG / LEAD", "Common Table Expressions", "5 practice problems"], res: [["LeetCode SQL 50", "https://leetcode.com/studyplan/top-sql-50/"]] },
  { d: 10, t: "SQL — Dates & Optimization", topic: "SQL", tasks: ["Date functions", "Query optimization basics", "5 more LeetCode SQL problems"], res: [["LeetCode SQL 50", "https://leetcode.com/studyplan/top-sql-50/"]] },
  { d: 11, t: "Python Basics", topic: "Python", tasks: ["Variables / loops / functions", "Read through one intro notebook"], res: [["Kaggle Learn: Python", "https://www.kaggle.com/learn/python"]] },
  { d: 12, t: "Pandas I", topic: "Python", tasks: ["read_csv / filtering", "groupby"], res: [["Kaggle Learn: Pandas", "https://www.kaggle.com/learn/pandas"]] },
  { d: 13, t: "Pandas II", topic: "Python", tasks: ["merge", "pivot_table", "handling nulls"], res: [["Kaggle Learn: Pandas", "https://www.kaggle.com/learn/pandas"]] },
  { d: 14, t: "Matplotlib / Seaborn", topic: "Python", tasks: ["Bar / line / scatter charts", "Recreate one earlier SQL/Excel analysis in Pandas"], res: [["Kaggle Learn: Data Viz", "https://www.kaggle.com/learn/data-visualization"]] },
  // Week 3
  { d: 15, t: "Power BI I", topic: "Power BI", tasks: ["Connect data sources", "Build relationships"], res: [["Power BI Learning Path", "https://learn.microsoft.com/en-us/training/powerplatform/power-bi"]] },
  { d: 16, t: "Power BI II — DAX", topic: "Power BI", tasks: ["CALCULATE", "SUMX", "Basic measures"], res: [["Power BI Learning Path", "https://learn.microsoft.com/en-us/training/powerplatform/power-bi"]] },
  { d: 17, t: "Build 2 Dashboards", topic: "Power BI", tasks: ["Dashboard from public dataset #1", "Dashboard from public dataset #2"], res: [["Tableau Public Training", "https://public.tableau.com/en-us/s/resources"]] },
  { d: 18, t: "Project 1 — Pick & Clean Data (E-commerce)", topic: "Projects", tasks: ["Download Olist Brazilian E-Commerce dataset", "Clean in Python/Excel"], res: [["Olist Dataset (Kaggle)", "https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce"], ["Online Retail II (UCI)", "https://archive.ics.uci.edu/dataset/502/online+retail+ii"]] },
  { d: 19, t: "Project 1 — Analysis", topic: "Projects", tasks: ["Analyze with SQL/Pandas", "Draft key findings"], res: [] },
  { d: 20, t: "Project 1 — Visualization", topic: "Projects", tasks: ["Build Power BI dashboard for the project"], res: [] },
  { d: 21, t: "Project 1 — Ship It", topic: "Projects", tasks: ["Write 1-page insight summary", "Push to GitHub with clear README"], res: [["GitHub", "https://github.com"]] },
  // Week 4
  { d: 22, t: "Project 2 — Pick & Clean (Retail Sales/Margin)", topic: "Projects", tasks: ["Download Superstore Sales dataset", "Clean the data"], res: [["Superstore Dataset (Kaggle)", "https://www.kaggle.com/datasets/vivek468/superstore-dataset-final"]] },
  { d: 23, t: "Project 2 — Analysis", topic: "Projects", tasks: ["SQL/Pandas analysis", "Draft findings"], res: [] },
  { d: 24, t: "Project 2 — Visualization + Ship", topic: "Projects", tasks: ["Build dashboard", "Push to GitHub with README"], res: [] },
  { d: 25, t: "Project 3 — Lightweight Case Study (Basket Analysis)", topic: "Projects", tasks: ["Pick a focused SQL/Python case study", "Write it up"], res: [["Instacart Market Basket (Kaggle)", "https://www.kaggle.com/datasets/psparks/instacart-market-basket-analysis"], ["DataLemur", "https://datalemur.com/"]] },
  { d: 26, t: "Resume + LinkedIn", topic: "Career", tasks: ["Quantify impact on resume", "Add SQL/Excel/Python/Power BI explicitly", "Update LinkedIn headline + Featured section"], res: [] },
  { d: 27, t: "Portfolio Site", topic: "Career", tasks: ["Build a simple GitHub Pages site", "Link all 3 projects with screenshots"], res: [["GitHub Pages", "https://pages.github.com/"]] },
  { d: 28, t: "Interview Prep", topic: "Career", tasks: ["Practice explaining each project in 2 min", "Review SQL/stats interview Qs", "Prep 3-4 STAR stories"], res: [["DataLemur Questions", "https://datalemur.com/questions"], ["Interview Query", "https://www.interviewquery.com/"]] },
  { d: 29, t: "Applications — Batch 1", topic: "Career", tasks: ["Send 8-10 tailored applications", "Message 5 people in data roles on LinkedIn"], res: [["LinkedIn Jobs", "https://linkedin.com/jobs"], ["Indeed", "https://indeed.com"]] },
  { d: 30, t: "Applications — Batch 2", topic: "Career", tasks: ["Send 8-10 more applications", "Reflect + plan month 2"], res: [["LinkedIn Jobs", "https://linkedin.com/jobs"], ["Indeed", "https://indeed.com"]] },
];

export interface SavedDayState {
  tasks: boolean[]; // Array matching length of predefined tasks
  customTasks: { text: string; done: boolean }[];
  hours: number;
  notes: string;
  complete: boolean;
}

export interface UserProfile {
  name: string;
  welcomeMessage: string;
  profileImage: string;
  focus: string;
}

export function loadUserProfile(): UserProfile {
  if (typeof window === "undefined") {
    return { name: "Job Seeker", welcomeMessage: "Let's crack the code!", profileImage: "", focus: "SQL" };
  }
  const raw = localStorage.getItem("user_profile");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  // Fallbacks using cookies if they exist
  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : "";
  };
  return {
    name: getCookie("user_name") || "Job Seeker",
    welcomeMessage: "Let's crush today's sprint!",
    profileImage: "",
    focus: getCookie("sprint_focus") || "SQL"
  };
}

export function saveUserProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem("user_profile", JSON.stringify(profile));
  // Keep cookies updated
  document.cookie = `user_name=${encodeURIComponent(profile.name)};path=/;max-age=31536000`;
  document.cookie = `sprint_focus=${encodeURIComponent(profile.focus)};path=/;max-age=31536000`;
}

export function loadAllDaysState(): Record<number, SavedDayState> {
  const result: Record<number, SavedDayState> = {};
  
  // Set defaults
  CURRICULUM.forEach((day) => {
    result[day.d] = {
      tasks: day.tasks.map(() => false),
      customTasks: [],
      hours: 0,
      notes: "",
      complete: false,
    };
  });

  if (typeof window === "undefined") return result;

  const raw = localStorage.getItem("sprint_days_state");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      // Merge with defaults to handle version mismatch
      Object.keys(parsed).forEach((dayNum) => {
        const d = Number(dayNum);
        if (result[d]) {
          result[d] = {
            ...result[d],
            ...parsed[d],
          };
        }
      });
    } catch (e) {}
  }
  return result;
}

export function saveAllDaysState(state: Record<number, SavedDayState>) {
  if (typeof window === "undefined") return;
  localStorage.setItem("sprint_days_state", JSON.stringify(state));
}

export interface ClientStats {
  progressPct: number;
  streak: number;
  hoursLogged: number;
  logCount: number;
  completedDaysCount: number;
}

export function calculateClientStats(daysState: Record<number, SavedDayState>): ClientStats {
  let completedDaysCount = 0;
  let hoursLogged = 0;
  let logCount = 0;

  // Let's calculate total tasks and done tasks
  let totalTasks = 0;
  let doneTasks = 0;

  CURRICULUM.forEach((day) => {
    const state = daysState[day.d];
    if (state) {
      if (state.complete) {
        completedDaysCount++;
      }
      hoursLogged += state.hours || 0;
      if (state.hours > 0 || state.complete) {
        logCount++;
      }

      // Predefined tasks
      totalTasks += state.tasks.length;
      doneTasks += state.tasks.filter((t) => t).length;

      // Custom tasks
      totalTasks += state.customTasks.length;
      doneTasks += state.customTasks.filter((t) => t.done).length;
    }
  });

  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Streak logic
  let streak = 0;
  let currentStreak = 0;
  // Let's check chronological streak from Day 1 to 30
  for (let d = 1; d <= 30; d++) {
    const state = daysState[d];
    if (state && (state.hours > 0 || state.complete)) {
      currentStreak++;
      if (currentStreak > streak) {
        streak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  return {
    progressPct,
    streak: streak || (completedDaysCount > 0 ? 1 : 0),
    hoursLogged,
    logCount,
    completedDaysCount
  };
}
