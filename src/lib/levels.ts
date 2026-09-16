// Shared level shape used across every topic module (each topic has 4
// difficulty tiers: Trivial / Challenging / Extreme / Helldive).

export type LevelId = 1 | 2 | 3 | 4;

export interface LevelMeta {
  id: LevelId;
  name: string;
  subtitle: string;
  difficulty: string;
}

export interface WorkedStep {
  text: string;
  math?: string;
}

export interface Lesson {
  intro: string;
  steps: WorkedStep[];
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

/** Renders an integer as unicode superscript digits, e.g. sup(-12) -> "⁻¹²". */
export function sup(n: number): string {
  return String(n)
    .split("")
    .map((ch) => SUP[ch] ?? ch)
    .join("");
}

/** Every divisor of n, ascending, from 1 to |n|. */
export function factorsOf(n: number): number[] {
  const abs = Math.abs(n);
  const out: number[] = [];
  for (let d = 1; d <= abs; d++) if (abs % d === 0) out.push(d);
  return out;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export interface Fraction {
  num: number;
  den: number;
}

/** Reduces num/den to lowest terms with a positive denominator. */
export function reduceFraction(num: number, den: number): Fraction {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  if (num === 0) return { num: 0, den: 1 };
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
}

/** "3" for whole numbers, "3/4" otherwise. Reduces first. */
export function formatFraction(f: Fraction): string {
  const r = reduceFraction(f.num, f.den);
  return r.den === 1 ? `${r.num}` : `${r.num}/${r.den}`;
}
