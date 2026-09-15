import Link from "next/link";

const TOPICS = [
  {
    href: "/topics/factoring-quadratics",
    title: "Factoring Quadratic Expressions",
    subtitle: "x² + bx + c → (x + p)(x + q)",
    available: true,
  },
  { href: "#", title: "Solving Quadratic Equations", subtitle: "Coming soon", available: false },
  { href: "#", title: "The Quadratic Formula", subtitle: "Coming soon", available: false },
  { href: "#", title: "Systems of Linear Equations", subtitle: "Coming soon", available: false },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-indigo">Algebra I</p>
      <h1 className="mt-1 text-3xl font-bold text-brand-ink sm:text-4xl">Mathly</h1>
      <p className="mt-2 max-w-xl text-brand-ink-soft">
        Short lessons, worked examples, and practice with instant feedback — pick a topic to get started.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {TOPICS.map((t) => (
          <Link
            key={t.title}
            href={t.href}
            aria-disabled={!t.available}
            className={`rounded-2xl border p-5 transition ${
              t.available
                ? "border-brand-line bg-brand-panel hover:border-brand-indigo/60 hover:bg-brand-panel-raised"
                : "pointer-events-none border-brand-line/50 bg-brand-panel/40 opacity-50"
            }`}
          >
            <div className="text-base font-semibold text-brand-ink">{t.title}</div>
            <div className="mt-1 font-mono text-sm text-brand-ink-soft">{t.subtitle}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
