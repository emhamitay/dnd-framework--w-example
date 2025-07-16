import { useEffect, useRef, useState } from "react";
import { useDndStore } from "./utils/dndStore";

/**
 * Enum for sortable directions.
 * @readonly
 * @enum {string}
 */
export const SORT_DIRECTION = {
  Vertical: "vertical",
  Horizontal: "horizontal",
};

/**
 * React hook to make an element sortable-aware.
 * It tracks whether the pointer is hovering over the element and 
 * determines its relative position during drag (before/after).
 *
 * @param {Object} options - Options for the sortable hook
 * @param {string} options.id - Unique identifier for the item
 * @param {string} [options.direction='vertical'] - Sorting direction: "vertical" or "horizontal"
 * @returns {{
 *   ref: React.RefObject<HTMLElement>,
 *   isOver: boolean,
 *   isActive: boolean
 * }}
 */
export function useSortable({ id, direction = SORT_DIRECTION.Vertical }) {
  const ref = useRef(null);
  const requestRef = useRef(null);
  const lastPositionRef = useRef(null);

  const activeItem = useDndStore((s) => s.activeItem);
  const hoverId = useDndStore((s) => s.hoverId);
  const updateHover = useDndStore((s) => s.updateHover);

  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (!activeItem || !activeItem.pointerPosition) return;

    /**
     * Continuously checks the element's position relative to the pointer.
     */
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

      setIsOver(inside);

      const isVertical = direction === SORT_DIRECTION.Vertical;
      const pointerCoord = isVertical ? pointer.y : pointer.x;
      const centerCoord = isVertical
        ? (rect.top + rect.bottom) / 2
        : (rect.left + rect.right) / 2;

      const position = pointerCoord < centerCoord ? "before" : "after";

      if (lastPositionRef.current !== position) {
        lastPositionRef.current = position;

        useDndStore.setState((s) => ({
          activeItem: {
            ...s.activeItem,
            data: {
              ...s.activeItem?.data,
              position,
            },
          },
        }));
      }

      if (inside && hoverId !== id) {
        updateHover(id);
      }

      requestRef.current = requestAnimationFrame(checkPosition);
    };

    requestRef.current = requestAnimationFrame(checkPosition);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [activeItem, hoverId, id, updateHover, direction]);

  const isActive = activeItem?.id === id;

  return {
    ref,
    isOver,
    isActive,
  };
}