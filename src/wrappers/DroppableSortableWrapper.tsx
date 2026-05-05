'use client';
// Convenience wrapper that composes Droppable and SortableDropGroup into a zone that accepts both foreign drops and internal reorders.
import React, { type ReactNode } from "react";
import { Droppable } from "./Droppable";
import { SortableDropGroup } from "./SortableDropGroup";
import { SORT_MODE, type SortModeValue } from "../hooks/useSortableDrop";
import { SORT_DIRECTION, LAYOUT_ANIMATION, type SortDirection, type LayoutAnimationValue } from "../hooks/useSortable";
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
  direction?: SortDirection;
  layoutAnimation?: LayoutAnimationValue;
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
  direction = SORT_DIRECTION.Vertical,
  layoutAnimation = LAYOUT_ANIMATION.Shift,
  className,
}: DroppableSortableWrapperProps<T>) {
  return (
    <Droppable id={id} onDrop={onDrop} onHoverEnter={onHoverEnter} onHoverLeave={onHoverLeave} className={className}>
      {(isHover, dropRef) => (
        <div ref={dropRef as React.RefObject<HTMLDivElement>}>
          <SortableDropGroup
            items={items}
            onSorted={onSorted}
            indexKey={indexKey}
            mode={mode}
            direction={direction}
            layoutAnimation={layoutAnimation}
          >
            {typeof children === "function" ? children({ isHover }) : children}
          </SortableDropGroup>
        </div>
      )}
    </Droppable>
  );
}
