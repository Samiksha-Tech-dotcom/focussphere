// src/pages/Landing.jsx
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Zap, Users, Timer, BarChart2, CheckSquare, ArrowRight, Star } from "lucide-react";

const Feature = ({ icon: Icon, title, desc, color }) => (
  <div className="glass" style={{ padding: 28, transition: "transform 0.2s, border-color 0.2s" }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = color + "44"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = ""; }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
      <Icon size={20} color={color} />
    </div>
    <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 8, fontSize: "1rem" }}>{title}</h3>
    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>{desc}</p>
  </div>
);

const Landing = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 20;
      const y = ((e.clientY - top) / height - 0.5) * 20;
      heroRef.current.style.setProperty("--rx", `${y}deg`);
      heroRef.current.style.setProperty("--ry", `${x}deg`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", overflowX: "hidden", position: "relative" }}>
      {/* Ambient BG */}
      <div className="orb" style={{ width: 800, height: 800, background: "var(--accent)", top: -300, left: "50%", transform: "translateX(-50%)", opacity: 0.08 }} />
      <div className="orb" style={{ width: 400, height: 400, background: "var(--accent-2)", bottom: 0, right: 0, opacity: 0.08 }} />

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 60px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100, background: "rgba(6,8,16,0.8)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, var(--accent), var(--accent-2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.2rem" }}>
            Focus<span style={{ color: "var(--accent)" }}>Sphere</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/auth" className="btn-secondary" style={{ padding: "9px 20px" }}>Sign in</Link>
          <Link to="/auth?mode=signup" className="btn-primary" style={{ padding: "9px 20px" }}>Get Started <ArrowRight size={14} /></Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "120px 24px 80px", maxWidth: 800, margin: "0 auto" }}>
        <div className="badge badge-purple" style={{ marginBottom: 24, display: "inline-flex" }}>
          <Star size={12} /> Social Deep Work Platform
        </div>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.03em" }}>
          Focus deeper,{" "}
          <span style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            together.
          </span>
        </h1>
        <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
          Combine Pomodoro focus sessions, live study rooms, and habit tracking — with real people keeping you accountable.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/auth?mode=signup" className="btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Start Studying Free <ArrowRight size={16} />
          </Link>
          <Link to="/auth" className="btn-secondary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Sign In
          </Link>
        </div>
        <p style={{ marginTop: 20, color: "var(--text-muted)", fontSize: "0.8rem" }}>No credit card · Free forever</p>
      </section>

      {/* Mock UI Preview */}
      <section style={{ maxWidth: 900, margin: "0 auto 100px", padding: "0 24px" }}>
        <div ref={heroRef} className="glass" style={{
          padding: 24, borderRadius: "var(--radius-xl)",
          transform: "perspective(1000px) rotateX(var(--rx, 2deg)) rotateY(var(--ry, -2deg))",
          transition: "transform 0.1s ease",
          background: "rgba(255,255,255,0.02)",
          overflow: "hidden",
        }}>
          {/* Fake timer UI */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
            <div style={{ flex: 1, height: 8, background: "var(--border)", borderRadius: 99 }}>
              <div style={{ width: "60%", height: "100%", background: "linear-gradient(90deg, var(--accent), var(--accent-2))", borderRadius: 99 }} />
            </div>
            <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "2rem", color: "var(--accent)" }}>15:00</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {["Alex", "Priya", "Dev"].map((name, i) => (
              <div key={name} className="glass" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${name}`} alt={name} style={{ width: 32, height: 32, borderRadius: "50%" }} />
                <div>
                  <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.8rem" }}>{name}</div>
                  <div className="badge badge-green" style={{ padding: "2px 8px", fontSize: "0.7rem" }}>Studying</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: "0 auto 100px", padding: "0 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: 12 }}>Everything you need to stay in flow</h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: 48, maxWidth: 480, margin: "0 auto 48px" }}>
          Built for students, remote learners, and solo developers who want to do their best work.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <Feature icon={Users} title="Live Study Rooms" color="var(--accent)"
            desc="Join virtual rooms with other learners. See who's studying, share energy, stay accountable." />
          <Feature icon={Timer} title="Smart Pomodoro" color="var(--accent-2)"
            desc="Custom intervals, auto-cycles, sound alerts. Track every minute of deep work automatically." />
          <Feature icon={BarChart2} title="Productivity Dashboard" color="var(--success)"
            desc="Daily and weekly focus stats, streak tracking, graphs, and personalized insights." />
          <Feature icon={CheckSquare} title="Habit Tracker" color="var(--warning)"
            desc="Build daily habits with CRUD management, streak highlights, and calendar completion view." />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 60px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
        <span style={{ fontFamily: "Syne", fontWeight: 800, color: "var(--text-secondary)" }}>FocusSphere</span> · Built with React + Firebase
      </footer>
    </div>
  );
};

export default Landing;
