
# bhi-dnd

A lightweight and modular drag-and-drop framework for React with sorting support.

## 📦 Installation

```bash
npm install bhi-dnd
```

## 🚀 Quick Start Tutorial

### 1. Wrapping your app

```jsx
import { DndProvider } from "bhi-dnd";

export default function App() {
  return (
    <DndProvider>
      {/* your drag-and-drop components here */}
    </DndProvider>
  );
}
```

### 2. Draggable Item

```jsx
import { Draggable } from "bhi-dnd";

<Draggable id="item-1">
  <div>Drag me!</div>
</Draggable>
```

### 3. Droppable Zone

```jsx
import { Droppable } from "bhi-dnd";

<Droppable id="zone-1" onDrop={(item) => console.log(item)}>
  <div>Drop here!</div>
</Droppable>
```

### 4. Sortable Items

```jsx
import { SortableDropGroup } from "bhi-dnd";

const items = ["item-1", "item-2", "item-3"];

<SortableDropGroup
  id="group-1"
  items={items}
  onSorted={(newItems) => console.log(newItems)}
  renderItem={(id) => <div key={id}>{id}</div>}
/>
```

### 5. Droppable + Sortable Combo

```jsx
import { DroppableSortableWrapper } from "bhi-dnd";

<DroppableSortableWrapper
  id="zone-1"
  items={["a", "b", "c"]}
  onSorted={(newOrder) => console.log(newOrder)}
  renderItem={(id) => <div key={id}>{id}</div>}
/>
```

## 🔧 API Reference

### `<Droppable />`

| Prop      | Type       | Description                            |
|-----------|------------|----------------------------------------|
| `id`      | `string`   | Unique identifier for the zone         |
| `onDrop`  | `function` | Called when an item is dropped         |
| `isOver`  | `boolean`  | `true` when an item is over the zone   |
| `isActive`| `boolean`  | `true` when the zone is accepting drop |

### `<Draggable />`

| Prop      | Type       | Description                            |
|-----------|------------|----------------------------------------|
| `id`      | `string`   | Unique ID of the draggable item        |
| `children`| `node`     | Content to render                      |

### `<SortableDropGroup />`

| Prop        | Type         | Description                                |
|-------------|--------------|--------------------------------------------|
| `id`        | `string`     | ID for the sortable group                  |
| `items`     | `string[]`   | Array of sortable item IDs                 |
| `onSorted`  | `function`   | Called with the new sorted array           |
| `renderItem`| `function`   | Function to render each item by its ID     |

### `<DroppableSortableWrapper />`

Combines both `Droppable` and `SortableDropGroup`. Props:

- All props from `Droppable`
- All props from `SortableDropGroup`

## 🧪 Advanced

This library is fully compatible with Zustand or your own state manager, but this package uses internal logic without exposing Zustand.

---

Made with ❤️ for modular React DnD needs.
