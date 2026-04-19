// src/pages/Auth.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser, loginUser, loginWithGoogle } from "../services/authService";
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const Auth = () => {
  const [params] = useSearchParams();
  const [isSignup, setIsSignup] = useState(params.get("mode") === "signup");
  const [form, setForm] = useState({ email: "", password: "", displayName: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        if (!form.displayName.trim()) return toast.error("Name required");
        await registerUser(form.email, form.password, form.displayName);
        toast.success("Welcome to FocusSphere! 🚀");
      } else {
        await loginUser(form.email, form.password);
        toast.success("Welcome back! 👋");
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message.replace("Firebase: ", "").replace(/\(.*\)/, ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <div className="orb" style={{ width: 600, height: 600, background: "var(--accent)", top: -200, left: -200, opacity: 0.1 }} />
      <div className="orb" style={{ width: 400, height: 400, background: "var(--accent-2)", bottom: -100, right: -100, opacity: 0.1 }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Back */}
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", textDecoration: "none", fontSize: "0.85rem", marginBottom: 32, transition: "color 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
          <ArrowLeft size={14} /> Back to home
        </Link>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, var(--accent), var(--accent-2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={20} color="white" />
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.3rem" }}>
            Focus<span style={{ color: "var(--accent)" }}>Sphere</span>
          </span>
        </div>

        <div className="glass" style={{ padding: 32 }}>
          <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.6rem", marginBottom: 6 }}>
            {isSignup ? "Create account" : "Welcome back"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: 28 }}>
            {isSignup ? "Start your deep work journey" : "Continue your focus streak"}
          </p>

          {/* Google */}
          <button onClick={handleGoogle} className="btn-secondary" style={{ width: "100%", justifyContent: "center", marginBottom: 20, gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {isSignup && (
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input className="input" placeholder="Display name" value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  style={{ paddingLeft: 40 }} required />
              </div>
            )}
            <div style={{ position: "relative" }}>
              <Mail size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="input" type="email" placeholder="Email address" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ paddingLeft: 40 }} required />
            </div>
            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="input" type={showPass ? "text" : "password"} placeholder="Password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingLeft: 40, paddingRight: 44 }} required minLength={6} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <button type="submit" className="btn-primary" style={{ justifyContent: "center", padding: "13px 24px", fontSize: "0.95rem", marginTop: 4, opacity: loading ? 0.6 : 1 }} disabled={loading}>
              {loading ? "Loading..." : isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button onClick={() => setIsSignup(!isSignup)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontFamily: "Syne", fontWeight: 700 }}>
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
