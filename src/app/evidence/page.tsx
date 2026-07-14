"use client";
import { useState, useEffect } from "react";
import { Upload, Filter, MoreHorizontal, Image as ImageIcon, FileText } from "lucide-react";

export default function EvidenceVaultPage() {
  const [evidenceFiles, setEvidenceFiles] = useState<Array<{ id: number, type: string, name: string, tag: string, date: string }>>([]);

  const defaultEvidence = [
    { id: 1, type: "image", name: "Olist_Dashboard_V1.png", tag: "Project 1", date: "Oct 12" },
    { id: 2, type: "image", name: "Superstore_Sales_Final.png", tag: "Project 2", date: "Oct 10" },
    { id: 3, type: "pdf", name: "SQL_Basic_Certificate.pdf", tag: "Certificate", date: "Oct 5" },
    { id: 4, type: "image", name: "LinkedIn_Viral_Post.jpg", tag: "Networking", date: "Oct 2" },
    { id: 5, type: "pdf", name: "Instacart_Case_Study.pdf", tag: "Project 3", date: "Sept 28" },
  ];

  const loadEvidence = () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("sprint_evidence_vault");
      if (raw) {
        try {
          setEvidenceFiles(JSON.parse(raw));
          return;
        } catch (e) {}
      }
      // If empty, seed default
      localStorage.setItem("sprint_evidence_vault", JSON.stringify(defaultEvidence));
      setEvidenceFiles(defaultEvidence);
    }
  };

  useEffect(() => {
    loadEvidence();
    window.addEventListener("storage", loadEvidence);
    return () => {
      window.removeEventListener("storage", loadEvidence);
    };
  }, []);

  const addMockEvidence = () => {
    const newFile = { 
      id: Date.now(), 
      type: "image", 
      name: "Project_Excel_Clean.png", 
      tag: "Excel", 
      date: "Just now" 
    };
    const nextList = [newFile, ...evidenceFiles];
    setEvidenceFiles(nextList);
    localStorage.setItem("sprint_evidence_vault", JSON.stringify(nextList));
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white animate-fade-in">Evidence Vault</h1>
          <p className="text-sm mt-1" style={{ color: "var(--ds-text-muted)" }}>Store your dashboards, certificates, and portfolio screenshots.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost border border-white/10 flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button onClick={addMockEvidence} className="btn-primary flex items-center gap-2 text-xs">
            <Upload className="w-3.5 h-3.5" /> Add Mock Screenshot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {evidenceFiles.map((file) => (
          <div key={file.id} className="glass-card rounded-xl overflow-hidden group cursor-pointer transition-all hover:-translate-y-1">
            <div className="aspect-[4/3] flex items-center justify-center relative" style={{ background: "var(--ds-surface-2)" }}>
              {file.type === "image" ? (
                <ImageIcon className="w-12 h-12" style={{ color: "var(--ds-text-muted)" }} />
              ) : (
                <FileText className="w-12 h-12" style={{ color: "var(--ds-text-muted)" }} />
              )}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm animate-fade-in" style={{ background: "rgba(13,15,20,0.6)" }}>
                <span className="text-white font-medium text-sm">View Evidence</span>
              </div>
            </div>
            <div className="p-4 border-t animate-fade-in" style={{ borderColor: "var(--ds-border)" }}>
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm truncate pr-2" style={{ color: "var(--ds-text)" }}>{file.name}</h3>
                <button style={{ color: "var(--ds-text-muted)" }} className="hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ background: "rgba(79,110,247,0.15)", color: "#4f6ef7" }}>
                  {file.tag}
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--ds-text-dim)" }}>{file.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
