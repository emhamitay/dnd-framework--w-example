import { useCallback } from "react";
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

  const onPointerDown = useCallback(
    (event: React.PointerEvent<Element>) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (isInteractive(event.target as Element)) return;

      startDrag(
        id,
        { type, data: { ...data } },
        event.currentTarget as HTMLElement,
        { x: event.clientX, y: event.clientY }
      );

      // Release implicit pointer capture so subsequent pointer events
      // (pointerenter, pointerleave, pointerup) are dispatched to whichever
      // element is under the pointer — required for touch/mobile support.
      (event.currentTarget as HTMLElement).releasePointerCapture?.(event.pointerId);

      const handlePointerMove = (e: PointerEvent) => {
        useDndStore.setState({ pointerPosition: { x: e.clientX, y: e.clientY } });
      };

      const preventSelect = (e: Event) => e.preventDefault();

      const handlePointerUp = () => {
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
    [id, type, data, startDrag, endDrag]
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
