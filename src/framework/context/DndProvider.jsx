// DndProvider.jsx
import React, { useEffect } from "react";

/**
 * DndProvider wraps your application and activates the drag-and-drop system.
 * Injects required drag-and-drop styles into the document head.
 */
export function DndProvider({ children }) {
  useEffect(() => {
    // Only inject once
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
