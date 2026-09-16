"use client";

import { useCallback, useEffect, useState } from "react";

export type Phase = "idle" | "focus" | "short-break" | "long-break";

export interface PomodoroState {
  phase: Phase;
  running: boolean;
  endsAt: number | null; // epoch ms, set while running
  remainingMs: number; // authoritative while paused/idle
  cyclesCompleted: number;
}

const KEY = "mathly.pomodoro.v1";

export const DURATIONS: Record<Exclude<Phase, "idle">, number> = {
  focus: 25 * 60_000,
  "short-break": 5 * 60_000,
  "long-break": 15 * 60_000,
};

function defaultState(): PomodoroState {
  return { phase: "idle", running: false, endsAt: null, remainingMs: DURATIONS.focus, cyclesCompleted: 0 };
}

function load(): PomodoroState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...(JSON.parse(raw) as PomodoroState) };
  } catch {
    return defaultState();
  }
}

function save(state: PomodoroState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable — timer just won't survive a refresh.
  }
}

function nextPhaseAfter(phase: Phase, cyclesCompleted: number): { phase: Phase; cyclesCompleted: number } {
  if (phase === "focus") {
    const cycles = cyclesCompleted + 1;
    return { phase: cycles % 4 === 0 ? "long-break" : "short-break", cyclesCompleted: cycles };
  }
  return { phase: "focus", cyclesCompleted };
}

function playChime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
    osc.onended = () => ctx.close();
  } catch {
    // Audio isn't available or was blocked — the visual state change still shows.
  }
}

export function usePomodoro() {
  const [state, setState] = useState<PomodoroState>(defaultState);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setState(load());
  }, []);

  useEffect(() => {
    if (!state.running) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [state.running]);

  // Advance phases as time runs out, even if the tab was backgrounded.
  useEffect(() => {
    if (!state.running || state.endsAt === null) return;
    if (now < state.endsAt) return;
    setState((prev) => {
      if (!prev.running || prev.endsAt === null) return prev;
      const { phase, cyclesCompleted } = nextPhaseAfter(prev.phase, prev.cyclesCompleted);
      const duration = DURATIONS[phase as Exclude<Phase, "idle">];
      const next: PomodoroState = { phase, running: true, endsAt: Date.now() + duration, remainingMs: duration, cyclesCompleted };
      save(next);
      playChime();
      return next;
    });
  }, [now, state.running, state.endsAt]);

  const start = useCallback(() => {
    setState((prev) => {
      const phase = prev.phase === "idle" ? "focus" : prev.phase;
      const remaining = prev.phase === "idle" ? DURATIONS.focus : prev.remainingMs;
      const next: PomodoroState = { ...prev, phase, running: true, endsAt: Date.now() + remaining };
      save(next);
      return next;
    });
  }, []);

  const pause = useCallback(() => {
    setState((prev) => {
      if (!prev.running || prev.endsAt === null) return prev;
      const remainingMs = Math.max(0, prev.endsAt - Date.now());
      const next: PomodoroState = { ...prev, running: false, endsAt: null, remainingMs };
      save(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const next = defaultState();
    save(next);
    setState(next);
  }, []);

  const skip = useCallback(() => {
    setState((prev) => {
      const basis = prev.phase === "idle" ? "focus" : prev.phase;
      const { phase, cyclesCompleted } = nextPhaseAfter(basis, prev.cyclesCompleted);
      const duration = DURATIONS[phase as Exclude<Phase, "idle">];
      const next: PomodoroState = { phase, running: prev.running, endsAt: prev.running ? Date.now() + duration : null, remainingMs: duration, cyclesCompleted };
      save(next);
      return next;
    });
  }, []);

  const remainingMs = state.running && state.endsAt !== null ? Math.max(0, state.endsAt - now) : state.remainingMs;

  return { state, remainingMs, start, pause, reset, skip };
}

export function formatClock(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
