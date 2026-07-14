"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Topic } from "@/lib/resources";

const TOPICS: (Topic | "All")[] = ["All", "SQL", "Python", "Excel", "Tableau", "Stats", "Portfolio", "Interview"];

export function TopicFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTopic = searchParams.get("topic") || "All";

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {TOPICS.map((topic) => {
        const isActive = currentTopic === topic;
        return (
          <button
            key={topic}
            onClick={() => {
              if (topic === "All") {
                router.push("/resources");
              } else {
                router.push(`/resources?topic=${topic}`);
              }
            }}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: isActive ? "var(--ds-primary)" : "var(--ds-surface-2)",
              color: isActive ? "#fff" : "var(--ds-text-muted)",
              border: `1px solid ${isActive ? "var(--ds-primary)" : "var(--ds-border)"}`,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = "var(--ds-text)";
                e.currentTarget.style.borderColor = "var(--ds-border-strong)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = "var(--ds-text-muted)";
                e.currentTarget.style.borderColor = "var(--ds-border)";
              }
            }}
          >
            {topic}
          </button>
        );
      })}
    </div>
  );
}
