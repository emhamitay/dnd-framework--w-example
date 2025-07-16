// utils/MouseUpHandler.js

// Prefix for all handler IDs
const handlerPrefix = "handler-";

/**
 * Represents a function to be executed when a drag ends (on mouse up).
 * Each instance has a unique ID and a `run` method to safely execute the handler.
 */
export class MouseUpHandler {
  /**
   * @param {Function} fn - The function to be executed on mouse up
   */
  constructor(sortableDropId, fn) {
    this.id = `${handlerPrefix}${crypto.randomUUID()}`; // Generate a unique ID
    this.fn = fn;
    this.sortableDropId = sortableDropId;
  }

  /**
   * Safely runs the handler function, catching any errors
   */
  run() {
    try {
      this.fn?.();
    } catch (e) {
      console.error("MouseUpHandler Error:", e);
    }
  }
}
