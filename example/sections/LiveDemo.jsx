import { useTaskStore } from "../store/useTaskStore";
import { KanbanColumn } from "../components/KanbanColumn";

export function LiveDemo() {
  const columns = useTaskStore((s) => s.columns);

  return (
    <section id="demo" className="bg-slate-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">
          See it in action
        </h2>
        <p className="text-slate-500 text-center mb-12 text-lg">
          Drag cards between columns or reorder within. Powered entirely by this framework.
        </p>

        {/* Tip */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm px-4 py-2 rounded-full font-medium">
            <span>☝️</span>
            Drag cards between columns or reorder within a column
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-6">
          {columns.map((col) => (
            <div key={col.id} className="flex-shrink-0">
              <KanbanColumn column={col} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
