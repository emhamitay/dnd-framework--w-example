# ⚡ Ghost Drop

A lightweight, flexible drag-and-drop library built from scratch for React.  
Free drag, droppable zones, and sortable lists — with a portal-based ghost layer that renders above everything.

[![npm](https://img.shields.io/npm/v/%40emhamitay%2Fghostdrop?color=6366f1&label=npm)](https://www.npmjs.com/package/@emhamitay/ghostdrop)
[![license](https://img.shields.io/badge/license-MIT-emerald)](LICENSE)
[![live demo](https://img.shields.io/badge/demo-live-blue)](https://emhamitay.github.io/ghostdrop)

---

## Why Ghost Drop?

Most drag-and-drop libraries render the drag preview inside the DOM tree — which means it can be clipped by `overflow: hidden` containers or buried under other elements' `z-index` values.

Ghost Drop renders the drag preview through a **React portal directly on `document.body`**. It always floats above everything, regardless of your layout. That was the original reason this library was built from scratch.

Other design decisions:
- **No native HTML5 drag events** — uses Pointer Events for full control over the drag lifecycle and **mobile support**
- **Zustand** for shared drag state — minimal, no Context re-render overhead on every mouse move
- **Dynamic callbacks** — `onDrop` and `onSorted` are read at call time, so closures always have fresh state without needing `useCallback`
- **Isolated groups** — multiple `DndProvider` trees on the same page don't interfere with each other
- **Written in TypeScript** — full type definitions included

---

## Live Demo

**[emhamitay.github.io/ghostdrop](https://emhamitay.github.io/ghostdrop)**

Interactive examples: basic drop → hover feedback → sortable list → drag into sortable → multiple independent groups → hover callbacks.

---

## Install

```bash
npm install @emhamitay/ghostdrop
```

---

## Quick Start

```tsx
import { useState } from 'react';
import type { DndItem } from '@emhamitay/ghostdrop';
import { DndProvider, GhostLayer, Draggable, Droppable } from '@emhamitay/ghostdrop';

function App() {
  const [dropped, setDropped] = useState<string | null>(null);

  return (
    <DndProvider>
      <GhostLayer />

      <Draggable id="item-1">
        <div className="card">📄 Drag me</div>
      </Draggable>

      <Droppable id="zone" onDrop={(item: DndItem) => setDropped(item.id)}>
        <div className="drop-zone">
          {dropped ? `✓ ${dropped} landed!` : 'Drop here'}
        </div>
      </Droppable>
    </DndProvider>
  );
}
```

### With hover feedback (render prop)

Pass a function as `Droppable`'s children to get `isHover` and `ref`:

```tsx
import type { DndItem } from '@emhamitay/ghostdrop';

<Droppable id="zone" onDrop={(item: DndItem) => handleDrop(item)}>
  {(isHover, ref) => (
    <div
      ref={ref}
      style={{ background: isHover ? '#dbeafe' : '#f8fafc' }}
    >
      {isHover ? 'Release!' : 'Drop here'}
    </div>
  )}
</Droppable>
```

### With hover callbacks (side-effects outside the zone)

Use `onHoverEnter` / `onHoverLeave` when you need to trigger effects *outside* the drop zone — toasts, previews, analytics:

```tsx
import { useState } from 'react';
import type { DndItem } from '@emhamitay/ghostdrop';

const [toast, setToast] = useState<string | null>(null);

<Droppable
  id="archive"
  onHoverEnter={(item: DndItem) => setToast(`Archive "${item.data.subject}"?`)}
  onHoverLeave={() => setToast(null)}
  onDrop={(item: DndItem) => { doArchive(item); setToast(null); }}
>
  <div className="zone">📦 Archive</div>
</Droppable>

{/* Toast lives outside the zone — works because it's driven by state */}
{toast && <div className="toast">{toast}</div>}
```

### Sortable list

As you drag, surrounding items slide to make space — you always see exactly where the item will land. Drop in empty space to cancel. Press **Escape** to cancel at any time.

```tsx
import { useState } from 'react';
import { DndProvider, GhostLayer, SortableDropGroup, SortableDraggable } from '@emhamitay/ghostdrop';

type Item = { id: string; label: string; index: number };

const INITIAL: Item[] = [
  { id: 'a', label: 'Alpha', index: 0 },
  { id: 'b', label: 'Beta', index: 1 },
  { id: 'c', label: 'Gamma', index: 2 },
];

function SortableList() {
  const [items, setItems] = useState(INITIAL);

  return (
    <DndProvider>
      <GhostLayer />
      {/* Items slide to make space as you drag (default). */}
      {/* Use layoutAnimation="none" to disable and get classic instant-reorder behavior. */}
      <SortableDropGroup items={items} onSorted={setItems}>
        {items.map((item) => (
          <SortableDraggable key={item.id} id={item.id}>
            <div className="row">{item.label}</div>
          </SortableDraggable>
        ))}
      </SortableDropGroup>
    </DndProvider>
  );
}
```

#### Horizontal and grid layouts

```tsx
{/* Horizontal list */}
<SortableDropGroup items={items} onSorted={setItems} direction={SORT_DIRECTION.Horizontal}>
  {items.map((item) => (
    <SortableDraggable key={item.id} id={item.id}>
      <div className="chip">{item.label}</div>
    </SortableDraggable>
  ))}
</SortableDropGroup>
```

#### Opt out of animation (classic mode)

```tsx
<SortableDropGroup items={items} onSorted={setItems} layoutAnimation="none">
  {/* items reorder instantly on drop — no shift animation */}
</SortableDropGroup>
```

---

## API

### Components

| Component | Description |
|---|---|
| `<DndProvider>` | Required root. Initializes the Zustand store. |
| `<GhostLayer />` | Renders the drag preview via a React portal on `document.body`. |
| `<Draggable id type? data?>` | Makes any element draggable. |
| `<Droppable id onDrop? onHoverEnter? onHoverLeave? children>` | Defines a drop zone. Children can be JSX or `(isHover, ref) => JSX`. |
| `<SortableDropGroup items onSorted direction? layoutAnimation? mode? indexKey?>` | A group of sortable items. Items animate to make space by default. |
| `<SortableDraggable id>` | Draggable item inside a `SortableDropGroup`. |
| `<DroppableSortableWrapper id items onSorted direction? layoutAnimation? mode? indexKey?>` | Combines `Droppable` + `SortableDropGroup` in one component. |

### `Droppable` Props

| Prop | Type | Description |
|---|---|---|
| `id` | `string` | Unique ID for this drop zone. |
| `onDrop` | `(item: DndItem) => void` | Called when an item is released over this zone. |
| `onHoverEnter` | `(item: DndItem) => void` | Called when a dragged item enters this zone. |
| `onHoverLeave` | `(item: DndItem) => void` | Called when a dragged item leaves this zone. |
| `children` | `ReactNode \| (isHover: boolean, ref) => ReactNode` | Static children or render prop for hover styling. |

### TypeScript Types

```ts
import type { DndItem } from '@emhamitay/ghostdrop';

// Passed to all callbacks
type DndItem = {
  id: string;
  type: string;
  data: Record<string, unknown>;
};
```

### Hooks (low-level)

| Hook | Returns |
|---|---|
| `useDrag({ id, type?, data? })` | `{ onPointerDown }` |
| `useDrop({ id, onDrop?, onHoverEnter?, onHoverLeave? })` | `{ dropRef, isHover }` |
| `useSortable({ id, direction? })` | `{ ref, isHover, isActive }` |
| `useSortableDrop({ items, onSorted, indexKey?, mode? })` | `sortId: string` |

### Enums

```ts
import { SORT_MODE, SORT_DIRECTION } from '@emhamitay/ghostdrop';

SORT_MODE.Switch   // swap positions
SORT_MODE.Insert   // shift items (default)

SORT_DIRECTION.Vertical    // default
SORT_DIRECTION.Horizontal
SORT_DIRECTION.Grid

LAYOUT_ANIMATION.Shift  // items slide to make space (default)
LAYOUT_ANIMATION.None   // instant reorder, no animation
```

---

## Architecture

```
DndProvider
└── DndStore (Zustand)           ← single source of truth for drag state
    ├── activeItem               ← what's being dragged (id, type, data, element)
    ├── hoverId                  ← which drop zone the cursor is over
    └── mouseUpHandlers          ← registered per drop zone, fired on release

GhostLayer
└── React portal → document.body ← renders above ALL DOM stacking contexts

Draggable / useDrag
└── pointerdown → startDrag()
└── pointermove → updates pointer position in store
└── pointerup   → fires registered drop handlers → endDrag()

Droppable / useDrop
└── pointerenter → updateHover(id) → fires onHoverEnter
└── pointerleave → updateHover(null) → fires onHoverLeave
└── registers pointerup handler → calls onDrop if cursor is inside zone

SortableDropGroup / SortableDraggable
└── tracks insertion index during drag
└── animates surrounding items via CSS transform (shift mode)
└── calls onSorted(newArray) on drop
└── dropping in empty space cancels the sort (hoverId cleared on leave)
```

The key design: **drop detection happens at the `Droppable` level, not at the `Draggable` level**. Each drop zone registers its own handler into a central store. When the user releases, only the handler for the zone under the cursor fires. This makes cross-group interactions and dynamic callbacks straightforward.

---

## License

MIT © [emhamitay](https://github.com/emhamitay)
