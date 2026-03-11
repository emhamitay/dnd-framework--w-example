import { useState } from "react";
import { DndProvider } from "../../src/context/DndProvider";
import { GhostLayer } from "../../src/GhostLayer";
import { Draggable } from "../../src/wrappers/Draggable";
import { Droppable } from "../../src/wrappers/Droppable";

const CODE = `// Two drop zones, completely different callbacks.
// Each zone does its own thing — fully independent.

<Droppable
  id="approve-zone"
  onDrop={(item) => approvePR(item.id)}   // calls your API
>
  ✅ Approve
</Droppable>

<Droppable
  id="reject-zone"
  onDrop={(item) => rejectPR(item.id)}    // different action
>
  ❌ Reject
</Droppable>

// The framework doesn't care what you do in onDrop.
// It just tells you what was dropped and where.`;

const PULL_REQUESTS = [
  { id: "pr-42", title: "Add dark mode", author: "alice" },
  { id: "pr-43", title: "Fix login bug", author: "bob" },
  { id: "pr-44", title: "Refactor auth", author: "carol" },
];

function Badge({ children, color }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {children}
    </span>
  );
}

function Demo() {
  const [prs, setPrs] = useState(PULL_REQUESTS);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [log, setLog] = useState([]);

  const addLog = (msg, color) =>
    setLog((l) => [{ msg, color, id: Date.now() }, ...l].slice(0, 4));

  const handleApprove = (item) => {
    const pr = prs.find((p) => p.id === item.id);
    if (!pr) return;
    setPrs((p) => p.filter((x) => x.id !== item.id));
    setApproved((a) => [...a, pr]);
    addLog(`✅ Approved "${pr.title}"`, "text-emerald-600");
  };

  const handleReject = (item) => {
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
            {(isHover, ref) => (
              <div ref={ref} className={`rounded-xl border-2 border-dashed p-3 text-center transition-all duration-150 min-h-20 flex flex-col items-center justify-center gap-1 ${
                isHover ? "border-emerald-400 bg-emerald-50 scale-105" : "border-emerald-200 bg-emerald-50/50"
              }`}>
                <span className="text-xl">✅</span>
                <span className="text-xs font-semibold text-emerald-700">Approve</span>
                {approved.length > 0 && <Badge color="bg-emerald-200 text-emerald-700">{approved.length}</Badge>}
              </div>
            )}
          </Droppable>

          <Droppable id="reject-zone" onDrop={handleReject}>
            {(isHover, ref) => (
              <div ref={ref} className={`rounded-xl border-2 border-dashed p-3 text-center transition-all duration-150 min-h-20 flex flex-col items-center justify-center gap-1 ${
                isHover ? "border-red-400 bg-red-50 scale-105" : "border-red-200 bg-red-50/50"
              }`}>
                <span className="text-xl">❌</span>
                <span className="text-xs font-semibold text-red-700">Reject</span>
                {rejected.length > 0 && <Badge color="bg-red-200 text-red-700">{rejected.length}</Badge>}
              </div>
            )}
          </Droppable>
        </div>

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

export function Example4MultiGroup({ CodeBlock }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <Demo />
      </div>
      <CodeBlock code={CODE} label="Example4.jsx" />
    </div>
  );
}
