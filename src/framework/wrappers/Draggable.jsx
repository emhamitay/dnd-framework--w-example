// components/Draggable.jsx
import React from "react";
import { useDrag } from "../hooks/useDrag"; // נתיב לפי איך שאתה מארגן את הפרויקט

/**
 * A wrapper component that makes its child draggable using `useDrag`.
 *
 * @param {Object} props
 * @param {string} props.id - Unique ID of the draggable item.
 * @param {string} props.sortId - Group ID used for sortable drop logic.
 * @param {string} [props.type="default"] - Optional drag type.
 * @param {any} [props.data] - Optional metadata (e.g., index, group, etc.).
 * @param {React.ReactElement} props.children - The element to make draggable.
 */
export function Draggable({ id, sortId, type = "default", data, children }) {
  const { onMouseDown } = useDrag({ id, sortId, type, data });

  if (!React.isValidElement(children)) {
    console.error("Draggable expects a valid React element as its child.");
    return null;
  }

  //returns the element with it's event
  return React.cloneElement(children, {
    onMouseDown,
  });
}
