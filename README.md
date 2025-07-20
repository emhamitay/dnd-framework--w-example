LINK TO NPM: https://www.npmjs.com/package/react-dnd-zustand

# react-dnd-zustand

A lightweight and customizable drag-and-drop framework built with **React** and **Zustand**.  
Supports sorting, groups, ghost layer, and both vertical and horizontal directions — with no external dependencies other than React and Zustand.

---

## ✨ Features

- ✅ Custom drag-and-drop with ghost preview
- ✅ Built-in sortable support (vertical / horizontal / grid)
- ✅ Group-based drag and move
- ✅ Zustand-powered state management
- ✅ No direct DOM access required
- ✅ Written in clean modular JavaScript

---

## 📦 Installation

```bash
npm install react-dnd-zustand
```

**Peer dependencies**:

```bash
npm install react zustand
```

---

## 🚀 Getting Started

### 1. Wrap your app with `DndProvider`

```jsx
import { DndProvider } from "react-dnd-zustand";

<DndProvider>
  <App />
</DndProvider>
```

### 2. Make items draggable

```jsx
import { useDrag } from "react-dnd-zustand";

function Item({ id }) {
  const { onMouseDown } = useDrag({ id });

  return <div onMouseDown={onMouseDown}>Drag me</div>;
}
```

### 3. Create drop zones

```jsx
import { useDrop } from "react-dnd-zustand";

function DropZone({ id, onDrop }) {
  const { dropRef, isOver } = useDrop({ id, onDrop });

  return (
    <div ref={dropRef} style={{ background: isOver ? "lightgreen" : "white" }}>
      Drop here
    </div>
  );
}
```

### 4. Sort items (optional)

```jsx
import { useSortableDrop, useSortable, SORT_DIRECTION } from "react-dnd-zustand";

//on Sortable Area (with holds all the items)
const sortId = useSortableDrop({
  items,
  onSorted: (newList) => setItems(newList)
});

//on the sortable Items
const { ref } = useSortable({ id: item.id, direction: SORT_DIRECTION.Vertical });
```

---

## 📘 API Reference

### `useDrag({ id, data?, type? })`
- Starts a drag operation with optional metadata.

### `useDrop({ id, onDrop })`
- Registers a drop zone and handles item drop.

### `useSortable({ id, direction? })`
- Allows an item to be sorted inside a sortable group.

### `useSortableDrop({ items, onSorted, indexKey? })`
- Enables drag-and-drop sorting for an array of items.

### `DndProvider`
- Must wrap your app to enable drag-and-drop context.

### `SORT_DIRECTION`
- Enum for `"vertical"` or `"horizontal"`.

---

## 📄 License

MIT © Amitay Englender
