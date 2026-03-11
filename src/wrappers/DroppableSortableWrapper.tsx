import React, { type ReactNode } from "react";
import { Droppable } from "./Droppable";
import { SortableDropGroup } from "./SortableDropGroup";
import { SORT_MODE, type SortModeValue } from "../hooks/useSortableDrop";
import type { DndItem } from "../types";

type SortableItem = { id: string; [key: string]: unknown };

export interface DroppableSortableWrapperProps<T extends SortableItem> {
  id: string;
  items: T[];
  onSorted: (newItems: T[]) => void;
  onDrop?: (item: DndItem) => void;
  onHoverEnter?: (item: DndItem) => void;
  onHoverLeave?: (item: DndItem) => void;
  children: ReactNode | ((params: { isHover: boolean }) => ReactNode);
  indexKey?: string;
  mode?: SortModeValue;
  className?: string;
}

export function DroppableSortableWrapper<T extends SortableItem>({
  id,
  items,
  onSorted,
  onDrop,
  onHoverEnter,
  onHoverLeave,
  children,
  indexKey = "index",
  mode = SORT_MODE.Insert,
  className,
}: DroppableSortableWrapperProps<T>) {
  return (
    <Droppable id={id} onDrop={onDrop} onHoverEnter={onHoverEnter} onHoverLeave={onHoverLeave} className={className}>
      {(isHover, dropRef) => (
        <div ref={dropRef as React.RefObject<HTMLDivElement>}>
          <SortableDropGroup items={items} onSorted={onSorted} indexKey={indexKey} mode={mode}>
            {typeof children === "function" ? children({ isHover }) : children}
          </SortableDropGroup>
        </div>
      )}
    </Droppable>
  );
}
