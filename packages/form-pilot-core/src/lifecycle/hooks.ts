import type { FormLifecycleHooks } from "../types/index.js";
import type { PartialHooks } from "./types.js";

export function createHooks<I>(hooks?: PartialHooks<I>): FormLifecycleHooks<I> {
  // Hooks are optional and composable; undefined handlers are harmless
  return {
    beforeSet: hooks?.beforeSet,
    afterSet: hooks?.afterSet,
    beforeValidate: hooks?.beforeValidate,
    beforeSubmit: hooks?.beforeSubmit,
  };
}