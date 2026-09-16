"use client";

import { useCallback, useEffect, useState } from "react";
import type { LevelId } from "./levels";

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

export { UNLOCK_THRESHOLD };

function storageKey(topicId: string): string {
  return `mathly.${topicId}.v1`;
}

/** Read a topic's progress without subscribing to it as a hook would — for read-only overviews (e.g. the campaign map) that list every topic at once. */
export function loadTopicProgress(topicId: string): TopicProgress {
  return load(topicId);
}

function load(topicId: string): TopicProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = window.localStorage.getItem(storageKey(topicId));
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as TopicProgress;
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

function save(topicId: string, progress: TopicProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(topicId), JSON.stringify(progress));
  } catch {
    // localStorage unavailable (private browsing, etc.) — progress just won't persist.
  }
}

/** topicId keys the localStorage entry, e.g. "factoring-quadratics" — keep it stable per topic or progress resets. */
export function useProgress(topicId: string) {
  const [progress, setProgress] = useState<TopicProgress>(defaultProgress);

  useEffect(() => {
    setProgress(load(topicId));
  }, [topicId]);

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
      save(topicId, next);
      return next;
    });
  }, [topicId]);

  const isUnlocked = useCallback((level: LevelId) => progress.unlockedLevels.includes(level), [progress]);

  return { progress, recordAttempt, isUnlocked, unlockThreshold: UNLOCK_THRESHOLD };
}
