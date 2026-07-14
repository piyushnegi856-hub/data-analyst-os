"use client";
import { useState, useEffect } from "react";
import { Briefcase, BookOpen, Users, Link as LinkIcon, MoreHorizontal, Plus } from "lucide-react";
import { LoadingButton } from "@/components/ui/LoadingButton";

export default function WorkLogPage() {
  const [logs, setLogs] = useState([
    {
      id: 1,
      category: "Application",
      text: "Applied to 3 Data Analyst roles on LinkedIn (Flipkart, Myntra, Swiggy)",
      date: "Today at 10:30 AM",
      icon: Briefcase,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      id: 2,
      category: "Learning",
      text: "Completed Kaggle Pandas micro-course",
      date: "Yesterday at 4:15 PM",
      icon: BookOpen,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      id: 3,
      category: "Networking",
      text: "Sent cold messages to 5 Sr. Data Analysts asking for coffee chats",
      date: "Yesterday at 2:00 PM",
      icon: Users,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      id: 4,
      category: "LinkedIn",
      text: "Posted about my latest SQL project analyzing Superstore sales",
      date: "Oct 12 at 9:00 AM",
      icon: LinkIcon,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20"
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [category, setCategory] = useState("Application");
  const [isPending, setIsPending] = useState(false);

  const handleAdd = () => {
    if (!inputText) return;
    setIsPending(true);
    
    setTimeout(() => {
      setLogs([{
        id: Date.now(),
        category: category,
        text: inputText,
        date: "Just now",
        icon: category === "Application" ? Briefcase : category === "Learning" ? BookOpen : category === "Networking" ? Users : LinkIcon,
        color: category === "Application" ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : 
               category === "Learning" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : 
               category === "Networking" ? "text-purple-400 bg-purple-500/10 border-purple-500/20" : "text-sky-400 bg-sky-500/10 border-sky-500/20"
      }, ...logs]);
      setInputText("");
      setIsPending(false);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ds-text)" }}>Work Log</h1>
          <p className="text-sm mt-1" style={{ color: "var(--ds-text-muted)" }}>Track your daily actions: learning, applications, and networking.</p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden glass-card">
        {/* Input Area (Quick Add) */}
        <div className="p-4 border-b flex gap-3" style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border)" }}>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{ background: "var(--ds-surface-3)", border: "1px solid var(--ds-border-strong)", color: "var(--ds-text)" }}
          >
            <option value="Application">💼 Application</option>
            <option value="Learning">📚 Learning</option>
            <option value="Networking">🤝 Networking</option>
            <option value="LinkedIn">✍️ LinkedIn</option>
            <option value="Other">📝 Other</option>
          </select>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="What did you do today?" 
            className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{ background: "var(--ds-surface-3)", border: "1px solid var(--ds-border-strong)", color: "var(--ds-text)" }}
          />
          <LoadingButton isPending={isPending} onClick={handleAdd}>
            Add
          </LoadingButton>
        </div>

        {/* Feed */}
        <div className="divide-y" style={{ borderColor: "var(--ds-border)" }}>
          {logs.map((log) => {
            const Icon = log.icon;
            return (
              <div key={log.id} className="p-5 flex gap-4 transition-colors group hover:bg-[var(--ds-surface-2)]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${log.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium" style={{ color: "var(--ds-text)" }}>{log.text}</p>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--ds-text-muted)" }}>
                      <MoreHorizontal className="w-4 h-4 hover:text-[var(--ds-text)]" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--ds-text-muted)" }}>{log.category}</span>
                    <span className="text-xs" style={{ color: "var(--ds-text-dim)" }}>• {log.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
