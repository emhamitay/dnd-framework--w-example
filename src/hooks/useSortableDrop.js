import { useEffect, useRef } from "react";
import { useDndStore } from "../utils/dndStore";
import { calculateNewIndex, switchArray, insertItem } from "../utils/sortableUtils";
import mouseUpEventStore from "../utils/MouseUpEventStore";

/**
 * Enum-like object defining the sorting modes available.
 * - `Switch`: Swaps the dragged item with the hovered item.
 * - `Insert`: Moves the dragged item to a new position, shifting others.
 *
 * @readonly
 * @enum {string}
 */
export const SORT_MODE = {
  Switch: "switch",
  Insert: "insert",
};

const sortIdNameStart = "sortable-group-";

/**
 * `useSortableDrop` is a custom React hook that enables sortable behavior
 * within a group of draggable items. It listens for drag end events and updates
 * the item order based on pointer position and user-defined logic.
 *
 * This hook registers a unique `sortId` for each instance, enabling multiple
 * sortable groups on the page simultaneously.
 *
 * @param {Object} params - Configuration parameters.
 * @param {Array<Object>} params.items - List of items to sort. Each item must have a unique `id`.
 * @param {Function} params.onSorted - Callback invoked when sorting completes. Receives the reordered list.
 * @param {string} [params.indexKey="index"] - Property name used to determine item position/order.
 * @param {"switch"|"insert"} [params.mode="insert"] - Sorting mode. `"switch"` for direct swap, `"insert"` for positional insert.
 * @returns {string} The unique sortable group ID used internally for event registration.
 */
export function useSortableDrop({
  items,
  onSorted,
  indexKey = "index",
  mode = SORT_MODE.Insert,
}) {
  /** @type {import("../utils/dndStore").ActiveItem | null} */
  const activeItem = useDndStore((s) => s.activeItem);

  /** @type {string | null} */
  const hoverId = useDndStore((s) => s.hoverId);

  /** Unique identifier for this sortable group instance */
  const sortIdRef = useRef(`${sortIdNameStart}${crypto.randomUUID()}`);
  const sortId = sortIdRef.current;

  useEffect(() => {
    if (!activeItem) return;

    /**
     * Handles the mouse up event by determining the target index
     * and applying the appropriate reorder logic.
     */
    function mouseUpEvent() {
      if (!activeItem || !hoverId || !items || !Array.isArray(items)) return;

      const draggedId = activeItem.id;
      const fromIndex = items.findIndex((item) => item.id === draggedId);
      const position = activeItem?.data?.position || "before";
      const toIndex = calculateNewIndex(items, draggedId, hoverId, position);

      // Skip if invalid indexes or no movement
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      let newItems;
      if (mode === SORT_MODE.Switch) {
        newItems = switchArray(items, fromIndex, toIndex, indexKey);
      } else {
        newItems = insertItem(items, fromIndex, toIndex, indexKey);
      }

      onSorted?.(newItems);
    }

    // Register mouse up logic for this sortable group
    mouseUpEventStore.removeEvents(sortId);
    mouseUpEventStore.addEvent(sortId, mouseUpEvent);

    return () => {
      // No cleanup needed – logic is managed by mouseUpEventStore
    };
  }, [activeItem, hoverId, items, onSorted, indexKey, mode]);

  return sortId;
}
