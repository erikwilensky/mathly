"use client";

import { useEffect, useState } from "react";
import {
  LEVELS,
  checkAnswer,
  expand,
  formatFactored,
  formatPoly,
  generateProblem,
  getHint,
  type FactorAnswer,
  type HintStage,
  type LevelId,
  type Problem,
} from "@/lib/factoring";
import { CORRECT_LINES, INCORRECT_LINES, MATH_JOKES, randomOf, streakHype } from "@/lib/humor";

interface Props {
  level: LevelId;
  onResult: (level: LevelId, correct: boolean) => void;
}

const EMPTY_ANSWER: FactorAnswer = { k: 1, m1: 1, n1: 0, m2: 1, n2: 0 };

type Feedback = { correct: boolean; message: string } | null;

export default function PracticePanel({ level, onResult }: Props) {
  // Problem starts null and is only generated client-side in an effect (not
  // during the initial render) so server and client render the same thing
  // on first paint — generating a random problem during render would pick a
  // different one during SSR vs. hydration and trigger a hydration mismatch.
  const [problem, setProblem] = useState<Problem | null>(null);
  const [answer, setAnswer] = useState<FactorAnswer>(EMPTY_ANSWER);
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
      const got = expand(answer);
      setFeedback({
        correct: false,
        message: `${randomOf(INCORRECT_LINES)} Your factors expand to ${formatPoly(got.a, got.b, got.c)}, but the target is ${formatPoly(
          problem.a,
          problem.b,
          problem.c,
        )}.`,
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
    setHintStage((s) => (s >= 3 ? 3 : ((s + 1) as HintStage)));
  }

  async function askAiTutor() {
    if (!problem) return;
    setAiLoading(true);
    setAiHint(null);
    try {
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          poly: formatPoly(problem.a, problem.b, problem.c),
          level: levelDef.name,
          studentAttempt: formatFactored(answer),
        }),
      });
      const data = await res.json();
      setAiHint(data.hint ?? "AI tutor is not connected yet — try a built-in hint instead.");
    } catch {
      setAiHint("Couldn't reach the AI tutor right now — try a built-in hint instead.");
    } finally {
      setAiLoading(false);
    }
  }

  const set = (patch: Partial<FactorAnswer>) => setAnswer((a) => ({ ...a, ...patch }));

  if (!problem) {
    return (
      <div className="rounded-2xl border border-brand-line bg-brand-panel p-5">
        <p className="text-center text-sm text-brand-ink-faint">Loading drop pod&hellip;</p>
      </div>
    );
  }

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

      <p className="mt-3 text-center font-mono text-2xl text-brand-ink">Target: {formatPoly(problem.a, problem.b, problem.c)}</p>

      <div className="mt-5">
        <FactorFields level={level} answer={answer} set={set} disabled={feedback?.correct} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {!feedback?.correct && (
          <button
            onClick={handleCheck}
            className="rounded-lg bg-brand-indigo px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-indigo/85"
          >
            Deploy &#128640;
          </button>
        )}
        {feedback?.correct && (
          <button
            onClick={nextProblem}
            className="rounded-lg bg-brand-green px-5 py-2 text-sm font-semibold text-brand-bg transition hover:bg-brand-green/85"
          >
            Next mission &rarr;
          </button>
        )}
        {!feedback?.correct && (
          <button
            onClick={revealNextHint}
            disabled={hintStage >= 3}
            className="rounded-lg border border-brand-line px-4 py-2 text-sm font-semibold text-brand-ink-soft transition hover:border-brand-gold hover:text-brand-gold disabled:opacity-40"
          >
            {hintStage === 0 ? "Request intel" : "More intel"}
          </button>
        )}
        {!feedback?.correct && (
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
            feedback.correct
              ? "border-brand-green/40 bg-brand-green/10 text-brand-green"
              : "animate-shake border-brand-red/40 bg-brand-red/10 text-brand-red"
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
        <div className="mt-3 animate-pop rounded-xl border border-pink-400/30 bg-pink-400/10 px-4 py-3 text-center text-sm text-pink-300">
          {joke}
        </div>
      )}
    </div>
  );
}

function FactorFields({
  level,
  answer,
  set,
  disabled,
}: {
  level: LevelId;
  answer: FactorAnswer;
  set: (patch: Partial<FactorAnswer>) => void;
  disabled?: boolean;
}) {
  const levelDef = LEVELS.find((l) => l.id === level)!;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-xl">
      {levelDef.showK && (
        <>
          <Box label="GCF" value={answer.k} onChange={(k) => set({ k })} disabled={disabled} w="w-12" />
          <span className="text-brand-ink-soft">&times;</span>
        </>
      )}
      <Pair
        showM={levelDef.showM}
        m={answer.m1}
        n={answer.n1}
        onM={(m1) => set({ m1 })}
        onN={(n1) => set({ n1 })}
        disabled={disabled}
      />
      <Pair
        showM={levelDef.showM}
        m={answer.m2}
        n={answer.n2}
        onM={(m2) => set({ m2 })}
        onN={(n2) => set({ n2 })}
        disabled={disabled}
      />
    </div>
  );
}

function Pair({
  showM,
  m,
  n,
  onM,
  onN,
  disabled,
}: {
  showM: boolean;
  m: number;
  n: number;
  onM: (v: number) => void;
  onN: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-brand-line bg-brand-panel-raised px-3 py-2">
      <span>(</span>
      {showM ? <Box label="x coefficient" value={m} onChange={onM} disabled={disabled} /> : <span className="px-1 text-brand-ink-soft">1</span>}
      <span>x +</span>
      <Box label="constant" value={n} onChange={onN} disabled={disabled} />
      <span>)</span>
    </div>
  );
}

function Box({
  label,
  value,
  onChange,
  disabled,
  w = "w-14",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  w?: string;
}) {
  return (
    <input
      type="number"
      aria-label={label}
      value={Number.isFinite(value) ? value : ""}
      disabled={disabled}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "" || raw === "-") {
          onChange(0);
          return;
        }
        const v = parseInt(raw, 10);
        onChange(Number.isNaN(v) ? 0 : v);
      }}
      className={`${w} rounded-lg border border-brand-line bg-brand-bg px-2 py-1.5 text-center font-mono text-lg text-brand-ink outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/40 disabled:opacity-60`}
    />
  );
}
