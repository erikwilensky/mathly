// Single source of truth for which topics exist and their level metadata —
// used by both the dashboard and the campaign map so they can't drift.

import { LEVELS as FACTORING_LEVELS } from "./factoring";
import { LEVELS as EXPONENT_LEVELS } from "./exponents";
import { LEVELS as RADICAL_EVAL_LEVELS } from "./radical-eval";
import { LEVELS as RADICAL_ARITHMETIC_LEVELS } from "./radical-arithmetic";
import type { LevelMeta } from "./levels";

export interface TopicMeta {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  levels: LevelMeta[];
}

export const TOPICS: TopicMeta[] = [
  {
    id: "factoring-quadratics",
    href: "/topics/factoring-quadratics",
    title: "Operation: Factor the Quadratics",
    subtitle: "x² + bx + c → (x + p)(x + q)",
    levels: FACTORING_LEVELS,
  },
  {
    id: "exponent-laws",
    href: "/topics/exponent-laws",
    title: "Operation: Simplify the Exponents",
    subtitle: "xᵃ·xᵇ = xᵃ⁺ᵇ",
    levels: EXPONENT_LEVELS,
  },
  {
    id: "radical-exponent-evaluation",
    href: "/topics/radical-exponent-evaluation",
    title: "Operation: No Calculator Allowed",
    subtitle: "ⁿ√p = p^(1/n)",
    levels: RADICAL_EVAL_LEVELS,
  },
  {
    id: "radical-arithmetic",
    href: "/topics/radical-arithmetic",
    title: "Operation: Radical Combat",
    subtitle: "√a + √b, √a · √b, …",
    levels: RADICAL_ARITHMETIC_LEVELS,
  },
];

export const COMING_SOON = [
  { title: "Solving Quadratic Equations", subtitle: "Next drop — not deployed yet" },
  { title: "The Quadratic Formula", subtitle: "Next drop — not deployed yet" },
  { title: "Systems of Linear Equations", subtitle: "Next drop — not deployed yet" },
];
