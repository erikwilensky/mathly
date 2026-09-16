import Link from "next/link";
import Greeting from "@/components/Greeting";
import { COMING_SOON, TOPICS } from "@/lib/topics";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-indigo">Algebra I, apparently</p>
      <Greeting />
      <p className="mt-2 max-w-xl text-brand-ink-soft">
        Short lessons, worked examples, and practice with instant feedback — pick a mission and let's ruin some algebra.
      </p>

      <Link
        href="/map"
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-brand-indigo/40 bg-brand-indigo/10 px-4 py-2 text-sm font-semibold text-brand-indigo transition hover:bg-brand-indigo/20"
      >
        🗺️ View Campaign Map
      </Link>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {TOPICS.map((t) => (
          <Link
            key={t.id}
            href={t.href}
            className="rounded-2xl border border-brand-line bg-brand-panel p-5 transition hover:border-brand-indigo/60 hover:bg-brand-panel-raised"
          >
            <div className="text-base font-semibold text-brand-ink">{t.title}</div>
            <div className="mt-1 font-mono text-sm text-brand-ink-soft">{t.subtitle}</div>
          </Link>
        ))}
        {COMING_SOON.map((t) => (
          <div key={t.title} className="pointer-events-none rounded-2xl border border-brand-line/50 bg-brand-panel/40 p-5 opacity-50">
            <div className="text-base font-semibold text-brand-ink">{t.title}</div>
            <div className="mt-1 font-mono text-sm text-brand-ink-soft">{t.subtitle}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
