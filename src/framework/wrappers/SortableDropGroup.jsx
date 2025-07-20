import React, { useMemo } from "react";
import { useSortableDrop , SORT_MODE } from "../hooks/useSortableDrop";
import { SortableContext } from "../context/SortableContext";

/**
 * Provides sortId via React Context to all descendants,
 * enables multiple nested SortableDropGroups without prop drilling.
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of sortable items with unique ids
 * @param {Function} props.onSorted - Callback with new sorted array
 * @param {React.ReactNode} props.children - React children nodes
 * @param {string} [props.indexKey="index"] - Key to use for sorting index
 * @param {"switch"|"insert"} [props.mode="insert"] - Mode for sorting behavior: swap or insert
 */
export function SortableDropGroup({ items, onSorted, children, indexKey = "index", mode = SORT_MODE.Insert }) {
  const sortId = useSortableDrop({ items, onSorted, indexKey, mode });
  const contextValue = useMemo(() => ({ sortId }), [sortId]);

  return (
    <SortableContext.Provider value={contextValue}>
      {children}
    </SortableContext.Provider>
  );
}
