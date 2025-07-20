import { useEffect, useRef } from "react";
import { useDndStore } from "../utils/dndStore";
import { calculateNewIndex, switchArray } from "../utils/sortableUtils";
import mouseUpEventStore from "../utils/MouseUpEventStore";

const sortIdNameStart = "sortable-group-";

/**
 * Custom hook that enables sortable drag-and-drop reordering.
 *
 * @param {Object} params - The hook parameters.
 * @param {Array<Object>} params.items - The array of items to be sorted. Each item must have a unique `id` key.
 * @param {Function} params.onSorted - Callback called with the reordered array when sorting occurs.
 * @param {string} [params.indexKey="index"] - Optional key to sort items by. Defaults to "index".
 * @returns {string} A unique ID identifying this sortable group.
 */
export function useSortableDrop({ items, onSorted, indexKey = "index" }) {
  // The item currently being dragged
  const activeItem = useDndStore((s) => s.activeItem);

  // The ID of the item currently hovered over
  const hoverId = useDndStore((s) => s.hoverId);

  // A unique ID for this sortable group, generated once
  const sortIdRef = useRef(`${sortIdNameStart}${crypto.randomUUID()}`);
  const sortId = sortIdRef.current;

  useEffect(() => {
    if (!activeItem) return;

    /**
     * Handler to run when mouse-up occurs; applies sorting logic.
     */
    function mouseUpEvent() {
      if (!activeItem || !hoverId) return;

      const draggedId = activeItem.id;
      const fromIndex = items.findIndex((item) => item.id === draggedId);
      const position = activeItem?.data?.position || "before";
      const toIndex = calculateNewIndex(items, draggedId, hoverId, position);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      const newItems = switchArray(items, fromIndex, toIndex, indexKey);
      onSorted?.(newItems);
    }

    // Register the event and remove any existing one with this ID to prevent duplicates
    mouseUpEventStore.removeEvents(sortId);
    mouseUpEventStore.addEvent(sortId, mouseUpEvent);

    // Cleanup on unmount or dependency change
    return () => {
      //do not add clean up - runs before the useDrag utility
      //becouse of that we added removeEvents before addEvents to fix the clean up problem
      //also added clean up in the useDrag functioon
    };
  }, [activeItem, hoverId, items, onSorted, indexKey]);

  return sortId;
}