// useDrop.js
import { useEffect, useRef, useCallback } from "react";
import { useDndStore } from "./dndStore";

/**
 * Custom hook to make a component act as a drop zone in a drag-and-drop system.
 * @param {Object} options - Configuration options for the drop zone.
 * @param {string} options.id - Unique identifier for this drop zone.
 * @param {(activeData: any) => void} options.onDrop - Callback function triggered when an item is dropped.
 * @returns {{ dropRef: React.Ref, isOver: boolean }} - Ref to attach to the drop zone element and a flag indicating if an item is currently over it.
 */
export function useDrop({ id, onDrop }) {
  // Ref to the DOM element that will act as the drop zone
  const ref = useRef(null);

  // Access drag-and-drop state and actions from the shared store
  const { activeId, activeData, hoverId, updateHover, endDrag } = useDndStore();

  // Determine if the current drop zone is being hovered over
  const isOver = hoverId === id;

  // Handler for when the pointer enters the drop zone
  const handlePointerEnter = useCallback(() => {
    // (check if an object is currently dragged when enters the droppable zone)
    if (activeId) {
      updateHover(id); // Mark this drop zone as being hovered
    }
  }, [activeId, id, updateHover]);

  // Handler for when the pointer leaves the drop zone
  const handlePointerLeave = useCallback(() => {
    updateHover(null); // Clear hover state
  }, [updateHover]);

  // Handler for when the pointer is released (drop action)
  const handleDrop = useCallback(() => {
    // Only trigger drop if this drop zone is the current hover target
    if (hoverId === id && activeId) {
      onDrop?.(activeData); // Call the onDrop callback with the dragged data
    }
    endDrag(); // Reset drag state
  }, [activeId, activeData, hoverId, id, onDrop, endDrag]);

  // Set up and clean up event listeners
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Listen for pointer events on the drop zone element
    el.addEventListener("pointerenter", handlePointerEnter);
    el.addEventListener("pointerleave", handlePointerLeave);

    // Listen for pointer release globally to handle drop
    window.addEventListener("pointerup", handleDrop);

    // Clean up event listeners on unmount or dependency change
    return () => {
      el.removeEventListener("pointerenter", handlePointerEnter);
      el.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerup", handleDrop);
    };
  }, [handlePointerEnter, handlePointerLeave, handleDrop]);

  // Return the ref to attach to the drop zone element and the hover state
  return { dropRef: ref, isOver };
}