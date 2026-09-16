"use client";

// Days-of-use streak — distinct from a topic's correct-answer streak.
// Records one visit per calendar day (device-local date) and tracks
// consecutive days, independent of which topic (if any) was practiced.

const KEY = "mathly.daily-streak.v1";

export interface DailyStreak {
  lastVisitDate: string | null; // YYYY-MM-DD, device-local
  currentStreak: number;
  bestStreak: number;
  totalDaysActive: number;
}

function defaultStreak(): DailyStreak {
  return { lastVisitDate: null, currentStreak: 0, bestStreak: 0, totalDaysActive: 0 };
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`).getTime();
  const db = new Date(`${b}T00:00:00`).getTime();
  return Math.round((db - da) / 86_400_000);
}

function load(): DailyStreak {
  if (typeof window === "undefined") return defaultStreak();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultStreak();
    return { ...defaultStreak(), ...(JSON.parse(raw) as DailyStreak) };
  } catch {
    return defaultStreak();
  }
}

function save(streak: DailyStreak) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(streak));
  } catch {
    // localStorage unavailable — streak just won't persist.
  }
}

export function readDailyStreak(): DailyStreak {
  return load();
}

/** Call once per app session (not per page nav) — records today's visit if not already recorded, and returns the up-to-date streak either way. */
export function recordDailyVisit(): DailyStreak {
  const prev = load();
  const today = todayStr();
  if (prev.lastVisitDate === today) return prev;

  const currentStreak = prev.lastVisitDate === null ? 1 : daysBetween(prev.lastVisitDate, today) === 1 ? prev.currentStreak + 1 : 1;
  const next: DailyStreak = {
    lastVisitDate: today,
    currentStreak,
    bestStreak: Math.max(prev.bestStreak, currentStreak),
    totalDaysActive: prev.totalDaysActive + 1,
  };
  save(next);
  return next;
}
