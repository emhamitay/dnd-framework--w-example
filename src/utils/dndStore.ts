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
  draggedFromIndex: number | null;
  draggedSize: { width: number; height: number } | null;
  draggedGap: number;
  pendingSortHandler: (() => void) | null;
  setConsoleLog: (val: boolean) => void;
  startDrag: (
    id: string,
    options?: DragOptions,
    draggedElement?: HTMLElement | null,
    pointerPosition?: { x: number; y: number } | null
  ) => void;
  updateHover: (id: string | null) => void;
  endDrag: () => void;
  setDraggedInfo: (info: {
    fromIndex: number;
    size: { width: number; height: number };
    gap: number;
  }) => void;
  setPendingSortHandler: (fn: (() => void) | null) => void;
}

export const useDndStore = create<DndState>((set, get) => ({
  activeItem: null,
  hoverId: null,
  consoleLog: false,
  draggedFromIndex: null,
  draggedSize: null,
  draggedGap: 0,
  pendingSortHandler: null,

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
    set({ activeItem: null, hoverId: null, draggedFromIndex: null, draggedSize: null, draggedGap: 0, pendingSortHandler: null });
    log(get, "endDrag");
  },

  setDraggedInfo: ({ fromIndex, size, gap }) => {
    set({ draggedFromIndex: fromIndex, draggedSize: size, draggedGap: gap });
  },

  setPendingSortHandler: (fn) => {
    set({ pendingSortHandler: fn });
  },
}));

function log(get: () => DndState, message: string) {
  const { consoleLog, activeItem, hoverId } = get();
  if (!consoleLog) return;
  console.log(`[DnD] ${message}`, { activeItem, hoverId });
}
