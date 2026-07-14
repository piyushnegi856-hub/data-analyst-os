"use client";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
      >
        <AlertTriangle className="w-8 h-8" style={{ color: "#ef4444" }} />
      </div>
      <div className="text-center">
        <h2
          className="text-lg font-bold mb-2"
          style={{ color: "var(--ds-text)" }}
        >
          Something went wrong
        </h2>
        <p className="text-sm max-w-xs" style={{ color: "var(--ds-text-muted)" }}>
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
      </div>
      <button
        onClick={reset}
        className="btn-primary flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}
