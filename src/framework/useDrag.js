import { useCallback } from "react";
import { useDndStore } from "./utils/dndStore";
import mouseUpEventStore from "./utils/mouseUpEventStore";

/**
 * Hook to make an element draggable.
 * Starts drag on mouse down, stores the dragged DOM element for ghost rendering,
 * tracks pointer position during dragging,
 * and ends drag on mouse up.
 *
 * @param {Object} options
 * @param {string} options.id - Unique ID of the draggable item
 * @param {string} [options.type="default"] - Optional type identifier
 * @param {any} [options.data] - Optional metadata (e.g. group, index)
 * @returns {{ onMouseDown: (e: MouseEvent) => void }}
 */
export function useDrag({ id, sortId,  type = "default", data }) {
  const startDrag = useDndStore((s) => s.startDrag);
  const endDrag = useDndStore((s) => s.endDrag);

  const onMouseDown = useCallback(
    (event) => {
      startDrag(id, { type, data:{
        ...data,
        sortId,
      } }, event.currentTarget, {
        x: event.clientX,
        y: event.clientY,
      });

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
    [id, type, data, startDrag, endDrag]
  );

  return { onMouseDown };
}
