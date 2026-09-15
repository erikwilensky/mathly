"use client";

import { useState } from "react";
import type { Lesson, LevelId } from "@/lib/levels";

export default function LearnPanel({ level, lessons }: { level: LevelId; lessons: Record<LevelId, Lesson> }) {
  const [stepIndex, setStepIndex] = useState(0);
  const lesson = lessons[level];
  const step = lesson.steps[Math.min(stepIndex, lesson.steps.length - 1)];

  return (
    <div className="rounded-2xl border border-brand-line bg-brand-panel p-5">
      <p className="text-sm leading-relaxed text-brand-ink-soft">{lesson.intro}</p>

      <div className="mt-4 rounded-xl border border-brand-line bg-brand-panel-raised p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-ink-faint">
            Worked example &middot; step {Math.min(stepIndex, lesson.steps.length - 1) + 1} of {lesson.steps.length}
          </span>
          <button
            onClick={() => setStepIndex(0)}
            className="text-xs text-brand-ink-faint underline decoration-dotted hover:text-brand-ink-soft"
          >
            restart
          </button>
        </div>
        <p className="mt-2 text-sm text-brand-ink-soft">{step.text}</p>
        {step.math && <p className="mt-2 font-mono text-lg text-brand-teal">{step.math}</p>}
        <button
          onClick={() => setStepIndex((i) => Math.min(i + 1, lesson.steps.length - 1))}
          disabled={stepIndex >= lesson.steps.length - 1}
          className="mt-4 rounded-lg bg-brand-indigo px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-indigo/85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {stepIndex >= lesson.steps.length - 1 ? "Done" : "Next step →"}
        </button>
      </div>
    </div>
  );
}
