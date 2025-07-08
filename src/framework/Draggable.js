import React from "react";
import { useDrag } from "./useDrag";

/**
 * Draggable
 * A wrapper component that makes its single child draggable using mouse events.
 *
 * @param {React.ReactElement} children - A single React element to make draggable.
 * @param {string} id - A unique identifier for the draggable item.
 * @param {any} [data] - Optional metadata to associate with the drag (e.g., group, index).
 *
 * @returns {React.ReactElement} - A cloned version of the child with drag behavior injected.
 *
 * Usage:
 * <Draggable id="user-1" data={{ group: "g1" }}>
 *   <div>Drag me</div>
 * </Draggable>
 */
export default function Draggable({ children, id, data }) {
  // Get the onMouseDown handler from the custom useDrag hook
  const { onMouseDown } = useDrag({ id, data });

  // Ensure there's only one child element (throws an error if more than one)
  const child = React.Children.only(children);

  // Clone the child element and inject our onMouseDown handler
  return React.cloneElement(child, {
    onMouseDown: (e) => {
      // Call the original onMouseDown handler if it exists
      child.props.onMouseDown?.(e);

      // Call our custom drag logic
      onMouseDown(e);
    },
  });
}