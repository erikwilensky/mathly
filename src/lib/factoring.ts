// Factoring-quadratics problem generation, checking, and hints.
// A problem is always a quadratic a*x^2 + b*x + c with integer coefficients.
// An answer is the general factored form k * (m1*x + n1) * (m2*x + n2), which
// covers monic trinomials, leading-coefficient trinomials, difference of
// squares, and GCF-first problems with one shape.

import type { Lesson, LevelId, LevelMeta } from "./levels";

export type { LevelId };

export interface Level extends LevelMeta {
  pattern: string;
  showK: boolean;
  showM: boolean;
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Basic Trinomials",
    subtitle: "x² + bx + c",
    pattern: "(x + _)(x + _)",
    showK: false,
    showM: false,
    difficulty: "Trivial",
  },
  {
    id: 2,
    name: "Leading Coefficient",
    subtitle: "ax² + bx + c",
    pattern: "(_x + _)(_x + _)",
    showK: false,
    showM: true,
    difficulty: "Challenging",
  },
  {
    id: 3,
    name: "Difference of Squares",
    subtitle: "a²x² − b²",
    pattern: "(_x + _)(_x + _)",
    showK: false,
    showM: true,
    difficulty: "Extreme",
  },
  {
    id: 4,
    name: "GCF First",
    subtitle: "k(ax² + bx + c)",
    pattern: "_(_x + _)(_x + _)",
    showK: true,
    showM: true,
    difficulty: "Helldive",
  },
];

export const FACTORING_LESSONS: Record<LevelId, Lesson> = {
  1: {
    intro:
      "For x² + bx + c, you're looking for two numbers that multiply to c and add to b. Those two numbers become the constants in your two binomials. If you can't just see them, list the factor pairs of c and test each one — that always works.",
    steps: [
      { text: "Start with the trinomial.", math: "x² + 5x + 6" },
      { text: "List the factor pairs of c = 6.", math: "1 × 6,   2 × 3" },
      { text: "Test the first pair: does it add to b = 5?", math: "1 + 6 = 7 — nope, not this one" },
      { text: "Test the next pair: does it add to b = 5?", math: "2 + 3 = 5 ✓ found it" },
      { text: "Use that pair (2 and 3) as the constants in the two binomials.", math: "(x + 2)(x + 3)" },
      { text: "Check by expanding — it should rebuild the original trinomial.", math: "x² + 3x + 2x + 6 = x² + 5x + 6 ✓" },
    ],
  },
  2: {
    intro:
      "When a ≠ 1, multiply a×c first. Find two numbers that multiply to a×c and add to b (same trial-and-error as Level 1, just with a×c instead of c), use them to split the middle term into two terms, then factor by grouping.",
    steps: [
      { text: "Start with the trinomial.", math: "2x² + 7x + 3" },
      { text: "Multiply a and c.", math: "a × c = 2 × 3 = 6" },
      { text: "List the factor pairs of 6 and test each against b = 7.", math: "1 × 6 → 1 + 6 = 7 ✓ found it" },
      { text: "Split the middle term 7x into 1x + 6x, using those two numbers.", math: "2x² + 1x + 6x + 3" },
      { text: "Group in pairs and factor each pair.", math: "x(2x + 1) + 3(2x + 1)" },
      { text: "Factor out the common binomial.", math: "(2x + 1)(x + 3)" },
    ],
  },
  3: {
    intro:
      "A difference of squares A² − B² always factors as (A − B)(A + B) — no middle term, so there's nothing to split. Just confirm both terms are perfect squares and find their roots.",
    steps: [
      { text: "Start with the binomial.", math: "9x² − 16" },
      { text: "Is the first term a perfect square? Find its square root.", math: "9x² = (3x)² — yes, √9 = 3" },
      { text: "Is the second term a perfect square? Find its square root.", math: "16 = 4² — yes, √16 = 4" },
      { text: "Apply A² − B² = (A − B)(A + B) with A = 3x, B = 4.", math: "(3x − 4)(3x + 4)" },
    ],
  },
  4: {
    intro:
      "Always check for a greatest common factor first. If you can't spot it immediately, list the factors of each coefficient and pick the largest one they all share, then factor whatever trinomial is left using the Level 1 or Level 2 method.",
    steps: [
      { text: "Start with the trinomial.", math: "4x² + 20x + 24" },
      { text: "List the factors of each coefficient.", math: "4: 1, 2, 4    20: 1, 2, 4, 5, 10, 20    24: 1, 2, 3, 4, 6, 8, 12, 24" },
      { text: "Find the largest factor common to all three.", math: "GCF = 4" },
      { text: "Factor it out.", math: "4(x² + 5x + 6)" },
      { text: "Factor the remaining trinomial like Level 1.", math: "4(x + 2)(x + 3)" },
    ],
  },
};

export interface Problem {
  id: string;
  level: LevelId;
  a: number;
  b: number;
  c: number;
  solution: FactorAnswer;
}

export interface FactorAnswer {
  k: number;
  m1: number;
  n1: number;
  m2: number;
  n2: number;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nonZero(min: number, max: number): number {
  let v = 0;
  while (v === 0) v = randInt(min, max);
  return v;
}

function genLevel1(): Problem {
  const p = nonZero(-9, 9);
  const q = nonZero(-9, 9);
  const a = 1;
  const b = p + q;
  const c = p * q;
  return makeProblem(1, a, b, c, { k: 1, m1: 1, n1: p, m2: 1, n2: q });
}

function genLevel2(): Problem {
  const m1 = randInt(2, 5);
  const m2 = randInt(1, 4);
  const n1 = nonZero(-9, 9);
  const n2 = nonZero(-9, 9);
  const a = m1 * m2;
  const b = m1 * n2 + m2 * n1;
  const c = n1 * n2;
  return makeProblem(2, a, b, c, { k: 1, m1, n1, m2, n2 });
}

function genLevel3(): Problem {
  const m = randInt(1, 6);
  const n = randInt(1, 9);
  const a = m * m;
  const b = 0;
  const c = -(n * n);
  return makeProblem(3, a, b, c, { k: 1, m1: m, n1: -n, m2: m, n2: n });
}

function genLevel4(): Problem {
  const k = randInt(2, 6);
  const p = nonZero(-9, 9);
  const q = nonZero(-9, 9);
  const a = k;
  const b = k * (p + q);
  const c = k * (p * q);
  return makeProblem(4, a, b, c, { k, m1: 1, n1: p, m2: 1, n2: q });
}

function makeProblem(level: LevelId, a: number, b: number, c: number, solution: FactorAnswer): Problem {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, level, a, b, c, solution };
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

export function expand(answer: FactorAnswer): { a: number; b: number; c: number } {
  const { k, m1, n1, m2, n2 } = answer;
  return {
    a: k * m1 * m2,
    b: k * (m1 * n2 + m2 * n1),
    c: k * n1 * n2,
  };
}

export function checkAnswer(problem: Problem, answer: FactorAnswer): boolean {
  const { a, b, c } = expand(answer);
  return a === problem.a && b === problem.b && c === problem.c;
}

export function formatPoly(a: number, b: number, c: number): string {
  const terms: string[] = [];
  if (a !== 0) {
    const coef = a === 1 ? "" : a === -1 ? "−" : `${a}`;
    terms.push(`${coef}x²`);
  }
  if (b !== 0) {
    const abs = Math.abs(b);
    const coef = abs === 1 ? "" : `${abs}`;
    const sign = b < 0 ? "−" : "+";
    terms.push(terms.length === 0 ? `${b < 0 ? "−" : ""}${coef}x` : `${sign} ${coef}x`);
  }
  if (c !== 0) {
    const abs = Math.abs(c);
    const sign = c < 0 ? "−" : "+";
    terms.push(terms.length === 0 ? `${c}` : `${sign} ${abs}`);
  }
  return terms.length === 0 ? "0" : terms.join(" ");
}

function binomialString(m: number, n: number): string {
  const mCoef = m === 1 ? "" : m === -1 ? "−" : `${m}`;
  const sign = n < 0 ? "−" : "+";
  return `(${mCoef}x ${sign} ${Math.abs(n)})`;
}

export function formatFactored(answer: FactorAnswer): string {
  const kPart = answer.k === 1 ? "" : `${answer.k}`;
  return `${kPart}${binomialString(answer.m1, answer.n1)}${binomialString(answer.m2, answer.n2)}`;
}

export type HintStage = 1 | 2 | 3 | 4;

/** Every divisor of n, ascending, from 1 to |n|. */
function factorsOf(n: number): number[] {
  const abs = Math.abs(n);
  const out: number[] = [];
  for (let d = 1; d <= abs; d++) if (abs % d === 0) out.push(d);
  return out;
}

/**
 * Walks the actual trial-and-error a student should do: try each divisor
 * pair of `product`, sign-matched to it, and stop at the one summing to
 * `sum` — this is the sub-step under "find two numbers that multiply to X
 * and add to Y" for a student who doesn't know how to search for them.
 */
function factorPairChecklist(product: number, sum: number): string {
  const absP = Math.abs(product);
  const lines: string[] = [];
  for (let d = 1; d * d <= absP; d++) {
    if (absP % d !== 0) continue;
    const other = absP / d;
    const candidates: Array<[number, number]> = product >= 0 ? [[d, other], [-d, -other]] : [[d, -other], [-d, other]];
    const match = candidates.find(([p, q]) => p + q === sum);
    const [p, q] = match ?? candidates[0]!;
    const ok = match !== undefined;
    lines.push(`${p} × ${q} → sum = ${p + q}${ok ? " ✓ that's it" : ""}`);
    if (ok) break;
  }
  return lines.join(", then ");
}

export function getHint(problem: Problem, stage: HintStage): string {
  const { level, a, b, c, solution } = problem;
  if (level === 1) {
    if (stage === 1) return "Find two numbers that multiply to c and add to b.";
    if (stage === 2) return `You need two numbers that multiply to ${c} and add to ${b}.`;
    if (stage === 3) return `Stuck on which two numbers those are? Try the divisor pairs of ${c} one at a time: ${factorPairChecklist(c, b)}.`;
    return `Those numbers are ${solution.n1} and ${solution.n2}, so it factors as ${formatFactored(solution)}.`;
  }
  if (level === 2) {
    const ac = a * c;
    if (stage === 1) return "Multiply a and c, then find two numbers that multiply to a×c and add to b. Use them to split the middle term and factor by grouping.";
    if (stage === 2) return `a×c = ${ac}. Find two numbers that multiply to ${ac} and add to ${b}, then rewrite ${formatPoly(a, b, c)} using those two terms in place of ${b}x.`;
    if (stage === 3) return `Stuck on which two numbers those are? Try the divisor pairs of ${ac} one at a time: ${factorPairChecklist(ac, b)}.`;
    return `Split the middle term and group: it factors as ${formatFactored(solution)}.`;
  }
  if (level === 3) {
    const m = solution.m1;
    const n = solution.n2;
    if (stage === 1) return "This is a difference of squares: A² − B² = (A − B)(A + B). Find the square roots of the two terms.";
    if (stage === 2) return `You need √${a} and √${Math.abs(c)} — what are they?`;
    if (stage === 3) return `Check: ${m}² = ${m * m} (that's a ✓), and ${n}² = ${n * n} (that's |c| ✓). So A = ${m}x and B = ${n}.`;
    return `It factors as ${formatFactored(solution)}.`;
  }
  // level 4
  const fa = factorsOf(a);
  const fb = factorsOf(b);
  const fc = factorsOf(c);
  if (stage === 1) return "First pull out the greatest common factor of all three terms, then factor the remaining trinomial.";
  if (stage === 2) return `Find the greatest number that divides evenly into all of ${a}, ${b}, and ${c}.`;
  if (stage === 3) return `Factors of ${a}: ${fa.join(", ")}. Factors of ${b}: ${fb.join(", ")}. Factors of ${c}: ${fc.join(", ")}. The largest one common to all three is the GCF.`;
  return `The GCF is ${solution.k}. After factoring it out you get ${solution.k}(${formatPoly(a / solution.k, b / solution.k, c / solution.k)}), which factors as ${formatFactored(solution)}.`;
}
