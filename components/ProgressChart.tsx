"use client";

import { Category, CATEGORY_META, Task } from "@/lib/types";

type Props = {
  tasks: Task[];
};

export default function ProgressChart({ tasks }: Props) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const rate = total === 0 ? 0 : Math.round((done / total) * 100);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rate / 100) * circumference;

  const byCategory = (Object.keys(CATEGORY_META) as Category[]).map((c) => {
    const items = tasks.filter((t) => t.category === c);
    const doneCount = items.filter((t) => t.done).length;
    const total = items.length;
    return {
      key: c,
      meta: CATEGORY_META[c],
      done: doneCount,
      total,
      pct: total === 0 ? 0 : Math.round((doneCount / total) * 100),
    };
  });

  return (
    <div className="glass rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-5">
        <div className="relative w-[110px] h-[110px] flex-shrink-0">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full -rotate-90"
            aria-hidden
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#e4f1e6"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="url(#gradGreen)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="ring-progress"
            />
            <defs>
              <linearGradient id="gradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-[#0f2e1a] leading-none">
              {rate}
              <span className="text-sm font-semibold text-[#5b7364]">%</span>
            </div>
            <div className="text-[10px] text-[#5b7364] mt-1">
              {done} / {total}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="text-xs text-[#5b7364] font-medium mb-1">
            カテゴリ別の進捗
          </div>
          {byCategory.map((c) => (
            <div key={c.key}>
              <div className="flex items-center justify-between text-[11px] mb-0.5">
                <span className="flex items-center gap-1 text-[#0f2e1a] font-medium">
                  <span>{c.meta.emoji}</span>
                  {c.meta.label}
                </span>
                <span className="text-[#5b7364] tabular-nums">
                  {c.done}/{c.total}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[#e4f1e6] overflow-hidden">
                <div
                  className="h-full rounded-full bar-grow"
                  style={{
                    width: `${c.pct}%`,
                    backgroundColor: c.meta.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
