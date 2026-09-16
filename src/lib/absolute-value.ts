// Absolute value: evaluating, solving equations, and solving inequalities.
// The inequality levels (3-4) use the exact rule taxonomy from the source
// worksheet's "Special Cases" / "Zero Cases" tables: |x-h| < k (k>0) is
// always a bounded "between" interval, |x-h| > k (k>0) is always two
// outer rays ("outside"), and the degenerate cases (k<=0, or comparing
// against 0) always resolve to one of no-solution / all-reals / all-reals-
// except-one-point. The answer is a discrete SHAPE choice plus whatever
// boundary numbers that shape needs — not a generic interval-union
// representation — because those five outcomes are exhaustive here.

import { formatFraction, reduceFraction, type Fraction, type Lesson, type LevelId, type LevelMeta } from "./levels";

export type { LevelId };

export type Shape = "between" | "outside" | "no-solution" | "all-reals" | "all-except";

export interface Level extends LevelMeta {
  mode: "evaluate" | "equation" | "inequality";
}

export const LEVELS: Level[] = [
  { id: 1, name: "Evaluating", subtitle: "|expression|", difficulty: "Trivial", mode: "evaluate" },
  { id: 2, name: "Solving Equations", subtitle: "|x − h| = k", difficulty: "Challenging", mode: "equation" },
  { id: 3, name: "Solving Inequalities", subtitle: "|x − h| < k or > k", difficulty: "Extreme", mode: "inequality" },
  { id: 4, name: "Isolate First", subtitle: "coefficient outside the bars", difficulty: "Helldive", mode: "inequality" },
];

export const ABSOLUTE_VALUE_LESSONS: Record<LevelId, Lesson> = {
  1: {
    intro: "Absolute value strips the sign — it's always the distance from zero, so the result is never negative. Simplify what's inside the bars first, then drop the sign.",
    steps: [
      { text: "Start with the expression.", math: "|7 − 15|" },
      { text: "Simplify inside the bars first.", math: "|−8|" },
      { text: "Absolute value drops the sign.", math: "|−8| = 8" },
    ],
  },
  2: {
    intro: "|x − h| = k means x is exactly k units from h — in either direction. That gives two equations: x − h = k, and x − h = −k.",
    steps: [
      { text: "Start with the equation.", math: "|x − 3| = 5" },
      { text: "Split into two cases.", math: "x − 3 = 5   or   x − 3 = −5" },
      { text: "Solve each one.", math: "x = 8   or   x = −2" },
    ],
  },
  3: {
    intro:
      "|x − h| < k means \"less than k away from h\" — a range between two values. |x − h| > k means \"more than k away\" — two separate regions. Watch the special cases: comparing to a negative number, or to zero, breaks the normal pattern.",
    steps: [
      { text: "\"Less than\" → between two values.", math: "|x − 2| < 4  →  −2 < x < 6" },
      { text: "\"Greater than\" → outside two values.", math: "|x + 1| > 3  →  x < −4 or x > 2" },
      { text: "Special case: < a negative number is impossible.", math: "|x| < −3  →  no solution (absolute value can't be negative)" },
      { text: "Special case: > a negative number is always true.", math: "|x| > −3  →  all real numbers" },
      { text: "Zero case: > 0 excludes just one point.", math: "|x − 5| > 0  →  all reals except x = 5" },
    ],
  },
  4: {
    intro: "When there's a coefficient outside the bars, isolate the absolute value expression first — exactly like solving any equation — before applying the rules from Level 3.",
    steps: [
      { text: "Start with the inequality.", math: "3|x − 1| + 2 ≤ 14" },
      { text: "Isolate the absolute value.", math: "3|x − 1| ≤ 12  →  |x − 1| ≤ 4" },
      { text: "Now apply the normal rule — \"less than\" means between.", math: "−3 ≤ x ≤ 5" },
    ],
  },
};

export interface Answer {
  value: Fraction;
  x1: Fraction;
  x2: Fraction;
  shape: Shape;
  lo: Fraction;
  hi: Fraction;
  exceptPoint: Fraction;
}

export interface Problem {
  id: string;
  level: LevelId;
  display: string;
  solution: Answer;
  drill: string;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nonZero(min: number, max: number): number {
  let v = 0;
  while (v === 0) v = randInt(min, max);
  return v;
}

function signStr(v: number): string {
  return v < 0 ? "−" : "+";
}

const F = (num: number, den = 1): Fraction => reduceFraction(num, den);
const ZERO: Fraction = { num: 0, den: 1 };

function baseAnswer(): Answer {
  return { value: ZERO, x1: ZERO, x2: ZERO, shape: "no-solution", lo: ZERO, hi: ZERO, exceptPoint: ZERO };
}

function makeProblem(level: LevelId, display: string, solution: Partial<Answer>, drill: string): Problem {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, level, display, solution: { ...baseAnswer(), ...solution }, drill };
}

function genLevel1(): Problem {
  const useTwo = Math.random() < 0.6;
  if (useTwo) {
    const a = randInt(-15, 15);
    const b = randInt(-15, 15);
    const value = Math.abs(a - b);
    const drill = `Simplify inside first: ${a} ${signStr(-b)} ${Math.abs(b)} = ${a - b}. Then drop the sign: |${a - b}| = ${value}.`;
    return makeProblem(1, `|${a} − (${b})|`, { value: F(value) }, drill);
  }
  const a = nonZero(-25, 25);
  const value = Math.abs(a);
  const drill = `Absolute value just drops the sign: |${a}| = ${value}.`;
  return makeProblem(1, `|${a}|`, { value: F(value) }, drill);
}

function genLevel2(): Problem {
  const h = randInt(-8, 8);
  const k = randInt(1, 10);
  const x1 = F(h + k);
  const x2 = F(h - k);
  const display = `|x ${signStr(-h)} ${Math.abs(h)}| = ${k}`;
  const drill = `Split into two cases: x ${signStr(-h)} ${Math.abs(h)} = ${k}, or x ${signStr(-h)} ${Math.abs(h)} = ${-k}. Solving each gives x = ${h + k} or x = ${h - k}.`;
  return makeProblem(2, display, { x1, x2 }, drill);
}

function inequalityFromRule(h: number, k: number, direction: "<" | ">", exprShown: string): { solution: Partial<Answer>; drillTail: string } {
  if (k > 0) {
    if (direction === "<") {
      return {
        solution: { shape: "between", lo: F(h - k), hi: F(h + k) },
        drillTail: `${exprShown} < ${k} means "less than ${k} from ${h}": ${h - k} < x < ${h + k}.`,
      };
    }
    return {
      solution: { shape: "outside", lo: F(h - k), hi: F(h + k) },
      drillTail: `${exprShown} > ${k} means "more than ${k} from ${h}": x < ${h - k} or x > ${h + k}.`,
    };
  }
  if (k < 0) {
    if (direction === "<") return { solution: { shape: "no-solution" }, drillTail: `${exprShown} < ${k}: absolute value can never be less than a negative number — no solution.` };
    return { solution: { shape: "all-reals" }, drillTail: `${exprShown} > ${k}: absolute value is always ≥ 0, which is always greater than a negative number — all real numbers.` };
  }
  // k === 0
  if (direction === "<") return { solution: { shape: "no-solution" }, drillTail: `${exprShown} < 0: absolute value is never negative — no solution.` };
  return { solution: { shape: "all-except", exceptPoint: F(h) }, drillTail: `${exprShown} > 0: true everywhere except where the inside is exactly 0, i.e. x = ${h} — all reals except x = ${h}.` };
}

function genLevel3(): Problem {
  const h = randInt(-8, 8);
  const direction: "<" | ">" = Math.random() < 0.5 ? "<" : ">";
  const roll = Math.random();
  const k = roll < 0.65 ? randInt(1, 9) : roll < 0.85 ? nonZero(-6, -1) : 0;
  const symbol = direction === "<" ? "<" : ">";
  const display = `|x ${signStr(-h)} ${Math.abs(h)}| ${symbol} ${k}`;
  const { solution, drillTail } = inequalityFromRule(h, k, direction, `|x ${signStr(-h)} ${Math.abs(h)}|`);
  return makeProblem(3, display, solution, drillTail);
}

function genLevel4(): Problem {
  const h = randInt(-6, 6);
  const coeff = randInt(2, 5);
  const direction: "<" | ">" = Math.random() < 0.5 ? "<" : ">";
  const roll = Math.random();
  const kInner = roll < 0.65 ? randInt(1, 8) : roll < 0.85 ? nonZero(-5, -1) : 0;
  const shift = randInt(-6, 6);
  // coeff*|x-h| + shift  (symbol)  target, where target = coeff*kInner + shift, so isolating gives |x-h| (symbol) kInner
  const target = coeff * kInner + shift;
  const symbol = direction === "<" ? "<" : ">";
  const display = `${coeff}|x ${signStr(-h)} ${Math.abs(h)}| ${signStr(shift)} ${Math.abs(shift)} ${symbol} ${target}`;
  const { solution, drillTail } = inequalityFromRule(h, kInner, direction, `|x ${signStr(-h)} ${Math.abs(h)}|`);
  const isolateStep = `First isolate the absolute value: subtract ${shift} then divide by ${coeff}, giving |x ${signStr(-h)} ${Math.abs(h)}| ${symbol} ${kInner}. `;
  return makeProblem(4, display, solution, isolateStep + drillTail);
}

const GENERATORS: Record<LevelId, () => Problem> = {
  1: genLevel1,
  2: genLevel2,
  3: genLevel3,
  4: genLevel4,
};

export function generateProblem(level: LevelId): Problem {
  return GENERATORS[level]();
}

function fracEq(a: Fraction, b: Fraction): boolean {
  const ra = reduceFraction(a.num, a.den || 1);
  const rb = reduceFraction(b.num, b.den || 1);
  return ra.num === rb.num && ra.den === rb.den;
}

export function checkAnswer(problem: Problem, answer: Answer): boolean {
  const s = problem.solution;
  if (problem.level === 1) return fracEq(answer.value, s.value);
  if (problem.level === 2) {
    const target = [s.x1, s.x2].map((f) => `${reduceFraction(f.num, f.den).num}/${reduceFraction(f.num, f.den).den}`).sort();
    const given = [answer.x1, answer.x2].map((f) => `${reduceFraction(f.num, f.den || 1).num}/${reduceFraction(f.num, f.den || 1).den}`).sort();
    return target[0] === given[0] && target[1] === given[1];
  }
  if (answer.shape !== s.shape) return false;
  if (s.shape === "between" || s.shape === "outside") return fracEq(answer.lo, s.lo) && fracEq(answer.hi, s.hi);
  if (s.shape === "all-except") return fracEq(answer.exceptPoint, s.exceptPoint);
  return true;
}

export function formatAnswer(answer: Answer, level: LevelId): string {
  if (level === 1) return formatFraction(answer.value);
  if (level === 2) return `x = ${formatFraction(answer.x1)} or x = ${formatFraction(answer.x2)}`;
  switch (answer.shape) {
    case "between":
      return `${formatFraction(answer.lo)} < x < ${formatFraction(answer.hi)}`;
    case "outside":
      return `x < ${formatFraction(answer.lo)} or x > ${formatFraction(answer.hi)}`;
    case "no-solution":
      return "No solution";
    case "all-reals":
      return "All real numbers";
    case "all-except":
      return `All reals except x = ${formatFraction(answer.exceptPoint)}`;
  }
}

export type HintStage = 1 | 2 | 3 | 4;

export function getHint(problem: Problem, stage: HintStage): string {
  const { level, solution, drill } = problem;
  if (stage === 4) return `${formatAnswer(solution, level)}.`;
  if (stage === 3) return `Still stuck? Here's the work: ${drill}`;
  if (level === 1) {
    if (stage === 1) return "Simplify what's inside the bars first, then take the absolute value.";
    return "Absolute value is always the non-negative version — just drop the minus sign if there is one.";
  }
  if (level === 2) {
    if (stage === 1) return "|expression| = k splits into two separate equations: expression = k, and expression = −k.";
    return "Solve both equations separately — you'll get two different values of x.";
  }
  if (level === 3) {
    if (stage === 1) return "\"<\" means between two values; \">\" means outside two values. But check the number being compared to — is it positive, negative, or zero?";
    return "If it's a normal positive comparison, use h ± k for the boundaries. If the comparison number is negative or zero, it's a special case: no solution, all reals, or all reals except one point.";
  }
  if (stage === 1) return "Isolate the absolute value expression first — undo whatever's added or multiplied outside the bars, just like solving a normal equation.";
  return "Once |expression| is alone on one side, apply the same between/outside/special-case rules from Level 3.";
}
