import { useEffect, useRef, useState } from "react";
import { useDndStore } from "./utils/dndStore";

/**
 * Hook to make an element sortable-aware.
 * Measures its position during drag and reports if the pointer is over it.
 */
export function useSortable({ id }) {
  const ref = useRef(null);
  const requestRef = useRef(null);
  const lastPositionRef = useRef(null);

  const activeItem = useDndStore((s) => s.activeItem);
  const hoverId = useDndStore((s) => s.hoverId);
  const updateHover = useDndStore((s) => s.updateHover);

  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (!activeItem || !activeItem.pointerPosition) return;

    const checkPosition = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const pointer = activeItem.pointerPosition;

      const inside =
        pointer.x >= rect.left &&
        pointer.x <= rect.right &&
        pointer.y >= rect.top &&
        pointer.y <= rect.bottom;

      setIsOver(inside);

      //update before\after
      const pointerY = pointer.y;
      const centerY = (rect.top + rect.bottom) / 2;
      const position = pointerY < centerY ? "before" : "after";

      //if position was changed update the state
      if (lastPositionRef.current !== position) {
        lastPositionRef.current = position;
        //update position inside active item
        useDndStore.setState((s) => ({
          activeItem: {
            ...s.activeItem,
            data: {
              ...s.activeItem?.data,
              position,
            },
          },
        }));
      }

      if (inside && hoverId !== id) {
        updateHover(id);
      }

      requestRef.current = requestAnimationFrame(checkPosition);
    };

    requestRef.current = requestAnimationFrame(checkPosition);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [activeItem, hoverId, id, updateHover]);

  const isActive = activeItem?.id === id;

  return {
    ref,
    isOver,
    isActive,
  };
}
