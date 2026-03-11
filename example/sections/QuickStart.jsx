import { useState } from "react";
import { DndProvider } from "../../src/context/DndProvider";
import { GhostLayer } from "../../src/GhostLayer";
import { Draggable } from "../../src/wrappers/Draggable";
import { Droppable } from "../../src/wrappers/Droppable";

const INSTALL_CODE = `npm install @emhamitay/ghostdrop`;

const USAGE_CODE = `import { DndProvider, GhostLayer, Draggable, Droppable } from '@emhamitay/ghostdrop';

function App() {
  return (
    <DndProvider>
      <GhostLayer />

      <Draggable id="card-1">
        <div>Drag me</div>
      </Draggable>

      <Droppable id="zone-1" onDrop={(item) => console.log('dropped:', item.id)}>
        <div>Drop here</div>
      </Droppable>
    </DndProvider>
  );
}`;

function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-xs text-slate-500 font-medium">{label}</span>
        </div>
        <button onClick={handleCopy} className="text-xs text-slate-400 hover:text-white transition-colors font-medium cursor-pointer px-2 py-1 rounded hover:bg-slate-800">
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-5 text-sm text-slate-300 overflow-x-auto font-mono leading-relaxed"><code>{code}</code></pre>
    </div>
  );
}

function LiveQuickDemo() {
  const [dropped, setDropped] = useState(null);

  return (
    <DndProvider>
      <GhostLayer />
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-6">
        <Draggable id="qs-card">
          <div className="bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg cursor-grab select-none hover:bg-indigo-400 transition-colors">
            ✋ Drag me
          </div>
        </Draggable>

        <Droppable id="qs-zone" onDrop={(item) => setDropped(item.id)}>
          {(isHover, ref) => (
            <div
              ref={ref}
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

export function QuickStart() {
  return (
    <section id="quickstart" className="bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">Quick Start</h2>
        <p className="text-slate-500 text-center mb-14 text-lg">Three steps. That's it.</p>

        <div className="flex flex-col gap-10">
          <div>
            <p className="text-slate-700 font-bold mb-3 text-sm tracking-widest uppercase">1 · Install</p>
            <CodeBlock code={INSTALL_CODE} label="Terminal" />
          </div>

          <div>
            <p className="text-slate-700 font-bold mb-3 text-sm tracking-widest uppercase">2 · Add to your app</p>
            <CodeBlock code={USAGE_CODE} label="App.jsx" />
          </div>

          <div>
            <p className="text-slate-700 font-bold mb-3 text-sm tracking-widest uppercase">3 · Try it — live</p>
            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4">
              <LiveQuickDemo />
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-10">
          Want more? See the <a href="#examples" className="text-indigo-500 hover:underline font-medium">Examples</a> below for sorting, groups, and custom callbacks.
        </p>
      </div>
    </section>
  );
}
