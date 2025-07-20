import { useEffect, useRef } from "react";
import { useDndStore } from "../utils/dndStore";
import { calculateNewIndex, switchArray } from "../utils/sortableUtils";
import mouseUpEventStore from "../utils/MouseUpEventStore";
import { insertItem } from "../utils/sortableUtils"; // נניח שהוספת את הפונקציה הזו

export const SORT_MODE = {
  Switch : "switch",
  Insert : "insert"
}

const sortIdNameStart = "sortable-group-";

/**
 * Custom hook that enables sortable drag-and-drop reordering.
 *
 * @param {Object} params - The hook parameters.
 * @param {Array<Object>} params.items - The array of items to be sorted. Each item must have a unique `id` key.
 * @param {Function} params.onSorted - Callback called with the reordered array when sorting occurs.
 * @param {string} [params.indexKey="index"] - Optional key to sort items by. Defaults to "index".
 * @param {"switch"|"insert"} [params.mode="insert"] - Whether to swap items or insert dragged item. Default is "insert".
 * @returns {string} A unique ID identifying this sortable group.
 */
export function useSortableDrop({ items, onSorted, indexKey = "index", mode = SORT_MODE.Insert }) {
  const activeItem = useDndStore((s) => s.activeItem);
  const hoverId = useDndStore((s) => s.hoverId);
  const sortIdRef = useRef(`${sortIdNameStart}${crypto.randomUUID()}`);
  const sortId = sortIdRef.current;

  useEffect(() => {
    if (!activeItem) return;

    function mouseUpEvent() {
      if (!activeItem || !hoverId) return;

      const draggedId = activeItem.id;
      const fromIndex = items.findIndex((item) => item.id === draggedId);
      const position = activeItem?.data?.position || "before";
      const toIndex = calculateNewIndex(items, draggedId, hoverId, position);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      let newItems;
      if (mode === SORT_MODE.Switch) {
        newItems = switchArray(items, fromIndex, toIndex, indexKey);
      } else {
        // Default to insert mode
        newItems = insertItem(items, fromIndex, toIndex, indexKey);
      }

      onSorted?.(newItems);
    }

    mouseUpEventStore.removeEvents(sortId);
    mouseUpEventStore.addEvent(sortId, mouseUpEvent);

    return () => {
      // Cleanup omitted as explained
    };
  }, [activeItem, hoverId, items, onSorted, indexKey, mode]);

  return sortId;
}
