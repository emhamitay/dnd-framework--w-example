'use client';
// Hook that registers pointer-event listeners on a DOM element to make it a drop target.
import { useEffect, useRef, useState } from "react";
import { useDndStore } from "../utils/dndStore";
import type { DndItem, UseDropResult } from "../types";

export interface UseDropOptions {
  id: string;
  onDrop?: (item: DndItem) => void;
  onHoverEnter?: (item: DndItem) => void;
  onHoverLeave?: (item: DndItem) => void;
}

export function useDrop({ id, onDrop, onHoverEnter, onHoverLeave }: UseDropOptions): UseDropResult {
  const elementRef = useRef<HTMLElement | null>(null);
  const [element, setElement] = useState<HTMLElement | null>(null);

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
  const dropRef = useRef({
    get current() {
      return elementRef.current;
    },
    set current(node: HTMLElement | null) {
      if (elementRef.current === node) return;
      elementRef.current = node;
      setElement(node);
    },
  });

  useEffect(() => {
    const el = element;
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

    // Guard against pointer-up events bubbling from children outside the drop zone.
    const handleDrop = (event: PointerEvent) => {
      const activeItem = useDndStore.getState().activeItem;
      if (el.contains(event.target as Node) && activeItem?.id) {
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
  }, [element]);

  return { dropRef: dropRef.current, isHover };
}
