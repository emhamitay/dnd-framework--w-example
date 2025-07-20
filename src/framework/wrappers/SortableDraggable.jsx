import React, { useContext } from "react";
import { useDrag } from "../hooks/useDrag";
import { useSortable, SORT_DIRECTION } from "../hooks/useSortable";
import { SortableContext } from "../context/SortableContext";

/**
 * Combines sortable + draggable logic into one component.
 * Automatically uses the nearest sortId from context.
 * Supports render props pattern or regular children.
 * 
 * @param {Object} props
 * @param {string} props.id - Unique id of the draggable item
 * @param {string} [props.sortId] - Optional override for sortId (defaults to context)
 * @param {string} [props.direction] - Sort direction, default vertical
 * @param {React.ReactNode|function} props.children - Children or render function
 */
export function SortableDraggable({
  id,
  sortId: sortIdProp,
  direction = SORT_DIRECTION.Vertical,
  children,
}) {
  // Use sortId from context if not passed explicitly
  const context = useContext(SortableContext);
  const sortId = sortIdProp ?? context?.sortId;

  if (!sortId) {
    throw new Error("SortableDraggable must be used inside a SortableDropGroup or have a sortId prop.");
  }

  const { ref: sortableRef, isOver, isActive } = useSortable({ id, direction });
  const { onMouseDown } = useDrag({ id, sortId });

  // Combine refs
  const setRef = (node) => {
    sortableRef.current = node;
  };

  const renderProps = {
    ref: setRef,
    isOver: !!isOver,
    isActive: !!isActive,
    onMouseDown,
  };

  // Support render function as children
  if (typeof children === "function") {
    return children(renderProps);
  }

  // Default rendering
  return (
    <div
      ref={setRef}
      onMouseDown={onMouseDown}
      style={{
        cursor: isActive ? "grabbing" : "grab",
        opacity: isActive ? 0.7 : 1,
        userSelect: "none",
        transition: "box-shadow 0.2s ease",
        boxShadow: isOver ? "0 0 10px rgba(0, 150, 0, 0.5)" : "none",
        borderRadius: 8,
      }}
    >
      {children}
    </div>
  );
}

SortableDraggable.displayName = "SortableDraggable";
