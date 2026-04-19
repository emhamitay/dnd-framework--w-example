import { useState } from "react";
import type { RefObject } from "react";
import type { DndItem } from "@lib/index";
import { DndProvider } from "@lib/context/DndProvider";
import { GhostLayer } from "@lib/GhostLayer";
import { Draggable } from "@lib/wrappers/Draggable";
import { Droppable } from "@lib/wrappers/Droppable";

export function LiveQuickDemo() {
  const [dropped, setDropped] = useState<string | null>(null);

  return (
    <DndProvider>
      <GhostLayer />
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-6">
        <Draggable id="qs-card">
          <div className="bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg cursor-grab select-none hover:bg-indigo-400 transition-colors">
            ✋ Drag me
          </div>
        </Draggable>

        <Droppable id="qs-zone" onDrop={(item: DndItem) => setDropped(item.id)}>
          {(isHover: boolean, ref: RefObject<HTMLElement | null>) => (
            <div
              ref={ref as RefObject<HTMLDivElement>}
              className={`w-44 h-20 rounded-xl border-2 border-dashed flex items-center justify-center text-sm font-medium transition-all duration-150 ${
                isHover
                  ? "border-indigo-400 bg-indigo-50 text-indigo-600 scale-105"
                  : dropped
                  ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                  : "border-slate-300 text-slate-400"
              }`}
            >
              {dropped ? "✓ Dropped!" : isHover ? "Release to drop" : "Drop zone"}
            </div>
          )}
        </Droppable>
      </div>
      {dropped && (
        <p className="text-center text-sm text-slate-500 mt-1">
          <code className="bg-slate-100 px-2 py-0.5 rounded">onDrop</code> fired with <code className="bg-slate-100 px-2 py-0.5 rounded">item.id = "{dropped}"</code>
        </p>
      )}
    </DndProvider>
  );
}
