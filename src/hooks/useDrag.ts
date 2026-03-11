import { useCallback } from "react";
import { useDndStore } from "../utils/dndStore";
import mouseUpEventStore from "../utils/MouseUpEventStore";
import type { DragItemData } from "../types";

export interface UseDragOptions {
  id: string;
  sortId?: string;
  type?: string;
  data?: DragItemData;
}

export function useDrag({ id, sortId = "", type = "default", data }: UseDragOptions) {
  const startDrag = useDndStore((s) => s.startDrag);
  const endDrag = useDndStore((s) => s.endDrag);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<Element>) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (isInteractive(event.target as Element)) return;

      startDrag(
        id,
        { type, data: { ...data, sortId } },
        event.currentTarget as HTMLElement,
        { x: event.clientX, y: event.clientY }
      );

      // Release implicit pointer capture so subsequent pointer events
      // (pointerenter, pointerleave, pointerup) are dispatched to whichever
      // element is under the pointer — required for touch/mobile support.
      (event.currentTarget as HTMLElement).releasePointerCapture?.(event.pointerId);

      const handlePointerMove = (e: PointerEvent) => {
        useDndStore.setState((s) => ({
          activeItem: s.activeItem
            ? { ...s.activeItem, pointerPosition: { x: e.clientX, y: e.clientY } }
            : null,
        }));
      };

      const handlePointerUp = () => {
        mouseUpEventStore.runEvents(sortId);
        mouseUpEventStore.removeEvents(sortId);
        endDrag();
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointermove", handlePointerMove);
      };

      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointermove", handlePointerMove);
    },
    [id, type, data, sortId, startDrag, endDrag]
  );

  return { onPointerDown };
}

function isInteractive(element: Element | null): boolean {
  if (!element) return false;
  return (
    element.closest(
      "button, [role=button], [tabindex]:not([tabindex='-1']), input, select, textarea, a[href], summary, label"
    ) !== null
  );
}
