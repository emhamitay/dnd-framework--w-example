import { useState } from "react";
import { DndProvider } from "../../src/context/DndProvider";
import { GhostLayer } from "../../src/GhostLayer";
import { Draggable } from "../../src/wrappers/Draggable";
import { Droppable } from "../../src/wrappers/Droppable";

const CODE = `import { DndProvider, GhostLayer, Draggable, Droppable } from '@emhamitay/ghostdrop';

function App() {
  const [dropped, setDropped] = useState(null);

  return (
    <DndProvider>
      <GhostLayer />

      <Draggable id="file-1">
        <div>📄 report.pdf</div>
      </Draggable>

      <Droppable
        id="inbox"
        onDrop={(item) => setDropped(item.id)}
      >
        <div className="drop-zone">
          {dropped ? \`✓ \${dropped} landed!\` : '📥 Drop here'}
        </div>
      </Droppable>
    </DndProvider>
  );
}`;

function Demo() {
  const [dropped, setDropped] = useState(null);
  const [files] = useState([
    { id: "report.pdf", icon: "📄" },
    { id: "photo.png", icon: "🖼️" },
    { id: "notes.txt", icon: "📝" },
  ]);

  return (
    <DndProvider>
      <GhostLayer />
      <div className="flex flex-col sm:flex-row gap-8 items-start justify-center py-4 min-h-48">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Files</p>
          {files.map((f) => (
            <Draggable key={f.id} id={f.id}>
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm cursor-grab hover:shadow-md hover:border-slate-300 transition-all select-none flex items-center gap-2">
                {f.icon} {f.id}
              </div>
            </Draggable>
          ))}
        </div>

        <Droppable
          id="inbox"
          onDrop={(item) => setDropped(item.id)}
        >
          <div className="w-44 min-h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2 transition-colors">
            {dropped ? (
              <>
                <span className="text-2xl">✓</span>
                <span className="text-sm font-medium text-emerald-600 text-center px-2">{dropped} landed!</span>
                <button
                  onClick={() => setDropped(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
                >
                  reset
                </button>
              </>
            ) : (
              <>
                <span className="text-2xl">📥</span>
                <span className="text-sm font-medium text-slate-400">Drop here</span>
              </>
            )}
          </div>
        </Droppable>
      </div>
    </DndProvider>
  );
}

export function Example1BasicDrop({ CodeBlock }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <Demo />
      </div>
      <CodeBlock code={CODE} label="Example1.jsx" />
    </div>
  );
}
