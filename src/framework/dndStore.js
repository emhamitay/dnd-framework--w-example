// dndStore.js
import { create } from "zustand";

/**
 * Zustand store for managing global drag-and-drop state.
 * Responsible for tracking:
 * - The currently dragged item (activeItem), which includes its id, type, data, and optionally the dragged DOM element.
 * - The id of the currently hovered droppable target (hoverId).
 * - Console logging toggle for debugging purposes.
 */
export const useDndStore = create((set, get) => ({
  /**
   * The currently active dragged item.
   * Structure example:
   * {
   *   id: string,          // unique identifier of the dragged item
   *   type: string,        // type of draggable item (optional, default "default")
   *   data: any,           // additional metadata related to the dragged item (optional)
   *   draggedElement: HTMLElement|null  // reference to the original DOM element being dragged (optional)
   * }
   */
  activeItem: null,

  /**
   * ID of the currently hovered droppable target.
   * Null if no target is hovered.
   */
  hoverId: null,

  /**
   * Flag to enable or disable console logging for debugging.
   * Default is false.
   */
  consoleLog: false,

  /**
   * Enable or disable debug console logging.
   * @param {boolean} val - true to enable logging, false to disable
   */
  setConsoleLog: (val) => {
    set({ consoleLog: val });
  },

  /**
   * Called when drag operation starts.
   * Updates the activeItem with given details.
   * @param {string} id - Unique ID of the dragged item
   * @param {object} options - Optional parameters object:
   *   - type: string (defaults to "default")
   *   - data: any additional metadata
   *   - draggedElement: HTMLElement reference to the original DOM node being dragged
   */
  startDrag: (id, options = {}, draggedElement = null, pointerPosition = null) => {
    const {
      type = "default",
      data = null,
    } = options;

    // Add a CSS class to body to prevent text selection during drag
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
   * Called when pointer hovers over a droppable target.
   * Updates the hoverId state to the currently hovered target's ID, or null if none.
   * @param {string|null} id - ID of the hovered drop target or null if none
   */
  updateHover: (id) => {
    set({ hoverId: id });
    log(get, "updateHover");
  },

  /**
   * Called when drag operation ends (either by drop or cancellation).
   * Resets activeItem and hoverId to null.
   */
  endDrag: () => {
    // Remove the CSS class from body to re-enable text selection
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
 * Prints the message and current drag state only if consoleLog is enabled.
 * @param {Function} get - Zustand's get() function to access current state
 * @param {string} message - Custom message to log
 */
function log(get, message) {
  const { consoleLog, activeItem, hoverId } = get();

  if (!consoleLog) return;

  const logData = {
    activeItem,
    hoverId,
  };

  console.log(`[DnD] ${message}`, logData);
}
