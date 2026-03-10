class DndManager {
  constructor() {
    // The currently active dragged item.
    this.activeItem = null;
    // ID of the currently hovered droppable target.
    this.hoverId = null;
  }

  /**
   * Start a new drag operation.
   */
  startDrag(id, options = {}, draggedElement = null, pointerPosition = null) {
    const { type = "default", data = null } = options;

    if (typeof document !== "undefined") {
      document.body.classList.add("dnd-noselect");
    }

    this.activeItem = {
      id,
      type,
      data,
      draggedElement,
      pointerPosition,
    };
  }

  /**
   * Update the ID of the currently hovered drop target.
   */
  updateHover(id) {
    this.hoverId = id;
  }

  /**
   * End the drag operation and reset state.
   */
  endDrag(){
    if (typeof document !== "undefined") {
      document.body.classList.remove("dnd-noselect");
    }
    this.activeItem = null;
    this.hoverId = null;
  }
}
const dndStore = new DndManager();
export default dndStore;