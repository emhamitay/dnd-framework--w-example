// Container that owns a sort group's shared context and computes visualTo for shift-animation previews.
import { useMemo, useRef, type ReactNode } from "react";
import { useSortableDrop, SORT_MODE, type SortModeValue } from "../hooks/useSortableDrop";
import { SortableContext } from "../context/SortableContext";
import { SORT_DIRECTION, LAYOUT_ANIMATION, type SortDirection, type LayoutAnimationValue } from "../hooks/useSortable";
import { useDndStore } from "../utils/dndStore";
import { calculateNewIndex } from "../utils/sortableUtils";


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
  // Stable ID for the group — generated once via ref so it survives re-renders.
  const sortIdRef = useRef('sortable-group-' + crypto.randomUUID());
  const sortId = sortIdRef.current;
  
  useSortableDrop({ items, onSorted, indexKey, mode });

  const activeItem = useDndStore((s) => s.activeItem);
  const hoverId = useDndStore((s) => s.hoverId);
  const hoverSortPosition = useDndStore((s) => s.hoverSortPosition);

  // visualTo is the live destination index shown to SortableDraggable children for animation.
  const visualTo = useMemo(() => {
    if (!activeItem || hoverId === null) return null;
    const position = hoverSortPosition ?? "before";
    return calculateNewIndex(items, activeItem.id, hoverId, position);
  }, [activeItem, hoverId, hoverSortPosition, items]);

  // Stable array of {id} objects to avoid recalculating context on unrelated data changes.
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
