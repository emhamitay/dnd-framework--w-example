'use client';
// Hook that registers a pending sort handler so the reorder fires atomically at the moment of pointer-up.
import { useEffect } from "react";
import { useDndStore } from "../utils/dndStore";
import { calculateNewIndex, switchArray, insertItem } from "../utils/sortableUtils";

export const SORT_MODE = {
  Switch: "switch",
  Insert: "insert",
} as const;

export type SortModeValue = (typeof SORT_MODE)[keyof typeof SORT_MODE];

type SortableItem = { id: string; [key: string]: unknown };

export interface UseSortableDropOptions<T extends SortableItem> {
  items: T[];
  onSorted: (newItems: T[]) => void;
  indexKey?: string;
  mode?: SortModeValue;
}

export function useSortableDrop<T extends SortableItem>({
  items,
  onSorted,
  indexKey = "index",
  mode = SORT_MODE.Insert,
}: UseSortableDropOptions<T>): void {
  const activeItem = useDndStore((s) => s.activeItem);
  const hoverId = useDndStore((s) => s.hoverId);

  useEffect(() => {
    if (!activeItem) return;

    function mouseUpEvent() {
      if (!activeItem || !hoverId || !items || !Array.isArray(items)) return;

      const draggedId = activeItem.id;
      const fromIndex = items.findIndex((item) => item.id === draggedId);
      const position = useDndStore.getState().hoverSortPosition ?? "before";
      const toIndex = calculateNewIndex(items, draggedId, hoverId, position);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      let newItems: T[];
      if (mode === SORT_MODE.Switch) {
        newItems = switchArray([...items], fromIndex, toIndex, indexKey);
      } else {
        newItems = insertItem([...items], fromIndex, toIndex, indexKey);
      }

      onSorted?.(newItems);
    }

    // Store the handler rather than attaching a window listener here—useDrag fires it
    // after pendingSortHandler is set but before endDrag clears state.
    useDndStore.getState().setPendingSortHandler(mouseUpEvent);

    return () => {
      useDndStore.getState().setPendingSortHandler(null);
    };
  }, [activeItem, hoverId, items, onSorted, indexKey, mode]);
}
