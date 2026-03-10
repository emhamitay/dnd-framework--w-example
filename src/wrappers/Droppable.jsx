import React from "react";
import { useDrop } from "../hooks/useDrop";

/**
 * A wrapper component that turns its child into a droppable area using `useDrop`.
 *
 * @component
 * @param {Object} props
 * @param {string} props.id - Unique ID of the drop zone.
 * @param {(activeItem: { id: string, type: string, data: any }) => void} props.onDrop - Callback when an item is dropped.
 * @param {(isOver: boolean, dropRef: React.Ref) => React.ReactNode | React.ReactNode} props.children -
 * Either a render function with `isOver` and `dropRef`, or static children.
 * @param {string} [props.className] - Optional CSS class names for the wrapper div.
 * @returns {React.ReactElement} The rendered droppable area.
 */
export function Droppable({ id, onDrop, children , className }) {
  const { dropRef, isOver } = useDrop({ id, onDrop });

  if (typeof children === "function") {
    return children(isOver, dropRef);
  }

  return <div ref={dropRef} className={className}>{children}</div>;
}
