// Adding, subtracting, multiplying, and dividing radicals (square roots
// only). Every answer is a single simplified term (coeffNum/coeffDen)*√r,
// with r=1 meaning "no radical left" — a pure rational number. Unlike the
// other modules, an equal-but-unsimplified answer isn't just wrong, it's a
// distinct outcome ("unsimplified"): the whole point of this topic is
// producing the fully reduced form, so that gets called out specifically
// rather than lumped in with a plain wrong answer.

import { gcd, type Lesson, type LevelId, type LevelMeta } from "./levels";

export type { LevelId };

export interface Level extends LevelMeta {
  showDen: boolean;
}

export const LEVELS: Level[] = [
  { id: 1, name: "Simplify a Radical", subtitle: "√(k·s²) = s√k", difficulty: "Trivial", showDen: false },
  { id: 2, name: "Add & Subtract Radicals", subtitle: "combine like radicals", difficulty: "Challenging", showDen: false },
  { id: 3, name: "Multiply Radicals", subtitle: "√a · √b = √(ab), then simplify", difficulty: "Extreme", showDen: false },
  { id: 4, name: "Divide & Rationalize", subtitle: "clear the radical from the denominator", difficulty: "Helldive", showDen: true },
];

export const RADICAL_ARITHMETIC_LESSONS: Record<LevelId, Lesson> = {
  1: {
    intro:
      "To simplify √n, find the largest perfect square that divides n evenly, pull its square root out front, and leave the rest under the radical.",
    steps: [
      { text: "Start with the radical.", math: "√72" },
      { text: "Find the largest perfect square factor of 72.", math: "72 = 36 × 2, and 36 is a perfect square (6²)" },
      { text: "Pull the square root of that factor out front.", math: "√72 = √36 × √2 = 6√2" },
    ],
  },
  2: {
    intro:
      "\"Like radicals\" (same number under the root) combine just like like-terms: add or subtract their coefficients and keep the radical. If the radicals don't match yet, simplify each one first — they might turn out to match after all.",
    steps: [
      { text: "Start with the sum.", math: "√8 + √18" },
      { text: "These don't look alike yet — simplify each one.", math: "√8 = 2√2,   √18 = 3√2" },
      { text: "Now they're both √2 — combine the coefficients.", math: "2√2 + 3√2 = 5√2" },
    ],
  },
  3: {
    intro:
      "To multiply radicals, multiply the coefficients together and the numbers under the radicals together, then simplify the result the same way as Level 1.",
    steps: [
      { text: "Start with the product.", math: "(2√3) × (3√6)" },
      { text: "Multiply coefficients and radicands separately.", math: "2 × 3 = 6,   3 × 6 = 18" },
      { text: "That gives 6√18 — but check if it simplifies further.", math: "18 = 9 × 2, so √18 = 3√2" },
      { text: "Combine with the coefficient already out front.", math: "6 × 3√2 = 18√2" },
    ],
  },
  4: {
    intro:
      "A radical left in the denominator isn't considered simplified — you have to \"rationalize\" it by multiplying top and bottom by that same radical, since √k × √k = k clears it out.",
    steps: [
      { text: "Start with the fraction.", math: "5 / (2√3)" },
      { text: "Multiply top and bottom by √3.", math: "(5 × √3) / (2√3 × √3)" },
      { text: "√3 × √3 = 3, so the denominator becomes rational.", math: "5√3 / (2 × 3) = 5√3 / 6" },
      { text: "Sometimes dividing same-core radicals collapses the radical entirely instead.", math: "√12 ÷ √3 = √(12/3) = √4 = 2" },
    ],
  },
};

export interface Answer {
  coeffNum: number;
  coeffDen: number;
  radicand: number;
}

export interface Problem {
  id: string;
  level: LevelId;
  display: string;
  solution: Answer;
  drill: string;
}

const CORES = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickCore(): number {
  return CORES[randInt(0, CORES.length - 1)]!;
}

/** The largest s such that s² divides n, and n/s² (which is then square-free). */
function extractSquareFactor(n: number): { s: number; k: number } {
  for (let d = Math.floor(Math.sqrt(n)); d >= 2; d--) {
    if (n % (d * d) === 0) return { s: d, k: n / (d * d) };
  }
  return { s: 1, k: n };
}

function simplifyRadicalTerm(coeffNum: number, coeffDen: number, radicand: number): Answer {
  if (coeffDen < 0) {
    coeffNum = -coeffNum;
    coeffDen = -coeffDen;
  }
  if (coeffNum === 0) return { coeffNum: 0, coeffDen: 1, radicand: 1 };
  const { s, k } = extractSquareFactor(radicand);
  const newNum = coeffNum * s;
  const g = gcd(newNum, coeffDen);
  return { coeffNum: newNum / g, coeffDen: coeffDen / g, radicand: k };
}

function termStr(coeffNum: number, radicand: number): string {
  if (radicand === 1) return `${coeffNum}`;
  const c = coeffNum === 1 ? "" : coeffNum === -1 ? "−" : `${coeffNum}`;
  return `${c}√${radicand}`;
}

export function formatAnswer(answer: Answer): string {
  const s = simplifyRadicalTerm(answer.coeffNum, answer.coeffDen || 1, answer.radicand || 1);
  return s.coeffDen === 1 ? termStr(s.coeffNum, s.radicand) : `${termStr(s.coeffNum, s.radicand)}/${s.coeffDen}`;
}

function makeProblem(level: LevelId, display: string, solution: Answer, drill: string): Problem {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, level, display, solution, drill };
}

function genLevel1(): Problem {
  const k = pickCore();
  const s = randInt(2, 4);
  const radicand = k * s * s;
  const drill = `${s}² = ${s * s} divides evenly into ${radicand} (${radicand}/${s * s} = ${k}), so pull ${s} out front: √${radicand} = ${s}√${k}.`;
  return makeProblem(1, `√${radicand}`, simplifyRadicalTerm(1, 1, radicand), drill);
}

function weightedS(): number {
  const r = Math.random();
  return r < 0.6 ? 1 : r < 0.85 ? 2 : 3;
}

function genLevel2(): Problem {
  const k = pickCore();
  const op: "+" | "−" = Math.random() < 0.5 ? "+" : "−";
  const b1 = randInt(1, 6);
  const s1 = weightedS();
  let b2 = randInt(1, 6);
  let s2 = weightedS();
  let finalCoeff = op === "+" ? b1 * s1 + b2 * s2 : b1 * s1 - b2 * s2;
  let guard = 0;
  while (finalCoeff === 0 && guard < 20) {
    b2 = randInt(1, 6);
    s2 = weightedS();
    finalCoeff = op === "+" ? b1 * s1 + b2 * s2 : b1 * s1 - b2 * s2;
    guard++;
  }
  const r1 = k * s1 * s1;
  const r2 = k * s2 * s2;
  const display = `${termStr(b1, r1)} ${op} ${termStr(b2, r2)}`;
  const simp1 = s1 === 1 ? `already √${k}` : `√${r1} = ${s1}√${k}, so this term is ${b1}×${s1} = ${b1 * s1} of √${k}`;
  const simp2 = s2 === 1 ? `already √${k}` : `√${r2} = ${s2}√${k}, so this term is ${b2}×${s2} = ${b2 * s2} of √${k}`;
  const drill = `Simplify each term to the same radical first. Term 1 is ${simp1}. Term 2 is ${simp2}. Now combine: ${b1 * s1}√${k} ${op} ${b2 * s2}√${k} = ${finalCoeff}√${k}.`;
  return makeProblem(2, display, simplifyRadicalTerm(finalCoeff, 1, k), drill);
}

function genLevel3(): Problem {
  const a = pickCore();
  const b = pickCore();
  const c1 = randInt(1, 5);
  const c2 = randInt(1, 5);
  const rawCoeff = c1 * c2;
  const rawRadicand = a * b;
  const { s, k } = extractSquareFactor(rawRadicand);
  const display = `(${termStr(c1, a)}) × (${termStr(c2, b)})`;
  const drill =
    s > 1
      ? `Multiply straight across: ${c1}×${c2}=${rawCoeff} and ${a}×${b}=${rawRadicand}, giving ${rawCoeff}√${rawRadicand}. That's not fully simplified — ${rawRadicand} = ${s * s}×${k}, so pull out ${s}: ${rawCoeff}×${s}=${rawCoeff * s}, giving ${rawCoeff * s}√${k}.`
      : `Multiply straight across: ${c1}×${c2}=${rawCoeff} and ${a}×${b}=${rawRadicand}, giving ${rawCoeff}√${rawRadicand} — already simplest form, ${rawRadicand} has no perfect-square factors.`;
  return makeProblem(3, display, simplifyRadicalTerm(rawCoeff, 1, rawRadicand), drill);
}

function genLevel4(): Problem {
  const usePatternB = Math.random() < 0.5;
  const k = pickCore();
  if (!usePatternB) {
    const sNum = randInt(1, 4);
    let sDen = randInt(1, 4);
    if (sDen === sNum) sDen = sNum === 4 ? 1 : sNum + 1;
    const radicandNum = k * sNum * sNum;
    const radicandDen = k * sDen * sDen;
    const display = `${termStr(1, radicandNum)} ÷ ${termStr(1, radicandDen)}`;
    const drill = `Same core under both radicals (${k}), so divide directly: √${radicandNum}÷√${radicandDen} = √(${radicandNum}/${radicandDen}) = √(${sNum}²/${sDen}²) = ${sNum}/${sDen}.`;
    return makeProblem(4, display, simplifyRadicalTerm(sNum, sDen, 1), drill);
  }
  const c = randInt(2, 9);
  const d = randInt(2, 4);
  const display = `${c} ÷ (${termStr(d, k)})`;
  const drill = `Multiply top and bottom by √${k} to clear the radical from the denominator: (${c}×√${k}) ÷ (${d}×${k}) = ${c}√${k}/${d * k}.`;
  return makeProblem(4, display, simplifyRadicalTerm(c, d * k, k), drill);
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

export type CheckResult = "correct" | "unsimplified" | "wrong";

export function checkAnswer(problem: Problem, answer: Answer): CheckResult {
  if (!answer.radicand || answer.radicand < 1 || !Number.isInteger(answer.radicand)) return "wrong";
  const simplified = simplifyRadicalTerm(answer.coeffNum, answer.coeffDen || 1, answer.radicand);
  const target = problem.solution;
  const valuesEqual = simplified.coeffNum === target.coeffNum && simplified.coeffDen === target.coeffDen && simplified.radicand === target.radicand;
  if (!valuesEqual) return "wrong";
  const enteredAlready = answer.radicand === simplified.radicand && answer.coeffNum === simplified.coeffNum && (answer.coeffDen || 1) === simplified.coeffDen;
  return enteredAlready ? "correct" : "unsimplified";
}

export type HintStage = 1 | 2 | 3 | 4;

export function getHint(problem: Problem, stage: HintStage): string {
  const { level, solution, drill } = problem;
  if (stage === 4) return `Fully simplified, it's ${formatAnswer(solution)}.`;
  if (stage === 3) return `Still stuck? Here's the work: ${drill}`;
  if (level === 1) {
    if (stage === 1) return "Look for the largest perfect square (4, 9, 16, 25, …) that divides evenly into the number under the radical.";
    return "Pull that perfect square's square root out front, and leave what's left under the radical.";
  }
  if (level === 2) {
    if (stage === 1) return "You can only combine radicals with the exact same number under the root — if they don't match, simplify each one first and check again.";
    return "Once both terms show the same radical, just add or subtract their coefficients like any other like terms.";
  }
  if (level === 3) {
    if (stage === 1) return "Multiply the coefficients together, and multiply the numbers under the radicals together — two separate multiplications.";
    return "Don't stop there — check whether the resulting radical can still be simplified, same as Level 1.";
  }
  if (stage === 1) return "A radical isn't allowed to stay in the denominator. Multiply the top and bottom of the fraction by that same radical to clear it out.";
  return "Sometimes it's simpler than that: if both radicals share the same number underneath, you can divide them directly and the radical may disappear entirely.";
}
