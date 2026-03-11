import { RefObject } from "react";

/** Arbitrary metadata attached to a draggable item. */
export type DragItemData = Record<string, unknown>;

/** The shape of an item being dragged, as seen by drop/hover callbacks. */
export interface DndItem {
  id: string;
  type: string;
  data: DragItemData;
}

/** Full internal drag state, extends DndItem with DOM/position info. */
export interface ActiveItem extends DndItem {
  draggedElement: HTMLElement | null;
  pointerPosition: { x: number; y: number };
}

/** Relative drop position for sortable calculations. */
export type SortPosition = "before" | "after";

/** Return value of useDrop — exported so users can type custom wrappers. */
export interface UseDropResult {
  dropRef: RefObject<HTMLElement | null>;
  isHover: boolean;
}
