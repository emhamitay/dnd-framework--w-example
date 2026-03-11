import { DroppableSortableWrapper } from "../../src/wrappers/DroppableSortableWrapper";
import { TaskCard } from "./TaskCard";
import { useTaskStore } from "../store/useTaskStore";

const COL_STYLE = {
  todo:       { dot: "bg-slate-400",   label: "text-slate-700",   ring: "ring-slate-300",   count: "bg-slate-200 text-slate-500" },
  inprogress: { dot: "bg-blue-500",    label: "text-blue-700",    ring: "ring-blue-300",    count: "bg-blue-100 text-blue-600" },
  review:     { dot: "bg-amber-500",   label: "text-amber-700",   ring: "ring-amber-300",   count: "bg-amber-100 text-amber-600" },
  done:       { dot: "bg-emerald-500", label: "text-emerald-700", ring: "ring-emerald-300", count: "bg-emerald-100 text-emerald-600" },
};

export function KanbanColumn({ column }) {
  const moveTask = useTaskStore((s) => s.moveTask);
  const updateColumnTasks = useTaskStore((s) => s.updateColumnTasks);
  const style = COL_STYLE[column.id] ?? COL_STYLE.todo;

  const onDrop = (item) => {
    if (column.tasks.some((t) => t.id === item.id)) return;
    moveTask(item.id, column.id);
  };

  const onSorted = (newTasks) => {
    updateColumnTasks(column.id, newTasks);
  };

  return (
    <DroppableSortableWrapper
      id={column.id}
      items={column.tasks}
      onSorted={onSorted}
      onDrop={onDrop}
    >
      {({ isHover }) => (
        <div
          className={`flex flex-col w-72 min-h-80 bg-slate-100 rounded-2xl p-4 gap-2 transition-all duration-150 ${
            isHover ? `ring-2 ${style.ring} bg-slate-50` : ""
          }`}
        >
          {/* Column header */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${style.dot}`} />
            <h3 className={`font-bold text-sm uppercase tracking-wider ${style.label}`}>
              {column.title}
            </h3>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${style.count}`}>
              {column.tasks.length}
            </span>
          </div>

          {/* Task cards */}
          <div className="flex flex-col gap-2">
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          {/* Empty state */}
          {column.tasks.length === 0 && (
            <div
              className={`flex-1 flex items-center justify-center rounded-xl border-2 border-dashed text-sm min-h-24 transition-colors ${
                isHover ? "border-blue-300 text-blue-400" : "border-slate-300 text-slate-400"
              }`}
            >
              Drop here
            </div>
          )}
        </div>
      )}
    </DroppableSortableWrapper>
  );
}
