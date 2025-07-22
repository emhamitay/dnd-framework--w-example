import { useCallback } from "react";
import { useDndStore } from "../utils/dndStore";
import mouseUpEventStore from "../utils/MouseUpEventStore";

/**
 * Custom hook that enables drag behavior for an element.
 *
 * Initializes drag on mouse down, tracks pointer position,
 * and handles cleanup on mouse up. Integrates with the central
 * mouse-up event store to allow coordinated drop actions.
 *
 * @param {Object} options - Configuration for the draggable element.
 * @param {string} options.id - Unique identifier for the draggable item.
 * @param {string} options.sortId - Group ID used for sorting and event handling.
 * @param {string} [options.type="default"] - Optional type label for the item.
 * @param {any} [options.data] - Optional metadata passed during drag (e.g., index, group).
 * @returns {{ onMouseDown: (e: MouseEvent) => void }} Object containing an `onMouseDown` handler.
 */
export function useDrag({ id, sortId, type = "default", data }) {
  const startDrag = useDndStore((s) => s.startDrag);
  const endDrag = useDndStore((s) => s.endDrag);

  /**
   * Initiates the drag behavior on mouse down.
   * Attaches mousemove and mouseup listeners to track and complete the drag.
   *
   * @param {MouseEvent} event - The original mouse down event.
   */
  const onMouseDown = useCallback(
    (event) => {
// Prevent drag start if already handled or not left click
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      // Prevent drag start if clicking on interactive elements or their children
      if (isInteractive(event.target)) {
        return;
      }

      // Start dragging process
      startDrag(
        id,
        {
          type,
          data: {
            ...data,
            sortId,
          },
        },
        event.currentTarget,
        {
          x: event.clientX,
          y: event.clientY,
        }
      );

      const handleMouseMove = (e) => {
        useDndStore.setState((s) => ({
          activeItem: {
            ...s.activeItem,
            pointerPosition: { x: e.clientX, y: e.clientY },
          },
        }));
      };

      const handleMouseUp = () => {
        mouseUpEventStore.runEvents(sortId);
        mouseUpEventStore.removeEvents(sortId);
        endDrag();

        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("mousemove", handleMouseMove);
      };

      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
    },
    [id, type, data, sortId, startDrag, endDrag]
  );

  return { onMouseDown };
}

/**
 * Checks if the element or one of its parents is interactive
 * by matching common interactive selectors.
 */
function isInteractive(element) {
  if (!element) return false;
  return element.closest(
    "button, [role=button], [tabindex]:not([tabindex='-1']), input, select, textarea, a[href], summary, label"
  ) !== null;
}