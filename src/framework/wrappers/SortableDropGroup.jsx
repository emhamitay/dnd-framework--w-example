import React, { useMemo } from "react";
import { useSortableDrop, SORT_MODE } from "../hooks/useSortableDrop";
import { SortableContext } from "../context/SortableContext";

/**
 * Provides sortable group behavior and context.
 * Allows children to access the current `sortId` via context.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.items - Array of sortable items (must contain unique `id` per item).
 * @param {Function} props.onSorted - Callback called with updated item order.
 * @param {React.ReactNode} props.children - Descendants (usually `SortableDraggable`).
 * @param {string} [props.indexKey="index"] - Key name used for sorting.
 * @param {"switch"|"insert"} [props.mode="insert"] - Sorting mode to use.
 * @returns {React.ReactElement}
 */
export function SortableDropGroup({
  items,
  onSorted,
  children,
  indexKey = "index",
  mode = SORT_MODE.Insert,
}) {
  const sortId = useSortableDrop({ items, onSorted, indexKey, mode });
  const contextValue = useMemo(() => ({ sortId }), [sortId]);

  return (
    <SortableContext.Provider value={contextValue}>
      {children}
    </SortableContext.Provider>
  );
}
