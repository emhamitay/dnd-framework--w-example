// useDrop.js
import { useEffect, useRef, useCallback } from "react";
import { useDndStore } from "./dndStore";

/**
 * Custom React hook that turns a component into a drop zone for drag-and-drop interactions.
 *
 * @param {Object} options - Configuration options for the drop zone.
 * @param {string} options.id - Unique identifier for this drop zone.
 * @param {(activeItem: { id: string, type: string, data: any }) => void} options.onDrop - Callback triggered when an item is dropped on this zone.
 * @returns {{ dropRef: React.RefObject, isOver: boolean }} - Ref to attach to the drop zone element and a flag indicating if an item is currently hovering over it.
 */
export function useDrop({ id, onDrop }) {
  const ref = useRef(null);

  // Access drag-and-drop state and actions
  const { activeItem, hoverId, updateHover, endDrag } = useDndStore();

  const isOver = hoverId === id;

  // Called when the pointer enters the drop zone
  const handlePointerEnter = useCallback(() => {
    if (activeItem?.id) {
      updateHover(id);
    }
  }, [activeItem, id, updateHover]);

  // Called when the pointer leaves the drop zone
  const handlePointerLeave = useCallback(() => {
    updateHover(null);
  }, [updateHover]);

  // Called when the pointer is released (drop)
  const handleDrop = useCallback((event) => {
    if (ref.current && ref.current.contains(event.target) && activeItem?.id) {
      onDrop?.(activeItem);
      endDrag();
    } else if (activeItem?.id) {
      endDrag();
    }
  }, [activeItem, onDrop, endDrag]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("pointerenter", handlePointerEnter);
    el.addEventListener("pointerleave", handlePointerLeave);
    el.addEventListener("pointerup", handleDrop);

    const handleWindowPointerUp = (event) => {
      if (activeItem?.id && (!ref.current || !ref.current.contains(event.target))) {
        endDrag();
      }
    };
    window.addEventListener("pointerup", handleWindowPointerUp);

    return () => {
      el.removeEventListener("pointerenter", handlePointerEnter);
      el.removeEventListener("pointerleave", handlePointerLeave);
      el.removeEventListener("pointerup", handleDrop);
      window.removeEventListener("pointerup", handleWindowPointerUp);
    };
  }, [handlePointerEnter, handlePointerLeave, handleDrop, activeItem?.id, endDrag]);

  return { dropRef: ref, isOver };
}
