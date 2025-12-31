"use client";

import { useMemo, useState } from "react";
import { generateDailyPlan } from "@/lib/task-logic";
import { Task } from "@/lib/types";

interface DailyPlannerProps {
  tasks: Task[];
}

export function DailyPlanner({ tasks }: DailyPlannerProps) {
  const [availableMinutes, setAvailableMinutes] = useState(240);
  const [energyLevel, setEnergyLevel] = useState<"Low" | "Medium" | "High">("Medium");

  const plan = useMemo(
    () => generateDailyPlan(tasks, { availableMinutes, energyLevel }),
    [tasks, availableMinutes, energyLevel]
  );

  return (
    <section className="card space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-200">🗓 Daily plan</h2>
        <p className="text-xs text-slate-400">Agent balances urgency, priority, and your energy allocation.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Focus budget (minutes)</label>
          <input
            type="number"
            min={60}
            step={30}
            value={availableMinutes}
            onChange={(event) => setAvailableMinutes(Number(event.target.value))}
            className="mt-1 w-full"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Energy level</label>
          <select value={energyLevel} onChange={(event) => setEnergyLevel(event.target.value as typeof energyLevel)} className="mt-1 w-full">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
          <p className="font-semibold text-slate-200">Tip</p>
          <p className="mt-1 text-slate-400">Reserve your highest energy for deep work. Batch shallow tasks when energy dips.</p>
        </div>
      </div>

      {plan.length === 0 ? (
        <p className="text-sm text-slate-400">All clear. No tasks align with the focus criteria for today.</p>
      ) : (
        <ol className="space-y-3">
          {plan.map((task, index) => (
            <li key={task.id} className="rounded-lg border border-primary/40 bg-primary/10 p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Block {index + 1}</span>
                {task.estimatedMinutes && <span>~{task.estimatedMinutes} min</span>}
              </div>
              <p className="mt-2 text-base font-semibold text-white">{task.name}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="badge">{task.priority}</span>
                {task.dueDate && <span className="badge">Due {new Date(task.dueDate).toLocaleString()}</span>}
                <span className="badge">{task.category}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
