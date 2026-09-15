// Evaluating radical/rational-exponent expressions without a calculator.
// Every problem is built from a "nice" base: pick an integer root value r
// and an index n, so p = r^n is a perfect nth power by construction — that's
// what makes it evaluable by hand. The answer is always a single rational
// number r^m (m the numerator of the rational exponent), represented as a
// reduced fraction {num, den} so a negative exponent's answer (e.g. 1/8) is
// just as checkable as an integer one.

import { gcd, sup, type Lesson, type LevelId, type LevelMeta } from "./levels";

export type { LevelId };

export interface Level extends LevelMeta {
  showDen: boolean;
}

export const LEVELS: Level[] = [
  { id: 1, name: "Roots of Perfect Powers", subtitle: "ⁿ√p, p a perfect nth power", difficulty: "Trivial", showDen: false },
  { id: 2, name: "Radical ⇄ Exponent Form", subtitle: "ⁿ√p = p^(1/n)", difficulty: "Challenging", showDen: false },
  { id: 3, name: "Rational Exponents", subtitle: "p^(m/n), including negative m", difficulty: "Extreme", showDen: true },
  { id: 4, name: "Negative Bases & Exponents", subtitle: "odd roots of negatives, combined", difficulty: "Helldive", showDen: true },
];

export const RADICAL_EVAL_LESSONS: Record<LevelId, Lesson> = {
  1: {
    intro:
      "ⁿ√p asks \"what number, raised to the nth power, gives p?\" For a square root (n=2) that's \"what times itself is p?\" For a cube root (n=3), \"what times itself three times?\" If you don't see it immediately, just try small integers until one works.",
    steps: [
      { text: "Start with the radical.", math: "√64" },
      { text: "Try small integers and cube... er, square them.", math: "5² = 25 — too small" },
      { text: "Try the next one.", math: "7² = 49 — still too small" },
      { text: "Try the next one.", math: "8² = 64 ✓ found it" },
      { text: "That's the answer.", math: "√64 = 8" },
    ],
  },
  2: {
    intro:
      "ⁿ√p and p^(1/n) mean exactly the same thing — a fractional exponent of 1/n IS the nth root. Whichever form a problem shows you, evaluate it the same way: find the number that, raised to the n, gives p.",
    steps: [
      { text: "Radical form.", math: "∛27" },
      { text: "Rewrite as a fractional exponent — same meaning.", math: "27^(1/3)" },
      { text: "Find r such that r³ = 27.", math: "3³ = 27 ✓" },
      { text: "Both forms give the same answer.", math: "∛27 = 27^(1/3) = 3" },
    ],
  },
  3: {
    intro:
      "For p^(m/n), the denominator n is still \"which root,\" and the numerator m is \"raised to what power\" — do the root first, it keeps the numbers small. A negative exponent means take the reciprocal after evaluating the positive version.",
    steps: [
      { text: "Start with the expression.", math: "8^(2/3)" },
      { text: "The denominator (3) says: take the cube root first.", math: "∛8 = 2" },
      { text: "The numerator (2) says: raise that to the 2nd power.", math: "2² = 4" },
      { text: "So 8^(2/3) = 4. Now watch a negative numerator.", math: "8^(-2/3)" },
      { text: "Evaluate as if positive, then flip it.", math: "8^(2/3) = 4, so 8^(-2/3) = 1/4" },
    ],
  },
  4: {
    intro:
      "Two extra rules stack on top of everything above. An odd-index root of a negative number is defined and negative (e.g. ∛(-8) = -2) — only even roots of negatives are undefined. And a negative rational exponent still just means \"reciprocal of the positive-exponent answer,\" sign and all.",
    steps: [
      { text: "Odd root of a negative base is fine.", math: "∛(-8) = -2, because (-2)³ = -8" },
      { text: "Combine with a power.", math: "(-8)^(2/3) = (∛(-8))² = (-2)² = 4" },
      { text: "Now make the exponent negative too.", math: "(-8)^(-2/3)" },
      { text: "Evaluate as positive, then flip it — the reciprocal of a positive number stays positive.", math: "(-8)^(2/3) = 4, so (-8)^(-2/3) = 1/4" },
    ],
  },
};

export interface Answer {
  num: number;
  den: number;
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

function reduceFraction(num: number, den: number): Answer {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
}

function radicalSymbol(n: number): string {
  if (n === 2) return "√";
  if (n === 3) return "∛";
  if (n === 4) return "∜";
  return `${sup(n)}√`;
}

function makeProblem(level: LevelId, display: string, num: number, den: number, drill: string): Problem {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, level, display, solution: reduceFraction(num, den), drill };
}

function rootSearchDrill(p: number, n: number, r: number): string {
  const lines: string[] = [];
  for (let t = r - 2 <= 1 ? 2 : r - 2; t <= r; t++) {
    const val = t ** n;
    lines.push(`${t}${sup(n)} = ${val}${val === p ? " ✓ that's it" : ""}`);
  }
  return lines.join(", then ");
}

function genLevel1(): Problem {
  const n = Math.random() < 0.6 ? 2 : 3;
  const r = randInt(2, n === 2 ? 12 : 8);
  const p = r ** n;
  const drill = `Try small numbers raised to the ${n === 2 ? "2nd" : "3rd"} power: ${rootSearchDrill(p, n, r)}.`;
  return makeProblem(1, `${radicalSymbol(n)}${p}`, r, 1, drill);
}

function genLevel2(): Problem {
  const n = randInt(2, 5);
  const r = randInt(2, n <= 3 ? 8 : 4);
  const p = r ** n;
  const asExponent = Math.random() < 0.5;
  const display = asExponent ? `${p}^(1/${n})` : `${radicalSymbol(n)}${p}`;
  const drill = `This means "which number, raised to the ${n}, gives ${p}?" Try small numbers: ${rootSearchDrill(p, n, r)}.`;
  return makeProblem(2, display, r, 1, drill);
}

function genLevel3(): Problem {
  const n = randInt(2, 3);
  const r = randInt(2, 4);
  const p = r ** n;
  const m = randInt(2, 3) * (Math.random() < 0.5 ? 1 : -1);
  const asExponent = Math.random() < 0.5;
  const display = asExponent ? `${p}^(${m}/${n})` : `(${radicalSymbol(n)}${p})${sup(m)}`;
  const rPowM = r ** Math.abs(m);
  const drill =
    `First, ${radicalSymbol(n)}${p} = ${r} (that's the root part). Then raise it to the ${Math.abs(m)}${m < 0 ? ", then flip it since the exponent is negative" : ""}: ${r}${sup(Math.abs(m))} = ${rPowM}` +
    (m < 0 ? `, so the answer is 1/${rPowM}.` : ".");
  return m >= 0 ? makeProblem(3, display, rPowM, 1, drill) : makeProblem(3, display, 1, rPowM, drill);
}

function genLevel4(): Problem {
  const n = randInt(0, 1) === 0 ? 3 : 5;
  const rMag = randInt(2, n === 3 ? 4 : 2);
  const r = Math.random() < 0.5 ? rMag : -rMag;
  const p = r ** n;
  const m = randInt(2, 3) * (Math.random() < 0.5 ? 1 : -1);
  const asExponent = Math.random() < 0.5;
  const display = asExponent ? `(${p})^(${m}/${n})` : `(${radicalSymbol(n)}(${p}))${sup(m)}`;
  const rPowM = r ** Math.abs(m);
  const rootNote = r < 0 ? ` (odd root of a negative — that's allowed, and negative)` : "";
  const drill =
    `First, ${radicalSymbol(n)}(${p}) = ${r}${rootNote}. Then raise it to the ${Math.abs(m)}${m < 0 ? ", then flip it since the exponent is negative" : ""}: ${signedTerm(r)}${sup(Math.abs(m))} = ${rPowM}` +
    (m < 0 ? `, so the answer is 1/${rPowM}.` : ".");
  return m >= 0 ? makeProblem(4, display, rPowM, 1, drill) : makeProblem(4, display, 1, rPowM, drill);
}

function signedTerm(n: number): string {
  return n < 0 ? `(${n})` : `${n}`;
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

export function checkAnswer(problem: Problem, answer: Answer): boolean {
  if (answer.den === 0) return false;
  const a = reduceFraction(answer.num, answer.den);
  const s = problem.solution;
  return a.num === s.num && a.den === s.den;
}

export function formatAnswer(answer: Answer): string {
  const a = reduceFraction(answer.num, answer.den);
  return a.den === 1 ? `${a.num}` : `${a.num}/${a.den}`;
}

export type HintStage = 1 | 2 | 3 | 4;

export function getHint(problem: Problem, stage: HintStage): string {
  const { level, solution, drill } = problem;
  if (stage === 4) return `It evaluates to ${formatAnswer(solution)}.`;
  if (stage === 3) return `Still stuck? Here's the search: ${drill}`;
  if (level === 1) {
    if (stage === 1) return "Ask yourself: what number, raised to that power, gives the number under the radical?";
    return "Try small integers (2, 3, 4, …) raised to that power until one matches.";
  }
  if (level === 2) {
    if (stage === 1) return "A radical and a fractional exponent with the same index mean the same thing — evaluate them the same way.";
    return "Find the number that, raised to the denominator's power, gives the base.";
  }
  if (level === 3) {
    if (stage === 1) return "Split it into two steps: the denominator tells you which root to take, the numerator tells you what power to raise it to afterward.";
    return "Take the root first (keeps the numbers small), then apply the power. If the exponent is negative, flip the final answer into a fraction.";
  }
  if (stage === 1) return "An odd-index root of a negative number is allowed and comes out negative. Handle that root first, then the power, then flip if the exponent is negative.";
  return "Same two-step process as before — root, then power — just track the negative sign through both steps carefully.";
}
