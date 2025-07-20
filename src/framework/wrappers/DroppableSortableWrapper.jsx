// components/DroppableSortableWrapper.jsx
import React from "react";
import { Droppable } from "./Droppable";
import { SortableDropGroup } from "./SortableDropGroup";

/**
 * Combines Droppable + SortableDropGroup
 *
 * @param {Object} props
 * @param {string} props.id - Drop zone ID
 * @param {Array} props.items - Items for sorting
 * @param {Function} props.onSorted - Called when list is sorted
 * @param {Function} props.onDrop - Called when item is dropped
 * @param {(params: { isOver: boolean, dropRef: React.Ref }) => React.ReactNode} props.children
 * @param {string} [props.indexKey="index"]
 */
export function DroppableSortableWrapper({ id, items, onSorted, onDrop, children, indexKey = "index" }) {
  return (
    <Droppable id={id} onDrop={onDrop}>
      {(isOver, dropRef) => (
        <div ref={dropRef}>
          <SortableDropGroup items={items} onSorted={onSorted} indexKey={indexKey}>
            {typeof children === "function" ? children({ isOver }) : children}
          </SortableDropGroup>
        </div>
      )}
    </Droppable>
  );
}

