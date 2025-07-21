import React, { useContext } from "react";
import { useDrag } from "../hooks/useDrag";
import { useSortable, SORT_DIRECTION } from "../hooks/useSortable";
import { SortableContext } from "../context/SortableContext";

/**
 * Combines sortable and draggable behavior for a single item.
 * Uses nearest sortId from context or accepts override via props.
 * Supports both children as JSX and render props pattern.
 *
 * @component
 * @param {Object} props
 * @param {string} props.id - Unique ID of the item.
 * @param {string} [props.sortId] - Optional override for sort group ID.
 * @param {"horizontal"|"vertical"} [props.direction="vertical"] - Drag direction.
 * @param {React.ReactNode|function} props.children - Children node or render function.
 * @returns {React.ReactElement}
 */
export function SortableDraggable({
  id,
  sortId: sortIdProp,
  direction = SORT_DIRECTION.Vertical,
  children,
}) {
  const context = useContext(SortableContext);
  const sortId = sortIdProp ?? context?.sortId;

  if (!sortId) {
    throw new Error("SortableDraggable must be used inside a SortableDropGroup or have a sortId prop.");
  }

  const { ref: sortableRef, isOver, isActive } = useSortable({ id, direction });
  const { onMouseDown } = useDrag({ id, sortId });

  const setRef = (node) => {
    sortableRef.current = node;
  };

  const renderProps = {
    ref: setRef,
    isOver: !!isOver,
    isActive: !!isActive,
    onMouseDown,
  };

  if (typeof children === "function") {
    return children(renderProps);
  }

  return (
    <div
      ref={setRef}
      onMouseDown={onMouseDown}
      style={{
        cursor: isActive ? "grabbing" : "grab",
        opacity: isActive ? 0.7 : 1,
        userSelect: "none",
        transition: "box-shadow 0.2s ease",
        borderRadius: 8,
      }}
    >
      {children}
    </div>
  );
}

SortableDraggable.displayName = "SortableDraggable";
