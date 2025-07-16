// utils/MouseUpHandler.js

// Prefix used to generate unique handler IDs
const handlerPrefix = "handler-";

/**
 * Represents a mouse-up event handler tied to a drop target.
 * Each instance contains a unique ID, the callback to execute, and its associated drop target.
 */
export class MouseUpHandler {
  /**
   * Creates a new MouseUpHandler.
   * @param {string} sortableDropId - The ID of the drop target this handler is associated with.
   * @param {Function} fn - The function to be executed when the mouse-up event occurs.
   */
  constructor(sortableDropId, fn) {
    /**
     * @type {string}
     * Unique identifier for this handler instance.
     */
    this.id = `${handlerPrefix}${crypto.randomUUID()}`;

    /**
     * @type {Function}
     * The callback function to execute on mouse up.
     */
    this.fn = fn;

    /**
     * @type {string}
     * The ID of the drop target that this handler is associated with.
     */
    this.sortableDropId = sortableDropId;
  }

  /**
   * Executes the handler function safely.
   * Logs an error to the console if execution fails.
   */
  run() {
    try {
      this.fn?.();
    } catch (e) {
      console.error("MouseUpHandler Error:", e);
    }
  }
}