import { useContext, type ReactNode, type RefObject } from "react";
import { useDrag } from "../hooks/useDrag";
import { useSortable, SORT_DIRECTION, type SortDirection } from "../hooks/useSortable";
import { SortableContext } from "../context/SortableContext";
import type { DndItem } from "../types";

export interface SortableDraggableRenderProps {
  ref: (node: HTMLElement | null) => void;
  isHover: boolean;
  isActive: boolean;
  onPointerDown: (e: React.PointerEvent<Element>) => void;
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
  direction = SORT_DIRECTION.Vertical,
  onHoverEnter,
  onHoverLeave,
  children,
  className,
}: SortableDraggableProps) {
  const context = useContext(SortableContext);
  const sortId = sortIdProp ?? context?.sortId;

  if (!sortId) {
    throw new Error("SortableDraggable must be used inside a SortableDropGroup or have a sortId prop.");
  }

  const { ref: sortableRef, isHover, isActive } = useSortable({ id, direction, onHoverEnter, onHoverLeave });
  const { onPointerDown } = useDrag({ id, sortId });

  const setRef = (node: HTMLElement | null) => {
    sortableRef.current = node;
  };

  const renderProps: SortableDraggableRenderProps = {
    ref: setRef,
    isHover: !!isHover,
    isActive: !!isActive,
    onPointerDown,
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
        opacity: isActive ? 0.7 : 1,
        userSelect: "none",
        transition: "box-shadow 0.2s ease",
        borderRadius: 8,
      }}
    >
      {children}
    </div>
  );
}

SortableDraggable.displayName = "SortableDraggable";
