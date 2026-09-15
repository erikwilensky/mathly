// A little personality. This app has exactly one user.
export const STUDENT_NAME = "Russell";

export const CORRECT_LINES = [
  "Correct. Somewhere, a math teacher just felt a disturbance.",
  `${STUDENT_NAME} 1, Quadratics 0.`,
  'You factored that harder than you factor "5 more minutes" into your bedtime.',
  "Yes! That's some elite (x + p)(x + q) energy.",
  "Correct! Somewhere a parabola just breathed a sigh of relief.",
  "Nailed it. Frame this. Or don't. Whatever.",
  "Flawless. Quadratic HP: 0.",
  "You just made algebra look easy, which is a crime against everyone who took this class before calculators existed.",
  "Correct! The quadratic formula is filing a restraining order against you.",
  "That's right. You're basically Pythagoras now, but for trinomials.",
];

export const INCORRECT_LINES = [
  "Nope. Close, but no algebra trophy.",
  "Not quite. Did a squirrel walk across your keyboard?",
  "That's a bold guess. Bold, and also wrong.",
  "Incorrect. The quadratic remains undefeated.",
  "Nice try. The quadratic formula is somewhere laughing at you.",
  "Wrong, but with confidence — respect.",
  "Not it. Try again before the equation starts trash-talking you.",
  "That expands to something, just not the thing we wanted.",
  "Denied. Try again, champ.",
];

export const MATH_JOKES = [
  "Why was the equal sign so humble? Because it wasn't greater than or less than anyone else.",
  "Why don't quadratics ever get lost? They always know how to find their roots.",
  "Parallel lines have so much in common. Too bad they'll never meet.",
  "Why was the math book sad? It had too many problems.",
  "I'd tell you a factoring joke, but it might not be prime material.",
  "Why did the student do their homework on the floor? The teacher said not to use tables.",
  "What do you call a quadratic that just won't factor nicely? Irrational.",
  "Why did x never text y back? x had no real solutions for them.",
  "Why was the fraction worried about marrying the decimal? He'd have to convert.",
  "Parabolas never trust anyone. They always assume the worst-case-x.",
  `${STUDENT_NAME}, did you know 6 is afraid of 7? Because 7 8 9. Anyway, back to work.`,
];

export const GREETINGS = [
  `Yo ${STUDENT_NAME} 👋`,
  `Welcome back, ${STUDENT_NAME}. The quadratics missed you.`,
  `Oh good, ${STUDENT_NAME}'s here. Parabolas, assume the position.`,
  `${STUDENT_NAME}. My favorite algebra enjoyer.`,
];

const STREAK_HYPE: { min: number; text: string }[] = [
  { min: 3, text: "🔥 3 in a row. You're heating up." },
  { min: 5, text: "🚀 5 straight. Certified quadratic menace." },
  { min: 8, text: "🏆 8 in a row?! Somebody alert the school newspaper." },
  { min: 12, text: "🐐 12 straight. You are, scientifically, the GOAT." },
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
