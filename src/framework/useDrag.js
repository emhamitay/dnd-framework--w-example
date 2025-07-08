// useDrag.js
import { useCallback } from "react";
import { useDndStore } from "./dndStore";

/**
 * Hook to make an element draggable
 * @param {Object} options
 * @param {string} options.id - Unique ID of the item
 * @param {any} [options.data] - Optional metadata (e.g. group, index)
 * @returns {{ onMouseDown: (e: MouseEvent) => void }}
 */
export function useDrag({ id, data }) {
  const startDrag = useDndStore((s) => s.startDrag);
  const endDrag = useDndStore((s) => s.endDrag);

  const onMouseDown = useCallback(() => {
    startDrag(id, data);

    // Clean up after drag ends (on mouseup)
    const handleMouseUp = () => {
      endDrag();
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mouseup", handleMouseUp);
  }, [id, data, startDrag, endDrag]);

  return { onMouseDown };
}
