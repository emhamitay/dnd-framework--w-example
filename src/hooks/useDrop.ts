import { useEffect, useRef } from "react";
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

  const { hoverId } = useDndStore();
  const isHover = hoverId === id;

  // Keep callback refs fresh each render so event handlers always call the
  // latest versions without being re-created (and re-registered) themselves.
  const idRef = useRef(id);
  idRef.current = id;
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;
  const onHoverEnterRef = useRef(onHoverEnter);
  onHoverEnterRef.current = onHoverEnter;
  const onHoverLeaveRef = useRef(onHoverLeave);
  onHoverLeaveRef.current = onHoverLeave;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handlePointerEnter = () => {
      const activeItem = useDndStore.getState().activeItem;
      if (activeItem?.id) {
        useDndStore.getState().updateHover(idRef.current);
        onHoverEnterRef.current?.(activeItem);
      }
    };

    const handlePointerLeave = () => {
      const activeItem = useDndStore.getState().activeItem;
      if (activeItem?.id) {
        onHoverLeaveRef.current?.(activeItem);
      }
      useDndStore.getState().updateHover(null);
    };

    const handleDrop = (event: PointerEvent) => {
      const activeItem = useDndStore.getState().activeItem;
      if (ref.current && ref.current.contains(event.target as Node) && activeItem?.id) {
        onDropRef.current?.(activeItem);
      }
    };

    el.addEventListener("pointerenter", handlePointerEnter);
    el.addEventListener("pointerleave", handlePointerLeave);
    el.addEventListener("pointerup", handleDrop);

    return () => {
      el.removeEventListener("pointerenter", handlePointerEnter);
      el.removeEventListener("pointerleave", handlePointerLeave);
      el.removeEventListener("pointerup", handleDrop);
    };
  }, []); // stable handlers — registers once on mount

  return { dropRef: ref, isHover };
}
