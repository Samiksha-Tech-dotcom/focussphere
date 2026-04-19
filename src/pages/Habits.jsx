// src/pages/Habits.jsx
import React, { useState, useMemo, useCallback } from "react";
import { useHabits } from "../hooks/useHabits";
import AppLayout from "../components/layout/AppLayout";
import { Plus, Trash2, Edit3, Check, Flame, X, Calendar } from "lucide-react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import toast from "react-hot-toast";

const EMOJIS = ["📚", "💪", "🧘", "💧", "🏃", "🎯", "✍️", "🎨", "🧠", "🌱"];
const COLORS = ["#7c5cff", "#ff5c8a", "#5cffd4", "#ffb347", "#5cb8ff", "#ff7c5c"];

const HabitRow = ({ habit, onToggle, onDelete, onEdit }) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const isDoneToday = habit.completedDates?.includes(today);

  // Last 21 days for grid
  const days = useMemo(() =>
    eachDayOfInterval({ start: subDays(new Date(), 20), end: new Date() }).map((d) => {
      const str = format(d, "yyyy-MM-dd");
      return { str, done: habit.completedDates?.includes(str) };
    }), [habit.completedDates]);

  const streak = useMemo(() => {
    let s = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].done) s++;
      else break;
    }
    return s;
  }, [days]);

  return (
    <div className="glass" style={{ padding: 20, transition: "transform 0.15s" }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = ""}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Toggle button */}
        <button onClick={() => onToggle(habit.id)} style={{
          width: 40, height: 40, borderRadius: "50%", border: `2px solid ${isDoneToday ? habit.color || "var(--accent)" : "var(--border)"}`,
          background: isDoneToday ? (habit.color || "var(--accent)") : "transparent",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s", flexShrink: 0,
        }}>
          {isDoneToday ? <Check size={16} color="white" strokeWidth={3} /> : <span style={{ fontSize: "1.1rem" }}>{habit.emoji || "📌"}</span>}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.95rem" }}>{habit.name}</span>
            {streak > 0 && (
              <div className="badge badge-orange" style={{ gap: 3 }}>
                <Flame size={10} /> {streak}
              </div>
            )}
            {isDoneToday && <div className="badge badge-green" style={{ fontSize: "0.7rem" }}>Done ✓</div>}
          </div>

          {/* 21-day grid */}
          <div style={{ display: "flex", gap: 3 }}>
            {days.map((day) => (
              <div key={day.str} title={day.str} style={{
                width: 12, height: 12, borderRadius: 3,
                background: day.done ? (habit.color || "var(--accent)") : "rgba(255,255,255,0.06)",
                transition: "background 0.2s",
              }} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => onEdit(habit)} className="btn-ghost" style={{ padding: "6px 8px" }}>
            <Edit3 size={14} />
          </button>
          <button onClick={() => onDelete(habit.id)} className="btn-ghost" style={{ padding: "6px 8px", color: "var(--danger)" }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const HabitModal = ({ habit, onClose, onSave }) => {
  const [form, setForm] = useState(habit || { name: "", emoji: "📚", color: "#7c5cff", description: "" });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="glass" style={{ width: "100%", maxWidth: 440, padding: 32, animation: "fadeUp 0.2s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Syne", fontWeight: 700 }}>{habit ? "Edit Habit" : "New Habit"}</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: "6px 8px" }}><X size={16} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Habit Name *</label>
            <input className="input" placeholder="e.g. Read 30 minutes" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Pick Emoji</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {EMOJIS.map((em) => (
                <button key={em} onClick={() => setForm({ ...form, emoji: em })} style={{
                  width: 40, height: 40, borderRadius: 10, border: `2px solid ${form.emoji === em ? "var(--accent)" : "var(--border)"}`,
                  background: form.emoji === em ? "rgba(124,92,255,0.15)" : "transparent",
                  cursor: "pointer", fontSize: "1.2rem", transition: "all 0.15s"
                }}>{em}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Color</label>
            <div style={{ display: "flex", gap: 8 }}>
              {COLORS.map((c) => (
                <button key={c} onClick={() => setForm({ ...form, color: c })} style={{
                  width: 28, height: 28, borderRadius: "50%", background: c, border: `3px solid ${form.color === c ? "white" : "transparent"}`,
                  cursor: "pointer", transition: "all 0.15s"
                }} />
              ))}
            </div>
          </div>

          <div>
            <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "block", marginBottom: 8 }}>Notes (optional)</label>
            <input className="input" placeholder="Why this habit matters to you..." value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={() => { if (!form.name.trim()) return toast.error("Name required"); onSave(form); }} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
            {habit ? "Save Changes" : "Add Habit"}
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const Habits = () => {
  const { habits, loading, add, update, remove, toggle } = useHabits();
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const today = format(new Date(), "yyyy-MM-dd");
  const completedToday = habits.filter((h) => h.completedDates?.includes(today)).length;
  const allDone = habits.length > 0 && completedToday === habits.length;

  const handleSave = useCallback(async (form) => {
    if (editingHabit) {
      await update(editingHabit.id, { name: form.name, emoji: form.emoji, color: form.color, description: form.description });
      toast.success("Habit updated!");
    } else {
      await add({ name: form.name, emoji: form.emoji, color: form.color, description: form.description });
    }
    setShowModal(false);
    setEditingHabit(null);
  }, [editingHabit, add, update]);

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowModal(true);
  };

  return (
    <AppLayout>
      <div style={{ padding: "40px 48px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", marginBottom: 4 }}>Habit Tracker</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              {format(new Date(), "EEEE, MMMM d")} · {completedToday}/{habits.length} done today
            </p>
          </div>
          <button onClick={() => { setEditingHabit(null); setShowModal(true); }} className="btn-primary">
            <Plus size={16} /> Add Habit
          </button>
        </div>

        {/* Today's progress bar */}
        {habits.length > 0 && (
          <div className="glass" style={{ padding: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Calendar size={16} color="var(--accent)" />
                <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.9rem" }}>Today's Progress</span>
              </div>
              <span style={{ fontFamily: "Syne", fontWeight: 800, color: allDone ? "var(--success)" : "var(--accent)" }}>
                {completedToday}/{habits.length}
              </span>
            </div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: allDone ? "var(--success)" : "linear-gradient(90deg, var(--accent), var(--accent-2))",
                width: `${habits.length > 0 ? (completedToday / habits.length) * 100 : 0}%`,
                transition: "width 0.5s ease",
              }} />
            </div>
            {allDone && (
              <p style={{ marginTop: 10, color: "var(--success)", fontSize: "0.82rem", fontFamily: "Syne", fontWeight: 600 }}>
                🎉 All habits completed for today! Amazing!
              </p>
            )}
          </div>
        )}

        {/* Habits list */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        ) : habits.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {habits.map((habit) => (
              <HabitRow key={habit.id} habit={habit} onToggle={toggle} onDelete={remove} onEdit={handleEdit} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🌱</div>
            <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1rem", marginBottom: 8 }}>No habits yet</p>
            <p style={{ fontSize: "0.875rem", marginBottom: 24 }}>Add your first habit and start building consistency</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              <Plus size={16} /> Add Your First Habit
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <HabitModal
          habit={editingHabit}
          onClose={() => { setShowModal(false); setEditingHabit(null); }}
          onSave={handleSave}
        />
      )}
    </AppLayout>
  );
};

export default Habits;
