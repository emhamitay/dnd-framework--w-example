import type { CSSProperties } from "react";
import { SORT_DIRECTION, LAYOUT_ANIMATION, type SortDirection, type LayoutAnimationValue } from "./useSortable";
import { computeGridShift } from "../utils/sortableGridUtils";
import { useDndStore } from "../utils/dndStore";

interface UseSortableItemStyleOptions {
  id: string;
  isActive: boolean;
  visualTo: number | null;
  items: Array<{ id: string }>;
  direction: SortDirection;
  layoutAnimation: LayoutAnimationValue;
}

export function useSortableItemStyle({
  id,
  isActive,
  visualTo,
  items,
  direction,
  layoutAnimation,
}: UseSortableItemStyleOptions): CSSProperties {
  const draggedFromIndex = useDndStore((s) => s.draggedFromIndex);
  const draggedSize = useDndStore((s) => s.draggedSize);
  const draggedGap = useDndStore((s) => s.draggedGap);

  if (layoutAnimation === LAYOUT_ANIMATION.None) {
    return { opacity: isActive ? 0.7 : 1 };
  }
  // layoutAnimation === "shift"
  if (isActive) {
    return { opacity: 0 };
  }
  if (
    draggedFromIndex !== null &&
    draggedSize !== null &&
    visualTo !== null &&
    visualTo !== undefined
  ) {
    const myIndex = items.findIndex((item) => item.id === id);
    if (myIndex !== -1) {
      const totalShift =
        (direction === SORT_DIRECTION.Horizontal ? draggedSize.width : draggedSize.height) + draggedGap;
      const fromIndex = draggedFromIndex;
      let shiftAmount = 0;
      if (direction === SORT_DIRECTION.Grid) {
        shiftAmount = computeGridShift(myIndex, fromIndex, visualTo, totalShift);
      } else if (visualTo > fromIndex && myIndex > fromIndex && myIndex <= visualTo) {
        shiftAmount = -totalShift;
      } else if (visualTo < fromIndex && myIndex >= visualTo && myIndex < fromIndex) {
        shiftAmount = totalShift;
      }
      const axis = direction === SORT_DIRECTION.Horizontal ? "X" : "Y";
      return shiftAmount !== 0 ? { transform: `translate${axis}(${shiftAmount}px)` } : {};
    }
  }
  return {};
}
