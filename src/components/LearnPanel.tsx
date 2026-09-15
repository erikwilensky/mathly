"use client";

import { useState } from "react";
import type { LevelId } from "@/lib/factoring";

interface WorkedStep {
  text: string;
  math?: string;
}

interface Lesson {
  intro: string;
  steps: WorkedStep[];
}

const LESSONS: Record<LevelId, Lesson> = {
  1: {
    intro:
      "For x² + bx + c, you're looking for two numbers that multiply to c and add to b. Those two numbers become the constants in your two binomials.",
    steps: [
      { text: "Start with the trinomial.", math: "x² + 5x + 6" },
      { text: "List factor pairs of c = 6, and check which pair adds to b = 5.", math: "1×6, 2×3 → 2 + 3 = 5 ✓" },
      { text: "Use that pair (2 and 3) as the constants in the two binomials.", math: "(x + 2)(x + 3)" },
      { text: "Check by expanding — it should rebuild the original trinomial.", math: "x² + 3x + 2x + 6 = x² + 5x + 6 ✓" },
    ],
  },
  2: {
    intro:
      "When a ≠ 1, multiply a×c first. Find two numbers that multiply to a×c and add to b, use them to split the middle term into two terms, then factor by grouping.",
    steps: [
      { text: "Start with the trinomial.", math: "2x² + 7x + 3" },
      { text: "Multiply a×c = 2×3 = 6. Find two numbers that multiply to 6 and add to b = 7.", math: "1×6 → 1 + 6 = 7 ✓" },
      { text: "Split the middle term 7x into 1x + 6x.", math: "2x² + 1x + 6x + 3" },
      { text: "Group in pairs and factor each pair.", math: "x(2x + 1) + 3(2x + 1)" },
      { text: "Factor out the common binomial.", math: "(2x + 1)(x + 3)" },
    ],
  },
  3: {
    intro:
      "A difference of squares A² − B² always factors as (A − B)(A + B) — no middle term, so there's nothing to split. Just find the two square roots.",
    steps: [
      { text: "Start with the binomial.", math: "9x² − 16" },
      { text: "Recognize both terms as perfect squares.", math: "9x² = (3x)²,  16 = 4²" },
      { text: "Apply A² − B² = (A − B)(A + B) with A = 3x, B = 4.", math: "(3x − 4)(3x + 4)" },
    ],
  },
  4: {
    intro:
      "Always check for a greatest common factor first. Pull it out front, then factor whatever trinomial is left using the Level 1 or Level 2 method.",
    steps: [
      { text: "Start with the trinomial.", math: "4x² + 20x + 24" },
      { text: "Find the GCF of 4, 20, and 24.", math: "GCF = 4" },
      { text: "Factor it out.", math: "4(x² + 5x + 6)" },
      { text: "Factor the remaining trinomial like Level 1.", math: "4(x + 2)(x + 3)" },
    ],
  },
};

export default function LearnPanel({ level }: { level: LevelId }) {
  const [stepIndex, setStepIndex] = useState(0);
  const lesson = LESSONS[level];
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
