"use client";

import { useState, useRef, useEffect } from "react";

type FilterType = "all" | "active" | "done";

interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      {checked && <polyline points="20 6 9 17 4 12" />}
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

const STORAGE_KEY = "todo-app-tasks";

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTodos(loadTodos());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveTodos(todos);
  }, [todos, mounted]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, done: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const activeCount = todos.filter((t) => !t.done).length;
  const doneCount = todos.filter((t) => t.done).length;

  const filterLabels: { key: FilterType; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "active", label: "未完了" },
    { key: "done", label: "完了済み" },
  ];

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
          やること
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {activeCount > 0
            ? `${activeCount} 件の未完了タスク`
            : todos.length === 0
            ? "タスクを追加してみましょう"
            : "すべて完了しました 🎉"}
        </p>
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-6">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="新しいタスクを入力..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all shadow-sm"
        />
        <button
          onClick={addTodo}
          disabled={!input.trim()}
          className="px-5 py-3 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          追加
        </button>
      </div>

      {/* Filter Tabs */}
      {todos.length > 0 && (
        <div className="flex gap-1 mb-4 bg-slate-100 p-1 rounded-xl">
          {filterLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === key
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
              {key === "all" && (
                <span className="ml-1 text-slate-400">({todos.length})</span>
              )}
              {key === "active" && activeCount > 0 && (
                <span className="ml-1 text-slate-400">({activeCount})</span>
              )}
              {key === "done" && doneCount > 0 && (
                <span className="ml-1 text-slate-400">({doneCount})</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-2">
        {filtered.length === 0 && todos.length > 0 && (
          <div className="text-center py-10 text-slate-300 text-sm">
            該当するタスクはありません
          </div>
        )}

        {filtered.map((todo) => (
          <div
            key={todo.id}
            className={`group flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border transition-all shadow-sm task-enter ${
              todo.done
                ? "border-slate-100 opacity-60"
                : "border-slate-200 hover:border-indigo-200 hover:shadow-md"
            }`}
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                todo.done
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-slate-300 hover:border-indigo-400 text-transparent hover:text-indigo-300"
              }`}
              aria-label={todo.done ? "未完了に戻す" : "完了にする"}
            >
              <CheckIcon checked={todo.done} />
            </button>

            {/* Text */}
            <span
              className={`flex-1 text-sm leading-relaxed ${
                todo.done
                  ? "line-through text-slate-400"
                  : "text-slate-700"
              }`}
            >
              {todo.text}
            </span>

            {/* Delete */}
            <button
              onClick={() => deleteTodo(todo.id)}
              className="flex-shrink-0 p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
              aria-label="削除"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      {doneCount > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setTodos((prev) => prev.filter((t) => !t.done))}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            完了済みをすべて削除
          </button>
        </div>
      )}
    </div>
  );
}
