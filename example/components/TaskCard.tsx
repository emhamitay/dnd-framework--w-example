import { SortableDraggable } from "../../src/wrappers/SortableDraggable";

const PRIORITY = {
  high:   { label: "High",   badge: "bg-red-100 text-red-700",       border: "border-l-red-400" },
  medium: { label: "Medium", badge: "bg-amber-100 text-amber-700",   border: "border-l-amber-400" },
  low:    { label: "Low",    badge: "bg-emerald-100 text-emerald-700", border: "border-l-emerald-400" },
};

const TAG = {
  feature: "bg-blue-100 text-blue-700",
  bug:     "bg-red-100 text-red-700",
  design:  "bg-purple-100 text-purple-700",
  docs:    "bg-slate-100 text-slate-600",
};

export function TaskCard({ task }) {
  const p = PRIORITY[task.priority] ?? PRIORITY.medium;
  const tagCls = TAG[task.tag] ?? TAG.feature;

  return (
    <SortableDraggable id={task.id}>
      <div
        className={`bg-white rounded-xl p-3.5 shadow-sm border border-slate-100 border-l-4 ${p.border} select-none hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing`}
      >
        <p className="text-sm font-medium text-slate-800 mb-2.5 leading-snug">
          {task.title}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.badge}`}>
            {p.label}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${tagCls}`}>
            {task.tag}
          </span>
        </div>
      </div>
    </SortableDraggable>
  );
}
