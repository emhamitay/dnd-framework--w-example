import { useState } from "react";
import type { ReactNode } from "react";
import { DndProvider } from "../../src/context/DndProvider";
import { GhostLayer } from "../../src/GhostLayer";
import { SortableDropGroup } from "../../src/wrappers/SortableDropGroup";
import { SortableDraggable } from "../../src/wrappers/SortableDraggable";

const CODE = `import { useState } from 'react';
import { DndProvider, GhostLayer, SortableDropGroup, SortableDraggable } from '@emhamitay/ghostdrop';

type Item = { id: string; label: string; index: number };

function SortableList({ items, setItems }: { items: Item[]; setItems: (items: Item[]) => void }) {
  return (
    <SortableDropGroup items={items} onSorted={setItems}>
      {items.map((item) => (
        <SortableDraggable key={item.id} id={item.id}>
          <div className="card">{item.label}</div>
        </SortableDraggable>
      ))}
    </SortableDropGroup>
  );
}`;

const INITIAL_ITEMS = [
  { id: "s1", label: "🏠 Homepage redesign", index: 0 },
  { id: "s2", label: "🔐 Auth flow improvements", index: 1 },
  { id: "s3", label: "📊 Analytics dashboard", index: 2 },
  { id: "s4", label: "🔔 Push notifications", index: 3 },
  { id: "s5", label: "🌙 Dark mode", index: 4 },
];

function Demo() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  return (
    <DndProvider>
      <GhostLayer />
      <div className="py-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Backlog — drag to reorder
        </p>
        <SortableDropGroup items={items} onSorted={setItems}>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <SortableDraggable key={item.id} id={item.id}>
                <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 shadow-sm cursor-grab hover:shadow-md hover:border-slate-300 transition-all select-none flex items-center justify-between">
                  <span>{item.label}</span>
                  <span className="text-slate-300 text-xs">⠿</span>
                </div>
              </SortableDraggable>
            ))}
          </div>
        </SortableDropGroup>
        <p className="text-xs text-slate-400 mt-3 text-center">
          Order: {items.map((i) => i.label.split(" ")[0]).join(" → ")}
        </p>
      </div>
    </DndProvider>
  );
}

export function Example2Sortable({ CodeBlock }: { CodeBlock: (props: { code: string; label: string }) => ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 items-start">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <Demo />
      </div>
      <CodeBlock code={CODE} label="Example2.tsx" />
    </div>
  );
}
