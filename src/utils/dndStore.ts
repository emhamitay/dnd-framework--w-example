'use client';
// Global Zustand store that holds all drag-and-drop runtime state and actions.
import { create } from "zustand";
import type { ActiveItem } from "../types";

interface DragOptions {
  type?: string;
  data?: Record<string, unknown> | null;
}

interface DndState {
  activeItem: ActiveItem | null;
  pointerPosition: { x: number; y: number } | null;
  hoverSortPosition: "before" | "after" | null;
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
  pointerPosition: null,
  hoverSortPosition: null,
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

    // Disable text selection globally for the duration of the drag.
    if (typeof document !== "undefined") {
      document.body.classList.add("dnd-noselect");
    }

    // Guard against a missing pointer position (e.g. keyboard-initiated drags).
    const initialPointer = pointerPosition ?? { x: 0, y: 0 };
    set({
      activeItem: {
        id,
        type,
        data: data ?? {},
        draggedElement,
        pointerPosition: initialPointer,
      },
      pointerPosition: initialPointer,
      hoverSortPosition: null,
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
    // Full reset — every transient drag field goes back to null/zero.
    set({
      activeItem: null,
      pointerPosition: null,
      hoverSortPosition: null,
      hoverId: null,
      draggedFromIndex: null,
      draggedSize: null,
      draggedGap: 0,
      pendingSortHandler: null,
    });
    log(get, "endDrag");
  },

  setDraggedInfo: ({ fromIndex, size, gap }) => {
    set({ draggedFromIndex: fromIndex, draggedSize: size, draggedGap: gap });
  },

  setPendingSortHandler: (fn) => {
    set({ pendingSortHandler: fn });
  },
}));

// Optional debug logger — only emits when consoleLog is enabled via setConsoleLog.
function log(get: () => DndState, message: string) {
  const { consoleLog, activeItem, hoverId } = get();
  if (!consoleLog) return;
  console.log(`[DnD] ${message}`, { activeItem, hoverId });
}
