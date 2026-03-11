function PropTable({ rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left px-4 py-2.5 font-semibold text-slate-700 w-32">Prop</th>
            <th className="text-left px-4 py-2.5 font-semibold text-slate-700 w-40">Type</th>
            <th className="text-left px-4 py-2.5 font-semibold text-slate-700">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
              <td className="px-4 py-2.5 font-mono text-indigo-600 font-semibold align-top text-xs">{row.prop}</td>
              <td className="px-4 py-2.5 font-mono text-slate-500 align-top text-xs">{row.type}</td>
              <td className="px-4 py-2.5 text-slate-600 align-top leading-relaxed">{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ id, title, badge, children }) {
  return (
    <div id={id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        {badge && (
          <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InlineCode({ children }) {
  return <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>;
}

const API_SECTIONS = [
  {
    id: "api-dnd-provider",
    title: "DndProvider",
    badge: "Required",
    desc: "Wrap your app (or the DnD area) with this. Sets up required DOM styles. No props needed.",
    props: [],
    note: "Place GhostLayer directly inside DndProvider, ideally at the root level.",
  },
  {
    id: "api-ghost-layer",
    title: "GhostLayer",
    badge: "Optional",
    desc: "Renders a clone of the dragged element that follows the cursor. Uses a React portal to render at body level, avoiding z-index and overflow issues. Completely optional — build your own if needed.",
    props: [],
    note: null,
  },
  {
    id: "api-draggable",
    title: "Draggable",
    badge: "Component",
    desc: "Makes any element draggable. Clones the child element and attaches drag behavior.",
    props: [
      { prop: "id", type: "string", desc: "Unique ID for this draggable item. Passed to onDrop callbacks." },
      { prop: "type", type: "string?", desc: 'Optional type identifier (default: "default"). Useful for filtering in drop callbacks.' },
      { prop: "data", type: "any?", desc: "Optional metadata attached to the drag item. Available in onDrop as item.data." },
      { prop: "children", type: "ReactElement", desc: "The element to make draggable. Must be a single React element." },
      { prop: "className", type: "string?", desc: "Extra classes merged onto the child element." },
    ],
    note: null,
  },
  {
    id: "api-droppable",
    title: "Droppable",
    badge: "Component",
    desc: "Defines a drop zone. Calls onDrop when an item is released over it. Supports render props for access to isHover state.",
    props: [
      { prop: "id", type: "string", desc: "Unique ID for this drop zone." },
      { prop: "onDrop", type: "(item) => void?", desc: "Called when an item is dropped. item = { id, data }." },
      { prop: "onHoverEnter", type: "(item) => void?", desc: "Called when a dragged item enters this zone. Use instead of (or alongside) isHover for side-effects like toasts or previews." },
      { prop: "onHoverLeave", type: "(item) => void?", desc: "Called when a dragged item leaves this zone." },
      {
        prop: "children",
        type: "node | (isHover, ref) => node",
        desc: "Static children, or a render function receiving isHover (boolean) and ref (attach to your drop element).",
      },
      { prop: "className", type: "string?", desc: "CSS classes for the wrapper div (only when children is static, not a render function)." },
    ],
    note: "item object: { id: string, data: Record<string, unknown> }",
  },
  {
    id: "api-sortable-drop-group",
    title: "SortableDropGroup",
    badge: "Component",
    desc: "Wraps a list of sortable items. Handles reordering logic and provides sort context to children. Use alongside SortableDraggable.",
    props: [
      { prop: "items", type: "object[]", desc: "Array of items to sort. Each must have a unique id property." },
      { prop: "onSorted", type: "(newItems) => void", desc: "Called with the reordered array after a sort completes." },
      { prop: "indexKey", type: "string?", desc: 'Property name used for sort order. Default: "index". Change if your items use a different field.' },
      { prop: "mode", type: "SORT_MODE?", desc: "Insert (default): shift items into position. Switch: swap dragged with hovered." },
      { prop: "children", type: "ReactNode", desc: "Should contain SortableDraggable components." },
      { prop: "className", type: "string?", desc: "CSS classes for the wrapper div." },
    ],
    note: null,
  },
  {
    id: "api-sortable-draggable",
    title: "SortableDraggable",
    badge: "Component",
    desc: "A draggable item that is aware of its sort group. Must be inside a SortableDropGroup (or DroppableSortableWrapper). Supports render props for full control.",
    props: [
      { prop: "id", type: "string", desc: "Unique ID matching the item in the SortableDropGroup items array." },
      { prop: "direction", type: "SORT_DIRECTION?", desc: "Layout direction for sorting. Vertical (default), Horizontal, or Grid." },
      { prop: "onHoverEnter", type: "(item) => void?", desc: "Called when a dragged item enters this sortable item." },
      { prop: "onHoverLeave", type: "(item) => void?", desc: "Called when a dragged item leaves this sortable item." },
      { prop: "children", type: "node | (renderProps) => node", desc: "Static children get automatic grab cursor + opacity. Render function receives { ref, isHover, isActive, onMouseDown }." },
      { prop: "className", type: "string?", desc: "CSS classes (when children is static)." },
    ],
    note: null,
  },
  {
    id: "api-droppable-sortable-wrapper",
    title: "DroppableSortableWrapper",
    badge: "Component",
    desc: "Combines Droppable + SortableDropGroup into one component. Use when you want a zone that accepts drops from outside AND allows internal reordering.",
    props: [
      { prop: "id", type: "string?", desc: "Drop zone ID (for external drops)." },
      { prop: "items", type: "object[]", desc: "Items to sort." },
      { prop: "onSorted", type: "(newItems) => void", desc: "Called when internal sort completes." },
      { prop: "onDrop", type: "(item) => void?", desc: "Called when an external item is dropped in." },
      { prop: "onHoverEnter", type: "(item) => void?", desc: "Called when a dragged item enters this zone." },
      { prop: "onHoverLeave", type: "(item) => void?", desc: "Called when a dragged item leaves this zone." },
      {
        prop: "children",
        type: "node | ({ isHover }) => node",
        desc: "Render function receives isHover. Use it to style the drop zone on hover.",
      },
      { prop: "indexKey", type: "string?", desc: 'Sort order key. Default: "index".' },
      { prop: "mode", type: "SORT_MODE?", desc: "Insert or Switch." },
      { prop: "className", type: "string?", desc: "CSS classes for the outer wrapper." },
    ],
    note: null,
  },
];

const ENUMS = [
  {
    id: "api-sort-mode",
    title: "SORT_MODE",
    values: [
      { name: "SORT_MODE.Insert", desc: "Default. Inserts the dragged item at the new position, shifting others." },
      { name: "SORT_MODE.Switch", desc: "Swaps the dragged item directly with the hovered item." },
    ],
  },
  {
    id: "api-sort-direction",
    title: "SORT_DIRECTION",
    values: [
      { name: "SORT_DIRECTION.Vertical", desc: "Default. Detects up/down movement for vertical lists." },
      { name: "SORT_DIRECTION.Horizontal", desc: "Detects left/right movement for horizontal lists." },
      { name: "SORT_DIRECTION.Grid", desc: "Detects both axes for grid layouts." },
    ],
  },
];

const HOOKS = [
  {
    id: "api-use-drag",
    title: "useDrag",
    desc: "The underlying primitive for drag behavior.",
    signature: "useDrag({ id, sortId?, type?, data? })",
    returns: "{ onMouseDown }",
    note: "Prefer using Draggable or SortableDraggable unless you need custom drag behavior.",
  },
  {
    id: "api-use-drop",
    title: "useDrop",
    desc: "The underlying primitive for drop zone detection.",
    signature: "useDrop({ id, onDrop?, onHoverEnter?, onHoverLeave? })",
    returns: "{ dropRef, isHover }",
    note: "Prefer using Droppable unless you need low-level access.",
  },
  {
    id: "api-use-sortable",
    title: "useSortable",
    desc: "Tracks hover state and position for a sortable item.",
    signature: "useSortable({ id, direction? })",
    returns: "{ ref, isHover, isActive }",
    note: null,
  },
  {
    id: "api-use-sortable-drop",
    title: "useSortableDrop",
    desc: "Registers a sortable group and handles sort completion.",
    signature: "useSortableDrop({ items, onSorted, indexKey?, mode? })",
    returns: "sortId (string)",
    note: null,
  },
];

export function ApiDocs() {
  return (
    <section id="api" className="bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">API Reference</h2>
        <p className="text-slate-500 text-center mb-16 text-lg">
          All components, props, hooks, and enums.
        </p>

        {/* Nav */}
        <div className="flex flex-wrap gap-2 mb-14 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          {API_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-sm text-indigo-600 hover:text-indigo-800 font-mono font-semibold hover:underline">
              {s.title}
            </a>
          ))}
          {ENUMS.map((e) => (
            <a key={e.id} href={`#${e.id}`} className="text-sm text-indigo-600 hover:text-indigo-800 font-mono font-semibold hover:underline">
              {e.title}
            </a>
          ))}
          {HOOKS.map((h) => (
            <a key={h.id} href={`#${h.id}`} className="text-sm text-indigo-600 hover:text-indigo-800 font-mono font-semibold hover:underline">
              {h.title}
            </a>
          ))}
        </div>

        <div className="space-y-14">
          {/* Components */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-100 pb-3">Components</h3>
            <div className="space-y-12">
              {API_SECTIONS.map((s) => (
                <Section key={s.id} id={s.id} title={s.title} badge={s.badge}>
                  <p className="text-slate-600 leading-relaxed">{s.desc}</p>
                  {s.props.length > 0 && <PropTable rows={s.props} />}
                  {s.note && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                      <strong>Note:</strong> {s.note}
                    </div>
                  )}
                </Section>
              ))}
            </div>
          </div>

          {/* Enums */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-100 pb-3">Enums</h3>
            <div className="space-y-10">
              {ENUMS.map((e) => (
                <Section key={e.id} id={e.id} title={e.title} badge="Enum">
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left px-4 py-2.5 font-semibold text-slate-700 w-56">Value</th>
                          <th className="text-left px-4 py-2.5 font-semibold text-slate-700">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {e.values.map((v, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                            <td className="px-4 py-2.5 font-mono text-indigo-600 font-semibold text-xs align-top">{v.name}</td>
                            <td className="px-4 py-2.5 text-slate-600 align-top leading-relaxed">{v.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Section>
              ))}
            </div>
          </div>

          {/* Hooks */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-100 pb-3">Hooks (low-level)</h3>
            <p className="text-slate-500 text-sm mb-8">
              These are the primitives the components are built on. Use them only when you need custom behavior that the components don't support.
            </p>
            <div className="space-y-8">
              {HOOKS.map((h) => (
                <Section key={h.id} id={h.id} title={h.title} badge="Hook">
                  <p className="text-slate-600 leading-relaxed">{h.desc}</p>
                  <div className="bg-slate-50 rounded-xl px-4 py-3 flex flex-col sm:flex-row gap-4 text-sm">
                    <div>
                      <span className="text-xs font-bold uppercase text-slate-400 tracking-wide">Signature</span>
                      <p className="font-mono text-slate-700 mt-1">{h.signature}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase text-slate-400 tracking-wide">Returns</span>
                      <p className="font-mono text-slate-700 mt-1">{h.returns}</p>
                    </div>
                  </div>
                  {h.note && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
                      {h.note}
                    </div>
                  )}
                </Section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
