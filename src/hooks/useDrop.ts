import { useEffect, useRef, useCallback } from "react";
import { useDndStore } from "../utils/dndStore";
import type { DndItem, UseDropResult } from "../types";

export interface UseDropOptions {
  id: string;
  onDrop?: (item: DndItem) => void;
  onHoverEnter?: (item: DndItem) => void;
  onHoverLeave?: (item: DndItem) => void;
}

export function useDrop({ id, onDrop, onHoverEnter, onHoverLeave }: UseDropOptions): UseDropResult {
  const ref = useRef<HTMLElement | null>(null);

  const { activeItem, hoverId, updateHover, endDrag } = useDndStore();
  const isHover = hoverId === id;

  const handlePointerEnter = useCallback(() => {
    if (activeItem?.id) {
      updateHover(id);
      onHoverEnter?.(activeItem);
    }
  }, [activeItem, id, updateHover, onHoverEnter]);

  const handlePointerLeave = useCallback(() => {
    if (activeItem?.id) {
      onHoverLeave?.(activeItem);
    }
    updateHover(null);
  }, [activeItem, updateHover, onHoverLeave]);

  const handleDrop = useCallback(
    (event: PointerEvent) => {
      if (ref.current && ref.current.contains(event.target as Node) && activeItem?.id) {
        onDrop?.(activeItem);
        endDrag();
      } else if (activeItem?.id) {
        endDrag();
      }
    },
    [activeItem, onDrop, endDrag]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("pointerenter", handlePointerEnter);
    el.addEventListener("pointerleave", handlePointerLeave);
    el.addEventListener("pointerup", handleDrop);

    const handleWindowPointerUp = (event: PointerEvent) => {
      if (activeItem?.id && (!ref.current || !ref.current.contains(event.target as Node))) {
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

  return { dropRef: ref, isHover };
}
