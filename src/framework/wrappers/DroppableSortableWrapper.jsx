import React from "react";
import { Droppable } from "./Droppable";
import { SortableDropGroup } from "./SortableDropGroup";
import { SORT_MODE } from "../hooks/useSortableDrop";

/**
 * Combines `Droppable` and `SortableDropGroup` into one higher-level component.
 * Provides both drop behavior and sortable reordering within the same zone.
 *
 * @component
 * @param {Object} props
 * @param {string} props.id - Drop zone ID.
 * @param {Array<any>} props.items - Items to be sorted.
 * @param {Function} props.onSorted - Called when sorting is completed.
 * @param {Function} props.onDrop - Called when an item is dropped.
 * @param {(params: { isOver: boolean }) => React.ReactNode | React.ReactNode} props.children - Either render function or static content.
 * @param {string} [props.indexKey="index"] - Key used for sorting.
 * @param {"switch"|"insert"} [props.mode="insert"] - Sorting mode: swap or insert.
 * @param {string} [props.className] - Optional CSS class names for the droppable wrapper.
 * @returns {React.ReactElement}
 */
export function DroppableSortableWrapper({
  id,
  items,
  onSorted,
  onDrop,
  children,
  indexKey = "index",
  mode = SORT_MODE.Insert,
  className
}) {
  return (
    <Droppable id={id} onDrop={onDrop} className={className}>
      {(isOver, dropRef) => (
        <div ref={dropRef}>
          <SortableDropGroup items={items} onSorted={onSorted} indexKey={indexKey} mode={mode}>
            {typeof children === "function" ? children({ isOver }) : children}
          </SortableDropGroup>
        </div>
      )}
    </Droppable>
  );
}
