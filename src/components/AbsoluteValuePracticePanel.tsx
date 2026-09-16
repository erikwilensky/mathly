"use client";

import { useEffect, useState } from "react";
import {
  LEVELS,
  checkAnswer,
  formatAnswer,
  generateProblem,
  getHint,
  type Answer,
  type HintStage,
  type LevelId,
  type Problem,
  type Shape,
} from "@/lib/absolute-value";
import { CORRECT_LINES, INCORRECT_LINES, MATH_JOKES, randomOf, streakHype } from "@/lib/humor";
import NumberBox from "@/components/NumberBox";

interface Props {
  level: LevelId;
  onResult: (level: LevelId, correct: boolean) => void;
}

const ZERO = { num: 0, den: 1 };
const EMPTY_ANSWER: Answer = { value: ZERO, x1: ZERO, x2: ZERO, shape: "between", lo: ZERO, hi: ZERO, exceptPoint: ZERO };

const SHAPE_OPTIONS: { shape: Shape; label: string }[] = [
  { shape: "between", label: "Between two values" },
  { shape: "outside", label: "Outside two values" },
  { shape: "no-solution", label: "No solution" },
  { shape: "all-reals", label: "All real numbers" },
  { shape: "all-except", label: "All reals except one point" },
];

type Feedback = { correct: boolean; message: string } | null;

export default function AbsoluteValuePracticePanel({ level, onResult }: Props) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [answer, setAnswer] = useState<Answer>(EMPTY_ANSWER);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [hintStage, setHintStage] = useState<HintStage | 0>(0);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [joke, setJoke] = useState<string | null>(null);
  const [localStreak, setLocalStreak] = useState(0);

  useEffect(() => {
    setProblem(generateProblem(level));
    setAnswer(EMPTY_ANSWER);
    setFeedback(null);
    setHintStage(0);
    setAiHint(null);
    setJoke(null);
  }, [level]);

  const levelDef = LEVELS.find((l) => l.id === level)!;

  function handleCheck() {
    if (!problem) return;
    const correct = checkAnswer(problem, answer);
    onResult(level, correct);
    setJoke(null);
    if (correct) {
      setLocalStreak((s) => s + 1);
      setFeedback({ correct: true, message: randomOf(CORRECT_LINES) });
    } else {
      setLocalStreak(0);
      setFeedback({
        correct: false,
        message: `${randomOf(INCORRECT_LINES)} You said ${formatAnswer(answer, level)}, but the correct answer is ${formatAnswer(problem.solution, level)}.`,
      });
    }
  }

  function nextProblem() {
    setProblem(generateProblem(level));
    setAnswer(EMPTY_ANSWER);
    setFeedback(null);
    setHintStage(0);
    setAiHint(null);
    setJoke(null);
  }

  function tellJoke() {
    setJoke(randomOf(MATH_JOKES));
  }

  function revealNextHint() {
    setHintStage((s) => (s >= 4 ? 4 : ((s + 1) as HintStage)));
  }

  async function askAiTutor() {
    if (!problem) return;
    setAiLoading(true);
    setAiHint(null);
    try {
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ poly: problem.display, level: levelDef.name, studentAttempt: formatAnswer(answer, level) }),
      });
      const data = await res.json();
      setAiHint(data.hint ?? "AI tutor is not connected yet — try a built-in hint instead.");
    } catch {
      setAiHint("Couldn't reach the AI tutor right now — try a built-in hint instead.");
    } finally {
      setAiLoading(false);
    }
  }

  const set = (patch: Partial<Answer>) => setAnswer((a) => ({ ...a, ...patch }));

  if (!problem) {
    return (
      <div className="rounded-2xl border border-brand-line bg-brand-panel p-5">
        <p className="text-center text-sm text-brand-ink-faint">Loading drop pod&hellip;</p>
      </div>
    );
  }

  const disabled = feedback?.correct;

  return (
    <div className="rounded-2xl border border-brand-line bg-brand-panel p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-ink-faint">
          Mission &middot; {levelDef.name} <span className="text-brand-ink-faint/70">({levelDef.difficulty})</span>
        </span>
        <button onClick={nextProblem} className="text-xs text-brand-ink-faint underline decoration-dotted hover:text-brand-ink-soft">
          abort mission
        </button>
      </div>

      <p className="mt-3 text-center font-mono text-xl text-brand-ink">{problem.display}</p>

      <div className="mt-5 flex flex-col items-center gap-3">
        {levelDef.mode === "evaluate" && (
          <NumberBox label="value" value={answer.value.num} onChange={(num) => set({ value: { num, den: 1 } })} disabled={disabled} w="w-20" />
        )}

        {levelDef.mode === "equation" && (
          <div className="flex items-center gap-3 text-lg">
            <span>x =</span>
            <NumberBox label="first solution" value={answer.x1.num} onChange={(num) => set({ x1: { num, den: 1 } })} disabled={disabled} w="w-16" />
            <span>or x =</span>
            <NumberBox label="second solution" value={answer.x2.num} onChange={(num) => set({ x2: { num, den: 1 } })} disabled={disabled} w="w-16" />
          </div>
        )}

        {levelDef.mode === "inequality" && (
          <>
            <div className="flex flex-wrap justify-center gap-2">
              {SHAPE_OPTIONS.map((opt) => (
                <button
                  key={opt.shape}
                  onClick={() => set({ shape: opt.shape })}
                  disabled={disabled}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${
                    answer.shape === opt.shape
                      ? "border-brand-indigo bg-brand-indigo/15 text-brand-indigo"
                      : "border-brand-line text-brand-ink-soft hover:border-brand-indigo/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {(answer.shape === "between" || answer.shape === "outside") && (
              <div className="flex items-center gap-2 text-lg">
                <NumberBox label="lower boundary" value={answer.lo.num} onChange={(num) => set({ lo: { num, den: 1 } })} disabled={disabled} w="w-16" />
                <span className="text-brand-ink-soft">to</span>
                <NumberBox label="upper boundary" value={answer.hi.num} onChange={(num) => set({ hi: { num, den: 1 } })} disabled={disabled} w="w-16" />
              </div>
            )}
            {answer.shape === "all-except" && (
              <div className="flex items-center gap-2 text-lg">
                <span>x ≠</span>
                <NumberBox label="excluded point" value={answer.exceptPoint.num} onChange={(num) => set({ exceptPoint: { num, den: 1 } })} disabled={disabled} w="w-16" />
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {!disabled && (
          <button onClick={handleCheck} className="rounded-lg bg-brand-indigo px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-indigo/85">
            Deploy &#128640;
          </button>
        )}
        {disabled && (
          <button onClick={nextProblem} className="rounded-lg bg-brand-green px-5 py-2 text-sm font-semibold text-brand-bg transition hover:bg-brand-green/85">
            Next mission &rarr;
          </button>
        )}
        {!disabled && (
          <button
            onClick={revealNextHint}
            disabled={hintStage >= 4}
            className="rounded-lg border border-brand-line px-4 py-2 text-sm font-semibold text-brand-ink-soft transition hover:border-brand-gold hover:text-brand-gold disabled:opacity-40"
          >
            {hintStage === 0 ? "Request intel" : "More intel"}
          </button>
        )}
        {!disabled && (
          <button
            onClick={askAiTutor}
            disabled={aiLoading}
            className="rounded-lg border border-brand-line px-4 py-2 text-sm font-semibold text-brand-ink-soft transition hover:border-brand-teal hover:text-brand-teal disabled:opacity-40"
          >
            {aiLoading ? "Contacting Super Earth…" : "Call Command AI"}
          </button>
        )}
        <button
          onClick={tellJoke}
          className="rounded-lg border border-brand-line px-4 py-2 text-sm font-semibold text-brand-ink-soft transition hover:border-pink-400 hover:text-pink-400"
        >
          Morale boost
        </button>
      </div>

      {feedback && (
        <div
          className={`mt-4 animate-pop rounded-xl border px-4 py-3 text-center text-sm ${
            feedback.correct ? "border-brand-green/40 bg-brand-green/10 text-brand-green" : "animate-shake border-brand-red/40 bg-brand-red/10 text-brand-red"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {feedback?.correct && localStreak >= 3 && streakHype(localStreak) && (
        <div className="mt-3 animate-pop rounded-xl border border-brand-gold/30 bg-brand-gold/10 px-4 py-3 text-center text-sm font-semibold text-brand-gold">
          {streakHype(localStreak)}
        </div>
      )}

      {hintStage > 0 && (
        <div className="mt-3 rounded-xl border border-brand-gold/30 bg-brand-gold/10 px-4 py-3 text-sm text-brand-gold">
          <span className="mr-1 font-bold uppercase tracking-wide">Intel report:</span>
          {getHint(problem, hintStage as HintStage)}
        </div>
      )}

      {aiHint && (
        <div className="mt-3 rounded-xl border border-brand-teal/30 bg-brand-teal/10 px-4 py-3 text-sm text-brand-teal">
          <span className="mr-1 font-bold uppercase tracking-wide">Command AI:</span>
          {aiHint}
        </div>
      )}

      {joke && (
        <div className="mt-3 animate-pop rounded-xl border border-pink-400/30 bg-pink-400/10 px-4 py-3 text-center text-sm text-pink-300">{joke}</div>
      )}
    </div>
  );
}
