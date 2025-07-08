// dndStore.js
import { create } from "zustand";

/**
 * Zustand store for managing drag-and-drop state.
 * Holds current drag item info, hovered target, and logging control.
 */
export const useDndStore = create((set, get) => ({
  /** ID of the currently dragged item */
  activeId: null,

  /** Custom data attached to the dragged item (e.g. group, index, etc.) */
  activeData: null,

  /** ID of the currently hovered droppable target */
  hoverId: null,

  /** Enables or disables console logging */
  consoleLog: false,

  /**
   * Updates the logging flag
   * @param {boolean} val - true to enable logging, false to disable
   */
  setConsoleLog: (val) => {
    set({
      consoleLog: val,
    });
  },

  /**
   * Called when drag starts
   * @param {string} id - ID of the dragged item
   * @param {any} data - Additional info (optional)
   */
  startDrag: (id, data = null) => {
    set({
      activeId: id,
      activeData: data,
    });
    log(get, "startDrag runs");
  },

  /**
   * Called when hovering over a drop target
   * @param {string|null} id - ID of the hovered target (or null if not hovering)
   */
  updateHover: (id) => {
    set({ hoverId: id });
    log(get, "updateHover");
  },

  /**
   * Called when drag ends (either dropped or canceled)
   */
  endDrag: () => {
    set({
      activeId: null,
      activeData: null,
      hoverId: null,
    });
    log(get, "endDrag");
  },
}));

/**
 * Logs a message and current drag state if logging is enabled
 * @param {Function} get - Zustand's get function to access current state
 * @param {string} message - Message to log
 */
function log(get, message) {
  const { consoleLog, activeId, hoverId } = get();
  const obj = {
    activeId: activeId,
    hoverId: hoverId,
  };
  consoleLog && console.log(message, obj);
}