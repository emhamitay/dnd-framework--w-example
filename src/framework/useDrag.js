// useDrag.js
import { useCallback } from "react";
import { useDndStore } from "./dndStore";

/**
 * Hook to make an element draggable.
 * Starts drag on mouse down, stores the dragged DOM element for ghost rendering,
 * and ends drag on mouse up.
 *
 * @param {Object} options
 * @param {string} options.id - Unique ID of the draggable item
 * @param {string} [options.type="default"] - Optional type identifier
 * @param {any} [options.data] - Optional metadata (e.g. group, index)
 * @returns {{ onMouseDown: (e: MouseEvent) => void }}
 */
export function useDrag({ id, type = "default", data }) {
  // Access startDrag and endDrag actions from Zustand store
  const startDrag = useDndStore((s) => s.startDrag);
  const endDrag = useDndStore((s) => s.endDrag);

  /**
   * Handle mouse down event to start dragging
   * @param {MouseEvent} event - the mouse down event
   */
  const onMouseDown = useCallback(
    (event) => {
      // Pass id, combined data (with type), the actual DOM element, and pointer position
      startDrag(
        id,
        { type, data },
        event.currentTarget,
        { x: event.clientX, y: event.clientY }
      );

      // Handler to end dragging when mouse button is released
      const handleMouseUp = () => {
        endDrag();
        window.removeEventListener("mouseup", handleMouseUp);
      };

      // Listen for mouseup globally to detect drag end
      window.addEventListener("mouseup", handleMouseUp);
    },
    [id, type, data, startDrag, endDrag]
  );

  return { onMouseDown };
}
