"use client";

import { useEffect, useMemo, useState } from "react";
import AddTaskForm from "./AddTaskForm";
import Filters from "./Filters";
import ProgressChart from "./ProgressChart";
import TaskItem from "./TaskItem";
import {
  CategoryFilter,
  PRIORITY_META,
  PriorityFilter,
  Task,
} from "@/lib/types";

const STORAGE_KEY = "todo-tasks-v2";

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [justCompletedIds, setJustCompletedIds] = useState<Set<string>>(
    new Set()
  );
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Task[];
        setTasks(parsed);
      } catch {
        // ignore parse error
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  const addTask = (t: Omit<Task, "id" | "done" | "createdAt">) => {
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        done: false,
        createdAt: new Date().toISOString(),
        ...t,
      },
      ...prev,
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              done: !t.done,
              completedAt: !t.done ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
    const target = tasks.find((t) => t.id === id);
    if (target && !target.done) {
      setJustCompletedIds((prev) => new Set(prev).add(id));
      setTimeout(() => {
        setJustCompletedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 700);
    }
  };

  const removeTask = (id: string) => {
    setRemovingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 250);
  };

  const clearCompleted = () => {
    const completed = tasks.filter((t) => t.done).map((t) => t.id);
    setRemovingIds((prev) => {
      const next = new Set(prev);
      completed.forEach((id) => next.add(id));
      return next;
    });
    setTimeout(() => {
      setTasks((prev) => prev.filter((t) => !t.done));
      setRemovingIds((prev) => {
        const next = new Set(prev);
        completed.forEach((id) => next.delete(id));
        return next;
      });
    }, 250);
  };

  const filtered = useMemo(() => {
    return tasks
      .filter(
        (t) => categoryFilter === "all" || t.category === categoryFilter
      )
      .filter(
        (t) => priorityFilter === "all" || t.priority === priorityFilter
      )
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        const pa = PRIORITY_META[a.priority].order;
        const pb = PRIORITY_META[b.priority].order;
        if (pa !== pb) return pa - pb;
        if (a.dueDate && b.dueDate) {
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [tasks, categoryFilter, priorityFilter]);

  const remaining = tasks.filter((t) => !t.done).length;
  const hasCompleted = tasks.some((t) => t.done);
  const filtersActive =
    categoryFilter !== "all" || priorityFilter !== "all";

  return (
    <div className="w-full max-w-lg">
      <header className="mb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0f2e1a]">
              タスク
            </h1>
            <p className="mt-1 text-sm text-[#5b7364]">
              {tasks.length === 0
                ? "今日は何から始めますか？"
                : remaining === 0
                ? "すべて完了しました 🎉"
                : `残り ${remaining} 件`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-[#5b7364] font-semibold">
              Today
            </div>
            <div className="text-sm text-[#0f2e1a] font-medium">
              {new Date().toLocaleDateString("ja-JP", {
                month: "long",
                day: "numeric",
                weekday: "short",
              })}
            </div>
          </div>
        </div>
      </header>

      <section className="mb-4">
        <ProgressChart tasks={tasks} />
      </section>

      <section className="mb-4">
        <AddTaskForm onAdd={addTask} />
      </section>

      <section className="mb-4 glass rounded-2xl p-4 shadow-sm">
        <Filters
          categoryFilter={categoryFilter}
          priorityFilter={priorityFilter}
          onCategoryChange={setCategoryFilter}
          onPriorityChange={setPriorityFilter}
        />
      </section>

      <ul className="space-y-2">
        {filtered.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            removing={removingIds.has(task.id)}
            justCompleted={justCompletedIds.has(task.id)}
            onToggle={toggleTask}
            onRemove={removeTask}
          />
        ))}
      </ul>

      {filtered.length === 0 && tasks.length > 0 && filtersActive && (
        <div className="text-center py-8 text-sm text-[#5b7364]">
          条件に合うタスクがありません
        </div>
      )}

      {hasCompleted && (
        <button
          onClick={clearCompleted}
          className="mt-4 w-full py-2.5 rounded-xl text-xs text-[#5b7364] hover:text-[#ef4444] hover:bg-white/60 transition-all"
        >
          完了済みをすべて削除
        </button>
      )}
    </div>
  );
}
