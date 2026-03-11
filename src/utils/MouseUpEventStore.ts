import { MouseUpHandler } from "./MouseUpHandler";

class MouseUpEventStore {
  private events: MouseUpHandler[] = [];

  addEvent(sortableDropId: string, fn: () => void): string {
    const e = new MouseUpHandler(sortableDropId, fn);
    this.events.push(e);
    return e.id;
  }

  removeEvent(id: string): void {
    const index = this.events.findIndex((event) => event.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  removeEvents(sortableDropId: string): void {
    this.events = this.events.filter((e) => e.sortableDropId !== sortableDropId);
  }

  clearEvents(): void {
    this.events = [];
  }

  runEvents(sortId: string): void {
    this.events
      .filter((e) => e.sortableDropId === sortId)
      .forEach((e) => e.run());
  }
}

const mouseUpEventStore = new MouseUpEventStore();
export default mouseUpEventStore;
