"use client";

import {
  Category,
  CATEGORY_META,
  CategoryFilter,
  Priority,
  PRIORITY_META,
  PriorityFilter,
} from "@/lib/types";

type Props = {
  categoryFilter: CategoryFilter;
  priorityFilter: PriorityFilter;
  onCategoryChange: (c: CategoryFilter) => void;
  onPriorityChange: (p: PriorityFilter) => void;
};

function Chip({
  active,
  label,
  onClick,
  color,
  emoji,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  color?: string;
  emoji?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 whitespace-nowrap ${
        active
          ? "border-transparent text-white shadow-sm chip-active"
          : "bg-white/60 border-[#d9e8db] text-[#5b7364] hover:border-[#059669] hover:text-[#059669]"
      }`}
      style={active && color ? { backgroundColor: color } : undefined}
    >
      {emoji && <span className="mr-1">{emoji}</span>}
      {label}
    </button>
  );
}

export default function Filters({
  categoryFilter,
  priorityFilter,
  onCategoryChange,
  onPriorityChange,
}: Props) {
  return (
    <div className="space-y-2.5">
      <div>
        <div className="text-[10px] uppercase tracking-wider text-[#5b7364] mb-1.5 font-semibold">
          カテゴリ
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <Chip
            active={categoryFilter === "all"}
            label="すべて"
            color="#059669"
            onClick={() => onCategoryChange("all")}
          />
          {(Object.keys(CATEGORY_META) as Category[]).map((c) => {
            const meta = CATEGORY_META[c];
            return (
              <Chip
                key={c}
                active={categoryFilter === c}
                label={meta.label}
                emoji={meta.emoji}
                color={meta.color}
                onClick={() => onCategoryChange(c)}
              />
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wider text-[#5b7364] mb-1.5 font-semibold">
          優先度
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <Chip
            active={priorityFilter === "all"}
            label="すべて"
            color="#059669"
            onClick={() => onPriorityChange("all")}
          />
          {(Object.keys(PRIORITY_META) as Priority[]).map((p) => {
            const meta = PRIORITY_META[p];
            return (
              <Chip
                key={p}
                active={priorityFilter === p}
                label={meta.label}
                color={meta.color}
                onClick={() => onPriorityChange(p)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
