"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CODE_LENGTH = 6;
const BOOT_LINES = [
  "> INITIALIZING MANAGED DEMOCRACY PROTOCOL...",
  "> ESTABLISHING UPLINK TO SUPER EARTH HIGH COMMAND...",
  "> SCANNING FOR AUTHORIZED HELLDIVER...",
  "> ENTER 6-DIGIT CLEARANCE CODE TO PROCEED",
];

function UnlockForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function submit(code: string) {
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
        setDigits(Array(CODE_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } finally {
      setLoading(false);
    }
  }

  function setDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (next.every((d) => d !== "")) {
      submit(next.join(""));
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace" && digits[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]!;
    setDigits(next);
    if (pasted.length === CODE_LENGTH) submit(pasted);
    else inputRefs.current[pasted.length]?.focus();
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 font-mono text-brand-gold"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,184,28,0.04) 0px, rgba(255,184,28,0.04) 1px, transparent 1px, transparent 3px), radial-gradient(ellipse at center, rgba(255,184,28,0.08) 0%, transparent 70%)",
      }}
    >
      <div
        className={`w-full max-w-sm rounded border-2 border-brand-gold/50 bg-black/80 p-6 shadow-[0_0_25px_rgba(255,184,28,0.25)] ${error ? "animate-shake" : ""}`}
      >
        <div className="flex items-center justify-between text-[10px] tracking-widest text-brand-gold/70">
          <span>SUPER EARTH HIGH COMMAND</span>
          <span className="animate-pulse">&#9679; LIVE</span>
        </div>
        <div className="mt-3 border-b border-brand-gold/30 pb-3 text-center">
          <div className="text-xl font-bold tracking-widest">RESTRICTED TERMINAL</div>
          <div className="text-[10px] tracking-widest text-brand-gold/60">CLEARANCE LEVEL: HELLDIVER ONLY</div>
        </div>

        <div className="mt-3 space-y-0.5 text-[11px] leading-relaxed text-brand-gold/70">
          {BOOT_LINES.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              autoFocus={i === 0}
              disabled={loading}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="h-11 w-9 rounded border border-brand-gold/40 bg-black text-center text-lg text-brand-gold outline-none focus:border-brand-gold focus:shadow-[0_0_8px_rgba(255,184,28,0.6)] disabled:opacity-40"
            />
          ))}
        </div>

        <button
          onClick={() => submit(digits.join(""))}
          disabled={loading || digits.some((d) => d === "")}
          className="mt-5 w-full rounded border border-brand-gold/60 bg-brand-gold/10 py-2 text-sm font-bold tracking-[0.2em] text-brand-gold transition hover:bg-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {loading ? "VERIFYING…" : "TRANSMIT"}
        </button>

        {error && (
          <p className="mt-3 text-center text-xs font-bold tracking-widest text-brand-red">
            &#9888; ACCESS DENIED &mdash; CODE NOT RECOGNIZED
          </p>
        )}

        <p className="mt-4 text-center text-[10px] tracking-wide text-brand-gold/40">DEMOCRACY PROTECTS. UNAUTHORIZED ACCESS WILL BE REPORTED.</p>
      </div>
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
