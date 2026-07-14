"use client";
import { useState, useEffect } from "react";
import { User, Image as ImageIcon, MessageSquare, Settings as SettingsIcon, Trash2, Award } from "lucide-react";
import { loadUserProfile, saveUserProfile, UserProfile } from "@/lib/curriculumStore";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Job Seeker",
    welcomeMessage: "Let's crack the code!",
    profileImage: "",
    focus: "SQL"
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setProfile(loadUserProfile());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      // Force refresh sidebar/topbar
      window.location.reload();
    }, 1000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all sprint progress? This cannot be undone.")) {
      localStorage.clear();
      // Clear cookies
      document.cookie = "sprint_started=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "sprint_focus=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "sprint_start_date=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      window.location.href = "/onboarding";
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-[#4f6ef7]" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ds-text)" }}>Profile Settings</h1>
          <p className="text-sm mt-1" style={{ color: "var(--ds-text-muted)" }}>Customize your OS profile and learning track.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden p-6 space-y-6">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ds-text-muted)" }}>
              <User className="w-3.5 h-3.5" /> Full Name
            </label>
            <input 
              type="text" 
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)", color: "var(--ds-text)" }}
            />
          </div>

          {/* Welcome Message */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ds-text-muted)" }}>
              <MessageSquare className="w-3.5 h-3.5" /> Dashboard Welcome Message
            </label>
            <input 
              type="text" 
              required
              value={profile.welcomeMessage}
              onChange={(e) => setProfile({ ...profile, welcomeMessage: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)", color: "var(--ds-text)" }}
            />
          </div>

          {/* Profile Image URL */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ds-text-muted)" }}>
              <ImageIcon className="w-3.5 h-3.5" /> Custom Profile Image URL
            </label>
            <input 
              type="url" 
              value={profile.profileImage}
              onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)", color: "var(--ds-text)" }}
            />
            {profile.profileImage && (
              <div className="mt-3 flex items-center gap-3 p-2 rounded-lg border" style={{ borderColor: "var(--ds-border)", background: "var(--ds-surface-2)" }}>
                <img src={profile.profileImage} alt="Profile preview" className="w-10 h-10 rounded-full object-cover border" style={{ borderColor: "var(--ds-border)" }} />
                <span className="text-xs" style={{ color: "var(--ds-text-muted)" }}>Avatar Preview</span>
              </div>
            )}
          </div>

          {/* Specialization focus */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ds-text-muted)" }}>
              <Award className="w-3.5 h-3.5" /> Starting Track / Focus
            </label>
            <select
              value={profile.focus}
              onChange={(e) => setProfile({ ...profile, focus: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)", color: "var(--ds-text)" }}
            >
              <option value="SQL">SQL Foundations</option>
              <option value="Python">Python & Pandas</option>
              <option value="Excel">Advanced Excel</option>
              <option value="Tableau">Data Visualisation (Tableau/Power BI)</option>
              <option value="Stats">Statistics & A/B Testing</option>
            </select>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="btn-primary w-full justify-center py-3 text-base flex items-center gap-2"
            >
              {savedSuccess ? "Saved Successfully!" : "Save Profile"}
            </button>
          </div>
        </form>

        <div className="border-t pt-6" style={{ borderColor: "var(--ds-border)" }}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--ds-text)" }}>Danger Zone</h3>
          <p className="text-xs mb-4" style={{ color: "var(--ds-text-muted)" }}>Resetting will wipe all locally saved tasks, work logs, streak data, and evidence screenshots.</p>
          <button 
            onClick={handleReset} 
            className="flex items-center gap-2 px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-semibold rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Reset 30-Day Sprint
          </button>
        </div>
      </div>
    </div>
  );
}
