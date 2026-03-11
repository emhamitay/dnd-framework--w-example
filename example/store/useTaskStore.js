import { create } from "zustand";
import { Task } from "../model/task";

const t = (id, title, priority, tag, index) =>
  new Task(id, title, priority, tag, index);

const initialColumns = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      t("t1", "Design landing page mockups", "high", "design", 0),
      t("t2", "Write API documentation", "medium", "docs", 1),
      t("t3", "Fix mobile navigation bug", "low", "bug", 2),
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    tasks: [
      t("t4", "Implement drag-and-drop sorting", "high", "feature", 0),
      t("t5", "Set up CI/CD pipeline", "medium", "feature", 1),
    ],
  },
  {
    id: "review",
    title: "Review",
    tasks: [
      t("t6", "Code review: auth module", "high", "feature", 0),
      t("t7", "Update color palette", "low", "design", 1),
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      t("t8", "Set up project structure", "medium", "feature", 0),
      t("t9", "Create component library", "low", "design", 1),
      t("t10", "Fix form validation errors", "high", "bug", 2),
    ],
  },
];

export const useTaskStore = create((set) => ({
  columns: initialColumns,

  moveTask: (taskId, toColumnId) =>
    set((state) => {
      let movedTask = null;

      const columnsWithoutTask = state.columns.map((col) => {
        const idx = col.tasks.findIndex((t) => t.id === taskId);
        if (idx === -1) return col;
        movedTask = col.tasks[idx];
        const filtered = col.tasks.filter((_, i) => i !== idx);
        return { ...col, tasks: filtered.map((t, i) => ({ ...t, index: i })) };
      });

      if (!movedTask) return state;

      return {
        columns: columnsWithoutTask.map((col) => {
          if (col.id !== toColumnId) return col;
          const newTask = { ...movedTask, index: col.tasks.length };
          return { ...col, tasks: [...col.tasks, newTask] };
        }),
      };
    }),

  updateColumnTasks: (columnId, newTasks) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId ? { ...col, tasks: newTasks } : col
      ),
    })),
}));
