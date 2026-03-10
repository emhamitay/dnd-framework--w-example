// dndStore.js
import { create } from "zustand";

/**
 * Zustand store for managing global drag-and-drop state.
 * Includes support for onMouseUp handlers that can be dynamically registered and executed.
 */
export const useDndStore = create((set, get) => ({
  /**
   * The currently active dragged item.
   */
  activeItem: null,

  /**
   * ID of the currently hovered droppable target.
   */
  hoverId: null,

  /**
   * Flag to enable or disable console logging for debugging.
   */
  consoleLog: false,

  /**
   * Enable or disable debug console logging.
   */
  setConsoleLog: (val) => {
    set({ consoleLog: val });
  },

  /**
   * Start a new drag operation.
   */
  startDrag: (id, options = {}, draggedElement = null, pointerPosition = null) => {
    const {
      type = "default",
      data = null,
    } = options;

    if (typeof document !== "undefined") {
      document.body.classList.add("dnd-noselect");
    }

    set({
      activeItem: {
        id,
        type,
        data,
        draggedElement,
        pointerPosition,
      },
    });

    log(get, "startDrag runs");
  },

  /**
   * Update the ID of the currently hovered drop target.
   */
  updateHover: (id) => {
    set({ hoverId: id });
    log(get, "updateHover");
  },

  /**
   * End the drag operation and reset state.
   */
  endDrag: () => {
    if (typeof document !== "undefined") {
      document.body.classList.remove("dnd-noselect");
    }

    set({
      activeItem: null,
      hoverId: null,
    });

    log(get, "endDrag");
  },

}));

/**
 * Helper function for conditional logging.
 */
function log(get, message) {
  const { consoleLog, activeItem, hoverId, mouseUpHandlers } = get();

  if (!consoleLog) return;

  const logData = {
    activeItem,
    hoverId,
    handlersCount: mouseUpHandlers?.length || 0,
  };

  console.log(`[DnD] ${message}`, logData);
}
