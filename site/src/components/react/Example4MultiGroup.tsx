import { useState } from "react";
import * as React from "react";
import { DndProvider } from "@lib/context/DndProvider";
import { GhostLayer } from "@lib/GhostLayer";
import { Draggable } from "@lib/wrappers/Draggable";
import { Droppable } from "@lib/wrappers/Droppable";

const CODE = `import type { DndItem } from '@emhamitay/ghostdrop';
import { DndProvider, GhostLayer, Draggable, Droppable } from '@emhamitay/ghostdrop';

// Two completely independent drop zones.
// Each has its own callback — the framework doesn't care what you do in onDrop.

<Droppable
  id="approve-zone"
  onDrop={(item: DndItem) => approvePR(item.id)}
>
  ✅ Approve
</Droppable>

<Droppable
  id="reject-zone"
  onDrop={(item: DndItem) => rejectPR(item.id)}
>
  ❌ Reject
</Droppable>`;

const PULL_REQUESTS = [
  { id: "pr-42", title: "Add dark mode", author: "alice" },
  { id: "pr-43", title: "Fix login bug", author: "bob" },
  { id: "pr-44", title: "Refactor auth", author: "carol" },
];

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {children}
    </span>
  );
}

function Demo() {
  const [prs, setPrs] = useState(PULL_REQUESTS);
  const [approved, setApproved] = useState<typeof PULL_REQUESTS>([]);
  const [rejected, setRejected] = useState<typeof PULL_REQUESTS>([]);
  const [log, setLog] = useState<{ msg: string; color: string; id: number }[]>([]);

  const reset = () => { setPrs(PULL_REQUESTS); setApproved([]); setRejected([]); setLog([]); };

  const addLog = (msg: string, color: string) =>
    setLog((l) => [{ msg, color, id: Date.now() }, ...l].slice(0, 4));

  const handleApprove = (item: { id: string }) => {
    const pr = prs.find((p) => p.id === item.id);
    if (!pr) return;
    setPrs((p) => p.filter((x) => x.id !== item.id));
    setApproved((a) => [...a, pr]);
    addLog(`✅ Approved "${pr.title}"`, "text-emerald-600");
  };

  const handleReject = (item: { id: string }) => {
    const pr = prs.find((p) => p.id === item.id);
    if (!pr) return;
    setPrs((p) => p.filter((x) => x.id !== item.id));
    setRejected((r) => [...r, pr]);
    addLog(`❌ Rejected "${pr.title}"`, "text-red-600");
  };

  return (
    <DndProvider>
      <GhostLayer />
      <div className="py-2 space-y-4">
        {/* PRs to review */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Pull Requests</p>
          <div className="flex flex-col gap-2 min-h-8">
            {prs.length === 0
              ? <p className="text-xs text-slate-400 italic">All reviewed!</p>
              : prs.map((pr) => (
                <Draggable key={pr.id} id={pr.id}>
                  <div className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 shadow-sm select-none cursor-grab hover:shadow-md transition-shadow flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{pr.title}</p>
                      <p className="text-xs text-slate-400">by {pr.author}</p>
                    </div>
                    <Badge color="bg-blue-100 text-blue-600">{pr.id}</Badge>
                  </div>
                </Draggable>
              ))}
          </div>
        </div>

        {/* Two drop zones */}
        <div className="grid grid-cols-2 gap-3">
          <Droppable id="approve-zone" onDrop={handleApprove}>
            <div className="rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-3 text-center min-h-20 flex flex-col items-center justify-center gap-1">
              <span className="text-xl">✅</span>
              <span className="text-xs font-semibold text-emerald-700">Approve</span>
              {approved.length > 0 && <Badge color="bg-emerald-200 text-emerald-700">{approved.length}</Badge>}
            </div>
          </Droppable>

          <Droppable id="reject-zone" onDrop={handleReject}>
            <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50/50 p-3 text-center min-h-20 flex flex-col items-center justify-center gap-1">
              <span className="text-xl">❌</span>
              <span className="text-xs font-semibold text-red-700">Reject</span>
              {rejected.length > 0 && <Badge color="bg-red-200 text-red-700">{rejected.length}</Badge>}
            </div>
          </Droppable>
        </div>

        {(approved.length > 0 || rejected.length > 0) && (
          <div className="flex justify-end">
            <button
              onClick={reset}
              className="text-xs text-slate-400 hover:text-slate-700 border border-slate-200 hover:border-slate-400 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              ↺ Reset
            </button>
          </div>
        )}

        {/* Callback log */}
        {log.length > 0 && (
          <div className="bg-slate-950 rounded-xl p-3 font-mono space-y-1">
            {log.map((entry) => (
              <p key={entry.id} className={`text-xs ${entry.color}`}>
                onDrop called → {entry.msg}
              </p>
            ))}
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export function Example4MultiGroup({ CodeBlock }: { CodeBlock: (props: { code: string; label: string }) => React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 items-start">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <Demo />
      </div>
      <CodeBlock code={CODE} label="Example4.tsx" />
    </div>
  );
}
