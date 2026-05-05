'use client';
// Component that injects drag behavior into its single child element without adding a wrapper DOM node.
import React from "react";
import { useDrag } from "../hooks/useDrag";
import type { DragItemData } from "../types";

export interface DraggableProps {
  id: string;
  type?: string;
  data?: DragItemData;
  children: React.ReactElement;
  className?: string;
}

export function Draggable({ id, type = "default", data, children, className }: DraggableProps) {
  const { onPointerDown } = useDrag({ id, type, data });

  // Merge the consumer's className with any existing className on the child.
  const childClassName = (children.props as { className?: string }).className ?? "";
  const combinedClassName = [childClassName, className].filter(Boolean).join(" ");

  if (!React.isValidElement(children)) {
    console.error("Draggable expects a valid React element as its child.");
    return null;
  }

  return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
    onPointerDown,
    style: {
      ...((children.props as { style?: React.CSSProperties }).style ?? {}),
      touchAction: "none",
      userSelect: "none",
    },
    className: combinedClassName || undefined,
  });
}
