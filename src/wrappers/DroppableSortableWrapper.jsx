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
 * @param {Function} [props.onDrop] - Called when an item is dropped.
 * @param {(item: { id: string, data: any }) => void} [props.onHoverEnter] - Called when a dragged item enters this zone.
 * @param {(item: { id: string, data: any }) => void} [props.onHoverLeave] - Called when a dragged item leaves this zone.
 * @param {(params: { isHover: boolean }) => React.ReactNode | React.ReactNode} props.children - Either render function or static content.
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
  onHoverEnter,
  onHoverLeave,
  children,
  indexKey = "index",
  mode = SORT_MODE.Insert,
  className
}) {
  return (
    <Droppable id={id} onDrop={onDrop} onHoverEnter={onHoverEnter} onHoverLeave={onHoverLeave} className={className}>
      {(isHover, dropRef) => (
        <div ref={dropRef}>
          <SortableDropGroup items={items} onSorted={onSorted} indexKey={indexKey} mode={mode}>
            {typeof children === "function" ? children({ isHover }) : children}
          </SortableDropGroup>
        </div>
      )}
    </Droppable>
  );
}
