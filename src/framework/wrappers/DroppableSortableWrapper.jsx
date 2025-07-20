// components/DroppableSortableWrapper.jsx
import React from "react";
import { Droppable } from "./Droppable";
import { SortableDropGroup } from "./SortableDropGroup";
import { SORT_MODE } from "../hooks/useSortableDrop";

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
 * @param {"switch"|"insert"} [props.mode="insert"] - Mode for sorting behavior
 */
export function DroppableSortableWrapper({ id, items, onSorted, onDrop, children, indexKey = "index", mode = SORT_MODE.Insert }) {
  return (
    <Droppable id={id} onDrop={onDrop}>
      {(isOver, dropRef) => (
        <div ref={dropRef}>
          <SortableDropGroup
            items={items}
            onSorted={onSorted}
            indexKey={indexKey}
            mode={mode}
          >
            {typeof children === "function" ? children({ isOver }) : children}
          </SortableDropGroup>
        </div>
      )}
    </Droppable>
  );
}
