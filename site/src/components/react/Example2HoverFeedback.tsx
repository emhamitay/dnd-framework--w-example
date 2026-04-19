import { useState } from "react";
import type { ReactNode, RefObject } from "react";
import { DndProvider } from "@lib/context/DndProvider";
import { GhostLayer } from "@lib/GhostLayer";
import { Draggable } from "@lib/wrappers/Draggable";
import { Droppable } from "@lib/wrappers/Droppable";
import type { DndItem } from "@lib/types";

const CODE_A = `// inside <DndProvider>
<Droppable id="inbox" onDrop={(item: DndItem) => console.log(item.id)}>
  {(isHover, ref) => (
    <div ref={ref} className={isHover ? 'zone zone--active' : 'zone'}>
      {isHover ? '🎯 Release to drop!' : '📥 Inbox'}
    </div>
  )}
</Droppable>`;

const CODE_B = `// inside <DndProvider>
const [preview, setPreview] = useState<string | null>(null);

<Droppable
  id="archive"
  onHoverEnter={(item: DndItem) => setPreview(\`Archive "\${item.id}"?\`)}
  onHoverLeave={() => setPreview(null)}
  onDrop={() => setPreview(null)}
>
  <div className="zone">📦 Archive</div>
</Droppable>

{/* Toast lives outside the zone — only doable with callbacks */}
{preview && <div className="toast">{preview}</div>}`;


function Demo() {
  const [droppedInbox, setDroppedInbox] = useState<string | null>(null);
  const [droppedArchive, setDroppedArchive] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const files = [
    { id: "report.pdf", icon: "📄" },
    { id: "photo.png", icon: "🖼️" },
    { id: "notes.txt", icon: "📝" },
  ];
  const available = files.filter(f => f.id !== droppedInbox && f.id !== droppedArchive);

  return (
    <DndProvider>
      <GhostLayer />
      <div className="flex flex-col gap-4 py-2">
        {/* Files */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Files — drag to either zone</p>
          <div className="flex gap-2 flex-wrap min-h-9">
            {available.map((f) => (
              <Draggable key={f.id} id={f.id}>
                <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 shadow-sm cursor-grab hover:shadow-md transition-all select-none flex items-center gap-1.5">
                  {f.icon} {f.id}
                </div>
              </Draggable>
            ))}
            {available.length === 0 && (
              <button onClick={() => { setDroppedInbox(null); setDroppedArchive(null); }} className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer">
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Two zones side by side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Zone A: isHover render prop */}
          <div>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1.5">A · isHover (render prop)</p>
            <Droppable id="inbox-hover" onDrop={(item: DndItem) => setDroppedInbox(item.id)}>
              {(isHover: boolean, ref: RefObject<HTMLElement | null>) => (
                <div
                  ref={ref as RefObject<HTMLDivElement>}
                  className={`min-h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all duration-150 text-center px-2 ${
                    isHover ? "border-blue-400 bg-blue-50 scale-105" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <span className="text-lg">📥</span>
                  <span className={`text-xs font-medium ${ isHover ? "text-blue-600" : "text-slate-400"}`}>
                    {droppedInbox ? droppedInbox : isHover ? "Release!" : "Inbox"}
                  </span>
                </div>
              )}
            </Droppable>
          </div>

          {/* Zone B: onHoverEnter/Leave */}
          <div>
            <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1.5">B · onHoverEnter/Leave</p>
            <Droppable
              id="archive-callbacks"
              onHoverEnter={(item: DndItem) => setPreview(`Archive "${item.id}"?`)}
              onHoverLeave={() => setPreview(null)}
              onDrop={(item: DndItem) => { setDroppedArchive(item.id); setPreview(null); }}
            >
              <div className="min-h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1 text-center px-2">
                <span className="text-lg">📦</span>
                <span className="text-xs font-medium text-slate-400">
                  {droppedArchive ? droppedArchive : "Archive"}
                </span>
              </div>
            </Droppable>
          </div>
        </div>

        {/* Preview toast — lives outside the drop zone, only possible with callbacks */}
        <div className={`transition-all duration-200 rounded-xl px-4 py-2.5 text-sm font-medium ${
          preview
            ? "bg-violet-50 border border-violet-200 text-violet-700 opacity-100 h-auto"
            : "opacity-0 h-0 py-0 overflow-hidden pointer-events-none"
        }`}>
          {preview ?? "\u200b"}
        </div>
      </div>
    </DndProvider>
  );
}

export function Example2HoverFeedback({ CodeBlock }: { CodeBlock: (props: { code: string; label: string }) => ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 items-start">

      {/* Left column: demo + explainer stacked */}
      <div className="flex flex-col gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <Demo />
        </div>

        {/* Explainer lives right below the demo it describes */}
        <div className="border border-amber-300 bg-amber-50 rounded-2xl p-5">
          <p className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            <span>💡</span> Two ways to react to hover
          </p>
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-amber-200 rounded-xl px-4 py-3">
              <p className="font-mono text-sm font-bold text-blue-600 mb-1">isHover render prop</p>
              <p className="text-amber-900 text-sm leading-relaxed">
                Pass a function as children — receives <code className="font-mono bg-amber-100 px-1 rounded text-xs">isHover</code> and <code className="font-mono bg-amber-100 px-1 rounded text-xs">ref</code>.
                Best for inline styling: borders, backgrounds, scale.
              </p>
            </div>
            <div className="bg-white border border-amber-200 rounded-xl px-4 py-3">
              <p className="font-mono text-sm font-bold text-violet-600 mb-1">onHoverEnter / onHoverLeave</p>
              <p className="text-amber-900 text-sm leading-relaxed">
                Callbacks fired when a dragged item enters or leaves this zone. Best for side-effects
                <em> outside</em> the zone: toasts, previews, logging.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right column: two focused snippets */}
      <div className="flex flex-col gap-4">
        <CodeBlock code={CODE_A} label="A · isHover render prop" />
        <CodeBlock code={CODE_B} label="B · onHoverEnter / onHoverLeave" />
      </div>
    </div>
  );
}
