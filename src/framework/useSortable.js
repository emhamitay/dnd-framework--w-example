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
  Grid: "grid", // New grid direction
};

/**
 * React hook to make an element sortable-aware.
 * It tracks whether the pointer is hovering over the element and 
 * determines its relative position during drag (before/after).
 *
 * Supports vertical, horizontal, and grid directions.
 *
 * @param {Object} options - Options for the sortable hook
 * @param {string} options.id - Unique identifier for the item
 * @param {string} [options.direction='vertical'] - Sorting direction: "vertical", "horizontal", or "grid"
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
     * Determines if the pointer is inside the element, and calculates
     * the relative position ("before" or "after") for drag sorting.
     */
    const checkPosition = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const pointer = activeItem.pointerPosition;

      // Check if pointer is inside this element's bounding box
      const inside =
        pointer.x >= rect.left &&
        pointer.x <= rect.right &&
        pointer.y >= rect.top &&
        pointer.y <= rect.bottom;

      setIsOver(inside);

      let position;

      if (direction === SORT_DIRECTION.Grid) {
        // For grid, calculate vertical and horizontal centers
        //const centerX = (rect.left + rect.right) / 2;
        const centerY = (rect.top + rect.bottom) / 2;

        // Determine if pointer is on top or bottom half
        const vertical = pointer.y < centerY ? "top" : "bottom";
        // Determine if pointer is on left or right half
        //const horizontal = pointer.x < centerX ? "left" : "right";

        // For now, we decide "before" or "after" based on vertical position
        // You can extend this to use horizontal info as well if needed
        position = vertical === "top" ? "before" : "after";

        // Optionally, position could be an object like:
        // position = { row: vertical, column: horizontal };
      } else {
        // For vertical or horizontal, compare pointer position with center
        const isVertical = direction === SORT_DIRECTION.Vertical;
        const pointerCoord = isVertical ? pointer.y : pointer.x;
        const centerCoord = isVertical
          ? (rect.top + rect.bottom) / 2
          : (rect.left + rect.right) / 2;

        position = pointerCoord < centerCoord ? "before" : "after";
      }

      // Only update if position changed since last check
      if (lastPositionRef.current !== position) {
        lastPositionRef.current = position;

        // Update the drag-and-drop store with the new position info
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

      // If pointer is inside this element and hoverId is not this element's id, update hoverId
      if (inside && hoverId !== id) {
        updateHover(id);
      }

      // Continue checking on the next animation frame
      requestRef.current = requestAnimationFrame(checkPosition);
    };

    // Start the check loop
    requestRef.current = requestAnimationFrame(checkPosition);

    // Cleanup: cancel animation frame on unmount
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [activeItem, hoverId, id, updateHover, direction]);

  // Whether this item is the currently active dragged item
  const isActive = activeItem?.id === id;

  return {
    ref,
    isOver,
    isActive,
  };
}
