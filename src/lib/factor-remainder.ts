// The Factor & Remainder Theorems. Levels 1-2 use the Remainder Theorem
// (evaluate P(c) directly); levels 3-4 use the Factor Theorem (find one
// linear factor by testing divisors of the constant term, then the
// remaining quadratic "by inspection"). A cubic can have more than one
// valid factorization when its quadratic factor itself factors further, so
// factoring answers are checked by re-expanding the student's (px+q)(x²+bx+c)
// and comparing coefficients to the original cubic — same approach as the
// factoring-quadratics module — rather than matching one canonical triple.

import { formatFraction, reduceFraction, type Fraction, type Lesson, type LevelId, type LevelMeta } from "./levels";

export type { LevelId };

export interface Level extends LevelMeta {
  mode: "evaluate" | "factor";
  showDen: boolean;
  showP: boolean;
}

export const LEVELS: Level[] = [
  { id: 1, name: "Remainder Theorem", subtitle: "find P(c) directly", difficulty: "Trivial", mode: "evaluate", showDen: false, showP: false },
  { id: 2, name: "Remainder Theorem (fractions)", subtitle: "c from a non-monic divisor", difficulty: "Challenging", mode: "evaluate", showDen: true, showP: false },
  { id: 3, name: "Factor Theorem", subtitle: "factor a monic cubic", difficulty: "Extreme", mode: "factor", showDen: false, showP: false },
  { id: 4, name: "Non-Monic Cubics", subtitle: "leading coefficient > 1", difficulty: "Helldive", mode: "factor", showDen: false, showP: true },
];

export const FACTOR_REMAINDER_LESSONS: Record<LevelId, Lesson> = {
  1: {
    intro:
      "The Remainder Theorem: if you divide a polynomial P(x) by (x − c), the remainder is just P(c) — plug c straight in, no long division needed.",
    steps: [
      { text: "Start with the polynomial and the value to test.", math: "P(x) = x³ − x² + 2x + 4,  find P(−1)" },
      { text: "Substitute x = −1 everywhere.", math: "(−1)³ − (−1)² + 2(−1) + 4" },
      { text: "Evaluate term by term.", math: "−1 − 1 − 2 + 4 = 0" },
      { text: "That's the remainder when dividing by (x + 1).", math: "P(−1) = 0" },
    ],
  },
  2: {
    intro:
      "For a non-monic divisor like (2x + 1), find the c-value by setting the divisor to zero first: 2x + 1 = 0 gives x = −1/2. Then evaluate P(−1/2) exactly, as a fraction.",
    steps: [
      { text: "Find c from the divisor.", math: "2x + 1 = 0  →  x = −1/2" },
      { text: "Substitute into P(x) = x³ − x² + 2x + 4.", math: "(−1/2)³ − (−1/2)² + 2(−1/2) + 4" },
      { text: "Evaluate each term as a fraction.", math: "−1/8 − 1/4 − 1 + 4" },
      { text: "Add them up over a common denominator.", math: "−1/8 − 2/8 − 8/8 + 32/8 = 21/8" },
    ],
  },
  3: {
    intro:
      "The Factor Theorem: if P(a) = 0, then (x − a) is a factor. Try small integer divisors of the constant term until one gives P(a) = 0, then find the remaining quadratic by matching the x³ and constant terms.",
    steps: [
      { text: "Start with the cubic.", math: "x³ − 2x² + 5x + 8" },
      { text: "Try divisors of the constant (8): ±1, ±2, ±4, ±8.", math: "P(1) = 1 − 2 + 5 + 8 = 12 — not zero" },
      { text: "Try the next one.", math: "P(−1) = −1 − 2 − 5 + 8 = 0 — found it! (x + 1) is a factor" },
      { text: "Write it as (x + 1)(x² + bx + c) and match the x² term to find b.", math: "x² term must be −2x², and (x)(bx)+(1)(x²) = −2x² → b = −3" },
      { text: "Match the constant term to find c.", math: "constant must be 8, and (1)(c) = 8 → c = 8" },
      { text: "Full factorization.", math: "x³ − 2x² + 5x + 8 = (x + 1)(x² − 3x + 8)" },
    ],
  },
  4: {
    intro:
      "Same method when the leading coefficient isn't 1 — you may need to try divisors of BOTH the constant term and the leading coefficient (the Rational Root Theorem) to find the linear factor (px + q).",
    steps: [
      { text: "Start with the cubic.", math: "2x³ + x² − 8x − 4" },
      { text: "Try x = 1/2 (a candidate from the Rational Root Theorem).", math: "2(1/8) + 1/4 − 4 − 4 = 0 — found it! (2x − 1) is a factor" },
      { text: "Write it as (2x − 1)(x² + bx + c) and match the leading term.", math: "leading term must be 2x³, and (2x)(x²) already gives that ✓" },
      { text: "Match the constant, then check the middle term.", math: "(−1)(c) = −4 → c = 4; check the x term works out too" },
      { text: "Full factorization.", math: "2x³ + x² − 8x − 4 = (2x − 1)(x² + x + 4)" },
    ],
  },
};

export interface Answer extends Fraction {
  p: number;
  q: number;
  b: number;
  c: number;
}

export interface Problem {
  id: string;
  level: LevelId;
  display: string;
  poly: { a: number; b: number; c: number; d: number }; // a*x^3 + b*x^2 + c*x + d, factor-mode only
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

function formatCubic(a: number, b: number, c: number, d: number): string {
  const terms: string[] = [];
  const coef = (v: number, suffix: string, isFirst: boolean) => {
    const abs = Math.abs(v);
    const mag = abs === 1 && suffix !== "" ? "" : `${abs}`;
    if (isFirst) return `${v < 0 ? "−" : ""}${mag}${suffix}`;
    return ` ${v < 0 ? "−" : "+"} ${mag}${suffix}`;
  };
  if (a !== 0) terms.push(coef(a, "x³", true));
  if (b !== 0) terms.push(coef(b, "x²", terms.length === 0));
  if (c !== 0) terms.push(coef(c, "x", terms.length === 0));
  if (d !== 0) terms.push(coef(d, "", terms.length === 0));
  return terms.length === 0 ? "0" : terms.join("");
}

const EMPTY_TRIPLE = { p: 1, q: 0, b: 0, c: 0 };

function makeEvalProblem(level: LevelId, display: string, num: number, den: number, poly: Problem["poly"], drill: string): Problem {
  const frac = reduceFraction(num, den);
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, level, display, poly, solution: { ...frac, ...EMPTY_TRIPLE }, drill };
}

function makeFactorProblem(level: LevelId, poly: Problem["poly"], p: number, q: number, b: number, c: number, drill: string): Problem {
  const display = `Factorise: ${formatCubic(poly.a, poly.b, poly.c, poly.d)}`;
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, level, display, poly, solution: { num: 0, den: 1, p, q, b, c }, drill };
}

function genLevel1(): Problem {
  const a = randInt(1, 3);
  const b = randInt(-6, 6);
  const c = randInt(-6, 6);
  const d = randInt(-8, 8);
  const testC = randInt(-4, 4);
  const value = a * testC ** 3 + b * testC ** 2 + c * testC + d;
  const drill = `Substitute x = ${testC}: ${a}(${testC})³ + ${b}(${testC})² + ${c}(${testC}) + ${d} = ${a * testC ** 3} + ${b * testC ** 2} + ${c * testC} + ${d} = ${value}.`;
  return makeEvalProblem(1, `P(x) = ${formatCubic(a, b, c, d)}. Find P(${testC}).`, value, 1, { a, b, c, d }, drill);
}

function genLevel2(): Problem {
  const p = randInt(2, 3);
  const q = nonZero(-4, 4);
  const a = randInt(1, 3);
  const b = randInt(-5, 5);
  const c = randInt(-5, 5);
  const d = randInt(-6, 6);
  // c-value = -q/p exactly, evaluated via a common denominator p^3 to stay exact.
  const numAt = a * (-q) ** 3 + b * (-q) ** 2 * p + c * (-q) * p ** 2 + d * p ** 3;
  const denAt = p ** 3;
  const cSign = q < 0 ? "−" : "+";
  const drill = `${p}x ${cSign} ${Math.abs(q)} = 0 gives x = ${formatFraction(reduceFraction(-q, p))}. Substituting that into P(x) and simplifying gives ${formatFraction(reduceFraction(numAt, denAt))}.`;
  return makeEvalProblem(
    2,
    `Find the remainder when P(x) = ${formatCubic(a, b, c, d)} is divided by ${p}x ${cSign} ${Math.abs(q)}.`,
    numAt,
    denAt,
    { a, b, c, d },
    drill,
  );
}

function genLevel3(): Problem {
  const root = nonZero(-4, 4);
  const qb = randInt(-5, 5);
  const qc = nonZero(-6, 6);
  const a = 1;
  const b = qb - root;
  const c = qc - root * qb;
  const d = -root * qc;
  const drill = `Try divisors of the constant term (${d}) until one gives zero: root x = ${root} works, since P(${root}) = 0. Match the x² term to find the quadratic's middle coefficient (${qb}) and the constant term to find the last one (${qc}).`;
  return makeFactorProblem(3, { a, b, c, d }, 1, -root, qb, qc, drill);
}

function genLevel4(): Problem {
  const p = randInt(2, 3);
  const q = nonZero(-3, 3);
  const qb = randInt(-4, 4);
  const qc = nonZero(-5, 5);
  const a = p;
  const b = p * qb + q;
  const c = p * qc + q * qb;
  const d = q * qc;
  const testRoot = formatFraction(reduceFraction(-q, p));
  const drill = `This time try divisors of both the constant (${d}) and the leading coefficient (${p}) as possible fractions. x = ${testRoot} works. Write it as (${p}x ${q < 0 ? "−" : "+"} ${Math.abs(q)})(x² + bx + c), then match the leading, middle, and constant terms to find b = ${qb} and c = ${qc}.`;
  return makeFactorProblem(4, { a, b, c, d }, p, q, qb, qc, drill);
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
  if (problem.level <= 2) {
    const a = reduceFraction(answer.num, answer.den || 1);
    const s = reduceFraction(problem.solution.num, problem.solution.den);
    return a.num === s.num && a.den === s.den;
  }
  const p = problem.level === 3 ? 1 : answer.p;
  const { a, b, c, d } = problem.poly;
  const expA = p;
  const expB = p * answer.b + answer.q;
  const expC = p * answer.c + answer.q * answer.b;
  const expD = answer.q * answer.c;
  return expA === a && expB === b && expC === c && expD === d;
}

export function formatAnswer(problem: Problem, answer: Answer): string {
  if (problem.level <= 2) return formatFraction(answer);
  const pPart = (problem.level === 4 ? answer.p : 1) === 1 ? "x" : `${problem.level === 4 ? answer.p : 1}x`;
  const qSign = answer.q < 0 ? "−" : "+";
  const bSign = answer.b < 0 ? "−" : "+";
  const cSign = answer.c < 0 ? "−" : "+";
  return `(${pPart} ${qSign} ${Math.abs(answer.q)})(x² ${bSign} ${Math.abs(answer.b)}x ${cSign} ${Math.abs(answer.c)})`;
}

export type HintStage = 1 | 2 | 3 | 4;

export function getHint(problem: Problem, stage: HintStage): string {
  const { level, solution, drill } = problem;
  if (stage === 4) {
    if (level <= 2) return `The remainder is ${formatFraction(solution)}.`;
    return `It factors as ${formatAnswer(problem, solution)}.`;
  }
  if (stage === 3) return `Still stuck? Here's the work: ${drill}`;
  if (level === 1) {
    if (stage === 1) return "The Remainder Theorem says the remainder when dividing by (x − c) is just P(c) — substitute directly.";
    return "Substitute the given value in for every x, then evaluate term by term.";
  }
  if (level === 2) {
    if (stage === 1) return "Set the divisor equal to zero first to find the c-value — it won't be a whole number this time.";
    return "Substitute that fraction in for x and simplify each term carefully, keeping everything as exact fractions.";
  }
  if (level === 3) {
    if (stage === 1) return "Try small integer divisors of the constant term as possible roots until P(a) = 0 for one of them.";
    return "Once you have a root a, write the cubic as (x − a)(x² + bx + c) and match coefficients to find b and c.";
  }
  if (stage === 1) return "This time the leading coefficient isn't 1, so also consider fractions p/q where p divides the constant and q divides the leading coefficient.";
  return "Once you find the linear factor (px + q), match the leading, middle, and constant terms to find the quadratic's coefficients.";
}
