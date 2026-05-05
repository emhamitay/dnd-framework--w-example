'use client';
// Hook that wires pointer events on an element to start/stop dragging and update the global DnD store.
import { useCallback, useRef } from "react";
import { useDndStore } from "../utils/dndStore";
import type { DragItemData } from "../types";

export interface UseDragOptions {
  id: string;
  type?: string;
  data?: DragItemData;
}

export function useDrag({ id, type = "default", data }: UseDragOptions) {
  const startDrag = useDndStore((s) => s.startDrag);
  const endDrag = useDndStore((s) => s.endDrag);

  // Keep a ref so the callback always reads the latest data without being
  // re-created every time the (object) reference changes.
  const dataRef = useRef(data);
  dataRef.current = data;

  const onPointerDown = useCallback(
    (event: React.PointerEvent<Element>) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (isInteractive(event.target as Element)) return;

      // Snapshot data into the store, attaching the element for GhostLayer cloning.
      startDrag(
        id,
        { type, data: { ...dataRef.current } },
        event.currentTarget as HTMLElement,
        { x: event.clientX, y: event.clientY }
      );

      // Release implicit pointer capture so subsequent pointer events
      // (pointerenter, pointerleave, pointerup) are dispatched to whichever
      // element is under the pointer — required for touch/mobile support.
      (event.currentTarget as HTMLElement).releasePointerCapture?.(event.pointerId);

      // Window-level listeners track movement and termination for the lifetime of one drag.
      const handlePointerMove = (e: PointerEvent) => {
        useDndStore.setState({ pointerPosition: { x: e.clientX, y: e.clientY } });
      };

      const preventSelect = (e: Event) => e.preventDefault();

      const handlePointerUp = () => {
        // Fire any queued sort handler before clearing state, so the final hover target is still set.
        useDndStore.getState().pendingSortHandler?.();
        endDrag();
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("selectstart", preventSelect);
      };

      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("selectstart", preventSelect);
    },
    [id, type, startDrag, endDrag]
  );

  return { onPointerDown };
}

// Prevents drag from starting when the pointer is on an interactive descendant.
function isInteractive(element: Element | null): boolean {
  if (!element) return false;
  return (
    element.closest(
      "button, [role=button], [tabindex]:not([tabindex='-1']), input, select, textarea, a[href], summary, label"
    ) !== null
  );
}
