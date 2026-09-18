"use client";

// Days-of-use streak — distinct from a topic's correct-answer streak.
// Records one visit per calendar day and tracks consecutive days,
// independent of which topic (if any) was practiced. Backed by the DB
// (via /api/streak) so it's shared across devices.

export interface DailyStreak {
  lastVisitDate: string | null; // YYYY-MM-DD
  currentStreak: number;
  bestStreak: number;
  totalDaysActive: number;
}

function defaultStreak(): DailyStreak {
  return { lastVisitDate: null, currentStreak: 0, bestStreak: 0, totalDaysActive: 0 };
}

export async function readDailyStreak(): Promise<DailyStreak> {
  try {
    const res = await fetch("/api/streak", { cache: "no-store" });
    if (!res.ok) return defaultStreak();
    return { ...defaultStreak(), ...((await res.json()) as DailyStreak) };
  } catch {
    return defaultStreak();
  }
}

/** Call once per app session (not per page nav) — records today's visit if not already recorded, and returns the up-to-date streak either way. */
export async function recordDailyVisit(): Promise<DailyStreak> {
  try {
    const res = await fetch("/api/streak", { method: "POST" });
    if (!res.ok) return defaultStreak();
    return { ...defaultStreak(), ...((await res.json()) as DailyStreak) };
  } catch {
    return defaultStreak();
  }
}
