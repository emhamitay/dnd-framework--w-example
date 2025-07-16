// utils/mouseUpEventStore.js
import { MouseUpHandler } from "./MouseUpHandler";

class MouseUpEventStore {
  constructor() {
    this.events = [];
  }

  addEvent(sortableDropId, fn) {
    const e = new MouseUpHandler(sortableDropId, fn);
    this.events.push(e);
    return e.id;
  }

  removeEvent(id) {
    const index = this.events.findIndex((event) => event.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  removeEvents(sortableDropId){
    this.events = this.events.filter(
      (e) => e.sortableDropId !== sortableDropId
    );
  }

  clearEvents() {
    this.events = [];
  }

  runEvents(sortId) {
    this.events.filter(e => e.sortableDropId == sortId).forEach((e) => e.run());
  }
}

const mouseUpEventStore = new MouseUpEventStore();
export default mouseUpEventStore;
