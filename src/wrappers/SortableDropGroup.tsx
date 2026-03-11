import { useMemo, type ReactNode } from "react";
import { useSortableDrop, SORT_MODE, type SortModeValue } from "../hooks/useSortableDrop";
import { SortableContext } from "../context/SortableContext";

type SortableItem = { id: string; [key: string]: unknown };

export interface SortableDropGroupProps<T extends SortableItem> {
  items: T[];
  onSorted: (newItems: T[]) => void;
  children: ReactNode;
  indexKey?: string;
  mode?: SortModeValue;
  className?: string;
}

export function SortableDropGroup<T extends SortableItem>({
  items,
  onSorted,
  children,
  indexKey = "index",
  mode = SORT_MODE.Insert,
  className,
}: SortableDropGroupProps<T>) {
  const sortId = useSortableDrop({ items, onSorted, indexKey, mode });
  const contextValue = useMemo(() => ({ sortId }), [sortId]);

  return (
    <SortableContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </SortableContext.Provider>
  );
}
