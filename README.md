# 📦 bhi-dnd

Lightweight and flexible drag-and-drop library for React with optional sorting support.

---

## ⚡ Quick Start

### 1. Setup `<DndContext>`

Wrap your app with `DndContext` to initialize drag-and-drop logic:

```jsx
import { DndContext } from "bhi-dnd";

<DndContext>
  {/* your app here */}
</DndContext>
```

---

### 2. Add `<GhostLayer />` (Optional but recommended)

This renders the dragged item visually.

```jsx
import { GhostLayer } from "bhi-dnd";

<GhostLayer />
```

Place it inside `DndContext`, ideally just once at the root level, outside any draggable components.

---

### 3. Make Items Draggable

Use `Draggable` to wrap any element and make it draggable.

```jsx
import { Draggable } from "bhi-dnd";

<Draggable id="item-1">
  <div>Drag me</div>
</Draggable>
```

---

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
