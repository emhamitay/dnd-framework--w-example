'use client';
// Wrapper component that injects the global no-select style rule and wires the Escape-key drag-cancel handler.
import { useEffect, type ReactNode } from "react";
import { useDndStore } from "../utils/dndStore";

interface DndProviderProps {
  children: ReactNode;
}

export function DndProvider({ children }: DndProviderProps) {
  useEffect(() => {
    // Inject the no-select rule once, idempotently — multiple DndProvider mounts are safe.
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

  useEffect(() => {
    // Cancel the active drag when the user presses Escape.
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && useDndStore.getState().activeItem) {
        useDndStore.getState().endDrag();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <>{children}</>;
}
