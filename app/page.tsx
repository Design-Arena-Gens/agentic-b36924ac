"use client";

import { useCallback, useMemo } from "react";
import { DailyPlanner } from "@/components/DailyPlanner";
import { Header } from "@/components/Header";
import { InsightsPanel } from "@/components/InsightsPanel";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { groupTasks } from "@/lib/task-logic";
import { usePersistentTasks } from "@/lib/storage";
import { type Priority, type Task } from "@/lib/types";
import { updateMatrixQuadrant } from "@/lib/parser";
import { seedTasks } from "@/data/seed-tasks";

export default function HomePage() {
  const [tasks, setTasks] = usePersistentTasks(seedTasks());

  const createTask = useCallback(
    (task: Task) => {
      setTasks((prev) => {
        const next = [updateMatrixQuadrant(task), ...prev];
        return next;
      });
    },
    [setTasks]
  );

  const updateTaskStatus = useCallback(
    (taskId: string, status: Task["status"]) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? updateMatrixQuadrant({
                ...task,
                status,
                subtasks: task.subtasks
              })
            : task
        )
      );
    },
    [setTasks]
  );

  const updateTaskPriority = useCallback(
    (taskId: string, priority: Priority) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? updateMatrixQuadrant({
                ...task,
                priority
              })
            : task
        )
      );
    },
    [setTasks]
  );

  const grouped = useMemo(() => groupTasks(tasks), [tasks]);
  const activeTasks = useMemo(() => tasks.filter((task) => task.status !== "Completed"), [tasks]);

  return (
    <div className="space-y-8">
      <Header />
      <TaskForm onCreate={createTask} />

      <TaskList tasks={tasks} onStatusChange={updateTaskStatus} onPriorityChange={updateTaskPriority} />

      <DailyPlanner tasks={activeTasks} />

      <InsightsPanel tasks={tasks} />

      <section className="card grid gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Today</p>
          <p className="text-xl font-semibold text-white">{grouped.today.length}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Upcoming</p>
          <p className="text-xl font-semibold text-white">{grouped.upcoming.length}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Overdue</p>
          <p className="text-xl font-semibold text-white">{grouped.overdue.length}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Unscheduled</p>
          <p className="text-xl font-semibold text-white">{grouped.unscheduled.length}</p>
        </div>
      </section>
    </div>
  );
}
