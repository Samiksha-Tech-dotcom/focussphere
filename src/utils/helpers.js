// src/utils/helpers.js

/**
 * Format seconds to MM:SS string
 */
export const formatTime = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

/**
 * Format minutes into human readable string
 */
export const formatMinutes = (mins) => {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

/**
 * Calculate streak from sorted array of date strings (yyyy-MM-dd)
 */
export const calculateStreak = (dates) => {
  if (!dates || dates.length === 0) return 0;
  const sorted = [...dates].sort().reverse();
  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (const dateStr of sorted) {
    const d = new Date(dateStr);
    const diff = Math.round((current - d) / (1000 * 60 * 60 * 24));
    if (diff === 0 || diff === 1) {
      streak++;
      current = d;
    } else {
      break;
    }
  }
  return streak;
};

/**
 * Group sessions by date and sum minutes
 */
export const groupSessionsByDate = (sessions) => {
  return sessions.reduce((acc, s) => {
    acc[s.date] = (acc[s.date] || 0) + (s.duration || 0);
    return acc;
  }, {});
};

/**
 * Generate avatar URL from seed
 */
export const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}`;

/**
 * Clamp a number between min and max
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
