// components/Droppable.jsx
import React from "react";
import { useDrop } from "../hooks/useDrop";

/**
 * A wrapper component that turns its child into a droppable area using `useDrop`.
 *
 * @param {Object} props
 * @param {string} props.id - Unique ID of the drop zone.
 * @param {(activeItem: { id: string, type: string, data: any }) => void} props.onDrop - Callback when an item is dropped.
 * @param {(isOver: boolean, dropRef: React.Ref) => React.ReactNode | React.ReactNode} props.children - 
 *        Either a render function receiving `isOver` and `dropRef`, or normal JSX content.
 */
export function Droppable({ id, onDrop, children }) {
  const { dropRef, isOver } = useDrop({ id, onDrop });

  if (typeof children === "function") {
    // Advanced usage: user gets full control over ref + state
    return children(isOver, dropRef);
  }

  // Default usage: automatically wrap children with a div that has the dropRef
  return (
    <div ref={dropRef}>
      {children}
    </div>
  );
}
