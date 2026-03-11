import { useEffect, useRef } from "react";
import { useDndStore } from "../utils/dndStore";
import { calculateNewIndex, switchArray, insertItem } from "../utils/sortableUtils";
import mouseUpEventStore from "../utils/MouseUpEventStore";

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

const sortIdNameStart = "sortable-group-";

export function useSortableDrop<T extends SortableItem>({
  items,
  onSorted,
  indexKey = "index",
  mode = SORT_MODE.Insert,
}: UseSortableDropOptions<T>): string {
  const activeItem = useDndStore((s) => s.activeItem);
  const hoverId = useDndStore((s) => s.hoverId);

  const sortIdRef = useRef(`${sortIdNameStart}${crypto.randomUUID()}`);
  const sortId = sortIdRef.current;

  useEffect(() => {
    if (!activeItem) return;

    function mouseUpEvent() {
      if (!activeItem || !hoverId || !items || !Array.isArray(items)) return;

      const draggedId = activeItem.id;
      const fromIndex = items.findIndex((item) => item.id === draggedId);
      const position = (activeItem.data?.position as "before" | "after") ?? "before";
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

    mouseUpEventStore.removeEvents(sortId);
    mouseUpEventStore.addEvent(sortId, mouseUpEvent);

    return () => {
      // cleanup managed by mouseUpEventStore
    };
  }, [activeItem, hoverId, items, onSorted, indexKey, mode, sortId]);

  return sortId;
}
