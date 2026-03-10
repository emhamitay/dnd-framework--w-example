// utils/mouseUpEventStore.js

import { MouseUpHandler } from "./MouseUpHandler";

/**
 * Manages a collection of mouse-up event handlers tied to specific drop targets.
 */
class MouseUpEventStore {
  constructor() {
    /**
     * @type {MouseUpHandler[]}
     * Stores all registered mouse-up handlers.
     */
    this.events = [];
  }

  /**
   * Adds a new mouse-up event handler.
   * @param {string} sortableDropId - Identifier for the drop target.
   * @param {Function} fn - Callback to execute on mouse-up.
   * @returns {string} The unique ID of the newly created handler.
   */
  addEvent(sortableDropId, fn) {
    const e = new MouseUpHandler(sortableDropId, fn);
    this.events.push(e);
    return e.id;
  }

  /**
   * Removes an event handler by its unique ID.
   * @param {string} id - The ID of the handler to remove.
   */
  removeEvent(id) {
    const index = this.events.findIndex((event) => event.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  /**
   * Removes all event handlers associated with a specific drop target.
   * @param {string} sortableDropId - Identifier for the drop target.
   */
  removeEvents(sortableDropId) {
    this.events = this.events.filter(
      (e) => e.sortableDropId !== sortableDropId
    );
  }

  /**
   * Clears all registered event handlers.
   */
  clearEvents() {
    this.events = [];
  }

  /**
   * Executes all handlers tied to a specific drop target.
   * @param {string} sortId - Identifier for the drop target to trigger.
   */
  runEvents(sortId) {
    this.events
      .filter((e) => e.sortableDropId === sortId)
      .forEach((e) => e.run());
  }
}

/**
 * Shared instance of the MouseUpEventStore.
 * @type {MouseUpEventStore}
 */
const mouseUpEventStore = new MouseUpEventStore();
export default mouseUpEventStore;