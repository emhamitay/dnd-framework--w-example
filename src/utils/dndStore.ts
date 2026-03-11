import { create } from "zustand";
import type { ActiveItem } from "../types";

interface DragOptions {
  type?: string;
  data?: Record<string, unknown> | null;
}

interface DndState {
  activeItem: ActiveItem | null;
  hoverId: string | null;
  consoleLog: boolean;
  setConsoleLog: (val: boolean) => void;
  startDrag: (
    id: string,
    options?: DragOptions,
    draggedElement?: HTMLElement | null,
    pointerPosition?: { x: number; y: number } | null
  ) => void;
  updateHover: (id: string | null) => void;
  endDrag: () => void;
}

export const useDndStore = create<DndState>((set, get) => ({
  activeItem: null,
  hoverId: null,
  consoleLog: false,

  setConsoleLog: (val) => {
    set({ consoleLog: val });
  },

  startDrag: (id, options = {}, draggedElement = null, pointerPosition = null) => {
    const { type = "default", data = null } = options;

    if (typeof document !== "undefined") {
      document.body.classList.add("dnd-noselect");
    }

    set({
      activeItem: {
        id,
        type,
        data: data ?? {},
        draggedElement,
        pointerPosition: pointerPosition ?? { x: 0, y: 0 },
      },
    });

    log(get, "startDrag runs");
  },

  updateHover: (id) => {
    set({ hoverId: id });
    log(get, "updateHover");
  },

  endDrag: () => {
    if (typeof document !== "undefined") {
      document.body.classList.remove("dnd-noselect");
    }
    set({ activeItem: null, hoverId: null });
    log(get, "endDrag");
  },
}));

function log(get: () => DndState, message: string) {
  const { consoleLog, activeItem, hoverId } = get();
  if (!consoleLog) return;
  console.log(`[DnD] ${message}`, { activeItem, hoverId });
}
