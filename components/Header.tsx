"use client";

import { format } from "date-fns";
import { useMemo } from "react";

export function Header() {
  const now = useMemo(() => new Date(), []);
  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour < 12) {
      return "Good morning";
    }
    if (hour < 18) {
      return "Good afternoon";
    }
    return "Good evening";
  }, [now]);

  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-widest text-slate-400">{format(now, "PPPP")}</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{greeting}, let us optimize your focus</h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Capture tasks, prioritize with intelligence, and close your day with clarity. Your agent keeps watch over urgency and energy so you can execute.
        </p>
      </div>
      <div className="card w-full sm:w-auto">
        <p className="text-xs uppercase tracking-widest text-slate-400">Momentum mantra</p>
        <p className="mt-2 text-sm text-slate-200">Schedule your top three outcomes before noon and defend that focus.</p>
      </div>
    </header>
  );
}
