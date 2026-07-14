"use client";
import { useState, useEffect } from "react";
import {
  User, Image as ImageIcon, MessageSquare, Award, Trash2,
  Save, CheckCircle2, AlertTriangle, ChevronRight, Palette, Bell
} from "lucide-react";
import { loadUserProfile, saveUserProfile, UserProfile } from "@/lib/curriculumStore";

const TRACKS = [
  { value: "SQL",     label: "SQL Foundations",             desc: "JOINs, CTEs, Window functions" },
  { value: "Python",  label: "Python & Pandas",             desc: "Data wrangling, EDA, Matplotlib" },
  { value: "Excel",   label: "Advanced Excel",              desc: "Pivot tables, Power Query, VBA" },
  { value: "Power BI",label: "Data Visualisation (Power BI)",desc: "DAX, dashboards, storytelling" },
  { value: "Stats",   label: "Statistics & A/B Testing",    desc: "Probability, hypothesis testing" },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    welcomeMessage: "",
    profileImage: "",
    focus: "SQL",
  });
  const [saved, setSaved] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => { setProfile(loadUserProfile()); }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile(profile);
    window.dispatchEvent(new Event("storage"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    localStorage.clear();
    ["sprint_started", "user_name", "sprint_focus", "sprint_start_date"].forEach((k) => {
      document.cookie = `${k}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
    window.location.href = "/onboarding";
  };

  return (
    <div className="max-w-2xl mx-auto pb-12 animate-slide-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Customize your profile, track, and sprint preferences.
        </p>
      </div>

      {/* Profile Card */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4" style={{ color: "var(--accent)" }} />
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Profile</h2>
          </div>

          {/* Avatar preview */}
          {profile.profileImage && (
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
            >
              <img
                src={profile.profileImage}
                alt="Preview"
                className="w-12 h-12 rounded-xl object-cover"
                style={{ border: "2px solid var(--accent-border)" }}
              />
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{profile.name || "Your Name"}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Avatar preview</p>
              </div>
            </div>
          )}

          {/* Fields */}
          {[
            { key: "name",           label: "Full Name",               placeholder: "Piyush Negi",                icon: User,         type: "text" },
            { key: "welcomeMessage", label: "Dashboard Greeting",       placeholder: "Ready to crush SQL today?",  icon: MessageSquare, type: "text" },
            { key: "profileImage",   label: "Avatar URL (optional)",   placeholder: "https://images.unsplash.com/...", icon: ImageIcon, type: "url" },
          ].map(({ key, label, placeholder, icon: Icon, type }) => (
            <div key={key}>
              <label className="section-label block mb-1.5">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                <input
                  type={type}
                  required={key === "name"}
                  value={(profile as any)[key]}
                  onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="input text-sm pl-9"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Track Selection */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4" style={{ color: "var(--accent)" }} />
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Focus Track</h2>
          </div>
          <div className="space-y-2">
            {TRACKS.map((track) => {
              const active = profile.focus === track.value;
              return (
                <button
                  key={track.value}
                  type="button"
                  onClick={() => setProfile({ ...profile, focus: track.value })}
                  className="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-150 text-left"
                  style={{
                    background: active ? "var(--accent-subtle)" : "var(--surface-2)",
                    border: `1px solid ${active ? "var(--accent-border)" : "var(--border)"}`,
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 transition-all"
                    style={{ background: active ? "var(--accent)" : "var(--border-strong)", boxShadow: active ? "0 0 8px var(--accent-glow)" : "none" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: active ? "var(--accent)" : "var(--text-primary)" }}>
                      {track.label}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>{track.desc}</p>
                  </div>
                  {active && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="btn-primary w-full justify-center py-3 text-sm font-semibold flex items-center gap-2"
          style={{ borderRadius: "var(--r-xl)" }}
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Saved Successfully!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </form>

      {/* Danger Zone */}
      <div
        className="mt-6 p-5 rounded-xl"
        style={{ background: "rgba(244,63,94,0.04)", border: "1px solid rgba(244,63,94,0.15)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4" style={{ color: "var(--danger)" }} />
          <h3 className="text-sm font-bold" style={{ color: "var(--danger)" }}>Danger Zone</h3>
        </div>
        <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Resetting will permanently wipe all locally saved tasks, work logs, streak data, job applications, and evidence. This cannot be undone.
        </p>

        {!resetConfirm ? (
          <button
            onClick={() => setResetConfirm(true)}
            className="btn-danger text-xs py-2 flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset Sprint
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold" style={{ color: "var(--danger)" }}>Are you sure?</p>
            <button onClick={handleReset} className="btn-danger text-xs py-2 px-3">Yes, reset</button>
            <button onClick={() => setResetConfirm(false)} className="btn-ghost text-xs py-2 px-3">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
