export type Priority = "high" | "medium" | "low";
export type Category = "work" | "private" | "other";

export type Task = {
  id: string;
  text: string;
  done: boolean;
  priority: Priority;
  category: Category;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
};

export type CategoryFilter = Category | "all";
export type PriorityFilter = Priority | "all";

export const PRIORITY_META: Record<
  Priority,
  { label: string; color: string; bg: string; ring: string; order: number }
> = {
  high: {
    label: "高",
    color: "#dc2626",
    bg: "#fef2f2",
    ring: "#fecaca",
    order: 0,
  },
  medium: {
    label: "中",
    color: "#d97706",
    bg: "#fffbeb",
    ring: "#fde68a",
    order: 1,
  },
  low: {
    label: "低",
    color: "#0891b2",
    bg: "#ecfeff",
    ring: "#a5f3fc",
    order: 2,
  },
};

export const CATEGORY_META: Record<
  Category,
  { label: string; color: string; bg: string; emoji: string }
> = {
  work: { label: "仕事", color: "#059669", bg: "#d1fae5", emoji: "💼" },
  private: { label: "プライベート", color: "#7c3aed", bg: "#ede9fe", emoji: "🏡" },
  other: { label: "その他", color: "#64748b", bg: "#f1f5f9", emoji: "📌" },
};
