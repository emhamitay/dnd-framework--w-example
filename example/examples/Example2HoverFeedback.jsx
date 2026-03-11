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

      {/* Pass a function as children → get isOver + ref */}
      <Droppable
        id="inbox"
        onDrop={(item) => setDropped(item.id)}
      >
        {(isOver, ref) => (
          <div
            ref={ref}
            className={isOver ? 'zone zone--active' : 'zone'}
          >
            {dropped ? \`✓ \${dropped} landed!\` : '📥 Drop here'}
          </div>
        )}
      </Droppable>
    </DndProvider>
  );
}`;

const CODE_SIMPLE = `// Plain children — always works, but no hover feedback:
<Droppable id="zone" onDrop={handleDrop}>
  <div className="zone">Drop here</div>
</Droppable>`;

const CODE_RENDER_PROP = `// Children as a function — you get isOver + ref:
<Droppable id="zone" onDrop={handleDrop}>
  {(isOver, ref) => (
    <div
      ref={ref}
      className={isOver ? 'zone zone--active' : 'zone'}
    >
      {isOver ? 'Release!' : 'Drop here'}
    </div>
  )}
</Droppable>`;

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
          {(isOver, ref) => (
            <div
              ref={ref}
              className={`w-44 min-h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all duration-150 ${
                isOver
                  ? "border-blue-400 bg-blue-50 scale-105"
                  : "border-slate-300 bg-slate-50"
              }`}
            >
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
                  <span className={`text-sm font-medium ${isOver ? "text-blue-600" : "text-slate-400"}`}>
                    {isOver ? "Release!" : "Inbox"}
                  </span>
                </>
              )}
            </div>
          )}
        </Droppable>
      </div>
    </DndProvider>
  );
}

export function Example2HoverFeedback({ CodeBlock }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

      {/* Left column: demo + explainer stacked */}
      <div className="flex flex-col gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <Demo />
        </div>

        {/* Explainer lives right below the demo it describes */}
        <div className="border border-amber-300 bg-amber-50 rounded-2xl p-5">
          <p className="font-bold text-amber-900 mb-1 flex items-center gap-2">
            <span>💡</span> What is{" "}
            <code className="font-mono bg-amber-200 px-1.5 py-0.5 rounded text-xs">
              {`{(isOver, ref) => (...)}`}
            </code>
            ?
          </p>
          <p className="text-amber-800 text-sm leading-relaxed mb-4">
            <code className="font-mono bg-amber-200 px-1 rounded text-xs">Droppable</code>'s children
            can be plain JSX <em>or</em> a function. A function unlocks two extra values:
          </p>
          <div className="flex flex-col gap-2 mb-4">
            <div className="bg-white border border-amber-200 rounded-xl px-4 py-3">
              <p className="font-mono text-sm font-bold text-amber-800 mb-1">ref</p>
              <p className="text-amber-900 text-sm leading-relaxed">
                Attach to your zone element so the framework knows <em>where</em> it is on screen.
                Without it, drops aren't detected.
              </p>
            </div>
            <div className="bg-white border border-amber-200 rounded-xl px-4 py-3">
              <p className="font-mono text-sm font-bold text-amber-800 mb-1">isOver</p>
              <p className="text-amber-900 text-sm leading-relaxed">
                <code className="font-mono bg-amber-100 px-1 rounded text-xs">true</code> while
                something hovers over this zone — use it to highlight the border, change the
                background, scale it up.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                Ex. 1 — plain children
              </p>
              <pre className="bg-slate-900 rounded-xl p-3 text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">{CODE_SIMPLE}</pre>
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-1.5">
                Ex. 2 — render prop ✓
              </p>
              <pre className="bg-slate-900 rounded-xl p-3 text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">{CODE_RENDER_PROP}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Right column: code block, fills its own height */}
      <CodeBlock code={CODE} label="Example2.jsx" />
    </div>
  );
}
