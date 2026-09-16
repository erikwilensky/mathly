// Solving inequalities: linear, quadratic (including the degenerate cases
// — no real roots, or a repeated root), and cubic via the sign-table
// method (the "Beyond Quadratics" material folded in as the hardest
// tier). Answers use the source worksheet's compound-inequality language
// ("x < a or x > b"), not interval-bracket notation, matching every file
// in the corpus except the one that introduces interval notation as a
// secondary, equivalent form alongside it.
//
// A cubic that's a product of 3 distinct linear factors (x-r1)(x-r2)(x-r3)
// with r1<r2<r3 always has the same alternating sign pattern across its 4
// regions (-,+,-,+ from left to right, for a positive leading
// coefficient), so its solution shape is fully determined by the
// inequality direction — no need for a general region-toggle UI, just
// which of the two fixed 2-piece shapes applies.

import { formatFraction, reduceFraction, type Fraction, type Lesson, type LevelId, type LevelMeta } from "./levels";

export type { LevelId };

export type Shape = "less-than" | "greater-than" | "between" | "outside" | "no-solution" | "all-reals" | "all-except" | "left-and-middle" | "middle-and-right";

export interface Level extends LevelMeta {
  degree: 1 | 2 | 3;
}

export const LEVELS: Level[] = [
  { id: 1, name: "Linear Inequalities", subtitle: "ax + b (>,<) c", difficulty: "Trivial", degree: 1 },
  { id: 2, name: "Quadratic Inequalities", subtitle: "two real roots", difficulty: "Challenging", degree: 2 },
  { id: 3, name: "Degenerate Cases", subtitle: "repeated or no real roots", difficulty: "Extreme", degree: 2 },
  { id: 4, name: "Cubic Sign Tables", subtitle: "(x-r₁)(x-r₂)(x-r₃)", difficulty: "Helldive", degree: 3 },
];

export const QUADRATIC_INEQUALITIES_LESSONS: Record<LevelId, Lesson> = {
  1: {
    intro: "Solve a linear inequality just like an equation — except dividing by a negative number flips the inequality sign.",
    steps: [
      { text: "Start with the inequality.", math: "3x + 2 < 14" },
      { text: "Isolate x normally.", math: "3x < 12 → x < 4" },
      { text: "Now try one with a negative coefficient.", math: "−2x + 1 > 9" },
      { text: "Isolate x, and flip the sign when dividing by a negative.", math: "−2x > 8 → x < −4  (sign flipped)" },
    ],
  },
  2: {
    intro: "Factor, find the zeros, then test one point from each region on a number line to see where the expression is positive or negative — a \"sign diagram.\"",
    steps: [
      { text: "Start with the inequality.", math: "x² − x > 12" },
      { text: "Move everything to one side and factor.", math: "x² − x − 12 > 0 → (x−4)(x+3) > 0" },
      { text: "The zeros are x = −3 and x = 4. Test a point in each region.", math: "x=−4: 8>0 ✓   x=0: −12<0 ✗   x=5: 8>0 ✓" },
      { text: "The solution is where the test came out positive.", math: "x < −3 or x > 4" },
    ],
  },
  3: {
    intro: "Two special cases show up a lot: a repeated (double) root, and no real roots at all. Both break the usual \"between/outside the roots\" pattern.",
    steps: [
      { text: "Repeated root case.", math: "(x−3)² < 0" },
      { text: "A square is never negative, so this is never true.", math: "No solution" },
      { text: "No real roots case (discriminant < 0).", math: "x² + 2x + 5 > 0" },
      { text: "This never touches zero and always opens upward — it's positive everywhere.", math: "All real numbers" },
    ],
  },
  4: {
    intro: "For three factors, build a sign table: one column per factor, marking + or − in each region, then multiply across each row to get the sign of the whole product.",
    steps: [
      { text: "Start with the inequality.", math: "(2x−1)(x+1)(x+7) > 0" },
      { text: "Zeros at x = 1/2, −1, −7. Build the sign table across the 4 regions.", math: "x<−7: (−)(−)(−)=−   −7<x<−1: (−)(−)(+)=+   −1<x<1/2: (−)(+)(+)=−   x>1/2: (+)(+)(+)=+" },
      { text: "Pick out the regions where the product is positive.", math: "−7 < x < −1  or  x > 1/2" },
    ],
  },
};

export interface Answer {
  shape: Shape;
  lo: Fraction;
  hi: Fraction;
  third: Fraction;
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

const F = (n: number): Fraction => reduceFraction(n, 1);
const ZERO: Fraction = { num: 0, den: 1 };

function baseAnswer(): Answer {
  return { shape: "no-solution", lo: ZERO, hi: ZERO, third: ZERO, exceptPoint: ZERO };
}

function makeProblem(level: LevelId, display: string, solution: Partial<Answer>, drill: string): Problem {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, level, display, solution: { ...baseAnswer(), ...solution }, drill };
}

function formatLinearTerm(coef: number, isFirst: boolean): string {
  const abs = Math.abs(coef);
  const mag = abs === 1 ? "" : `${abs}`;
  return isFirst ? `${coef < 0 ? "−" : ""}${mag}x` : ` ${signStr(coef)} ${mag}x`;
}

function genLevel1(): Problem {
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const x0 = randInt(-8, 8);
  const c = a * x0 + b;
  const finalShape: "less-than" | "greater-than" = Math.random() < 0.5 ? "less-than" : "greater-than";
  const rawIsLess = a > 0 ? finalShape === "less-than" : finalShape === "greater-than";
  const symbol = rawIsLess ? "<" : ">";
  const bTerm = b === 0 ? "" : ` ${signStr(b)} ${Math.abs(b)}`;
  const display = `${formatLinearTerm(a, true)}${bTerm} ${symbol} ${c}`;
  const flipNote = a < 0 ? ` Dividing by a negative number (${a}) flips the inequality.` : "";
  const drill = `Isolate x: ${a}x ${symbol} ${c - b} → x ${finalShape === "less-than" ? "<" : ">"} ${x0}.${flipNote}`;
  return makeProblem(1, display, { shape: finalShape, lo: F(x0) }, drill);
}

function formatQuadraticDisplay(r1: number, r2: number, factored: boolean, symbol: string): string {
  if (factored) {
    const t1 = `(x ${signStr(-r1)} ${Math.abs(r1)})`;
    const t2 = `(x ${signStr(-r2)} ${Math.abs(r2)})`;
    return `${t1}${t2} ${symbol} 0`;
  }
  const b = -(r1 + r2);
  const c = r1 * r2;
  const bTerm = b === 0 ? "" : ` ${signStr(b)} ${Math.abs(b)}x`;
  const cTerm = c === 0 ? "" : ` ${signStr(c)} ${Math.abs(c)}`;
  return `x²${bTerm}${cTerm} ${symbol} 0`;
}

function genLevel2(): Problem {
  let r1 = randInt(-7, 7);
  let r2 = randInt(-7, 7);
  while (r2 === r1) r2 = randInt(-7, 7);
  if (r1 > r2) [r1, r2] = [r2, r1];
  const greaterThan = Math.random() < 0.5;
  const symbol = greaterThan ? ">" : "<";
  const factored = Math.random() < 0.5;
  const display = formatQuadraticDisplay(r1, r2, factored, symbol);
  const shape: Shape = greaterThan ? "outside" : "between";
  const drill = `${factored ? "The" : "Factor to get the"} zeros: x = ${r1} and x = ${r2}. Test a point in each region: ${greaterThan ? "outside the roots gives a positive product" : "between the roots gives a negative product"}.`;
  return makeProblem(2, display, { shape, lo: F(r1), hi: F(r2) }, drill);
}

function genLevel3(): Problem {
  const roll = Math.random();
  const greaterThan = Math.random() < 0.5;
  const symbol = greaterThan ? ">" : "<";
  if (roll < 0.35) {
    // Repeated root: (x-r)^2 (symbol) 0
    const r = randInt(-8, 8);
    const display = `(x ${signStr(-r)} ${Math.abs(r)})² ${symbol} 0`;
    const shape: Shape = greaterThan ? "all-except" : "no-solution";
    const drill = greaterThan
      ? `A square is 0 only at x = ${r}, and positive everywhere else — so this is true for all reals except x = ${r}.`
      : `A square is never negative, so (x${signStr(-r)}${Math.abs(r)})² < 0 is never true — no solution.`;
    return makeProblem(3, display, { shape, exceptPoint: F(r) }, drill);
  }
  if (roll < 0.7) {
    // No real roots: x^2 + bx + c with discriminant < 0, positive leading coefficient.
    const h = randInt(-6, 6);
    const kPositive = randInt(1, 8); // vertex form (x-h)^2 + kPositive, always > 0
    const b = -2 * h;
    const c = h * h + kPositive;
    const bTerm = b === 0 ? "" : ` ${signStr(b)} ${Math.abs(b)}x`;
    const display = `x²${bTerm} ${signStr(c)} ${Math.abs(c)} ${symbol} 0`;
    const shape: Shape = greaterThan ? "all-reals" : "no-solution";
    const drill = `This never touches zero (no real roots) and opens upward, so it's always positive — ${greaterThan ? "true for all real numbers" : "never less than 0, so no solution"}.`;
    return makeProblem(3, display, { shape }, drill);
  }
  // Fall back to a normal two-distinct-root case for variety.
  return genLevel2();
}

function genLevel4(): Problem {
  let roots: number[] = [];
  while (roots.length < 3) {
    const r = randInt(-6, 6);
    if (!roots.includes(r)) roots.push(r);
  }
  roots.sort((a, b) => a - b);
  const [r1, r2, r3] = roots as [number, number, number];
  const greaterThan = Math.random() < 0.5;
  const symbol = greaterThan ? ">" : "<";
  const terms = roots.map((r) => `(x ${signStr(-r)} ${Math.abs(r)})`).join("");
  const display = `${terms} ${symbol} 0`;
  const shape: Shape = greaterThan ? "middle-and-right" : "left-and-middle";
  const drill = `Zeros at x = ${r1}, ${r2}, ${r3}. The sign alternates −,+,−,+ across the 4 regions (for x<${r1}, ${r1}<x<${r2}, ${r2}<x<${r3}, x>${r3}). The product is ${greaterThan ? "positive" : "negative"} in ${greaterThan ? `(${r1},${r2}) and x>${r3}` : `x<${r1} and (${r2},${r3})`}.`;
  return makeProblem(4, display, { shape, lo: F(r1), hi: F(r2), third: F(r3) }, drill);
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
  if (answer.shape !== s.shape) return false;
  switch (s.shape) {
    case "less-than":
    case "greater-than":
      return fracEq(answer.lo, s.lo);
    case "between":
    case "outside":
      return fracEq(answer.lo, s.lo) && fracEq(answer.hi, s.hi);
    case "all-except":
      return fracEq(answer.exceptPoint, s.exceptPoint);
    case "left-and-middle":
    case "middle-and-right":
      return fracEq(answer.lo, s.lo) && fracEq(answer.hi, s.hi) && fracEq(answer.third, s.third);
    default:
      return true;
  }
}

export function formatAnswer(answer: Answer): string {
  switch (answer.shape) {
    case "less-than":
      return `x < ${formatFraction(answer.lo)}`;
    case "greater-than":
      return `x > ${formatFraction(answer.lo)}`;
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
    case "left-and-middle":
      return `x < ${formatFraction(answer.lo)} or ${formatFraction(answer.hi)} < x < ${formatFraction(answer.third)}`;
    case "middle-and-right":
      return `${formatFraction(answer.lo)} < x < ${formatFraction(answer.hi)} or x > ${formatFraction(answer.third)}`;
  }
}

export type HintStage = 1 | 2 | 3 | 4;

export function getHint(problem: Problem, stage: HintStage): string {
  const { level, solution, drill } = problem;
  if (stage === 4) return `${formatAnswer(solution)}.`;
  if (stage === 3) return `Still stuck? Here's the work: ${drill}`;
  if (level === 1) {
    if (stage === 1) return "Isolate x the same way you would in an equation.";
    return "Watch out: if you multiply or divide both sides by a negative number, the inequality sign flips direction.";
  }
  if (level === 2) {
    if (stage === 1) return "Move everything to one side, factor, and find the zeros — those split the number line into regions.";
    return "Test one point from each region in the factored expression. Where it's positive vs negative tells you the answer.";
  }
  if (level === 3) {
    if (stage === 1) return "Check the structure first: is this a perfect square, or does it have no real roots at all? Both break the usual pattern.";
    return "A square is never negative. An expression with no real roots never changes sign — figure out which sign it always has.";
  }
  if (stage === 1) return "Find all three zeros, then build a sign table: one column per factor, marking + or − in each of the 4 regions they create.";
  return "Multiply the signs across each row of the table to get the sign of the whole product in that region, then pick out the regions matching the inequality.";
}
