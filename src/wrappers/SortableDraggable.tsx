import { useContext, useRef, type CSSProperties, type ReactNode } from "react";
import { useDrag } from "../hooks/useDrag";
import { useSortable, SORT_DIRECTION, LAYOUT_ANIMATION, type SortDirection } from "../hooks/useSortable";
import { SortableContext } from "../context/SortableContext";
import { useDndStore } from "../utils/dndStore";
import { computeGridShift } from "../utils/sortableGridUtils";
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
  const context = useContext(SortableContext);
  const sortId = sortIdProp ?? context?.sortId;
  const elementRef = useRef<HTMLElement | null>(null);

  if (!sortId) {
    throw new Error("SortableDraggable must be used inside a SortableDropGroup or have a sortId prop.");
  }

  const draggedFromIndex = useDndStore((s) => s.draggedFromIndex);
  const draggedSize = useDndStore((s) => s.draggedSize);
  const draggedGap = useDndStore((s) => s.draggedGap);
  const setDraggedInfo = useDndStore((s) => s.setDraggedInfo);

  const effectiveDirection = directionProp ?? context?.direction ?? SORT_DIRECTION.Vertical;

  const { ref: sortableRef, isHover, isActive } = useSortable({
    id,
    direction: effectiveDirection,
    onHoverEnter,
    onHoverLeave,
  });
  const { onPointerDown: rawPointerDown } = useDrag({ id, sortId });

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

  const computeItemStyle = (): CSSProperties => {
    if (layoutAnimation === LAYOUT_ANIMATION.None) {
      return { opacity: isActive ? 0.7 : 1 };
    }
    // layoutAnimation === "shift"
    if (isActive) {
      return { opacity: 0 };
    }
    if (
      draggedFromIndex !== null &&
      draggedSize !== null &&
      context?.visualTo !== null &&
      context?.visualTo !== undefined
    ) {
      const myIndex = context.items.findIndex((item) => item.id === id);
      if (myIndex !== -1) {
        const totalShift =
          (effectiveDirection === SORT_DIRECTION.Horizontal ? draggedSize.width : draggedSize.height) + draggedGap;
        const visualTo = context.visualTo;
        const fromIndex = draggedFromIndex;
        let shiftAmount = 0;
        if (effectiveDirection === SORT_DIRECTION.Grid) {
          shiftAmount = computeGridShift(myIndex, fromIndex, visualTo, totalShift);
        } else if (visualTo > fromIndex && myIndex > fromIndex && myIndex <= visualTo) {
          shiftAmount = -totalShift;
        } else if (visualTo < fromIndex && myIndex >= visualTo && myIndex < fromIndex) {
          shiftAmount = totalShift;
        }
        const axis = effectiveDirection === SORT_DIRECTION.Horizontal ? "X" : "Y";
        return shiftAmount !== 0 ? { transform: `translate${axis}(${shiftAmount}px)` } : {};
      }
    }
    return {};
  };

  const itemStyle = computeItemStyle();

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
