// Factoring-quadratics problem generation, checking, and hints.
// A problem is always a quadratic a*x^2 + b*x + c with integer coefficients.
// An answer is the general factored form k * (m1*x + n1) * (m2*x + n2), which
// covers monic trinomials, leading-coefficient trinomials, difference of
// squares, and GCF-first problems with one shape.

export type LevelId = 1 | 2 | 3 | 4;

export interface Level {
  id: LevelId;
  name: string;
  subtitle: string;
  pattern: string;
  showK: boolean;
  showM: boolean;
  /** Helldivers-style difficulty tier, purely for flavor. */
  difficulty: string;
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

export type HintStage = 1 | 2 | 3;

export function getHint(problem: Problem, stage: HintStage): string {
  const { level, a, b, c, solution } = problem;
  if (level === 1) {
    if (stage === 1) return "Find two numbers that multiply to c and add to b.";
    if (stage === 2) return `You need two numbers that multiply to ${c} and add to ${b}.`;
    return `Those numbers are ${solution.n1} and ${solution.n2}, so it factors as ${formatFactored(solution)}.`;
  }
  if (level === 2) {
    const ac = a * c;
    if (stage === 1) return "Multiply a and c, then find two numbers that multiply to a×c and add to b. Use them to split the middle term and factor by grouping.";
    if (stage === 2) return `a×c = ${ac}. Find two numbers that multiply to ${ac} and add to ${b}, then rewrite ${formatPoly(a, b, c)} using those two terms in place of ${b}x.`;
    return `Split the middle term and group: it factors as ${formatFactored(solution)}.`;
  }
  if (level === 3) {
    const m = solution.m1;
    const n = solution.n2;
    if (stage === 1) return "This is a difference of squares: A² − B² = (A − B)(A + B). Find the square roots of the two terms.";
    if (stage === 2) return `√${a} = ${m}x and √${Math.abs(c)} = ${n}, so A = ${m}x and B = ${n}.`;
    return `It factors as ${formatFactored(solution)}.`;
  }
  // level 4
  if (stage === 1) return "First pull out the greatest common factor of all three terms, then factor the remaining trinomial.";
  if (stage === 2) return `The GCF of ${a}, ${b}, and ${c} is ${solution.k}. After factoring it out you get ${solution.k}(${formatPoly(a / solution.k, b / solution.k, c / solution.k)}).`;
  return `It factors as ${formatFactored(solution)}.`;
}
