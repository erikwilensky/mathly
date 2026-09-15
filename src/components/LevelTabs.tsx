"use client";

import { LEVELS, type LevelId } from "@/lib/factoring";

interface Props {
  active: LevelId;
  onSelect: (level: LevelId) => void;
  isUnlocked: (level: LevelId) => boolean;
  correctByLevel: Record<LevelId, number>;
  unlockThreshold: number;
}

function difficultyStyle(difficulty: string): string {
  switch (difficulty) {
    case "Trivial":
      return "bg-brand-green/15 text-brand-green";
    case "Challenging":
      return "bg-brand-gold/15 text-brand-gold";
    case "Extreme":
      return "bg-orange-500/15 text-orange-400";
    case "Helldive":
      return "bg-brand-red/15 text-brand-red";
    default:
      return "bg-brand-line/40 text-brand-ink-faint";
  }
}

export default function LevelTabs({ active, onSelect, isUnlocked, correctByLevel, unlockThreshold }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {LEVELS.map((lvl) => {
        const unlocked = isUnlocked(lvl.id);
        const isActive = active === lvl.id;
        return (
          <button
            key={lvl.id}
            disabled={!unlocked}
            onClick={() => onSelect(lvl.id)}
            className={`rounded-xl border px-3 py-2.5 text-left transition ${
              isActive
                ? "border-brand-indigo bg-brand-indigo/15 ring-1 ring-brand-indigo"
                : unlocked
                  ? "border-brand-line bg-brand-panel hover:border-brand-indigo/60"
                  : "cursor-not-allowed border-brand-line/60 bg-brand-panel/40 opacity-50"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-brand-ink-faint">
              <span>Level {lvl.id}</span>
              {!unlocked && <span>&#128274;</span>}
            </div>
            <div className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${difficultyStyle(lvl.difficulty)}`}>
              {lvl.difficulty}
            </div>
            <div className="mt-1 text-sm font-semibold text-brand-ink">{lvl.name}</div>
            <div className="font-mono text-xs text-brand-ink-soft">{lvl.subtitle}</div>
            {!unlocked && (
              <div className="mt-1 text-[11px] text-brand-ink-faint">
                {unlockThreshold} confirmed kills at Level {lvl.id - 1} to deploy here
              </div>
            )}
            {unlocked && (
              <div className="mt-1 text-[11px] text-brand-ink-faint">{correctByLevel[lvl.id]} confirmed kills</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
