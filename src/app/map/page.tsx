"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TOPICS } from "@/lib/topics";
import { loadTopicProgress, UNLOCK_THRESHOLD, type TopicProgress } from "@/lib/progress";
import { readDailyStreak, type DailyStreak } from "@/lib/dailyStreak";
import type { LevelId } from "@/lib/levels";

type Status = "locked" | "in-progress" | "mastered";

function levelStatus(progress: TopicProgress, levelId: LevelId): Status {
  if (!progress.unlockedLevels.includes(levelId)) return "locked";
  return progress.correctByLevel[levelId] >= UNLOCK_THRESHOLD ? "mastered" : "in-progress";
}

const STATUS_STYLE: Record<Status, string> = {
  locked: "bg-brand-line/40 text-brand-ink-faint border-brand-line/60",
  "in-progress": "bg-brand-gold/15 text-brand-gold border-brand-gold/40",
  mastered: "bg-brand-green/15 text-brand-green border-brand-green/40",
};

const STATUS_ICON: Record<Status, string> = {
  locked: "\u{1F512}",
  "in-progress": "\u{1F7E1}",
  mastered: "\u{2705}",
};

export default function CampaignMapPage() {
  const [progressByTopic, setProgressByTopic] = useState<Record<string, TopicProgress> | null>(null);
  const [streak, setStreak] = useState<DailyStreak | null>(null);

  useEffect(() => {
    const entries: Record<string, TopicProgress> = {};
    for (const topic of TOPICS) entries[topic.id] = loadTopicProgress(topic.id);
    setProgressByTopic(entries);
    setStreak(readDailyStreak());
  }, []);

  const totalXp = progressByTopic ? Object.values(progressByTopic).reduce((sum, p) => sum + p.xp, 0) : 0;
  const totalKills = progressByTopic
    ? Object.values(progressByTopic).reduce((sum, p) => sum + Object.values(p.correctByLevel).reduce((a, b) => a + b, 0), 0)
    : 0;
  const totalMastered = progressByTopic
    ? TOPICS.reduce((sum, t) => sum + t.levels.filter((l) => levelStatus(progressByTopic[t.id]!, l.id) === "mastered").length, 0)
    : 0;
  const totalLevels = TOPICS.reduce((sum, t) => sum + t.levels.length, 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link href="/" className="text-sm text-brand-ink-faint hover:text-brand-ink-soft">
        &larr; Back to Super Earth
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-brand-ink sm:text-3xl">Galactic War Map</h1>
      <p className="mt-1 text-sm text-brand-ink-soft">Every front, every planet, every difficulty tier liberated so far.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Day Streak" value={streak ? `${streak.currentStreak}` : "—"} accent="text-brand-gold" />
        <Stat label="Best Streak" value={streak ? `${streak.bestStreak}` : "—"} accent="text-brand-teal" />
        <Stat label="Total Medals" value={`${totalXp}`} accent="text-brand-gold" />
        <Stat label="Tiers Liberated" value={`${totalMastered}/${totalLevels}`} accent="text-brand-green" />
      </div>
      <p className="mt-2 text-center text-[11px] text-brand-ink-faint">
        {streak && streak.totalDaysActive > 0 ? `${streak.totalDaysActive} total day${streak.totalDaysActive === 1 ? "" : "s"} deployed · ` : ""}
        {totalKills} confirmed kills across every front
      </p>

      <div className="mt-8 grid gap-4">
        {TOPICS.map((topic) => {
          const progress = progressByTopic?.[topic.id];
          const mastered = progress ? topic.levels.filter((l) => levelStatus(progress, l.id) === "mastered").length : 0;
          return (
            <Link
              key={topic.id}
              href={topic.href}
              className="rounded-2xl border border-brand-line bg-brand-panel p-5 transition hover:border-brand-indigo/60 hover:bg-brand-panel-raised"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-base font-semibold text-brand-ink">{topic.title}</div>
                  <div className="mt-0.5 font-mono text-xs text-brand-ink-soft">{topic.subtitle}</div>
                </div>
                <div className="text-sm font-semibold text-brand-ink-faint">
                  {mastered}/{topic.levels.length} liberated
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {topic.levels.map((level) => {
                  const status = progress ? levelStatus(progress, level.id) : "locked";
                  return (
                    <div key={level.id} className={`rounded-lg border px-2 py-2 text-center ${STATUS_STYLE[status]}`}>
                      <div className="text-base leading-none">{STATUS_ICON[status]}</div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wide">{level.difficulty}</div>
                      {progress && status !== "locked" && (
                        <div className="mt-0.5 text-[10px] opacity-80">{progress.correctByLevel[level.id]} kills</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl border border-brand-line bg-brand-panel px-3 py-3 text-center">
      <div className={`text-xl font-bold ${accent}`}>{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-brand-ink-faint">{label}</div>
    </div>
  );
}
