# Mathly — math tutoring app

Interactive lessons + practice for 10th grade math, starting with **Factoring
Quadratic Expressions**. More topics get added as new routes under
`src/app/topics/*`.

## Run it

```bash
npm install
npm run dev
```

Opens on `http://localhost:3000`.

## Factoring Quadratics module

- `src/lib/factoring.ts` — problem generation, answer checking, and the
  progressive hint text for all four levels (basic trinomials, leading
  coefficient, difference of squares, GCF-first). Answer checking works by
  expanding the student's factored form and comparing coefficients, so any
  algebraically correct factorization is accepted, not just the one
  generator happened to produce.
- `src/lib/progress.ts` — per-browser progress (XP, streak, level unlocks)
  stored in `localStorage`. No account/DB needed for this MVP.
- `src/components/PracticePanel.tsx` — the practice loop: problem, structured
  factor input, check, built-in hints, and an "Ask AI tutor" button.
- `src/app/api/hint/route.ts` — optional OpenAI-backed hint endpoint. Without
  `OPENAI_API_KEY` set it returns a graceful fallback message; the built-in
  hints always work regardless.

Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY` to enable the AI
tutor button.
