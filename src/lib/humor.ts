// A little personality. This app has exactly one user: Russell.
// Russell likes Helldivers, maps, and flags, so that's the whole vibe here.
export const STUDENT_NAME = "Russell";

export const CORRECT_LINES = [
  `Objective complete, Helldiver ${STUDENT_NAME}. That trinomial has been liberated.`,
  `Confirmed kill. Super Earth thanks you for your service, ${STUDENT_NAME}.`,
  `Correct! Somewhere a Terminid just lost a leg out of pure respect.`,
  `Mission success. ${STUDENT_NAME} 1, Managed Democracy's enemies 0.`,
  `That factorization has better symmetry than most national flags. 10/10, would fly it.`,
  `Correct — clean, balanced, no unnecessary lettering. Somewhere a vexillologist is nodding.`,
  `Nailed it. That's more accurate than a Mercator projection, and twice as satisfying.`,
  `${STUDENT_NAME}, that answer is now the most efficiently governed territory on this page.`,
  `Direct hit. Democracy Officer adds a gold star to your file.`,
  `Correct! You navigated that trinomial like you had a compass and a grudge.`,
  `Factored and pacified. Liberty never sleeps, and apparently neither do you.`,
  `That's a flawless drop, Helldiver. Hellpod landed dead center on the answer.`,
  `Yes! Somewhere a cartographer just added your name to a map, out of respect.`,
  `Correct. Even the automatons are filing a complaint about how fast that was.`,
];

export const INCORRECT_LINES = [
  `KIA, ${STUDENT_NAME}. Redeploying in 3… 2… 1…`,
  `Negative, Helldiver. That's friendly fire — the trinomial is still very much alive.`,
  `Mission failed. We'll get 'em on the next drop.`,
  `That answer just got denied by the Democracy Officer. Try again, ${STUDENT_NAME}.`,
  `Not quite — that map is upside down and so is this answer.`,
  `Nope. That flag design breaks at least three of the five good flag rules, and so does this.`,
  `Wrong coordinates, ${STUDENT_NAME}. You've landed in the wrong trinomial entirely.`,
  `Call in a resupply, because that answer did not survive contact with reality.`,
  `Incorrect. Somewhere, Super Earth's propaganda office is quietly rewriting this as a win anyway.`,
  `Not it. Even a Mercator projection is more accurate than that.`,
  `Negative, Helldiver — that's not liberation, that's just noise.`,
];

export const MATH_JOKES = [
  "Why did the Helldiver factor the trinomial before deploying? Super Earth doesn't send anyone into the field unprepared.",
  "What's a cartographer's favorite kind of math? Long-itude division.",
  "Why don't mapmakers ever get lost? They always know their own coordinates.",
  "What do you call a flag that's bad at algebra? Unbalanced — no symmetry, no solutions.",
  "What's the most democratic shape? The circle. Every point is equidistant from the center. Very fair. Very Super Earth.",
  "Why was the equal sign so humble? Because it wasn't greater than or less than anyone else.",
  "Why don't quadratics ever get lost on a mission? They always know how to find their roots.",
  `${STUDENT_NAME}, did you know 6 is afraid of 7? Because 7 8 9. Anyway, back to the front line.`,
  "Why did x never text y back? x had no real solutions for them.",
  "What did the Terminid say to the trinomial? 'Nice factors, shame about what happens next.'",
  "Why is the Nepal flag so good at geometry? It's the only national flag that isn't a rectangle — an icon of non-conformity.",
  "What do you call a map with no legend? Lost.",
  "Why did the fraction refuse to enlist? It didn't want to be reduced to nothing.",
  "Parabolas never trust anyone. They always assume the worst-case-x.",
];

export const GREETINGS = [
  `Helldiver ${STUDENT_NAME}, reporting for algebra duty.`,
  `${STUDENT_NAME}. Super Earth has a new mission: factor these trinomials before they factor you.`,
  `Welcome back, Helldiver ${STUDENT_NAME}. Managed Democracy needs your math skills today.`,
  `${STUDENT_NAME}, your planet needs you. Let's go liberate some quadratics.`,
  `Oh good, ${STUDENT_NAME}'s here. Parabolas, assume the position.`,
  `Radar contact: ${STUDENT_NAME}, inbound. Prep the hellpod.`,
];

const STREAK_HYPE: { min: number; text: string }[] = [
  { min: 3, text: "🎖️ 3 confirmed. The Democracy Officer is taking notes." },
  { min: 5, text: "🚀 5 in a row. Someone call in an orbital strike, because you're unstoppable." },
  { min: 8, text: "🏅 8 straight. That's Helldiver-of-the-Month material." },
  { min: 12, text: "🦅 12 in a row. Super Earth is naming a planet after you." },
];

export function randomOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

export function streakHype(streak: number): string | null {
  let best: string | null = null;
  for (const tier of STREAK_HYPE) {
    if (streak >= tier.min) best = tier.text;
  }
  return best;
}
