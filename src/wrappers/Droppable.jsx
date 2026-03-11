import React from "react";
import { useDrop } from "../hooks/useDrop";

/**
 * A wrapper component that turns its child into a droppable area using `useDrop`.
 *
 * @component
 * @param {Object} props
 * @param {string} props.id - Unique ID of the drop zone.
 * @param {(item: { id: string, data: any }) => void} [props.onDrop] - Callback when an item is dropped.
 * @param {(item: { id: string, data: any }) => void} [props.onHoverEnter] - Callback when a dragged item enters this zone.
 * @param {(item: { id: string, data: any }) => void} [props.onHoverLeave] - Callback when a dragged item leaves this zone.
 * @param {(isHover: boolean, dropRef: React.Ref) => React.ReactNode | React.ReactNode} props.children -
 * Either a render function with `isHover` and `dropRef`, or static children.
 * @param {string} [props.className] - Optional CSS class names for the wrapper div.
 * @returns {React.ReactElement} The rendered droppable area.
 */
export function Droppable({ id, onDrop, onHoverEnter, onHoverLeave, children, className }) {
  const { dropRef, isHover } = useDrop({ id, onDrop, onHoverEnter, onHoverLeave });

  if (typeof children === "function") {
    return children(isHover, dropRef);
  }

  return <div ref={dropRef} className={className}>{children}</div>;
}
