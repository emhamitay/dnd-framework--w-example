// Sortable drag item that combines drag, hover detection, and shift-animation styles, reading group config from SortableContext.
import { useContext, useRef, type CSSProperties, type ReactNode } from "react";
import { useDrag } from "../hooks/useDrag";
import { useSortable, SORT_DIRECTION, LAYOUT_ANIMATION, type SortDirection } from "../hooks/useSortable";
import { useSortableItemStyle } from "../hooks/useSortableItemStyle";
import { SortableContext } from "../context/SortableContext";
import { useDndStore } from "../utils/dndStore";
import type { DndItem } from "../types";

export interface SortableDraggableRenderProps {
  ref: (node: HTMLElement | null) => void;
  isHover: boolean;
  isActive: boolean;
  onPointerDown: (e: React.PointerEvent<Element>) => void;
  style: CSSProperties;
}

export interface SortableDraggableProps {
  id: string;
  sortId?: string;
  direction?: SortDirection;
  onHoverEnter?: (item: DndItem) => void;
  onHoverLeave?: (item: DndItem) => void;
  children: ReactNode | ((renderProps: SortableDraggableRenderProps) => ReactNode);
  className?: string;
}

export function SortableDraggable({
  id,
  sortId: sortIdProp,
  direction: directionProp,
  onHoverEnter,
  onHoverLeave,
  children,
  className,
}: SortableDraggableProps) {
  // Prefer a prop-supplied sortId/direction; fall back to values from the nearest SortableDropGroup context.
  const context = useContext(SortableContext);
  const sortId = sortIdProp ?? context?.sortId;
  const elementRef = useRef<HTMLElement | null>(null);

  if (!sortId) {
    throw new Error("SortableDraggable must be used inside a SortableDropGroup or have a sortId prop.");
  }

  const setDraggedInfo = useDndStore((s) => s.setDraggedInfo);
  const draggedFromIndex = useDndStore((s) => s.draggedFromIndex);

  const effectiveDirection = directionProp ?? context?.direction ?? SORT_DIRECTION.Vertical;

  const { ref: sortableRef, isHover, isActive } = useSortable({
    id,
    direction: effectiveDirection,
    onHoverEnter,
    onHoverLeave,
  });
  const { onPointerDown: rawPointerDown } = useDrag({ id });

  // Dual-assign the same node to both the sortable hook ref and the local element ref.
  const setRef = (node: HTMLElement | null) => {
    sortableRef.current = node;
    elementRef.current = node;
  };

  const onPointerDown = (e: React.PointerEvent<Element>) => {
    const el = elementRef.current;
    if (el && context) {
      const rect = el.getBoundingClientRect();
      let gap = 0;
      const next = el.nextElementSibling as HTMLElement | null;
      // Measure the gap between this item and its next sibling to correctly compute shift distances.
      if (next) {
        const nextRect = next.getBoundingClientRect();
        gap =
          effectiveDirection === SORT_DIRECTION.Horizontal
            ? Math.max(0, nextRect.left - rect.right)
            : Math.max(0, nextRect.top - rect.bottom);
      }
      const myIndex = context.items.findIndex((item) => item.id === id);
      setDraggedInfo({ fromIndex: myIndex, size: { width: rect.width, height: rect.height }, gap });
    }
    rawPointerDown(e);
  };

  const layoutAnimation = context?.layoutAnimation ?? LAYOUT_ANIMATION.Shift;

  const itemStyle = useSortableItemStyle({
    id,
    isActive: !!isActive,
    visualTo: context?.visualTo ?? null,
    items: context?.items ?? [],
    direction: effectiveDirection,
    layoutAnimation,
  });

  const renderProps: SortableDraggableRenderProps = {
    ref: setRef,
    isHover: !!isHover,
    isActive: !!isActive,
    onPointerDown,
    style: itemStyle,
  };

  if (typeof children === "function") {
    return <>{children(renderProps)}</>;
  }

  return (
    <div
      ref={setRef}
      onPointerDown={onPointerDown}
      className={className}
      style={{
        touchAction: "none",
        cursor: isActive ? "grabbing" : "grab",
        userSelect: "none",
        borderRadius: 8,
        transition:
          // Only apply the CSS transition while a drag is live, to avoid animating during initial render.
          layoutAnimation === "shift" && draggedFromIndex !== null
            ? "transform 200ms ease, box-shadow 0.2s ease"
            : "box-shadow 0.2s ease",
        ...itemStyle,
      }}
    >
      {children}
    </div>
  );
}

SortableDraggable.displayName = "SortableDraggable";
