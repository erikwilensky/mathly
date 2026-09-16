"use client";

import { useState } from "react";
import { formatClock, usePomodoro, type Phase } from "@/lib/pomodoro";

const PHASE_LABEL: Record<Phase, string> = {
  idle: "Ready",
  focus: "Focus",
  "short-break": "Short Break",
  "long-break": "Long Break",
};

const PHASE_COLOR: Record<Phase, string> = {
  idle: "border-brand-line text-brand-ink-soft",
  focus: "border-brand-indigo text-brand-indigo",
  "short-break": "border-brand-teal text-brand-teal",
  "long-break": "border-brand-green text-brand-green",
};

export default function PomodoroWidget() {
  const { state, remainingMs, start, pause, reset, skip } = usePomodoro();
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className={`fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border bg-brand-panel px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur transition hover:bg-brand-panel-raised ${PHASE_COLOR[state.phase]}`}
        style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <span>&#9201;&#65039;</span>
        <span className="font-mono">{formatClock(remainingMs)}</span>
        {state.running && <span className="text-[10px] uppercase tracking-wide opacity-70">{PHASE_LABEL[state.phase]}</span>}
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-40 w-64 rounded-2xl border border-brand-line bg-brand-panel p-4 shadow-xl"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-ink-faint">Stratagem Timer</span>
        <button onClick={() => setExpanded(false)} className="text-brand-ink-faint hover:text-brand-ink-soft" aria-label="Collapse">
          &times;
        </button>
      </div>

      <div className={`mt-2 rounded-xl border px-3 py-4 text-center ${PHASE_COLOR[state.phase]}`}>
        <div className="text-[11px] font-semibold uppercase tracking-wide">{PHASE_LABEL[state.phase]}</div>
        <div className="mt-1 font-mono text-4xl">{formatClock(remainingMs)}</div>
      </div>

      <p className="mt-2 text-center text-[11px] text-brand-ink-faint">{state.cyclesCompleted} focus session{state.cyclesCompleted === 1 ? "" : "s"} completed</p>

      <div className="mt-3 flex items-center justify-center gap-2">
        {state.running ? (
          <button onClick={pause} className="rounded-lg bg-brand-indigo px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-indigo/85">
            Pause
          </button>
        ) : (
          <button onClick={start} className="rounded-lg bg-brand-green px-4 py-1.5 text-sm font-semibold text-brand-bg transition hover:bg-brand-green/85">
            {state.phase === "idle" ? "Start Focus" : "Resume"}
          </button>
        )}
        <button onClick={skip} className="rounded-lg border border-brand-line px-3 py-1.5 text-sm font-semibold text-brand-ink-soft transition hover:border-brand-gold hover:text-brand-gold">
          Skip
        </button>
        <button onClick={reset} className="rounded-lg border border-brand-line px-3 py-1.5 text-sm font-semibold text-brand-ink-soft transition hover:border-brand-red hover:text-brand-red">
          Reset
        </button>
      </div>
    </div>
  );
}
