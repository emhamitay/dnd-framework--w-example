// Hook that continuously polls pointer position via rAF to determine which side (before/after) of a sortable item the pointer is on.
import { useEffect, useRef, useState } from "react";
import { useDndStore } from "../utils/dndStore";
import type { DndItem, SortPosition } from "../types";

export const SORT_DIRECTION = {
  Vertical: "vertical",
  Horizontal: "horizontal",
  Grid: "grid",
} as const;

export type SortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];

export const LAYOUT_ANIMATION = {
  Shift: "shift",
  None: "none",
} as const;

export type LayoutAnimationValue = (typeof LAYOUT_ANIMATION)[keyof typeof LAYOUT_ANIMATION];

export interface UseSortableOptions {
  id: string;
  direction?: SortDirection;
  onHoverEnter?: (item: DndItem) => void;
  onHoverLeave?: (item: DndItem) => void;
}

export function useSortable({
  id,
  direction = SORT_DIRECTION.Vertical,
  onHoverEnter,
  onHoverLeave,
}: UseSortableOptions) {
  const ref = useRef<HTMLElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const lastPositionRef = useRef<SortPosition | null>(null);
  const wasInsideRef = useRef(false);

  const activeItem = useDndStore((s) => s.activeItem);
  const hoverId = useDndStore((s) => s.hoverId);
  const updateHover = useDndStore((s) => s.updateHover);

  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    if (!activeItem) return;

    // rAF loop — checks pointer position every frame instead of relying on pointer events,
    // which can miss moves when the pointer travels fast over thin items.
    const checkPosition = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const pointer = useDndStore.getState().pointerPosition;
      if (!pointer) {
        requestRef.current = requestAnimationFrame(checkPosition);
        return;
      }

      const inside =
        pointer.x >= rect.left &&
        pointer.x <= rect.right &&
        pointer.y >= rect.top &&
        pointer.y <= rect.bottom;

      setIsHover(inside);

      if (inside !== wasInsideRef.current) {
        wasInsideRef.current = inside;
        if (inside) {
          onHoverEnter?.(activeItem);
        } else {
          onHoverLeave?.(activeItem);
          // Clear the global hoverId when we leave, so dropping in empty space does nothing
          if (hoverId === id) updateHover(null);
        }
      }

      // Grid layout uses only the Y axis for split; linear layouts use the axis matching direction.
      let position: SortPosition;

      if (direction === SORT_DIRECTION.Grid) {
        const centerY = (rect.top + rect.bottom) / 2;
        position = pointer.y < centerY ? "before" : "after";
      } else {
        const isVertical = direction === SORT_DIRECTION.Vertical;
        const pointerCoord = isVertical ? pointer.y : pointer.x;
        const rectStart = isVertical ? rect.top : rect.left;
        const rectEnd = isVertical ? rect.bottom : rect.right;
        const center = (rectStart + rectEnd) / 2;
        position = pointerCoord < center ? "before" : "after";
      }

      // Only write to the store when the position actually changes, to avoid unnecessary re-renders.
      if (inside && position !== lastPositionRef.current) {
        lastPositionRef.current = position;
        updateHover(id);
        useDndStore.setState({ hoverSortPosition: position });
      }

      requestRef.current = requestAnimationFrame(checkPosition);
    };

    requestRef.current = requestAnimationFrame(checkPosition);
    return () => {
      if (requestRef.current != null) cancelAnimationFrame(requestRef.current);
      wasInsideRef.current = false;
      lastPositionRef.current = null;
      setIsHover(false);
    };
  }, [activeItem, hoverId, id, updateHover, direction, onHoverEnter, onHoverLeave]);

  const isActive = activeItem?.id === id;

  return { ref, isHover, isActive };
}
