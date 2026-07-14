"use client";
import { useState } from "react";
import { Upload, Filter, MoreHorizontal, Image as ImageIcon, FileText, Plus } from "lucide-react";

export default function EvidenceVaultPage() {
  const [evidenceFiles, setEvidenceFiles] = useState([
    { id: 1, type: "image", name: "Olist_Dashboard_V1.png", tag: "Project 1", date: "Oct 12" },
    { id: 2, type: "image", name: "Superstore_Sales_Final.png", tag: "Project 2", date: "Oct 10" },
    { id: 3, type: "pdf", name: "SQL_Basic_Certificate.pdf", tag: "Certificate", date: "Oct 5" },
    { id: 4, type: "image", name: "LinkedIn_Viral_Post.jpg", tag: "Networking", date: "Oct 2" },
    { id: 5, type: "pdf", name: "Instacart_Case_Study.pdf", tag: "Project 3", date: "Sept 28" },
  ]);

  const addMockEvidence = () => {
    setEvidenceFiles([
      { id: Date.now(), type: "image", name: "Project_Excel_Clean.png", tag: "Excel", date: "Just now" },
      ...evidenceFiles
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ds-text)" }}>Evidence Vault</h1>
          <p className="text-sm mt-1" style={{ color: "var(--ds-text-muted)" }}>Store your dashboards, certificates, and portfolio screenshots.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button onClick={addMockEvidence} className="btn-primary">
            <Upload className="w-4 h-4" /> Upload Mock
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
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm" style={{ background: "rgba(13,15,20,0.6)" }}>
                <span className="text-white font-medium text-sm">View Evidence</span>
              </div>
            </div>
            <div className="p-4 border-t" style={{ borderColor: "var(--ds-border)" }}>
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm truncate pr-2" style={{ color: "var(--ds-text)" }}>{file.name}</h3>
                <button style={{ color: "var(--ds-text-muted)" }} className="hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
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
