import React, { type ReactNode, type RefObject } from "react";
import { useDrop } from "../hooks/useDrop";
import type { DndItem } from "../types";

export interface DroppableProps {
  id: string;
  onDrop?: (item: DndItem) => void;
  onHoverEnter?: (item: DndItem) => void;
  onHoverLeave?: (item: DndItem) => void;
  children: ReactNode | ((isHover: boolean, dropRef: RefObject<HTMLElement | null>) => ReactNode);
  className?: string;
}

export function Droppable({ id, onDrop, onHoverEnter, onHoverLeave, children, className }: DroppableProps) {
  const { dropRef, isHover } = useDrop({ id, onDrop, onHoverEnter, onHoverLeave });

  if (typeof children === "function") {
    return <>{children(isHover, dropRef)}</>;
  }

  return <div ref={dropRef as React.RefObject<HTMLDivElement>} className={className}>{children}</div>;
}
