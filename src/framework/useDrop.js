// useDrop.js
import { useEffect, useRef, useCallback } from "react";
import { useDndStore } from "./dndStore";

/**
 * Custom React hook that turns a component into a drop zone for drag-and-drop interactions.
 * @param {Object} options - Configuration options for the drop zone.
 * @param {string} options.id - Unique identifier for this drop zone.
 * @param {(activeData: any) => void} options.onDrop - Callback triggered when an item is dropped on this zone.
 * @returns {{ dropRef: React.Ref, isOver: boolean }} - Ref to attach to the drop zone element and a flag indicating if an item is currently hovering over it.
 */
export function useDrop({ id, onDrop }) {
  const ref = useRef(null); // Ref to the DOM element acting as the drop zone

  // Access drag-and-drop state and actions from the shared store
  const { activeId, activeData, hoverId, updateHover, endDrag } = useDndStore();

  const isOver = hoverId === id; // True if this drop zone is currently being hovered

  // Called when the pointer enters the drop zone
  const handlePointerEnter = useCallback(() => {
    if (activeId) {
      updateHover(id); // Mark this drop zone as currently hovered
    }
  }, [activeId, id, updateHover]);

  // Called when the pointer leaves the drop zone
  const handlePointerLeave = useCallback(() => {
    updateHover(null); // Clear hover state
  }, [updateHover]);

  // Called when the pointer is released (drop attempt)
  const handleDrop = useCallback((event) => {
    if (ref.current && ref.current.contains(event.target) && activeId) {
      onDrop?.(activeData); // Trigger drop callback with dragged data
      endDrag(); // Finalize drag state
    } else if (activeId) {
      endDrag(); // Cancel drag if dropped outside
    }
  }, [activeId, activeData, onDrop, endDrag]);

  // Register and clean up event listeners
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Attach pointer event listeners to the drop zone element
    el.addEventListener("pointerenter", handlePointerEnter);
    el.addEventListener("pointerleave", handlePointerLeave);
    el.addEventListener("pointerup", handleDrop);

    // Global listener to handle pointer release outside any drop zone
    const handleWindowPointerUp = (event) => {
      if (activeId && (!ref.current || !ref.current.contains(event.target))) {
        endDrag();
      }
    };
    window.addEventListener("pointerup", handleWindowPointerUp);

    // Cleanup on unmount or dependency change
    return () => {
      el.removeEventListener("pointerenter", handlePointerEnter);
      el.removeEventListener("pointerleave", handlePointerLeave);
      el.removeEventListener("pointerup", handleDrop);
      window.removeEventListener("pointerup", handleWindowPointerUp);
    };
  }, [handlePointerEnter, handlePointerLeave, handleDrop, activeId, endDrag]);

  return { dropRef: ref, isOver };
}