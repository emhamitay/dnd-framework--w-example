import { createContext } from "react";
import type { SortDirection, LayoutAnimationValue } from "../hooks/useSortable";

export interface SortableContextValue {
  sortId: string;
  direction: SortDirection;
  layoutAnimation: LayoutAnimationValue;
  items: Array<{ id: string }>;
  visualTo: number | null;
}

export const SortableContext = createContext<SortableContextValue | null>(null);
