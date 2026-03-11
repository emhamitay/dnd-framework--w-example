import { useState } from "react";
import { DndProvider } from "../../src/context/DndProvider";
import { GhostLayer } from "../../src/GhostLayer";
import { Draggable } from "../../src/wrappers/Draggable";
import { DroppableSortableWrapper } from "../../src/wrappers/DroppableSortableWrapper";
import { SortableDraggable } from "../../src/wrappers/SortableDraggable";

const CODE = `// Mix Droppable + Sortable in one component:
// DroppableSortableWrapper handles both.
// Items inside can be reordered AND new items
// can be dropped in from outside.

<DroppableSortableWrapper
  items={teamItems}
  onSorted={setTeamItems}
  onDrop={(item) => addToTeam(item.id)}
>
  {({ isHover }) => (
    <div className={isHover ? "column column--over" : "column"}>
      {teamItems.map((m) => (
        <SortableDraggable key={m.id} id={m.id}>
          <div className="card">{m.name}</div>
        </SortableDraggable>
      ))}
    </div>
  )}
</DroppableSortableWrapper>`;

const BENCH = [
  { id: "p1", name: "Alice", role: "Frontend" },
  { id: "p2", name: "Bob", role: "Backend" },
  { id: "p3", name: "Carol", role: "Design" },
];

const INITIAL_TEAM = [
  { id: "p4", name: "Dan", role: "Lead", index: 0 },
];

const ROLE_COLOR = {
  Frontend: "bg-blue-100 text-blue-700",
  Backend:  "bg-purple-100 text-purple-700",
  Design:   "bg-pink-100 text-pink-700",
  Lead:     "bg-amber-100 text-amber-700",
};

function PersonCard({ person, draggable = false }) {
  const card = (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 shadow-sm select-none flex items-center gap-3 hover:shadow-md transition-shadow">
      <span className="text-lg">👤</span>
      <div>
        <p className="text-sm font-semibold text-slate-800">{person.name}</p>
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${ROLE_COLOR[person.role] ?? "bg-slate-100 text-slate-600"}`}>
          {person.role}
        </span>
      </div>
    </div>
  );

  return draggable
    ? <Draggable id={person.id}>{card}</Draggable>
    : card;
}

function Demo() {
  const [bench, setBench] = useState(BENCH);
  const [team, setTeam] = useState(INITIAL_TEAM);

  const addToTeam = (personId) => {
    const person = bench.find((p) => p.id === personId);
    if (!person || team.some((t) => t.id === personId)) return;
    setBench((b) => b.filter((p) => p.id !== personId));
    setTeam((t) => [...t, { ...person, index: t.length }]);
  };

  return (
    <DndProvider>
      <GhostLayer />
      <div className="flex flex-col sm:flex-row gap-6 py-2">
        {/* Bench */}
        <div className="flex-shrink-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Available</p>
          <div className="flex flex-col gap-2 min-h-12">
            {bench.length === 0
              ? <p className="text-xs text-slate-400 italic">Everyone's on the team!</p>
              : bench.map((p) => <PersonCard key={p.id} person={p} draggable />)}
          </div>
        </div>

        {/* Sortable team drop zone */}
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Team</p>
          <DroppableSortableWrapper
            items={team}
            onSorted={setTeam}
            onDrop={(item) => addToTeam(item.id)}
          >
            {({ isHover }) => (
              <div className={`flex flex-col gap-2 min-h-24 rounded-xl border-2 border-dashed p-3 transition-all duration-150 ${
                isHover ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-slate-50"
              }`}>
                {team.map((p) => (
                  <SortableDraggable key={p.id} id={p.id}>
                    <PersonCard person={p} />
                  </SortableDraggable>
                ))}
                {team.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">Drop people here</p>
                )}
              </div>
            )}
          </DroppableSortableWrapper>
          <p className="text-xs text-slate-400 mt-2">↕ Reorder within team too</p>
        </div>
      </div>
    </DndProvider>
  );
}

export function Example3Mixed({ CodeBlock }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <Demo />
      </div>
      <CodeBlock code={CODE} label="Example3.jsx" />
    </div>
  );
}
