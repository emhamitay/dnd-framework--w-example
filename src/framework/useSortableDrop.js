import { useEffect, useRef } from "react";
import { useDndStore } from "./utils/dndStore";
import { calculateNewIndex, reorderArray } from "./utils/sortableUtils";
import mouseUpEventStore from "./utils/mouseUpEventStore";

const sortIdNameStart = "sortable-group-";

export function useSortableDrop({ items, onSorted, indexKey = "index" }) {
  const activeItem = useDndStore((s) => s.activeItem);
  const hoverId = useDndStore((s) => s.hoverId);

  // Generate a unique group ID once per instance
  const sortIdRef = useRef(`${sortIdNameStart}${crypto.randomUUID()}`);
  const sortId = sortIdRef.current;

  useEffect(() => {
    if (!activeItem) {
      return;
    }

    function mouseUpEvent() {
      if (!activeItem || !hoverId) return;

      const draggedId = activeItem.id;
      const fromIndex = items.findIndex((item) => item.id === draggedId);
      const position = activeItem?.data?.position || "before";
      const toIndex = calculateNewIndex(items, draggedId, hoverId, position);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        return;
      }

      const newItems = reorderArray(items, fromIndex, toIndex, indexKey);
      onSorted?.(newItems);
    }

    mouseUpEventStore.removeEvents(sortId);
    mouseUpEventStore.addEvent(sortId, mouseUpEvent);

    // Cleanup: remove handler on unmount or deps change to prevent duplicates
    return () => {
      //console.log('clean up');
      //mouseUpEventStore.removeEvent(id);
    };
  }, [activeItem, hoverId, items, onSorted, indexKey]);

  return sortId;
}
