"use client";

import { formatISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { hydrateTask, parseTaskInput } from "@/lib/parser";
import { Task } from "@/lib/types";

interface TaskFormProps {
  onCreate: (task: Task) => void;
}

const categories = ["Work", "Personal", "Study", "Health", "Finance", "Errands", "Creative", "Learning", "Planning", "General"];
const priorities = ["Critical", "High", "Medium", "Low"] as const;

export function TaskForm({ onCreate }: TaskFormProps) {
  const [input, setInput] = useState("");
  const [notes, setNotes] = useState("");
  const [manualDueDate, setManualDueDate] = useState<string>("");
  const [manualPriority, setManualPriority] = useState<string>("");
  const [manualCategory, setManualCategory] = useState<string>("");
  const [manualEstimate, setManualEstimate] = useState<string>("");
  const [subtaskInput, setSubtaskInput] = useState<string>("");

  const parsed = useMemo(() => {
    if (!input.trim()) {
      return undefined;
    }
    return parseTaskInput(input);
  }, [input]);

  useEffect(() => {
    if (!parsed) {
      return;
    }
    if (!manualPriority) {
      setManualPriority(parsed.priority);
    }
    if (!manualCategory) {
      setManualCategory(parsed.category);
    }
    if (!manualDueDate && parsed.dueDate) {
      setManualDueDate(parsed.dueDate);
    }
    if (!manualEstimate && parsed.estimatedMinutes) {
      setManualEstimate(String(parsed.estimatedMinutes));
    }
    if (!subtaskInput && parsed.subtasks.length > 0) {
      setSubtaskInput(parsed.subtasks.join(", "));
    }
  }, [parsed, manualCategory, manualDueDate, manualEstimate, manualPriority, subtaskInput]);

  function resetForm() {
    setInput("");
    setNotes("");
    setManualDueDate("");
    setManualPriority("");
    setManualCategory("");
    setManualEstimate("");
    setSubtaskInput("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) {
      return;
    }

    const base = parsed ?? parseTaskInput(input);
    const task = hydrateTask({
      ...base,
      priority: (manualPriority as Task["priority"]) || base.priority,
      category: manualCategory || base.category,
      dueDate: manualDueDate || base.dueDate,
      estimatedMinutes: manualEstimate ? Number(manualEstimate) : base.estimatedMinutes,
      subtasks: subtaskInput
        ? subtaskInput
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
        : base.subtasks
    });

    task.notes = notes.trim() || undefined;
    task.dueDate = task.dueDate ? formatISO(new Date(task.dueDate)) : undefined;

    onCreate(task);
    resetForm();
  }

  return (
    <section className="card">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-slate-200">Quick capture</label>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="e.g. Tomorrow by 3pm finalize presentation deck urgent high priority"
            className="mt-2 w-full"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-400">Priority</label>
            <select value={manualPriority} onChange={(event) => setManualPriority(event.target.value)} className="mt-1 w-full">
              <option value="">Auto: {parsed?.priority ?? "Medium"}</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-400">Category</label>
            <select value={manualCategory} onChange={(event) => setManualCategory(event.target.value)} className="mt-1 w-full">
              <option value="">Auto: {parsed?.category ?? "General"}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-400">Due (ISO or leave blank)</label>
            <input
              type="datetime-local"
              value={manualDueDate ? manualDueDate.slice(0, 16) : ""}
              onChange={(event) => setManualDueDate(event.target.value ? new Date(event.target.value).toISOString() : "")}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-400">Estimated minutes</label>
            <input
              type="number"
              min={5}
              step={5}
              value={manualEstimate}
              placeholder={parsed?.estimatedMinutes ? String(parsed.estimatedMinutes) : "45"}
              onChange={(event) => setManualEstimate(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-400">Subtasks (comma separated)</label>
            <input value={subtaskInput} onChange={(event) => setSubtaskInput(event.target.value)} placeholder="Draft | Review | Submit" />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Context / notes</label>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Key info, resources, blockers" rows={2} />
        </div>

        {parsed && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
            <p className="font-medium text-slate-300">Smart parse preview</p>
            <ul className="mt-2 space-y-1">
              <li>
                <span className="text-slate-500">Name:</span> {parsed.name}
              </li>
              <li>
                <span className="text-slate-500">Priority:</span> {parsed.priority}
              </li>
              <li>
                <span className="text-slate-500">Category:</span> {parsed.category}
              </li>
              <li>
                <span className="text-slate-500">Due:</span> {parsed.dueDate ? new Date(parsed.dueDate).toLocaleString() : "Not detected"}
              </li>
              <li>
                <span className="text-slate-500">Estimate:</span> {parsed.estimatedMinutes ? `${parsed.estimatedMinutes} min` : "Not detected"}
              </li>
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">Press Enter to queue this task instantly.</p>
          <button type="submit">Add task</button>
        </div>
      </form>
    </section>
  );
}
