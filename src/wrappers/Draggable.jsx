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
 * @param {string} [props.className] - Optional CSS class names for the wrapper div.
 * @returns {React.ReactElement|null} A cloned React element with drag behavior, or null if invalid.
 */
export function Draggable({ id, type = "default", data, children, className  }) {
  const { onPointerDown } = useDrag({ id, type, data });

  // Merge child's existing className with the new one if any
  const childClassName = children.props.className || "";
  const combinedClassName = [childClassName, className].filter(Boolean).join(" ");

  if (!React.isValidElement(children)) {
    console.error("Draggable expects a valid React element as its child.");
    return null;
  }

  return React.cloneElement(children, {
    onPointerDown,
    style: { ...children.props.style, touchAction: "none" },
    className: combinedClassName || undefined,
  });
}
