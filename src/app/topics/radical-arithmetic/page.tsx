"use client";

import Link from "next/link";
import { useState } from "react";
import LearnPanel from "@/components/LearnPanel";
import LevelTabs from "@/components/LevelTabs";
import RadicalArithmeticPracticePanel from "@/components/RadicalArithmeticPracticePanel";
import { LEVELS, RADICAL_ARITHMETIC_LESSONS, type LevelId } from "@/lib/radical-arithmetic";
import { useProgress } from "@/lib/progress";

export default function RadicalArithmeticPage() {
  const [level, setLevel] = useState<LevelId>(1);
  const { progress, recordAttempt, isUnlocked, unlockThreshold } = useProgress("radical-arithmetic");
  const levelDef = LEVELS.find((l) => l.id === level)!;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link href="/" className="text-sm text-brand-ink-faint hover:text-brand-ink-soft">
        &larr; Back to Super Earth
      </Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink sm:text-3xl">Operation: Radical Combat</h1>
          <p className="mt-1 text-sm text-brand-ink-soft">
            Add, subtract, multiply, and divide radicals — always in simplest form. For Democracy, Russell.
          </p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <div className="text-lg font-bold text-brand-gold">{progress.xp}</div>
            <div className="text-[11px] uppercase tracking-wide text-brand-ink-faint">Medals</div>
          </div>
          <div>
            <div className="text-lg font-bold text-brand-teal">{progress.streak}</div>
            <div className="text-[11px] uppercase tracking-wide text-brand-ink-faint">Kill Streak</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <LevelTabs
          levels={LEVELS}
          active={level}
          onSelect={(l) => isUnlocked(l) && setLevel(l)}
          isUnlocked={isUnlocked}
          correctByLevel={progress.correctByLevel}
          unlockThreshold={unlockThreshold}
        />
      </div>

      <div className="mt-6 grid gap-6">
        <LearnPanel key={`learn-${level}`} level={level} lessons={RADICAL_ARITHMETIC_LESSONS} />
        <RadicalArithmeticPracticePanel key={`practice-${level}`} level={level} onResult={recordAttempt} />
      </div>

      <p className="mt-6 text-center text-xs text-brand-ink-faint">
        {levelDef.name} ({levelDef.difficulty}): get {unlockThreshold} confirmed kills to unlock the next difficulty tier.
      </p>
    </main>
  );
}
