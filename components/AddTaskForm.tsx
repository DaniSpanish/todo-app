"use client";

import { useRef, useState } from "react";
import {
  Category,
  CATEGORY_META,
  Priority,
  PRIORITY_META,
  Task,
} from "@/lib/types";

type Props = {
  onAdd: (task: Omit<Task, "id" | "done" | "createdAt">) => void;
};

export default function AddTaskForm({ onAdd }: Props) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("work");
  const [dueDate, setDueDate] = useState("");
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({
      text: trimmed,
      priority,
      category,
      dueDate: dueDate || undefined,
    });
    setText("");
    setDueDate("");
    setPriority("medium");
    setCategory("work");
    setExpanded(false);
    inputRef.current?.focus();
  };

  return (
    <div className="glass rounded-2xl p-4 shadow-sm">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setExpanded(true)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="新しいタスクを入力..."
          className="todo-input flex-1 px-4 py-3 rounded-xl bg-white/70 border border-[#d9e8db] text-[#0f2e1a] placeholder-[#9cb3a2] text-sm transition-all"
        />
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] text-white text-sm font-medium shadow-sm hover:shadow-md hover:from-[#047857] hover:to-[#065f46] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          追加
        </button>
      </div>

      {expanded && (
        <div className="mt-4 fade-in-up space-y-3">
          <div>
            <label className="block text-xs text-[#5b7364] mb-1.5 font-medium">
              優先度
            </label>
            <div className="flex gap-2">
              {(Object.keys(PRIORITY_META) as Priority[]).map((p) => {
                const meta = PRIORITY_META[p];
                const active = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
                      active
                        ? "border-transparent text-white shadow-sm"
                        : "border-[#d9e8db] bg-white/60 text-[#5b7364] hover:border-[#059669]"
                    }`}
                    style={
                      active
                        ? { backgroundColor: meta.color }
                        : undefined
                    }
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#5b7364] mb-1.5 font-medium">
              カテゴリ
            </label>
            <div className="flex gap-2">
              {(Object.keys(CATEGORY_META) as Category[]).map((c) => {
                const meta = CATEGORY_META[c];
                const active = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
                      active
                        ? "border-transparent text-white shadow-sm"
                        : "border-[#d9e8db] bg-white/60 text-[#5b7364] hover:border-[#059669]"
                    }`}
                    style={active ? { backgroundColor: meta.color } : undefined}
                  >
                    <span className="mr-1">{meta.emoji}</span>
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#5b7364] mb-1.5 font-medium">
              締め切り日
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="todo-input w-full px-3 py-2 rounded-lg bg-white/70 border border-[#d9e8db] text-sm text-[#0f2e1a]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
