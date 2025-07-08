// Droppable.js
import React from "react";
import { useDrop } from "./useDrop-old-backup";

/**
 * Droppable
 * A wrapper component that turns its child into a drop zone.
 *
 * @param {React.ReactElement} children - A single React element to act as a drop zone.
 * @param {string} id - A unique identifier for the drop zone.
 * @param {(data: any) => void} onDrop - Callback triggered when an item is dropped.
 *
 * @returns {React.ReactElement} - A cloned version of the child with drop behavior injected.
 *
 * Usage:
 * <Droppable id="zone-1" onDrop={(data) => console.log("Dropped:", data)}>
 *   <div>Drop here</div>
 * </Droppable>
 */
export default function Droppable({ children, id, onDrop }) {
  //const { dropRef, isOver } = useDrop({ id, onDrop });
  const { dropRef } = useDrop({ id, onDrop });
  const child = React.Children.only(children);

  return React.cloneElement(child, {
    ref: dropRef,
    style: {
      ...(child.props.style || {}),
    },
  });
}


//TODO : maybe to update a good way to add css
