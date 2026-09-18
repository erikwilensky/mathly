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

/** Read a topic's progress from the DB — for read-only overviews (e.g. the campaign map) that list every topic at once. */
export async function loadTopicProgress(topicId: string): Promise<TopicProgress> {
  try {
    const res = await fetch(`/api/progress/${topicId}`, { cache: "no-store" });
    if (!res.ok) return defaultProgress();
    const parsed = (await res.json()) as TopicProgress;
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

function save(topicId: string, progress: TopicProgress) {
  fetch(`/api/progress/${topicId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(progress),
  }).catch(() => {
    // Best-effort — if the save fails, the next successful GET will still
    // reflect whatever was last persisted; local UI state is unaffected.
  });
}

/** topicId keys the DB row, e.g. "factoring-quadratics" — keep it stable per topic or progress resets. */
export function useProgress(topicId: string) {
  const [progress, setProgress] = useState<TopicProgress>(defaultProgress);

  useEffect(() => {
    let cancelled = false;
    loadTopicProgress(topicId).then((loaded) => {
      if (!cancelled) setProgress(loaded);
    });
    return () => {
      cancelled = true;
    };
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
