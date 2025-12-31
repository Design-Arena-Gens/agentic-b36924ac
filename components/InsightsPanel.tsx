"use client";

import { useMemo } from "react";
import { buildReminders, computeSummary } from "@/lib/task-logic";
import { Task } from "@/lib/types";

interface InsightsPanelProps {
  tasks: Task[];
}

const coachingPrompts = [
  "Which task, if completed today, would unlock the most progress?",
  "Is there a commitment you can delegate or decline to protect focus?",
  "What would make your tomorrow feel lighter?",
  "Which habit will give you energy for the week ahead?",
  "Is there a high-priority task missing a clear next step?"
];

const productivityTips = [
  "Batch similar tasks into themed blocks to reduce context switching.",
  "Use the 1-3-5 planning method: 1 big, 3 medium, 5 small wins per day.",
  "Schedule inbox time instead of living inside it.",
  "Close your day with a 5-minute review and reset ritual.",
  "Protect your first 90 minutes for deep work when possible."
];

export function InsightsPanel({ tasks }: InsightsPanelProps) {
  const summary = useMemo(() => computeSummary(tasks), [tasks]);
  const reminders = useMemo(() => buildReminders(tasks), [tasks]);
  const question = useMemo(() => coachingPrompts[Math.floor(Math.random() * coachingPrompts.length)], []);
  const tip = useMemo(() => productivityTips[Math.floor(Math.random() * productivityTips.length)], []);

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="card space-y-3">
        <h3 className="text-lg font-semibold text-slate-200">📈 Weekly snapshot</h3>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs text-slate-400">Tasks completed</p>
            <p className="mt-1 text-2xl font-semibold text-white">{summary.tasksCompleted}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs text-slate-400">New tasks</p>
            <p className="mt-1 text-2xl font-semibold text-white">{summary.tasksCreated}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs text-slate-400">Completion rate</p>
            <p className="mt-1 text-2xl font-semibold text-white">{summary.completionRate}%</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs text-slate-400">Week anchor</p>
            <p className="mt-1 text-base text-white">Starting {summary.weekStart}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-widest text-slate-500">Bottlenecks</p>
          <ul className="space-y-1 text-xs text-slate-400">
            {summary.bottlenecks.length ? summary.bottlenecks.map((item, index) => <li key={index}>• {item}</li>) : <li>System running smoothly.</li>}
          </ul>
        </div>

        <div className="space-y-2 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-widest text-slate-500">Recommendations</p>
          <ul className="space-y-1 text-xs text-slate-200">
            {summary.recommendations.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-slate-200">🔔 Active reminders</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {reminders.length ? reminders.map((reminder, index) => <li key={index}>{reminder}</li>) : <li>All deadlines under control.</li>}
          </ul>
        </div>
        <div className="card space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-500">Focus question</p>
          <p className="text-sm text-slate-200">{question}</p>
        </div>
        <div className="card space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-500">Productivity cue</p>
          <p className="text-sm text-slate-200">{tip}</p>
        </div>
      </div>
    </section>
  );
}
