"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { recordDailyVisit, type DailyStreak } from "@/lib/dailyStreak";
import PomodoroWidget from "@/components/PomodoroWidget";

export default function AppChrome() {
  const pathname = usePathname();
  const [streak, setStreak] = useState<DailyStreak | null>(null);

  useEffect(() => {
    if (pathname === "/unlock") return;
    setStreak(recordDailyVisit());
  }, [pathname]);

  if (pathname === "/unlock") return null;

  return (
    <>
      {streak && streak.currentStreak > 0 && (
        <Link
          href="/map"
          className="fixed left-4 top-4 z-40 flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-brand-panel px-3 py-1.5 text-sm font-semibold text-brand-gold shadow-lg backdrop-blur transition hover:bg-brand-panel-raised"
          style={{ marginTop: "env(safe-area-inset-top, 0px)" }}
        >
          <span>&#128293;</span>
          <span>
            {streak.currentStreak} day{streak.currentStreak === 1 ? "" : "s"}
          </span>
        </Link>
      )}
      <PomodoroWidget />
    </>
  );
}
