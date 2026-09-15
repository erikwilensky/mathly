// Exponent-laws problem generation, checking, and hints.
// Every problem simplifies to a single monomial coeff * x^ex * y^ey with
// integer exponents (possibly negative or zero). That canonical form is
// unique, so checking an answer is a direct tuple comparison — no
// equivalence search needed (unlike factoring, where many binomial pairs
// expand to the same polynomial).

import type { Lesson, LevelId, LevelMeta } from "./levels";

export type { LevelId };

export interface Level extends LevelMeta {
  showCoeff: boolean;
  showY: boolean;
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Product & Quotient Rules",
    subtitle: "xᵃ·xᵇ = xᵃ⁺ᵇ",
    difficulty: "Trivial",
    showCoeff: true,
    showY: false,
  },
  {
    id: 2,
    name: "Power of a Power / Product",
    subtitle: "(xᵃyᵇ)ᶜ = xᵃᶜyᵇᶜ",
    difficulty: "Challenging",
    showCoeff: true,
    showY: true,
  },
  {
    id: 3,
    name: "Zero & Negative Exponents",
    subtitle: "x⁻ⁿ = 1/xⁿ, x⁰ = 1",
    difficulty: "Extreme",
    showCoeff: false,
    showY: false,
  },
  {
    id: 4,
    name: "Combined Exponent Laws",
    subtitle: "multi-step simplification",
    difficulty: "Helldive",
    showCoeff: true,
    showY: true,
  },
];

export const EXPONENT_LESSONS: Record<LevelId, Lesson> = {
  1: {
    intro:
      "Same base, multiplying: add the exponents. Same base, dividing: subtract the exponents. Coefficients just multiply or divide like normal numbers, completely separately from the exponents.",
    steps: [
      { text: "Start with the product.", math: "x³ × x⁵" },
      { text: "Same base (x), so add the exponents.", math: "3 + 5 = 8" },
      { text: "That gives the simplified form.", math: "x³ × x⁵ = x⁸" },
      { text: "A quotient works the same way, but subtract instead of add.", math: "x⁷ ÷ x² → 7 − 2 = 5 → x⁵" },
      { text: "With coefficients, handle them separately from the exponents.", math: "2x³ × 3x⁵ → coefficients: 2×3=6, exponents: 3+5=8 → 6x⁸" },
    ],
  },
  2: {
    intro:
      "A power outside parentheses applies to everything inside: multiply every exponent inside by the outer power, and raise any coefficient to that power too.",
    steps: [
      { text: "Start with the power of a power.", math: "(x³)⁴" },
      { text: "Multiply the exponents.", math: "3 × 4 = 12" },
      { text: "That gives the simplified form.", math: "(x³)⁴ = x¹²" },
      { text: "With a second variable, apply the outer power to it too.", math: "(x³y²)² → x: 3×2=6, y: 2×2=4 → x⁶y⁴" },
      { text: "With a coefficient, raise it to the outer power as well.", math: "(2x³y²)² → coefficient: 2²=4 → 4x⁶y⁴" },
    ],
  },
  3: {
    intro:
      "x⁰ = 1, always (except x = 0). A negative exponent means \"flip it\": x⁻ⁿ = 1/xⁿ. You can still use the product and quotient rules — the exponents just end up negative or zero sometimes, and that's a perfectly valid final answer here.",
    steps: [
      { text: "Zero exponent identity.", math: "x⁰ × x⁴ = 1 × x⁴ = x⁴" },
      { text: "Product rule still works with a negative exponent — add it, sign and all.", math: "x³ × x⁻⁷ → 3 + (−7) = −4 → x⁻⁴" },
      { text: "Dividing by a negative exponent flips the sign — subtracting a negative becomes adding.", math: "x² ÷ x⁻³ → 2 − (−3) = 5 → x⁵" },
      { text: "A negative exponent in the answer is fine — leave it negative.", math: "x² × x⁻⁵ → 2 + (−5) = −3 → x⁻³" },
    ],
  },
  4: {
    intro:
      "Multi-step problems just chain the same rules: handle the power of a power/product first, then apply the product or quotient rule with whatever's left.",
    steps: [
      { text: "Start with the combined expression.", math: "(2x³y⁻²)² × x⁻¹" },
      { text: "Handle the power of a power/product first, one piece at a time.", math: "coefficient: 2²=4, x: 3×2=6, y: −2×2=−4" },
      { text: "That parenthesized part simplifies to:", math: "(2x³y⁻²)² = 4x⁶y⁻⁴" },
      { text: "Now apply the product rule between that and the remaining term.", math: "4x⁶y⁻⁴ × x⁻¹ → x: 6 + (−1) = 5" },
      { text: "Final simplified form.", math: "4x⁵y⁻⁴" },
    ],
  },
};

export interface Answer {
  coeff: number;
  ex: number;
  ey: number;
}

export interface Problem {
  id: string;
  level: LevelId;
  display: string;
  solution: Answer;
  /** The concrete arithmetic sub-step (computed at generation time, since it needs the raw operands, not just the final answer) for the "still stuck" hint stage. */
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

const SUP: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "-": "⁻",
};

function sup(n: number): string {
  return String(n)
    .split("")
    .map((ch) => SUP[ch] ?? ch)
    .join("");
}

function varFactor(name: string, exp: number): string {
  if (exp === 0) return "";
  if (exp === 1) return name;
  return `${name}${sup(exp)}`;
}

/** Renders coeff * x^ex * y^ey as e.g. "2x³y⁻²", omitting zero-exponent vars, an exponent of 1, and a coefficient of 1. */
function term(coeff: number, ex: number, ey: number): string {
  const varPart = `${varFactor("x", ex)}${varFactor("y", ey)}`;
  if (varPart === "") return `${coeff}`;
  return coeff === 1 ? varPart : `${coeff}${varPart}`;
}

function makeProblem(level: LevelId, display: string, solution: Answer, drill: string): Problem {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, level, display, solution, drill };
}

function genLevel1(): Problem {
  const op: "mul" | "div" = Math.random() < 0.5 ? "mul" : "div";
  if (op === "mul") {
    const a = randInt(1, 6);
    const b = randInt(1, 6);
    const c1 = Math.random() < 0.5 ? 1 : randInt(2, 5);
    const c2 = Math.random() < 0.5 ? 1 : randInt(2, 5);
    const drill = `Add the exponents: ${a} + ${b} = ${a + b}.${c1 !== 1 || c2 !== 1 ? ` Multiply the coefficients: ${c1} × ${c2} = ${c1 * c2}.` : ""}`;
    return makeProblem(1, `${term(c1, a, 0)} × ${term(c2, b, 0)}`, { coeff: c1 * c2, ex: a + b, ey: 0 }, drill);
  }
  const b = randInt(1, 5);
  const a = randInt(b + 1, b + 6);
  const c2 = randInt(1, 4);
  const result = randInt(1, 4);
  const c1 = c2 * result;
  const drill = `Subtract the exponents: ${a} − ${b} = ${a - b}.${c1 !== 1 || c2 !== 1 ? ` Divide the coefficients: ${c1} ÷ ${c2} = ${result}.` : ""}`;
  return makeProblem(1, `${term(c1, a, 0)} ÷ ${term(c2, b, 0)}`, { coeff: result, ex: a - b, ey: 0 }, drill);
}

function genLevel2(): Problem {
  const c = Math.random() < 0.4 ? 1 : randInt(2, 3);
  const a = randInt(1, 4);
  const b = randInt(1, 4);
  const outer = randInt(2, 3);
  const drill = `Multiply each inner exponent by the outer power: x's exponent ${a} × ${outer} = ${a * outer}, y's exponent ${b} × ${outer} = ${b * outer}.${
    c !== 1 ? ` Raise the coefficient too: ${c}${sup(outer)} = ${c ** outer}.` : ""
  }`;
  return makeProblem(2, `(${term(c, a, b)})${sup(outer)}`, { coeff: c ** outer, ex: a * outer, ey: b * outer }, drill);
}

function genLevel3(): Problem {
  const variant = randInt(0, 4);
  if (variant === 0) {
    const a = randInt(1, 6);
    const b = randInt(1, 6);
    const drill = `Add the exponents, keeping the sign of the second one: ${a} + (${-b}) = ${a - b}.`;
    return makeProblem(3, `x${sup(a)} × x${sup(-b)}`, { coeff: 1, ex: a - b, ey: 0 }, drill);
  }
  if (variant === 1) {
    const a = randInt(1, 6);
    const b = randInt(1, 6);
    const drill = `Subtract the exponents, and subtracting a negative flips to a plus: ${a} − (${-b}) = ${a + b}.`;
    return makeProblem(3, `x${sup(a)} ÷ x${sup(-b)}`, { coeff: 1, ex: a + b, ey: 0 }, drill);
  }
  if (variant === 2) {
    const a = randInt(1, 6);
    const b = randInt(1, 6);
    const drill = `Subtract the exponents: ${-a} − ${b} = ${-a - b}.`;
    return makeProblem(3, `x${sup(-a)} ÷ x${sup(b)}`, { coeff: 1, ex: -a - b, ey: 0 }, drill);
  }
  if (variant === 3) {
    const a = randInt(1, 4);
    const outer = randInt(2, 3);
    const drill = `Multiply the exponents: ${-a} × ${outer} = ${-a * outer}.`;
    return makeProblem(3, `(x${sup(-a)})${sup(outer)}`, { coeff: 1, ex: -a * outer, ey: 0 }, drill);
  }
  const a = randInt(1, 6);
  const drill = `x⁰ is just 1, so this is really 1 × x${sup(a)}, which is just x${sup(a)}.`;
  return makeProblem(3, `x⁰ × x${sup(a)}`, { coeff: 1, ex: a, ey: 0 }, drill);
}

function genLevel4(): Problem {
  const c1 = randInt(2, 3);
  const ax = nonZero(-2, 4);
  const ay = nonZero(-2, 4);
  const outer = randInt(2, 3);
  const coeff1 = c1 ** outer;
  const ex1 = ax * outer;
  const ey1 = ay * outer;

  const op: "mul" | "div" = Math.random() < 0.5 ? "mul" : "div";
  const bx = nonZero(-3, 3);
  const by = nonZero(-3, 3);

  const powerStep = `First, the power of a power/product: x's exponent ${ax} × ${outer} = ${ex1}, y's exponent ${ay} × ${outer} = ${ey1}, coefficient ${c1}${sup(outer)} = ${coeff1}.`;

  if (op === "mul") {
    const c2 = randInt(1, 2);
    const display = `(${term(c1, ax, ay)})${sup(outer)} × ${term(c2, bx, by)}`;
    const drill = `${powerStep} Then combine with the second term by adding exponents: x → ${ex1} + ${bx} = ${ex1 + bx}, y → ${ey1} + ${by} = ${ey1 + by}.`;
    return makeProblem(4, display, { coeff: coeff1 * c2, ex: ex1 + bx, ey: ey1 + by }, drill);
  }
  const display = `(${term(c1, ax, ay)})${sup(outer)} ÷ (${term(1, bx, by)})`;
  const drill = `${powerStep} Then divide by the second term by subtracting exponents: x → ${ex1} − ${bx} = ${ex1 - bx}, y → ${ey1} − ${by} = ${ey1 - by}.`;
  return makeProblem(4, display, { coeff: coeff1, ex: ex1 - bx, ey: ey1 - by }, drill);
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
  const s = problem.solution;
  return answer.coeff === s.coeff && answer.ex === s.ex && answer.ey === s.ey;
}

export function formatAnswer(answer: Answer): string {
  return term(answer.coeff, answer.ex, answer.ey);
}

export type HintStage = 1 | 2 | 3 | 4;

export function getHint(problem: Problem, stage: HintStage): string {
  const { level, solution, drill } = problem;
  if (stage === 4) return `It simplifies to ${formatAnswer(solution)}.`;
  if (stage === 3) return `Still stuck? Here's the arithmetic: ${drill}`;
  if (level === 1) {
    if (stage === 1) return "Same base, so combine the exponents: add them if you're multiplying, subtract if you're dividing.";
    return "Multiply or divide the coefficients separately from the exponents.";
  }
  if (level === 2) {
    if (stage === 1) return "The outer exponent applies to everything inside the parentheses — every variable's exponent, and the coefficient too.";
    return "Multiply each inner exponent by the outer exponent, and raise the coefficient to the outer power.";
  }
  if (level === 3) {
    if (stage === 1) return "x⁰ = 1. A negative exponent isn't wrong — it just means that factor belongs in the denominator. You can leave it negative here.";
    return "Still just add (multiplying) or subtract (dividing) the exponents, keeping track of the signs carefully.";
  }
  if (stage === 1) return "Handle the power of a power/product first — apply the outer exponent to everything inside — then combine with the rest using the product or quotient rule.";
  return "Work it in two passes: simplify the parenthesized part completely, then multiply or divide by the remaining term.";
}
