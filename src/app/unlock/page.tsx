"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function UnlockForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        router.replace(params.get("next") || "/");
        router.refresh();
      } else {
        setError(true);
        setCode("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={submit}
        className={`w-full max-w-xs rounded-2xl border border-brand-line bg-brand-panel p-6 text-center ${error ? "animate-shake" : ""}`}
      >
        <div className="text-3xl">🔒</div>
        <h1 className="mt-2 text-lg font-bold text-brand-ink">Clearance Required</h1>
        <p className="mt-1 text-sm text-brand-ink-soft">Super Earth restricts this terminal to authorized Helldivers only.</p>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          maxLength={12}
          placeholder="Access code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-5 w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-2 text-center text-lg tracking-[0.3em] text-brand-ink outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/40"
        />
        <button
          type="submit"
          disabled={loading || code.length === 0}
          className="mt-4 w-full rounded-lg bg-brand-indigo px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-indigo/85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Verifying…" : "Authenticate"}
        </button>
        {error && <p className="mt-3 text-sm text-brand-red">Access denied. That code isn't in the system.</p>}
      </form>
    </main>
  );
}

export default function UnlockPage() {
  return (
    <Suspense fallback={null}>
      <UnlockForm />
    </Suspense>
  );
}
