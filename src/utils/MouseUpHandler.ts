const handlerPrefix = "handler-";

export class MouseUpHandler {
  id: string;
  fn: () => void;
  sortableDropId: string;

  constructor(sortableDropId: string, fn: () => void) {
    this.id = `${handlerPrefix}${crypto.randomUUID()}`;
    this.fn = fn;
    this.sortableDropId = sortableDropId;
  }

  run() {
    try {
      this.fn();
    } catch (e) {
      console.error("MouseUpHandler Error:", e);
    }
  }
}
