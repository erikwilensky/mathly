import "server-only";
import { createClient } from "@libsql/client";
import type { LevelId } from "./levels";

let schemaReady: Promise<void> | null = null;

function client() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN are not set — progress can't be read or saved.");
  }
  return createClient({ url, authToken });
}

/**
 * Creates the tables on first use if they don't exist yet, and seeds
 * Russell's already-completed Radical Combat levels 1-2 — but only if that
 * row doesn't already exist, so this is safe to run on every cold start
 * without ever overwriting real progress.
 */
function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = client();
      await db.batch(
        [
          `CREATE TABLE IF NOT EXISTS progress (
             topic_id TEXT PRIMARY KEY,
             xp INTEGER NOT NULL DEFAULT 0,
             streak INTEGER NOT NULL DEFAULT 0,
             best_streak INTEGER NOT NULL DEFAULT 0,
             correct_by_level TEXT NOT NULL DEFAULT '{"1":0,"2":0,"3":0,"4":0}',
             attempts_by_level TEXT NOT NULL DEFAULT '{"1":0,"2":0,"3":0,"4":0}',
             unlocked_levels TEXT NOT NULL DEFAULT '[1]',
             updated_at TEXT NOT NULL DEFAULT (datetime('now'))
           )`,
          `CREATE TABLE IF NOT EXISTS daily_streak (
             id INTEGER PRIMARY KEY CHECK (id = 1),
             last_visit_date TEXT,
             current_streak INTEGER NOT NULL DEFAULT 0,
             best_streak INTEGER NOT NULL DEFAULT 0,
             total_days_active INTEGER NOT NULL DEFAULT 0
           )`,
        ],
        "write",
      );
      // Seed: Radical Combat (radical-arithmetic) levels 1 & 2 already completed.
      // XP/streak computed with the same formula recordAttempt uses, for 10
      // straight correct answers (5 at level 1, 5 at level 2).
      await db.execute({
        sql: `INSERT INTO progress (topic_id, xp, streak, best_streak, correct_by_level, attempts_by_level, unlocked_levels)
              SELECT 'radical-arithmetic', 180, 10, 10, '{"1":5,"2":5,"3":0,"4":0}', '{"1":5,"2":5,"3":0,"4":0}', '[1,2,3]'
              WHERE NOT EXISTS (SELECT 1 FROM progress WHERE topic_id = 'radical-arithmetic')`,
        args: [],
      });
    })();
  }
  return schemaReady;
}

export interface TopicProgressRow {
  xp: number;
  streak: number;
  bestStreak: number;
  correctByLevel: Record<LevelId, number>;
  attemptsByLevel: Record<LevelId, number>;
  unlockedLevels: LevelId[];
}

function defaultProgress(): TopicProgressRow {
  return {
    xp: 0,
    streak: 0,
    bestStreak: 0,
    correctByLevel: { 1: 0, 2: 0, 3: 0, 4: 0 },
    attemptsByLevel: { 1: 0, 2: 0, 3: 0, 4: 0 },
    unlockedLevels: [1],
  };
}

export async function getProgress(topicId: string): Promise<TopicProgressRow> {
  await ensureSchema();
  const db = client();
  const res = await db.execute({
    sql: "SELECT xp, streak, best_streak, correct_by_level, attempts_by_level, unlocked_levels FROM progress WHERE topic_id = ?",
    args: [topicId],
  });
  const row = res.rows[0];
  if (!row) return defaultProgress();
  return {
    xp: Number(row.xp),
    streak: Number(row.streak),
    bestStreak: Number(row.best_streak),
    correctByLevel: JSON.parse(row.correct_by_level as string),
    attemptsByLevel: JSON.parse(row.attempts_by_level as string),
    unlockedLevels: JSON.parse(row.unlocked_levels as string),
  };
}

export async function saveProgress(topicId: string, progress: TopicProgressRow): Promise<void> {
  await ensureSchema();
  const db = client();
  await db.execute({
    sql: `INSERT INTO progress (topic_id, xp, streak, best_streak, correct_by_level, attempts_by_level, unlocked_levels, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
          ON CONFLICT (topic_id) DO UPDATE SET
            xp = excluded.xp,
            streak = excluded.streak,
            best_streak = excluded.best_streak,
            correct_by_level = excluded.correct_by_level,
            attempts_by_level = excluded.attempts_by_level,
            unlocked_levels = excluded.unlocked_levels,
            updated_at = excluded.updated_at`,
    args: [
      topicId,
      progress.xp,
      progress.streak,
      progress.bestStreak,
      JSON.stringify(progress.correctByLevel),
      JSON.stringify(progress.attemptsByLevel),
      JSON.stringify(progress.unlockedLevels),
    ],
  });
}

export interface DailyStreakRow {
  lastVisitDate: string | null;
  currentStreak: number;
  bestStreak: number;
  totalDaysActive: number;
}

function defaultStreak(): DailyStreakRow {
  return { lastVisitDate: null, currentStreak: 0, bestStreak: 0, totalDaysActive: 0 };
}

export async function getDailyStreak(): Promise<DailyStreakRow> {
  await ensureSchema();
  const db = client();
  const res = await db.execute("SELECT last_visit_date, current_streak, best_streak, total_days_active FROM daily_streak WHERE id = 1");
  const row = res.rows[0];
  if (!row) return defaultStreak();
  return {
    lastVisitDate: row.last_visit_date as string | null,
    currentStreak: Number(row.current_streak),
    bestStreak: Number(row.best_streak),
    totalDaysActive: Number(row.total_days_active),
  };
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00Z`).getTime();
  const db = new Date(`${b}T00:00:00Z`).getTime();
  return Math.round((db - da) / 86_400_000);
}

/** Records today's visit if not already recorded, and returns the up-to-date streak either way. */
export async function recordDailyVisit(): Promise<DailyStreakRow> {
  const prev = await getDailyStreak();
  const today = todayStr();
  if (prev.lastVisitDate === today) return prev;

  const currentStreak = prev.lastVisitDate === null ? 1 : daysBetween(prev.lastVisitDate, today) === 1 ? prev.currentStreak + 1 : 1;
  const next: DailyStreakRow = {
    lastVisitDate: today,
    currentStreak,
    bestStreak: Math.max(prev.bestStreak, currentStreak),
    totalDaysActive: prev.totalDaysActive + 1,
  };

  const db = client();
  await db.execute({
    sql: `INSERT INTO daily_streak (id, last_visit_date, current_streak, best_streak, total_days_active)
          VALUES (1, ?, ?, ?, ?)
          ON CONFLICT (id) DO UPDATE SET
            last_visit_date = excluded.last_visit_date,
            current_streak = excluded.current_streak,
            best_streak = excluded.best_streak,
            total_days_active = excluded.total_days_active`,
    args: [next.lastVisitDate, next.currentStreak, next.bestStreak, next.totalDaysActive],
  });
  return next;
}
