"use client";

import { useState, useEffect, useRef } from "react";

type Task = {
  id: string;
  text: string;
  done: boolean;
};

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("todo-tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [
      { id: crypto.randomUUID(), text, done: false },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
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
    }, 200);
  };

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1a1a2e] tracking-tight">
          タスク
        </h1>
        <p className="mt-1 text-sm text-[#888]">
          {tasks.length === 0
            ? "タスクがありません"
            : remaining === 0
            ? "すべて完了！"
            : `残り ${remaining} 件`}
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="新しいタスクを入力..."
          className="todo-input flex-1 px-4 py-3 rounded-xl bg-white border border-[#e8e5e0] text-[#1a1a2e] placeholder-[#bbb] text-sm transition-shadow"
        />
        <button
          onClick={addTask}
          disabled={!input.trim()}
          className="px-4 py-3 rounded-xl bg-[#6366f1] text-white text-sm font-medium hover:bg-[#4f52d3] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          追加
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-white border transition-all duration-200 ${
              removingIds.has(task.id)
                ? "task-exit"
                : "task-enter border-[#e8e5e0]"
            }`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              aria-label={task.done ? "未完了に戻す" : "完了にする"}
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                task.done
                  ? "bg-[#6366f1] border-[#6366f1]"
                  : "border-[#ccc] hover:border-[#6366f1]"
              }`}
            >
              {task.done && (
                <svg
                  className="w-3 h-3 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            <span
              className={`flex-1 text-sm transition-all ${
                task.done ? "line-through text-[#bbb]" : "text-[#1a1a2e]"
              }`}
            >
              {task.text}
            </span>

            <button
              onClick={() => removeTask(task.id)}
              aria-label="削除"
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[#ccc] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {tasks.some((t) => t.done) && (
        <button
          onClick={() => setTasks((prev) => prev.filter((t) => !t.done))}
          className="mt-4 w-full py-2 text-xs text-[#aaa] hover:text-[#ef4444] transition-colors"
        >
          完了済みをすべて削除
        </button>
      )}
    </div>
  );
}
