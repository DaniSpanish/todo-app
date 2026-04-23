"use client";

import { CATEGORY_META, PRIORITY_META, Task } from "@/lib/types";

type Props = {
  task: Task;
  removing: boolean;
  justCompleted: boolean;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

function formatDue(dateStr: string): { label: string; tone: string } {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const label = `${d.getMonth() + 1}/${d.getDate()}`;
  if (diff < 0) return { label: `${label} (期限切れ)`, tone: "#dc2626" };
  if (diff === 0) return { label: `${label} (今日)`, tone: "#d97706" };
  if (diff === 1) return { label: `${label} (明日)`, tone: "#d97706" };
  if (diff <= 3) return { label: `${label} (あと${diff}日)`, tone: "#059669" };
  return { label, tone: "#5b7364" };
}

export default function TaskItem({
  task,
  removing,
  justCompleted,
  onToggle,
  onRemove,
}: Props) {
  const priority = PRIORITY_META[task.priority];
  const category = CATEGORY_META[task.category];
  const due = task.dueDate ? formatDue(task.dueDate) : null;

  return (
    <li
      className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-white border transition-all duration-200 shadow-sm hover:shadow-md ${
        removing ? "task-exit" : "task-enter"
      } ${justCompleted ? "task-complete-pulse" : ""}`}
      style={{ borderColor: "rgba(217, 232, 219, 0.9)" }}
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? "未完了に戻す" : "完了にする"}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all active:scale-90 ${
          task.done
            ? "bg-gradient-to-br from-[#10b981] to-[#059669] border-[#059669]"
            : "border-[#c6d9ca] hover:border-[#059669] hover:bg-[#ecfdf5]"
        }`}
      >
        {task.done && (
          <svg
            className={`w-3 h-3 text-white ${
              justCompleted ? "check-draw" : ""
            }`}
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div
          className={`text-sm transition-all ${
            task.done ? "line-through text-[#a8bdae]" : "text-[#0f2e1a]"
          }`}
        >
          {task.text}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
            style={{ color: priority.color, backgroundColor: priority.bg }}
          >
            優先度 {priority.label}
          </span>
          <span
            className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md"
            style={{ color: category.color, backgroundColor: category.bg }}
          >
            <span>{category.emoji}</span>
            {category.label}
          </span>
          {due && (
            <span
              className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#f1f5f4]"
              style={{ color: due.tone }}
            >
              📅 {due.label}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onRemove(task.id)}
        aria-label="削除"
        className="mt-0.5 flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[#b8c9bc] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-all active:scale-90"
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
  );
}
