import { useEffect, useRef, useState } from "react";
import { useDndStore } from "../utils/dndStore";
import type { DndItem, SortPosition } from "../types";

export const SORT_DIRECTION = {
  Vertical: "vertical",
  Horizontal: "horizontal",
  Grid: "grid",
} as const;

export type SortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];

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
    if (!activeItem || !activeItem.pointerPosition) return;

    const checkPosition = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const pointer = activeItem.pointerPosition;

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
        }
      }

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

      if (inside && position !== lastPositionRef.current) {
        lastPositionRef.current = position;
        updateHover(id);
        useDndStore.setState((s) => ({
          activeItem: s.activeItem
            ? { ...s.activeItem, data: { ...s.activeItem.data, position } }
            : null,
        }));
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
