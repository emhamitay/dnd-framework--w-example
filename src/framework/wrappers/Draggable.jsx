import React from "react";
import { useDrag } from "../hooks/useDrag"; // נתיב לפי איך שאתה מארגן את הפרויקט

/**
 * A wrapper component that makes its child draggable using `useDrag`.
 *
 * @component
 * @param {Object} props
 * @param {string} props.id - Unique ID of the draggable item.
 * @param {string} [props.type="default"] - Optional drag type identifier.
 * @param {any} [props.data] - Optional metadata (e.g. index, group).
 * @param {React.ReactElement} props.children - The child element to make draggable.
 * @returns {React.ReactElement|null} A cloned React element with drag behavior, or null if invalid.
 */
export function Draggable({ id, type = "default", data, children }) {
  const { onMouseDown } = useDrag({ id, type, data });

  if (!React.isValidElement(children)) {
    console.error("Draggable expects a valid React element as its child.");
    return null;
  }

  return React.cloneElement(children, {
    onMouseDown,
  });
}
