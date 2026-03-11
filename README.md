# ⚡ Ghost Drop

A lightweight, flexible drag-and-drop library built from scratch for React.  
Free drag, droppable zones, and sortable lists — with a portal-based ghost layer that renders above everything.

[![npm](https://img.shields.io/npm/v/ghostdrop?color=6366f1&label=npm)](https://www.npmjs.com/package/ghostdrop)
[![license](https://img.shields.io/badge/license-MIT-emerald)](LICENSE)
[![live demo](https://img.shields.io/badge/demo-live-blue)](https://emhamitay.github.io/ghostdrop)

---

## Why Ghost Drop?

Most drag-and-drop libraries render the drag preview inside the DOM tree — which means it can be clipped by `overflow: hidden` containers or buried under other elements' `z-index` values.

Ghost Drop renders the drag preview through a **React portal directly on `document.body`**. It always floats above everything, regardless of your layout. That was the original reason this library was built from scratch.

Other design decisions:
- **No native HTML5 drag events** — uses `mousedown` / `mousemove` / `mouseup` for full control over the drag lifecycle
- **Zustand** for shared drag state — minimal, no Context re-render overhead on every mouse move
- **Dynamic callbacks** — `onDrop` and `onSorted` are read at call time, so closures always have fresh state without needing `useCallback`
- **Isolated groups** — multiple `DndProvider` trees on the same page don't interfere with each other

---

## Live Demo

**[emhamitay.github.io/ghostdrop](https://emhamitay.github.io/ghostdrop)**

Interactive examples: basic drop → hover feedback → sortable list → drag into sortable → multiple independent groups.

---

## Install

```bash
npm install ghostdrop
```

---

## Quick Start

```jsx
import { DndProvider, GhostLayer, Draggable, Droppable } from 'ghostdrop';

function App() {
  const [dropped, setDropped] = useState(null);

  return (
    <DndProvider>
      <GhostLayer />

      <Draggable id="item-1">
        <div className="card">📄 Drag me</div>
      </Draggable>

      <Droppable id="zone" onDrop={(item) => setDropped(item.id)}>
        <div className="drop-zone">
          {dropped ? `✓ ${dropped} landed!` : 'Drop here'}
        </div>
      </Droppable>
    </DndProvider>
  );
}
```

### With hover feedback

Pass a function as `Droppable`'s children to get `isOver` and `ref`:

```jsx
<Droppable id="zone" onDrop={handleDrop}>
  {(isOver, ref) => (
    <div
      ref={ref}
      style={{ background: isOver ? '#dbeafe' : '#f8fafc' }}
    >
      {isOver ? 'Release!' : 'Drop here'}
    </div>
  )}
</Droppable>
```

### Sortable list

```jsx
import { DndProvider, GhostLayer, SortableDropGroup, SortableDraggable } from 'ghostdrop';

const INITIAL = [
  { id: 'a', label: 'Alpha', index: 0 },
  { id: 'b', label: 'Beta', index: 1 },
  { id: 'c', label: 'Gamma', index: 2 },
];

function SortableList() {
  const [items, setItems] = useState(INITIAL);

  return (
    <DndProvider>
      <GhostLayer />
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

---

## API

### Components

| Component | Description |
|---|---|
| `<DndProvider>` | Required root. Initializes the Zustand store. |
| `<GhostLayer />` | Renders the drag preview via a React portal on `document.body`. |
| `<Draggable id type? data?>` | Makes any element draggable. |
| `<Droppable id onDrop children>` | Defines a drop zone. Children can be JSX or `(isOver, ref) => JSX`. |
| `<SortableDropGroup items onSorted mode? indexKey?>` | A group of sortable items. |
| `<SortableDraggable id>` | Draggable item inside a `SortableDropGroup`. |
| `<DroppableSortableWrapper>` | Combines `Droppable` + `SortableDropGroup` in one component. |

### Hooks (for custom implementations)

| Hook | Returns |
|---|---|
| `useDrag({ id, type?, data? })` | `{ onMouseDown }` |
| `useDrop({ id, onDrop })` | `{ dropRef, isOver }` |
| `useSortable({ id, direction? })` | `{ ref, isOver, isActive }` |
| `useSortableDrop({ items, onSorted, indexKey?, mode? })` | `sortId` (string) |

### Enums

```js
import { SORT_MODE, SORT_DIRECTION } from 'ghostdrop';

SORT_MODE.Switch   // swap positions
SORT_MODE.Insert   // shift items (default)

SORT_DIRECTION.Vertical    // default
SORT_DIRECTION.Horizontal
SORT_DIRECTION.Grid
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
└── mousedown → startDrag()
└── mousemove → updates pointer position in store
└── mouseup   → fires registered drop handlers → endDrag()

Droppable / useDrop
└── pointerenter → updateHover(id)
└── pointerleave → updateHover(null)
└── registers mouseup handler → calls onDrop if cursor is inside zone

SortableDropGroup / SortableDraggable
└── tracks insertion index during drag
└── calls onSorted(newArray) on drop
```

The key design: **drop detection happens at the `Droppable` level, not at the `Draggable` level**. Each drop zone registers its own mouseup handler into a central store. When the user releases, only the handler for the zone under the cursor fires. This makes cross-group interactions and dynamic callbacks straightforward.

---

## Roadmap

- [ ] Touch / mobile support
- [ ] TypeScript types
- [ ] `onHover(item)` callback — fires while a specific item is over a zone
- [ ] Keyboard accessibility

---

## License

MIT © [emhamitay](https://github.com/emhamitay)

### 4. Define a Drop Zone

Use `Droppable` to allow drops on a specific area.

```jsx
import { Droppable } from "bhi-dnd";

<Droppable id="zone-1" onDrop={(item) => 
  console.log(`an item with id ${item.id} has dropped into 'zone-1'`);
  }>
  <div>Drop items here</div>
</Droppable>
```

---

### 5. Add Sorting (Step 1)

Wrap your sortable list with `SortableDropGroup`.

```jsx
import { SortableDropGroup } from "bhi-dnd";

<SortableDropGroup
  id="list-1"
  items={[
    { id: "item-1", index: 0 }, 
    { id: "item-2", index: 1 }
    ]}
  onSorted={(newOrder) => console.log(newOrder)}
>
  {items.map((id) => (
    <SortableDraggable key={id} id={id}>
      <div>{id}</div>
    </SortableDraggable>
  ))}
</SortableDropGroup>

```
Use the `indexKey` prop if your items use a different property name (e.g., `sortIndex`) instead of index.

---

### 6. Or Use Combined Wrapper

`DroppableSortableWrapper` combines `Droppable` + `SortableDropGroup`.

```jsx
import { DroppableSortableWrapper, SortableDraggable } from "bhi-dnd";

<DroppableSortableWrapper
  id="list-1"
  items={[
    { id: "item-1", index: 0 }, 
    { id: "item-2", index: 1 }
    ]}
  onSorted={(newOrder) => console.log(newOrder)}
  onDrop={(item) => 
  console.log(`an item with id ${item.id} has dropped into 'list-1'`);
  }>
>
  {items.map((id) => (
    <SortableDraggable key={id} id={id}>
      <div>{id}</div>
    </SortableDraggable>
  ))}
</DroppableSortableWrapper>
```

---

## 📚 API Reference

### `DndContext`

Initializes drag-and-drop. Wrap your entire app.

### `GhostLayer`

Optional visual feedback layer. Renders a copy of the dragged item.

---

### `Draggable`

| Prop | Type   | Description                      |
| ---- | ------ | -------------------------------- |
| `id` | string | Unique ID for the draggable item |

---

### `Droppable`

| Prop       | Type              | Description                                                                      |
| ---------- | ----------------- | -------------------------------------------------------------------------------- |
| `id`       | string            | Unique ID of the drop zone                                                       |
| `onDrop`   | (item\[]) => void | A callback function to be called once an item was dropped in the droppable zone  |
| `children` | node              | Zone contents                                                                    |

#### `item` explanation:

item: { id: string, type: string, data: any } 

---

#### `item.type` explanation:

item.type - Optional string to identify the kind of item being dragged. Useful for validating or filtering drops.

---

### `SortableDropGroup`

| Prop       | Type                                     | Description                                                 |
| ---------- | ---------------------------------------- | ----------------------------------------------------------- |
| `id`       | string                                   | ID of the droppable group                                   |
| `items`    | object\[]                                | Array of items with `id` property                           |
| `onSorted` | (sortedItemsArray\[]) => void            | Called when sort completes with new order                   |
| `mode`     | `SORT_MODE` enum                         | Sorting strategy: Insert (default) or Switch                |
| `indexKey` | string (optional)                        | Name of the property used for sort order, e.g., `sortIndex` |

#### `indexKey` explanation:

If you're working with objects instead of plain strings, you can provide an `indexKey` to define where the new index should be written. Example:

```jsx
<SortableDropGroup
  items={[{ id: "1", sortIndex: 0 }, { id: "2", sortIndex: 1 }]}
  indexKey="sortIndex"
  onSorted={(newItems) => setItems(newItems)}
/>
```

---

### `SortableDraggable`

Use inside a `SortableDropGroup` or `DroppableSortableWrapper`

| Prop        | Type                        | Description                                              |
| ----------- | --------------------------- | -------------------------------------------------------- |
| `id`        | string                      | Unique ID                                                |
| `direction` | `SORT_DIRECTION` enum       | Layout direction: vertical (default), horizontal or grid |

---

### `DroppableSortableWrapper`

Combines a droppable area with sorting capabilities.

Props = `SortableDropGroup` + `Droppable`

---

### `SORT_MODE`

Enum-like object for sorting logic:

```js
import { SORT_MODE } from 'bhi-dnd'

SORT_MODE = {
  Switch: "switch", // swap dragged with hovered
  Insert: "insert", // insert into new position
};
```

---

### `SORT_DIRECTION`

Enum-like object for layout direction:

```js
import { SORT_DIRECTION } from 'bhi-dnd'

SORT_DIRECTION = {
  Vertical: "vertical",
  Horizontal: "horizontal",
  Grid: "grid",
};
```

---

## ✅ Tips

* Wrap your entire app with `DndContext`
* Use stable items with an unqiue `.id` property for items
* Always set `key={id}` on repeated elements
* Add `GhostLayer` for smooth and professional visual feedback

בהצלחה בעה"י!
