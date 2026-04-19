// src/pages/Focus.jsx
import React, { useState, useMemo, useCallback } from "react";
import { useTimer } from "../context/TimerContext";
import AppLayout from "../components/layout/AppLayout";
import { Play, Pause, RotateCcw, Settings, Coffee, Zap } from "lucide-react";

const Focus = () => {
  const {
    timeLeft, isRunning, isBreak, cycle, sessionLabel,
    focusDuration, breakDuration,
    start, pause, reset, setSessionLabel,
    updateFocusDuration, updateBreakDuration,
  } = useTimer();

  const [showSettings, setShowSettings] = useState(false);
  const [focusMins, setFocusMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);

  const totalSecs = isBreak ? breakDuration : focusDuration;
  const progress = useMemo(() => ((totalSecs - timeLeft) / totalSecs) * 100, [timeLeft, totalSecs, focusDuration, breakDuration]);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = useCallback((s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`, []);

  const applySettings = () => {
    updateFocusDuration(focusMins);
    updateBreakDuration(breakMins);
    setShowSettings(false);
  };

  const LABELS = ["Deep Focus", "Study Session", "Coding", "Reading", "Writing", "Research"];

  return (
    <AppLayout>
      <div style={{ padding: "40px 48px", maxWidth: 800, margin: "0 auto", minHeight: "calc(100vh - 0px)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", marginBottom: 4 }}>Focus Timer</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Session {cycle} · {isBreak ? "Break" : "Focus"}</p>
          </div>
          <button onClick={() => setShowSettings(!showSettings)} className="btn-secondary" style={{ padding: "9px 16px", gap: 8 }}>
            <Settings size={15} /> Settings
          </button>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="glass" style={{ padding: 24, marginBottom: 32, animation: "fadeUp 0.2s ease" }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20 }}>Timer Settings</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Focus Duration (min)</label>
                <input className="input" type="number" min={1} max={120} value={focusMins} onChange={(e) => setFocusMins(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Break Duration (min)</label>
                <input className="input" type="number" min={1} max={60} value={breakMins} onChange={(e) => setBreakMins(Number(e.target.value))} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Session Label</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {LABELS.map((l) => (
                  <button key={l} onClick={() => setSessionLabel(l)} style={{
                    padding: "6px 14px", borderRadius: 999,
                    border: `1px solid ${sessionLabel === l ? "var(--accent)" : "var(--border)"}`,
                    background: sessionLabel === l ? "rgba(124,92,255,0.15)" : "transparent",
                    color: sessionLabel === l ? "var(--accent)" : "var(--text-secondary)",
                    cursor: "pointer", fontSize: "0.8rem", fontFamily: "Syne", fontWeight: 600, transition: "all 0.15s"
                  }}>{l}</button>
                ))}
              </div>
            </div>
            <button onClick={applySettings} className="btn-primary" style={{ padding: "10px 20px" }}>Apply</button>
          </div>
        )}

        {/* Timer Circle */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", marginBottom: 48 }}>
            {/* Glow */}
            <div style={{
              position: "absolute", inset: -20, borderRadius: "50%",
              background: isBreak ? "radial-gradient(circle, rgba(92,255,212,0.12) 0%, transparent 70%)" : "radial-gradient(circle, rgba(124,92,255,0.15) 0%, transparent 70%)",
              transition: "background 0.5s",
            }} />

            <svg width="280" height="280" style={{ transform: "rotate(-90deg)" }}>
              {/* Background circle */}
              <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              {/* Progress circle */}
              <circle
                cx="140" cy="140" r="120" fill="none"
                stroke={isBreak ? "var(--success)" : "var(--accent)"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
              />
            </svg>

            {/* Center content */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                {isBreak ? <Coffee size={16} color="var(--success)" /> : <Zap size={16} color="var(--accent)" />}
                <span style={{ color: isBreak ? "var(--success)" : "var(--accent)", fontSize: "0.8rem", fontFamily: "Syne", fontWeight: 700 }}>
                  {isBreak ? "BREAK" : sessionLabel.toUpperCase()}
                </span>
              </div>
              <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "3.5rem", lineHeight: 1, color: "var(--text-primary)", letterSpacing: "-0.04em" }}>
                {formatTime(timeLeft)}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: 8 }}>
                Cycle {cycle}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={reset} className="btn-secondary" style={{ borderRadius: "50%", width: 48, height: 48, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <RotateCcw size={18} />
            </button>

            <button
              onClick={isRunning ? pause : start}
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: isBreak ? "var(--success)" : "var(--accent)",
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 8px 32px ${isBreak ? "rgba(92,255,212,0.3)" : "rgba(124,92,255,0.4)"}`,
                transition: "all 0.2s", color: "white",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = ""}
            >
              {isRunning ? <Pause size={28} /> : <Play size={28} fill="white" />}
            </button>

            <div style={{ width: 48, height: 48 }} /> {/* spacer */}
          </div>

          {/* Tips */}
          <div style={{ marginTop: 48, textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
              {isBreak ? "☕ Step away, hydrate, and rest your eyes" : "📴 Close distracting tabs and silence notifications"}
            </p>
          </div>

          {/* Cycle progress dots */}
          <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
            {Array.from({ length: Math.min(cycle + 2, 8) }, (_, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%",
                background: i < cycle ? "var(--accent)" : "var(--border)",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Focus;
