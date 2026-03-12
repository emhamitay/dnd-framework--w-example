function ConceptCard({ icon, title, children }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-bold text-slate-900 text-base font-mono">{title}</h3>
      </div>
      <div className="text-slate-600 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function Callout({ children }) {
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-4 text-sm text-indigo-900 leading-relaxed">
      {children}
    </div>
  );
}

function Code({ children }) {
  return (
    <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">
      {children}
    </code>
  );
}

function FlowDiagram() {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 text-sm font-mono">
      <p className="text-slate-400 text-xs mb-5 uppercase tracking-widest">The flow</p>
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 flex-wrap justify-center">
        <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-center min-w-32">
          <p className="text-xs text-indigo-200 mb-0.5">user drags</p>
          <p className="font-bold">&lt;Draggable id="x"&gt;</p>
        </div>
        <div className="text-slate-500 text-lg sm:mx-3">→</div>
        <div className="bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-center min-w-32">
          <p className="text-xs text-slate-400 mb-0.5">framework tracks it</p>
          <p className="font-bold">ghost follows cursor</p>
        </div>
        <div className="text-slate-500 text-lg sm:mx-3">→</div>
        <div className="bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-center min-w-32">
          <p className="text-xs text-emerald-200 mb-0.5">user releases over</p>
          <p className="font-bold">&lt;Droppable id="zone"&gt;</p>
        </div>
        <div className="text-slate-500 text-lg sm:mx-3">→</div>
        <div className="bg-amber-600 text-white px-4 py-2.5 rounded-xl text-center min-w-32">
          <p className="text-xs text-amber-200 mb-0.5">your callback fires</p>
          <p className="font-bold">onDrop({"{ id: 'x' }"})</p>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">How it works</h2>
        <p className="text-slate-500 text-center mb-14 text-lg max-w-xl mx-auto">
          Three concepts. Once you get these, everything else follows naturally.
        </p>

        {/* Flow diagram */}
        <div className="mb-12">
          <FlowDiagram />
        </div>

        {/* Core concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">

          <ConceptCard icon="✋" title="<Draggable>">
            <p>
              A wrapper around <strong className="text-slate-800">whatever you want to drag</strong> — a card, a row, an image, anything.
              The only thing you must give it is an <Code>id</Code>. That id is what comes back to you
              when it lands somewhere, so you know which item was moved.
            </p>
            <p className="text-slate-400 italic">
              The framework doesn't know what your data is. It just hands your id back to you and lets you decide what to do.
            </p>
          </ConceptCard>

          <ConceptCard icon="📥" title="<Droppable>">
            <p>
              Marks an area on the page as a valid <strong className="text-slate-800">landing zone</strong>.
              When the user releases a draggable over it, <Code>onDrop(item)</Code> fires — and <Code>item</Code> is:
            </p>
            <div className="bg-slate-100 rounded-lg px-3 py-2 font-mono text-xs text-slate-700 mt-1">
              {"{ id: 'your-id', type: 'default', data: anything }"}
            </div>
            <p className="mt-2">
              <Code>id</Code> — what was dropped.{" "}
              <Code>type</Code> — optional label you set on Draggable to filter drops.{" "}
              <Code>data</Code> — any extra info you attached.
            </p>
          </ConceptCard>

          <ConceptCard icon="👻" title="<GhostLayer>">
            <p>
              Completely <strong className="text-slate-800">optional</strong>. Renders a visual copy of the dragged
              element that follows the cursor while dragging.
            </p>
            <p>
              It uses a React portal to render at the top of the page — so it never gets clipped by
              <Code>overflow: hidden</Code>, never loses to <Code>z-index</Code> wars.
              That was actually the main reason this framework was built from scratch.
            </p>
            <p className="text-slate-400 italic">
              Don't like it? Skip it. Build your own. The drag-and-drop still works without it.
            </p>
          </ConceptCard>

          <ConceptCard icon="↕️" title="<SortableDropGroup> + <SortableDraggable>">
            <p>
              A group of items that can <strong className="text-slate-800">reorder themselves</strong> when you drag one
              over another. Think reorderable lists, kanban columns, priority queues.
            </p>
            <p>
              You give it your <Code>items</Code> array (your current order) and an <Code>onSorted</Code> callback.
              When the user finishes dragging, <Code>onSorted</Code> gives you back the same array in the new order — you just set your state.
            </p>
            <div className="bg-slate-100 rounded-lg px-3 py-2 font-mono text-xs text-slate-700">
              {"onSorted={(newItems) => setItems(newItems)}"}
            </div>
          </ConceptCard>
        </div>

        {/* DroppableSortableWrapper */}
        <Callout>
          <strong>What about <code className="bg-indigo-100 px-1.5 py-0.5 rounded text-xs font-mono">&lt;DroppableSortableWrapper&gt;</code>?</strong>{" "}
          It's just Droppable + SortableDropGroup combined into one component — for when you want a zone that
          accepts drops from outside <em>and</em> lets items inside reorder. Instead of composing two components,
          you use one. Same props, same concepts.
        </Callout>
      </div>
    </section>
  );
}
