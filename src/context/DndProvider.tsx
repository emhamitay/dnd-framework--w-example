import { useEffect, type ReactNode } from "react";

interface DndProviderProps {
  children: ReactNode;
}

export function DndProvider({ children }: DndProviderProps) {
  useEffect(() => {
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
