import { type Ref, type MutableRefObject } from "react";

export function combineRefs<T>(...refs: Array<Ref<T> | null | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as MutableRefObject<T | null>).current = node;
      }
    });
  };
}
