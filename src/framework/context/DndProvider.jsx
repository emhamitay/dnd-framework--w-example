// DndProvider.jsx
import React, { useEffect } from "react";

/**
 * `DndProvider` is a context-free wrapper component that prepares the DOM
 * for drag-and-drop usage. It ensures required styles (like disabling user selection)
 * are injected only once into the document head.
 *
 * Wrap your entire application (or the part that uses drag-and-drop) with this provider.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to render inside the provider.
 * @returns {React.ReactElement} The children wrapped with drag-and-drop setup.
 */
export function DndProvider({ children }) {
  useEffect(() => {
    // Only inject the no-select style once per document
    if (typeof document !== "undefined" && !document.getElementById("dnd-noselect-style")) {
      const style = document.createElement("style");
      style.id = "dnd-noselect-style";
      style.textContent = `
        .dnd-noselect {
          user-select: none !important;
          -webkit-user-select: none !important;
          -ms-user-select: none !important;
          -moz-user-select: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return <>{children}</>;
}
