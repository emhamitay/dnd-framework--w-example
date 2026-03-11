import { createContext } from "react";

export interface SortableContextValue {
  sortId: string;
}

export const SortableContext = createContext<SortableContextValue | null>(null);
