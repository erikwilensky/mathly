// Solving equations with the variable in a denominator. Levels 1-2 always
// have exactly one solution by construction (no extraneous risk, since
// there's only ever one pole and the equation is built so the root avoids
// it). Levels 3-4 use a three-term shared-denominator structure —
// p/(x-d1) + q/(x-d2) = r/((x-d1)(x-d2)), the same shape the source
// worksheet's genuine extraneous-solution example uses — which always
// clears to a single LINEAR equation. That's what makes deliberately
// forcing an extraneous root possible: setting r = p*(d1-d2) makes the
// algebraic solution equal to d1 exactly, by construction, so it's
// guaranteed extraneous ("no solution"); any other r generically gives a
// genuine solution (verified not to land on a pole).

import { formatFraction, reduceFraction, type Fraction, type Lesson, type LevelId, type LevelMeta } from "./levels";

export type { LevelId };

export interface Level extends LevelMeta {
  showNoSolutionToggle: boolean; // levels 3-4: "no solution" is a real possible outcome
}

export const LEVELS: Level[] = [
  { id: 1, name: "Numeric Denominators", subtitle: "x/a ± x/b = c", difficulty: "Trivial", showNoSolutionToggle: false },
  { id: 2, name: "One Variable Denominator", subtitle: "p/x = q/(x+d)", difficulty: "Challenging", showNoSolutionToggle: false },
  { id: 3, name: "Extraneous Solutions", subtitle: "always check the root against every denominator", difficulty: "Extreme", showNoSolutionToggle: true },
  { id: 4, name: "Harder Rational Equations", subtitle: "bigger numbers, same extraneous check", difficulty: "Helldive", showNoSolutionToggle: true },
];

export const RATIONAL_EQUATIONS_LESSONS: Record<LevelId, Lesson> = {
  1: {
    intro:
      "When every denominator is just a number (no x on the bottom), clear them by multiplying every term by the least common denominator, then solve the resulting equation normally.",
    steps: [
      { text: "Start with the equation.", math: "x/4 + x/6 = 5" },
      { text: "Multiply every term by the LCD (12).", math: "3x + 2x = 60" },
      { text: "Combine and solve.", math: "5x = 60 → x = 12" },
    ],
  },
  2: {
    intro:
      "With one x in a denominator, cross-multiply to clear it — but remember, the value that makes that denominator zero can never be the answer.",
    steps: [
      { text: "Start with the equation.", math: "3/x = 2/(x+1)" },
      { text: "Cross-multiply.", math: "3(x+1) = 2x" },
      { text: "Expand and solve.", math: "3x + 3 = 2x → x = −3" },
      { text: "Check it doesn't make a denominator zero.", math: "x = −3 gives x ≠ 0 and x+1 = −2 ≠ 0 ✓ valid" },
    ],
  },
  3: {
    intro:
      "With a denominator that's the product of the other two (like x(x−2)), clearing everything gives a straightforward linear equation. But the answer you get algebraically isn't automatically valid — it might turn out to equal one of the values that makes a denominator zero, in which case there's actually no solution at all.",
    steps: [
      { text: "Start with the equation.", math: "10/(x(x−2)) + 4/x = 5/(x−2)" },
      { text: "Multiply everything by x(x−2) to clear every denominator.", math: "10 + 4(x−2) = 5x" },
      { text: "Solve the resulting linear equation.", math: "10 + 4x − 8 = 5x → 4x + 2 = 5x → x = 2" },
      { text: "Check it against the original denominators — x ≠ 0 and x ≠ 2 are both required.", math: "x = 2 makes (x−2) zero, so this solution is extraneous — there is no solution" },
    ],
  },
  4: {
    intro:
      "Same shared-denominator method as Level 3, just with bigger numbers. Always solve the linear equation first, then check the result against every original denominator before declaring it the answer.",
    steps: [
      { text: "Start with the equation.", math: "7/(x(x+3)) − 2/x = 3/(x+3)" },
      { text: "Multiply everything by x(x+3).", math: "7 − 2(x+3) = 3x" },
      { text: "Solve the resulting linear equation.", math: "7 − 2x − 6 = 3x → 1 − 2x = 3x → x = 1/5" },
      { text: "Check against x ≠ 0 and x ≠ −3 — this one's genuinely valid.", math: "x = 1/5 doesn't make either denominator zero ✓" },
    ],
  },
};

export interface Answer {
  noSolution: boolean;
  x1: Fraction;
}

export interface Problem {
  id: string;
  level: LevelId;
  display: string;
  solution: Fraction | null; // null means no solution (the only algebraic root was extraneous)
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

function fracEq(a: Fraction, b: Fraction): boolean {
  const ra = reduceFraction(a.num, a.den);
  const rb = reduceFraction(b.num, b.den);
  return ra.num === rb.num && ra.den === rb.den;
}

function signStr(v: number): string {
  return v < 0 ? "−" : "+";
}

function makeProblem(level: LevelId, display: string, solution: Fraction | null, drill: string): Problem {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, level, display, solution, drill };
}

function genLevel1(): Problem {
  let a = 0,
    b = 0,
    sign = 1,
    kNum = 0,
    kDen = 1;
  while (kNum === 0) {
    a = randInt(2, 9);
    b = randInt(2, 9);
    sign = Math.random() < 0.5 ? 1 : -1;
    kNum = b + sign * a;
    kDen = a * b;
  }
  const xNum = nonZero(-6, 6);
  const xDen = randInt(1, 4);
  const cNum = kNum * xNum;
  const cDen = kDen * xDen;
  const target = reduceFraction(xNum, xDen);
  const display = `x/${a} ${sign > 0 ? "+" : "−"} x/${b} = ${formatFraction(reduceFraction(cNum, cDen))}`;
  const lcd = a * b;
  const drill = `Multiply every term by the LCD (${lcd}): ${lcd / a}x ${sign > 0 ? "+" : "−"} ${lcd / b}x = ${formatFraction(reduceFraction(cNum * lcd, cDen))}. Combine the x terms (coefficient ${kNum} over ${kDen}) and divide to solve.`;
  return makeProblem(1, display, target, drill);
}

function genLevel2(): Problem {
  let p = 0,
    q = 0,
    d = 0,
    xTarget: Fraction = { num: 0, den: 1 };
  let ok = false;
  while (!ok) {
    p = nonZero(-6, 6);
    q = nonZero(-6, 6);
    d = nonZero(-5, 5);
    if (p === q) continue;
    xTarget = reduceFraction(-p * d, p - q);
    const pole1 = reduceFraction(0, 1);
    const pole2 = reduceFraction(-d, 1);
    if (fracEq(xTarget, pole1) || fracEq(xTarget, pole2)) continue;
    ok = true;
  }
  const display = `${p}/x = ${q}/(x ${signStr(d)} ${Math.abs(d)})`;
  const drill = `Cross-multiply: ${p}(x ${signStr(d)} ${Math.abs(d)}) = ${q}x. Expand to ${p}x ${signStr(p * d)} ${Math.abs(p * d)} = ${q}x, then collect x terms on one side and solve.`;
  return makeProblem(2, display, xTarget, drill);
}

/**
 * p/(x-d1) + q/(x-d2) = r/((x-d1)(x-d2)), cleared by (x-d1)(x-d2):
 *   p(x-d2) + q(x-d1) = r
 *   (p+q)x = r + p*d2 + q*d1
 *   x = (r + p*d2 + q*d1) / (p+q)
 * Setting r = p*(d1-d2) forces that root to equal d1 exactly (extraneous,
 * since x=d1 is a pole) — the "no solution" case. Any other r generically
 * gives a genuine root, which we verify misses both poles.
 */
function genSharedDenominatorEquation(range: number, forceExtraneous: boolean): { p: number; q: number; d1: number; d2: number; r: number; root: Fraction | null } {
  for (let attempt = 0; attempt < 200; attempt++) {
    const d1 = randInt(-5, 5);
    let d2 = randInt(-5, 5);
    if (d2 === d1) d2 = d1 + 1;
    const p = nonZero(-range, range);
    const q = nonZero(-range, range);
    if (p + q === 0) continue;

    if (forceExtraneous) {
      const r = p * (d1 - d2);
      return { p, q, d1, d2, r, root: null };
    }

    const r = nonZero(-range * 2, range * 2);
    const rootVal = reduceFraction(r + p * d2 + q * d1, p + q);
    const pole1 = reduceFraction(d1, 1);
    const pole2 = reduceFraction(d2, 1);
    if (fracEq(rootVal, pole1) || fracEq(rootVal, pole2)) continue;
    return { p, q, d1, d2, r, root: rootVal };
  }
  // Fallback (should be unreachable at these ranges): a known-good genuine case.
  return { p: 3, q: 2, d1: 1, d2: -2, r: 7, root: reduceFraction(1, 1) };
}

function buildSharedDenominatorProblem(level: LevelId, found: ReturnType<typeof genSharedDenominatorEquation>): Problem {
  const { p, q, d1, d2, r, root } = found;
  const denom1 = `(x ${signStr(-d1)} ${Math.abs(d1)})`;
  const denom2 = `(x ${signStr(-d2)} ${Math.abs(d2)})`;
  const display = `${p}/${denom1} ${q < 0 ? "−" : "+"} ${Math.abs(q)}/${denom2} = ${r}/(${denom1}${denom2})`;
  const algebraicRoot = root ?? reduceFraction(d1, 1);
  const drill = root
    ? `Clear every denominator by multiplying by (x${signStr(-d1)}${Math.abs(d1)})(x${signStr(-d2)}${Math.abs(d2)}): ${p}(x${signStr(-d2)}${Math.abs(d2)}) ${q < 0 ? "−" : "+"} ${Math.abs(q)}(x${signStr(-d1)}${Math.abs(d1)}) = ${r}. That solves to x = ${formatFraction(algebraicRoot)}, and checking shows it doesn't hit either pole (x ≠ ${d1}, x ≠ ${d2}), so it's genuinely valid.`
    : `Clear every denominator the same way — it solves to x = ${formatFraction(algebraicRoot)}. But one of the original denominators is zero there (x ≠ ${d1} is required), so this root is extraneous and there's no solution.`;
  return makeProblem(level, display, root, drill);
}

function genLevel3(): Problem {
  const forceExtraneous = Math.random() < 0.45;
  return buildSharedDenominatorProblem(3, genSharedDenominatorEquation(6, forceExtraneous));
}

function genLevel4(): Problem {
  const forceExtraneous = Math.random() < 0.45;
  return buildSharedDenominatorProblem(4, genSharedDenominatorEquation(10, forceExtraneous));
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
  if (problem.solution === null) return answer.noSolution;
  if (answer.noSolution) return false;
  return fracEq(answer.x1, problem.solution);
}

export function formatSolution(solution: Fraction | null): string {
  return solution === null ? "No solution" : `x = ${formatFraction(solution)}`;
}

export type HintStage = 1 | 2 | 3 | 4;

export function getHint(problem: Problem, stage: HintStage): string {
  const { level, solution, drill } = problem;
  if (stage === 4) return `${formatSolution(solution)}.`;
  if (stage === 3) return `Still stuck? Here's the work: ${drill}`;
  if (level === 1) {
    if (stage === 1) return "Multiply every term by the least common denominator to clear the fractions, then solve like a normal equation.";
    return "Once the fractions are cleared, collect the x terms and divide to isolate x.";
  }
  if (level === 2) {
    if (stage === 1) return "Cross-multiply to clear the single variable denominator.";
    return "Expand and collect the x terms on one side, then check your answer isn't a value that makes a denominator zero.";
  }
  if (level === 3) {
    if (stage === 1) return "Multiply every term by the product of both denominators to clear them all at once — one denominator here is already that product.";
    return "Solve the resulting linear equation, then check the root against every original denominator. If it makes one zero, the answer is 'no solution.'";
  }
  if (stage === 1) return "Same process as Level 3, just with bigger numbers — clear every denominator, solve the linear equation.";
  return "Don't skip the check: verify the root against every original denominator before deciding whether it's valid or extraneous.";
}
