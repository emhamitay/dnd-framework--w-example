import React, { useMemo } from "react";
import { useSortableDrop } from "../hooks/useSortableDrop";
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
 */
export function SortableDropGroup({ items, onSorted, children, indexKey = "index" }) {
  const sortId = useSortableDrop({ items, onSorted, indexKey });
  const contextValue = useMemo(() => ({ sortId }), [sortId]);

  return (
    <SortableContext.Provider value={contextValue}>
      {children}
    </SortableContext.Provider>
  );
}
