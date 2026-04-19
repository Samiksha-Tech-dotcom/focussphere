// src/pages/Profile.jsx
import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useSessions } from "../hooks/useSessions";
import { useHabits } from "../hooks/useHabits";
import { updateUserProfile } from "../services/dataService";
import AppLayout from "../components/layout/AppLayout";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Edit3, Save, Flame, Zap, Timer, CheckCircle2, Trophy, TrendingUp, X } from "lucide-react";
import { format, subDays } from "date-fns";
import toast from "react-hot-toast";

const ACHIEVEMENTS = [
  { id: "first_session", icon: "🚀", label: "First Focus", desc: "Complete your first session", check: (p) => p.sessionsCompleted >= 1 },
  { id: "streak_3", icon: "🔥", label: "On Fire", desc: "3-day streak", check: (p) => p.currentStreak >= 3 },
  { id: "streak_7", icon: "⚡", label: "Week Warrior", desc: "7-day streak", check: (p) => p.currentStreak >= 7 },
  { id: "hour_club", icon: "⏰", label: "Hour Club", desc: "100+ total minutes focused", check: (p) => p.totalFocusTime >= 100 },
  { id: "habit_10", icon: "✅", label: "Habit Master", desc: "10 total sessions", check: (p) => p.sessionsCompleted >= 10 },
  { id: "marathon", icon: "🏆", label: "Marathon", desc: "500+ total minutes", check: (p) => p.totalFocusTime >= 500 },
];

const Profile = () => {
  const { userProfile, refreshProfile } = useAuth();
  const { stats, sessions } = useSessions();
  const { habits } = useHabits();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || "");
  const [saving, setSaving] = useState(false);

  const achievements = useMemo(() =>
    ACHIEVEMENTS.map((a) => ({ ...a, unlocked: userProfile ? a.check(userProfile) : false })),
    [userProfile]);

  const weeklyData = useMemo(() => stats.weeklyData || [], [stats]);

  const totalHabitCompletions = useMemo(() =>
    habits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0), [habits]);

  const handleSave = async () => {
    if (!displayName.trim()) return toast.error("Name required");
    setSaving(true);
    try {
      await updateUserProfile(userProfile.uid, { displayName });
      await refreshProfile();
      setEditing(false);
      toast.success("Profile updated!");
    } catch (e) {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass" style={{ padding: "8px 12px", fontSize: "0.78rem" }}>
        <div style={{ color: "var(--text-secondary)" }}>{label}</div>
        <div style={{ fontFamily: "Syne", fontWeight: 700, color: "var(--accent)" }}>{payload[0].value} min</div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div style={{ padding: "40px 48px", maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: 32 }}>Profile</h1>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, marginBottom: 20 }}>
          {/* Profile Card */}
          <div className="glass" style={{ padding: 28, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ position: "relative", marginBottom: 20 }}>
              <img
                src={userProfile?.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${userProfile?.uid}`}
                alt="avatar"
                style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid var(--accent)" }}
              />
              <div style={{
                position: "absolute", bottom: 0, right: 0, width: 24, height: 24,
                background: "var(--success)", borderRadius: "50%", border: "2px solid var(--bg-surface)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <div style={{ width: 8, height: 8, background: "white", borderRadius: "50%" }} />
              </div>
            </div>

            {editing ? (
              <div style={{ width: "100%", marginBottom: 16 }}>
                <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  style={{ textAlign: "center", marginBottom: 10 }} />
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  <button onClick={handleSave} className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.8rem", opacity: saving ? 0.6 : 1 }} disabled={saving}>
                    <Save size={13} /> Save
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-secondary" style={{ padding: "8px 12px" }}>
                    <X size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                  <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.1rem" }}>{userProfile?.displayName || "User"}</h2>
                  <button onClick={() => setEditing(true)} className="btn-ghost" style={{ padding: "4px 6px" }}>
                    <Edit3 size={12} />
                  </button>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{userProfile?.email}</p>
              </div>
            )}

            {/* Stats */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: Flame, label: "Current Streak", value: `${userProfile?.currentStreak || 0} days`, color: "var(--accent-2)" },
                { icon: Trophy, label: "Best Streak", value: `${userProfile?.longestStreak || 0} days`, color: "var(--warning)" },
                { icon: Timer, label: "Total Focus", value: `${userProfile?.totalFocusTime || 0} min`, color: "var(--accent)" },
                { icon: Zap, label: "Sessions", value: userProfile?.sessionsCompleted || 0, color: "var(--success)" },
                { icon: CheckCircle2, label: "Habit Completions", value: totalHabitCompletions, color: "var(--accent)" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                    <Icon size={13} color={color} />
                    {label}
                  </div>
                  <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.85rem" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Weekly chart */}
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <TrendingUp size={16} color="var(--accent)" />
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.95rem" }}>Focus Activity</h3>
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={weeklyData} barSize={20}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                    {weeklyData.map((entry, i) => (
                      <Cell key={i} fill={entry.minutes > 0 ? "var(--accent)" : "rgba(255,255,255,0.05)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Achievements */}
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <Trophy size={16} color="var(--warning)" />
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.95rem" }}>Achievements</h3>
                <span className="badge badge-purple" style={{ marginLeft: "auto" }}>
                  {achievements.filter((a) => a.unlocked).length}/{achievements.length}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {achievements.map((a) => (
                  <div key={a.id} style={{
                    padding: "14px 12px", textAlign: "center", borderRadius: "var(--radius-md)",
                    background: a.unlocked ? "rgba(124,92,255,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${a.unlocked ? "rgba(124,92,255,0.25)" : "var(--border)"}`,
                    opacity: a.unlocked ? 1 : 0.4, transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: 6, filter: a.unlocked ? "none" : "grayscale(1)" }}>{a.icon}</div>
                    <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.72rem", marginBottom: 2 }}>{a.label}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.65rem", lineHeight: 1.3 }}>{a.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
