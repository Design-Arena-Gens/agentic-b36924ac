"use client";

import { format, formatDistanceToNow, isPast, parseISO } from "date-fns";
import { useMemo } from "react";
import { summarizeByQuadrant } from "@/lib/task-logic";
import { type MatrixQuadrant, type Priority, type Task } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onPriorityChange: (taskId: string, priority: Priority) => void;
}

function PrioritySection({
  label,
  emoji,
  tasks,
  onStatusChange,
  onPriorityChange
}: {
  label: string;
  emoji: string;
  tasks: Task[];
  onStatusChange: TaskListProps["onStatusChange"];
  onPriorityChange: TaskListProps["onPriorityChange"];
}) {
  if (tasks.length === 0) {
    return null;
  }
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-200">
        {emoji} {label}
      </h3>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="card border-l-4 border-l-primary/60">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-white">{task.name}</p>
                  <span className="badge">{task.category}</span>
                  <span className="badge">{task.matrixQuadrant}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  {task.dueDate && (
                    <span className={isPast(parseISO(task.dueDate)) && task.status !== "Completed" ? "text-rose-400" : "text-slate-300"}>
                      ⏰ Due {format(parseISO(task.dueDate), "PPp")} ({formatDistanceToNow(parseISO(task.dueDate), { addSuffix: true })})
                    </span>
                  )}
                  {task.estimatedMinutes && <span>🕒 ~{task.estimatedMinutes} min</span>}
                  <span>Status: {task.status}</span>
                </div>
                {task.notes && <p className="mt-2 text-sm text-slate-300">{task.notes}</p>}
                {task.subtasks.length > 0 && (
                  <ul className="mt-3 space-y-1 text-xs text-slate-300">
                    {task.subtasks.map((subtask) => (
                      <li key={subtask.id} className="flex items-center gap-2">
                        <span>{subtask.completed ? "✅" : "⬜️"}</span>
                        <span>{subtask.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400">Status</label>
                <select
                  value={task.status}
                  onChange={(event) => onStatusChange(task.id, event.target.value as Task["status"])}
                  className="w-full"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <label className="mt-2 text-xs text-slate-400">Adjust priority</label>
                <select value={task.priority} onChange={(event) => onPriorityChange(task.id, event.target.value as Priority)}>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TaskList({ tasks, onStatusChange, onPriorityChange }: TaskListProps) {
  const critical = useMemo(() => tasks.filter((task) => task.priority === "Critical"), [tasks]);
  const high = useMemo(() => tasks.filter((task) => task.priority === "High"), [tasks]);
  const medium = useMemo(() => tasks.filter((task) => task.priority === "Medium"), [tasks]);
  const low = useMemo(() => tasks.filter((task) => task.priority === "Low"), [tasks]);
  const matrix = useMemo(() => summarizeByQuadrant(tasks), [tasks]);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">📋 To-Do List</h2>
        <p className="text-sm text-slate-400">Sorted by agentic priority and urgency signals.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <PrioritySection label="Critical" emoji="🚨" tasks={critical} onStatusChange={onStatusChange} onPriorityChange={onPriorityChange} />
          <PrioritySection label="High Priority" emoji="🔥" tasks={high} onStatusChange={onStatusChange} onPriorityChange={onPriorityChange} />
        </div>
        <div className="space-y-6">
          <PrioritySection label="Medium Priority" emoji="⚡" tasks={medium} onStatusChange={onStatusChange} onPriorityChange={onPriorityChange} />
          <PrioritySection label="Low Priority" emoji="💤" tasks={low} onStatusChange={onStatusChange} onPriorityChange={onPriorityChange} />
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-slate-200">Eisenhower matrix snapshot</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(["Urgent & Important", "Important, Not Urgent", "Urgent, Not Important", "Neither"] as MatrixQuadrant[]).map((quadrant) => (
            <div key={quadrant} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <p className="text-sm font-semibold text-slate-200">{quadrant}</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-400">
                {matrix[quadrant]?.length ? (
                  matrix[quadrant].map((task) => <li key={task.id}>{task.name}</li>)
                ) : (
                  <li>No tasks here. Maintain momentum.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
