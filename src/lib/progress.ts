"use client";

import { useCallback, useEffect, useState } from "react";
import type { LevelId } from "./factoring";

const STORAGE_KEY = "mathly.factoring-quadratics.v1";
const UNLOCK_THRESHOLD = 5;

export interface TopicProgress {
  xp: number;
  streak: number;
  bestStreak: number;
  correctByLevel: Record<LevelId, number>;
  attemptsByLevel: Record<LevelId, number>;
  unlockedLevels: LevelId[];
}

function defaultProgress(): TopicProgress {
  return {
    xp: 0,
    streak: 0,
    bestStreak: 0,
    correctByLevel: { 1: 0, 2: 0, 3: 0, 4: 0 },
    attemptsByLevel: { 1: 0, 2: 0, 3: 0, 4: 0 },
    unlockedLevels: [1],
  };
}

function load(): TopicProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as TopicProgress;
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

function save(progress: TopicProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage unavailable (private browsing, etc.) — progress just won't persist.
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<TopicProgress>(defaultProgress);

  useEffect(() => {
    setProgress(load());
  }, []);

  const recordAttempt = useCallback((level: LevelId, correct: boolean) => {
    setProgress((prev) => {
      const next: TopicProgress = {
        ...prev,
        correctByLevel: { ...prev.correctByLevel },
        attemptsByLevel: { ...prev.attemptsByLevel },
        unlockedLevels: [...prev.unlockedLevels],
      };
      next.attemptsByLevel[level] += 1;
      if (correct) {
        next.correctByLevel[level] += 1;
        next.streak += 1;
        next.bestStreak = Math.max(next.bestStreak, next.streak);
        next.xp += 10 + Math.min(next.streak, 5) * 2;
        const nextLevel = (level + 1) as LevelId;
        if (
          nextLevel <= 4 &&
          !next.unlockedLevels.includes(nextLevel) &&
          next.correctByLevel[level] >= UNLOCK_THRESHOLD
        ) {
          next.unlockedLevels.push(nextLevel);
        }
      } else {
        next.streak = 0;
      }
      save(next);
      return next;
    });
  }, []);

  const isUnlocked = useCallback((level: LevelId) => progress.unlockedLevels.includes(level), [progress]);

  return { progress, recordAttempt, isUnlocked, unlockThreshold: UNLOCK_THRESHOLD };
}
