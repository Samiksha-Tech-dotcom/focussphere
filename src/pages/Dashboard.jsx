// src/pages/Dashboard.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSessions } from "../hooks/useSessions";
import { useHabits } from "../hooks/useHabits";
import { useTimer } from "../context/TimerContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Timer, Users, Flame, Zap, TrendingUp, CheckCircle2, ArrowRight, Brain } from "lucide-react";
import { format } from "date-fns";
import AppLayout from "../components/layout/AppLayout";

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="glass" style={{ padding: 24, transition: "transform 0.2s" }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = ""}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={18} color={color} />
      </div>
    </div>
    <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "2rem", color: "var(--text-primary)", lineHeight: 1 }}>{value}</div>
    <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: 6 }}>{label}</div>
    {sub && <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: 4 }}>{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass" style={{ padding: "10px 14px", fontSize: "0.8rem" }}>
      <div style={{ color: "var(--text-secondary)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "Syne", fontWeight: 700, color: "var(--accent)" }}>{payload[0].value} min</div>
    </div>
  );
};

const Dashboard = () => {
  const { userProfile } = useAuth();
  const { stats, loading: sessionsLoading } = useSessions();
  const { habits } = useHabits();
  const { isRunning, timeLeft, isBreak } = useTimer();

  const todayCompletedHabits = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    return habits.filter((h) => h.completedDates?.includes(today)).length;
  }, [habits]);

  const insights = useMemo(() => {
    const list = [];
    if (stats.bestTimeLabel) list.push(`🕐 You focus best in the ${stats.bestTimeLabel}`);
    if (userProfile?.currentStreak >= 3) list.push(`🔥 ${userProfile.currentStreak}-day streak — keep it up!`);
    if (stats.todayMinutes >= 60) list.push(`💪 You've crossed 1 hour of focus today`);
    if (stats.avgDaily > 0) list.push(`📊 You average ${Math.round(stats.avgDaily)} min/day`);
    if (todayCompletedHabits === habits.length && habits.length > 0) list.push(`✅ All habits done today!`);
    return list.slice(0, 3);
  }, [stats, userProfile, todayCompletedHabits, habits]);

  return (
    <AppLayout>
      <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: "2rem", marginBottom: 6 }}>
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
            <span style={{ color: "var(--accent)" }}>{userProfile?.displayName?.split(" ")[0] || "Focuser"}</span> 👋
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            {format(new Date(), "EEEE, MMMM d")} · {stats.todayMinutes > 0 ? `${stats.todayMinutes} min focused today` : "Ready to start focusing?"}
          </p>
        </div>

        {/* Live Timer Banner */}
        {isRunning && (
          <Link to="/focus" style={{ textDecoration: "none", display: "block", marginBottom: 24 }}>
            <div style={{
              background: isBreak ? "rgba(92,255,212,0.06)" : "linear-gradient(135deg, rgba(124,92,255,0.1), rgba(255,92,138,0.05))",
              border: `1px solid ${isBreak ? "rgba(92,255,212,0.2)" : "rgba(124,92,255,0.25)"}`,
              borderRadius: "var(--radius-lg)", padding: "16px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: isBreak ? "var(--success)" : "var(--accent)", animation: "pulse-ring 2s infinite" }} />
                <span style={{ fontFamily: "Syne", fontWeight: 700, color: isBreak ? "var(--success)" : "var(--accent)" }}>
                  {isBreak ? "Break Time" : "Focusing"}
                </span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")} remaining
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.8rem" }}>
                Go to timer <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        )}

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          <StatCard icon={Timer} label="Minutes today" value={stats.todayMinutes || 0} color="var(--accent)" sub={`${stats.todaySessions} sessions`} />
          <StatCard icon={Flame} label="Day streak" value={userProfile?.currentStreak || 0} color="var(--accent-2)" sub={`Best: ${userProfile?.longestStreak || 0}`} />
          <StatCard icon={Zap} label="Sessions done" value={userProfile?.sessionsCompleted || 0} color="var(--success)" sub="Total all time" />
          <StatCard icon={CheckCircle2} label="Habits today" value={`${todayCompletedHabits}/${habits.length}`} color="var(--warning)" sub="completed" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
          {/* Chart */}
          <div className="glass" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1rem" }}>Weekly Focus</h2>
              <span className="badge badge-purple"><TrendingUp size={11} /> Last 7 days</span>
            </div>
            {sessionsLoading ? (
              <div style={{ height: 200 }}>
                {Array(7).fill(0).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 12, marginBottom: 8, width: `${Math.random() * 60 + 20}%` }} />
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.weeklyData} barSize={24}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12, fontFamily: "DM Sans" }} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                    {stats.weeklyData?.map((entry, i) => (
                      <Cell key={i} fill={entry.minutes > 0 ? "var(--accent)" : "rgba(255,255,255,0.06)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Insights */}
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Brain size={16} color="var(--accent)" />
                <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.95rem" }}>Focus Insights</h2>
              </div>
              {insights.length ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {insights.map((insight, i) => (
                    <div key={i} style={{ padding: "10px 14px", background: "rgba(124,92,255,0.06)", borderRadius: "var(--radius-md)", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                      {insight}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>Complete sessions to unlock insights</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="glass" style={{ padding: 24 }}>
              <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.95rem", marginBottom: 14 }}>Quick Actions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { to: "/focus", icon: Timer, label: "Start Focus Session", color: "var(--accent)" },
                  { to: "/rooms", icon: Users, label: "Join Study Room", color: "var(--accent-2)" },
                ].map(({ to, icon: Icon, label, color }) => (
                  <Link key={to} to={to} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontSize: "0.875rem", fontFamily: "Syne", fontWeight: 600, transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = color + "44"; e.currentTarget.style.background = color + "0a"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.background = ""; }}>
                    <Icon size={15} color={color} />
                    {label}
                    <ArrowRight size={12} style={{ marginLeft: "auto", color: "var(--text-muted)" }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
