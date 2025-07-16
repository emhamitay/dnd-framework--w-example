🚀 Getting Started
1. Wrap your app with DndProvider
jsx
Copy
Edit
import { DndProvider } from "./framework/DndProvider";

function App() {
  return (
    <DndProvider>
      <YourApp />
    </DndProvider>
  );
}
2. Make Items Draggable
jsx
Copy
Edit
import { useDrag } from "./framework/useDrag";

function DraggableItem({ id }) {
  const { onMouseDown } = useDrag({ id });

  return (
    <div onMouseDown={onMouseDown}>
      Drag me
    </div>
  );
}
3. Enable Drop Zones
jsx
Copy
Edit
import { useDrop } from "./framework/useDrop";

function DropZone({ id, onDrop }) {
  const { dropRef, isOver } = useDrop({ id, onDrop });

  return (
    <div ref={dropRef} className={isOver ? "highlight" : ""}>
      Drop items here
    </div>
  );
}
4. Enable Sorting
a. Per item (useSortable)
jsx
Copy
Edit
import { useSortable } from "./framework/useSortable";

function SortableItem({ id }) {
  const { ref } = useSortable({ id });
  return <div ref={ref}>Sortable {id}</div>;
}
b. Per list (useSortableDrop)
jsx
Copy
Edit
import { useSortableDrop } from "./framework/useSortableDrop";

function SortableList({ items, onSorted }) {
  const sortId = useSortableDrop({
    items,
    onSorted,
  });

  return (
    <div>
      {items.map(item => (
        <SortableItem key={item.id} id={item.id} sortId={sortId} />
      ))}
    </div>
  );
}
🧠 Features
✅ Custom drag logic with Zustand state

✅ Ghost layer rendered via portal

✅ Fine-grained onDrop and onSorted handlers

✅ Vertical / Horizontal / Grid sorting support

✅ Multiple sortable zones (via unique sortId)

✅ Clean separation of logic and UI

✅ No external DnD dependencies

