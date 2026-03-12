import { useMemo, type ReactNode } from "react";
import { useSortableDrop, SORT_MODE, type SortModeValue } from "../hooks/useSortableDrop";
import { SortableContext } from "../context/SortableContext";
import { SORT_DIRECTION, LAYOUT_ANIMATION, type SortDirection, type LayoutAnimationValue } from "../hooks/useSortable";
import { useDndStore } from "../utils/dndStore";
import { calculateNewIndex } from "../utils/sortableUtils";
import type { SortPosition } from "../types";

type SortableItem = { id: string; [key: string]: unknown };

export interface SortableDropGroupProps<T extends SortableItem> {
  items: T[];
  onSorted: (newItems: T[]) => void;
  children: ReactNode;
  indexKey?: string;
  mode?: SortModeValue;
  direction?: SortDirection;
  layoutAnimation?: LayoutAnimationValue;
  className?: string;
}

export function SortableDropGroup<T extends SortableItem>({
  items,
  onSorted,
  children,
  indexKey = "index",
  mode = SORT_MODE.Insert,
  direction = SORT_DIRECTION.Vertical,
  layoutAnimation = LAYOUT_ANIMATION.Shift,
  className,
}: SortableDropGroupProps<T>) {
  const sortId = useSortableDrop({ items, onSorted, indexKey, mode });

  const activeItem = useDndStore((s) => s.activeItem);
  const hoverId = useDndStore((s) => s.hoverId);

  const visualTo = useMemo(() => {
    if (!activeItem || hoverId === null) return null;
    const position = (activeItem.data?.position as SortPosition) ?? "before";
    return calculateNewIndex(items, activeItem.id, hoverId, position);
  }, [activeItem, hoverId, items]);

  const itemIds = useMemo(() => items.map((item) => ({ id: item.id })), [items]);

  const contextValue = useMemo(
    () => ({ sortId, direction, layoutAnimation, items: itemIds, visualTo }),
    [sortId, direction, layoutAnimation, itemIds, visualTo]
  );

  return (
    <SortableContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </SortableContext.Provider>
  );
}
