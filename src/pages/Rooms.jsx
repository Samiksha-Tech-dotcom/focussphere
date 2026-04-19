// src/pages/Rooms.jsx
import React, { useState, useCallback } from "react";
import { useRooms } from "../hooks/useRooms";
import { useAuth } from "../context/AuthContext";
import { useTimer } from "../context/TimerContext";
import AppLayout from "../components/layout/AppLayout";
import { Users, Plus, LogOut, Play, Pause, Search, Lock, Globe } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["All", "Coding", "Design", "Exam Prep", "Reading", "Writing", "General"];

const RoomCard = ({ room, onJoin, isCurrent, userId }) => {
  const isCreator = room.createdBy === userId;
  return (
    <div className="glass" style={{
      padding: 20, cursor: "pointer", transition: "all 0.2s",
      border: isCurrent ? "1px solid rgba(124,92,255,0.4)" : "1px solid var(--border)",
      background: isCurrent ? "rgba(124,92,255,0.06)" : "var(--bg-card)",
    }}
      onMouseEnter={(e) => { if (!isCurrent) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}}
      onMouseLeave={(e) => { if (!isCurrent) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = ""; }}}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.95rem" }}>{room.name}</h3>
            {room.isPrivate ? <Lock size={12} color="var(--text-muted)" /> : <Globe size={12} color="var(--text-muted)" />}
          </div>
          <div className="badge badge-purple" style={{ fontSize: "0.7rem" }}>{room.category || "General"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", animation: "pulse-ring 2s infinite" }} />
          <span style={{ color: "var(--success)", fontFamily: "Syne", fontWeight: 700, fontSize: "0.8rem" }}>Live</span>
        </div>
      </div>

      {/* Avatars */}
      <div style={{ display: "flex", alignItems: "center", gap: -4, marginBottom: 14 }}>
        {(room.members || []).slice(0, 5).map((uid, i) => (
          <img key={uid} src={`https://api.dicebear.com/7.x/shapes/svg?seed=${uid}`} alt="member"
            style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid var(--bg-base)", marginLeft: i > 0 ? -8 : 0 }} />
        ))}
        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginLeft: 8 }}>
          {room.memberCount || 0} member{room.memberCount !== 1 ? "s" : ""}
        </span>
      </div>

      {room.description && (
        <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginBottom: 14, lineHeight: 1.5 }}>{room.description}</p>
      )}

      {!isCurrent ? (
        <button onClick={() => onJoin(room)} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "9px 16px", fontSize: "0.85rem" }}>
          Join Room
        </button>
      ) : (
        <div className="badge badge-green" style={{ display: "flex", justifyContent: "center", padding: "8px 16px" }}>
          ✓ You're in this room
        </div>
      )}
    </div>
  );
};

const Rooms = () => {
  const { rooms, loading, currentRoom, create, join, leave } = useRooms();
  const { user } = useAuth();
  const { isRunning, start, pause, timeLeft, isBreak } = useTimer();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [form, setForm] = useState({ name: "", description: "", category: "General", isPrivate: false });

  const filtered = rooms.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || r.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleCreate = useCallback(async () => {
    if (!form.name.trim()) return toast.error("Room name required");
    await create(form);
    setShowCreate(false);
    setForm({ name: "", description: "", category: "General", isPrivate: false });
  }, [form, create]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <AppLayout>
      <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", marginBottom: 4 }}>Study Rooms</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{rooms.length} active room{rooms.length !== 1 ? "s" : ""} live now</p>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">
            <Plus size={16} /> Create Room
          </button>
        </div>

        {/* Current room banner */}
        {currentRoom && (
          <div style={{
            background: "rgba(124,92,255,0.08)", border: "1px solid rgba(124,92,255,0.25)",
            borderRadius: "var(--radius-lg)", padding: "20px 24px", marginBottom: 24,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 4, color: "var(--accent)" }}>
                📍 {currentRoom.name}
              </div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                {isRunning ? `${isBreak ? "Break" : "Focusing"} · ${formatTime(timeLeft)}` : "Timer not running"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={isRunning ? pause : start}
                className={isRunning ? "btn-secondary" : "btn-primary"} style={{ padding: "9px 16px", gap: 8 }}>
                {isRunning ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Focus</>}
              </button>
              <button onClick={leave} className="btn-ghost" style={{ padding: "9px 16px", color: "var(--danger)", gap: 6 }}>
                <LogOut size={14} /> Leave
              </button>
            </div>
          </div>
        )}

        {/* Create form */}
        {showCreate && (
          <div className="glass" style={{ padding: 28, marginBottom: 24, animation: "fadeUp 0.2s ease" }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20 }}>Create Study Room</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Room Name *</label>
                <input className="input" placeholder="e.g. CS Exam Crunch" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Category</label>
                <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={{ cursor: "pointer" }}>
                  {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Description (optional)</label>
              <input className="input" placeholder="What are you studying?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleCreate} className="btn-primary">Create Room</button>
              <button onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        )}

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input className="input" placeholder="Search rooms..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 42 }} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setActiveCategory(c)} style={{
                padding: "8px 16px", borderRadius: 999, border: `1px solid ${activeCategory === c ? "var(--accent)" : "var(--border)"}`,
                background: activeCategory === c ? "rgba(124,92,255,0.15)" : "transparent",
                color: activeCategory === c ? "var(--accent)" : "var(--text-secondary)",
                cursor: "pointer", fontSize: "0.8rem", fontFamily: "Syne", fontWeight: 600, transition: "all 0.15s"
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 180, borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        ) : filtered.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {filtered.map((room) => (
              <RoomCard key={room.id} room={room} onJoin={join} isCurrent={currentRoom?.id === room.id} userId={user?.uid} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--text-muted)" }}>
            <Users size={40} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
            <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1rem", marginBottom: 8 }}>No rooms yet</p>
            <p style={{ fontSize: "0.875rem" }}>Create the first room and invite others!</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Rooms;
